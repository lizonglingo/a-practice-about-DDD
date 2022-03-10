import camelcaseKeys = require("camelcase-keys")
import { auth } from "./proto_gen/auth/auth_pb"

export namespace Coolcar {
    const serverAddr = 'http://localhost:8123'
    const AUTH_ERR = 'AUTH_ERR'
    const authData = {
        token: '',
        expiryMs: 0,
    }

    export interface RequestOption<REQ, RES> {
        method: 'GET' | 'PUT' | 'POST' | 'DELETE'
        path: string
        data: REQ
        respMarshaller: (r: object) => RES
    }

    export interface AuthOption {
        attachAuthHeader: boolean
        retryOnAuthError: boolean
    }

    // 用于请求流程管理
    export async function sendRequestWithAuthRetry<REQ, RES>(o: RequestOption<REQ, RES>, a?: AuthOption): Promise<RES> {
        const authOpt = a || {
            attachAuthHeader: true,
            retryOnAuthError: true,
        }
        try {
            await login()   // 要保证发生请求前 身份通过认证
            return sendRequest(o, authOpt)
        } catch (err) {
            if (err === AUTH_ERR && authOpt.retryOnAuthError) {
                // 清除 token 进行重试
                authData.token = ''
                authData.expiryMs = 0
                return sendRequestWithAuthRetry(o, {
                    attachAuthHeader: authOpt.attachAuthHeader,
                    retryOnAuthError: false,    // 这里设为false避免死循环
                })  // 需要重试
            } else {
                throw err
            }
        }

    }


    export async function login() {
        // 如果token有效 直接发业务请求 不用再login
        if (authData.token && authData.expiryMs >= Date.now()) {
            console.log('has token and expiry > now')
            return
        }

        const wxResp = await wxLogin()
        const reqTimeMs = Date.now()
        const resp = await sendRequest<auth.v1.ILoginRequest, auth.v1.ILoginResponse>({
            method: 'POST',
            path: '/v1/auth/login',
            data: {
                code: wxResp.code,
            },
            respMarshaller: auth.v1.LoginResponse.fromObject,
        }, {
            attachAuthHeader: false,
            retryOnAuthError: false,
        })
        authData.token = resp.accessToken!
        authData.expiryMs = reqTimeMs + resp.expiresIn! * 1000
    }

    function sendRequest<REQ, RES>(o: RequestOption<REQ, RES>, a: AuthOption): Promise<RES> {
        const authOpt = a || {
            attachAuthHeader: true
        }
        return new Promise((resolve, reject) => {
            const header: Record<string, any> = {}

            if (authOpt.attachAuthHeader) {
                if (authData.token && authData.expiryMs >= Date.now()) {
                    header.authorization = 'Bearer ' + authData.token
                } else {
                    reject(AUTH_ERR)    // 用户有意使用header来验证但是没有通过 报错返回 AUTH_ERR
                    return
                }
            }

            wx.request({
                url: serverAddr + o.path,
                method: o.method,
                data: o.data,
                header,
                success: res => {
                    if (res.statusCode === 401) {
                        reject(AUTH_ERR)
                    } else if (res.statusCode >= 400) {
                        reject(res)
                    } else {
                        resolve(o.respMarshaller(
                            camelcaseKeys(res.data as object, { deep: true })
                        ))
                    }
                },
                fail: reject,
            })
        })
    }


    function wxLogin(): Promise<WechatMiniprogram.LoginSuccessCallbackResult> {
        return new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject,
            })
        })
    }
}