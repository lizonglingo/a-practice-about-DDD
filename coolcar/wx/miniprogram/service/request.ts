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
        data?: REQ
        respMarshaller: (r: object) => RES
    }

    // 请求时的身份认证选项
    export interface AuthOption {
        attachAuthHeader: boolean       // 是否添加 token 头
        retryOnAuthError: boolean       // 是否重试
    }

    // 用于请求流程管理
    // 1. 判断请求时是否需要携带认证信息和重试选项
    // 2. 尝试登录 进行身份验证
    //      2.1 检查token和expire时间 如果有效不再登录
    //      2.2 否则执行登录并设置token和expire
    // 3. 若通过 执行真正的请求逻辑
    // 4. 否则检查错误类型 进行重试登录 (重试次数为1次)
    // 5. 若重试后再次出现问题 抛出错误
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

    // 包装 wx 的原生 login
    export async function login() {
        // 如果token有效 直接发业务请求 不用再login
        if (authData.token && authData.expiryMs >= Date.now()) {
            //  console.log('has token and expiry > now') 用于调试
            return
        }

        // 调用微信login接口获得code
        const wxResp = await wxLogin()
        const reqTimeMs = Date.now()
        // 通过code向后端发起认证请求
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
        authData.token = resp.accessToken!  // ! 表示确定该值一定有
        authData.expiryMs = reqTimeMs + resp.expiresIn! * 1000
    }

    // 在身份认证通过后执行真正的请求处理
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

    export interface UploadFilesOpts {
        localPath: string
        url: string
    }
    export function uploadfile(o: UploadFilesOpts): Promise<void> {
        const data = wx.getFileSystemManager().readFileSync(o.localPath)
        return new Promise((resolve, reject) => {
            // 测试上传
            wx.request({
                method: 'PUT',
                url: o.url,
                data: data,
                header: { 'Content-Type': 'image/jpeg' },
                success: res => {
                    if (res.statusCode >= 400) {
                        reject(res)
                    } else {
                        resolve()
                    }
                },
                fail: reject,
            })
        })

    }
}