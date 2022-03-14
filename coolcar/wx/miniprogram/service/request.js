"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Coolcar = void 0;
const camelcaseKeys = require("camelcase-keys");
const auth_pb_1 = require("./proto_gen/auth/auth_pb");
var Coolcar;
(function (Coolcar) {
    const serverAddr = 'http://localhost:8123';
    const AUTH_ERR = 'AUTH_ERR';
    const authData = {
        token: '',
        expiryMs: 0,
    };
    function sendRequestWithAuthRetry(o, a) {
        return __awaiter(this, void 0, void 0, function* () {
            const authOpt = a || {
                attachAuthHeader: true,
                retryOnAuthError: true,
            };
            try {
                yield login();
                return sendRequest(o, authOpt);
            }
            catch (err) {
                if (err === AUTH_ERR && authOpt.retryOnAuthError) {
                    authData.token = '';
                    authData.expiryMs = 0;
                    return sendRequestWithAuthRetry(o, {
                        attachAuthHeader: authOpt.attachAuthHeader,
                        retryOnAuthError: false,
                    });
                }
                else {
                    throw err;
                }
            }
        });
    }
    Coolcar.sendRequestWithAuthRetry = sendRequestWithAuthRetry;
    function login() {
        return __awaiter(this, void 0, void 0, function* () {
            if (authData.token && authData.expiryMs >= Date.now()) {
                return;
            }
            const wxResp = yield wxLogin();
            const reqTimeMs = Date.now();
            const resp = yield sendRequest({
                method: 'POST',
                path: '/v1/auth/login',
                data: {
                    code: wxResp.code,
                },
                respMarshaller: auth_pb_1.auth.v1.LoginResponse.fromObject,
            }, {
                attachAuthHeader: false,
                retryOnAuthError: false,
            });
            authData.token = resp.accessToken;
            authData.expiryMs = reqTimeMs + resp.expiresIn * 1000;
        });
    }
    Coolcar.login = login;
    function sendRequest(o, a) {
        const authOpt = a || {
            attachAuthHeader: true
        };
        return new Promise((resolve, reject) => {
            const header = {};
            if (authOpt.attachAuthHeader) {
                if (authData.token && authData.expiryMs >= Date.now()) {
                    header.authorization = 'Bearer ' + authData.token;
                }
                else {
                    reject(AUTH_ERR);
                    return;
                }
            }
            wx.request({
                url: serverAddr + o.path,
                method: o.method,
                data: o.data,
                header,
                success: res => {
                    if (res.statusCode === 401) {
                        reject(AUTH_ERR);
                    }
                    else if (res.statusCode >= 400) {
                        reject(res);
                    }
                    else {
                        resolve(o.respMarshaller(camelcaseKeys(res.data, { deep: true })));
                    }
                },
                fail: reject,
            });
        });
    }
    function wxLogin() {
        return new Promise((resolve, reject) => {
            wx.login({
                success: resolve,
                fail: reject,
            });
        });
    }
})(Coolcar = exports.Coolcar || (exports.Coolcar = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBQ2hELHNEQUErQztBQUUvQyxJQUFpQixPQUFPLENBK0h2QjtBQS9IRCxXQUFpQixPQUFPO0lBQ3BCLE1BQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFBO0lBQzFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQTtJQUMzQixNQUFNLFFBQVEsR0FBRztRQUNiLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7S0FDZCxDQUFBO0lBdUJELFNBQXNCLHdCQUF3QixDQUFXLENBQTBCLEVBQUUsQ0FBYzs7WUFDL0YsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJO2dCQUNqQixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixnQkFBZ0IsRUFBRSxJQUFJO2FBQ3pCLENBQUE7WUFDRCxJQUFJO2dCQUNBLE1BQU0sS0FBSyxFQUFFLENBQUE7Z0JBQ2IsT0FBTyxXQUFXLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtvQkFFOUMsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7b0JBQ25CLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBO29CQUNyQixPQUFPLHdCQUF3QixDQUFDLENBQUMsRUFBRTt3QkFDL0IsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjt3QkFDMUMsZ0JBQWdCLEVBQUUsS0FBSztxQkFDMUIsQ0FBQyxDQUFBO2lCQUNMO3FCQUFNO29CQUNILE1BQU0sR0FBRyxDQUFBO2lCQUNaO2FBQ0o7UUFFTCxDQUFDO0tBQUE7SUF0QnFCLGdDQUF3QiwyQkFzQjdDLENBQUE7SUFHRCxTQUFzQixLQUFLOztZQUV2QixJQUFJ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ZWxjYXNlS2V5cyA9IHJlcXVpcmUoXCJjYW1lbGNhc2Uta2V5c1wiKVxyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vcHJvdG9fZ2VuL2F1dGgvYXV0aF9wYlwiXHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIENvb2xjYXIge1xyXG4gICAgY29uc3Qgc2VydmVyQWRkciA9ICdodHRwOi8vbG9jYWxob3N0OjgxMjMnXHJcbiAgICBjb25zdCBBVVRIX0VSUiA9ICdBVVRIX0VSUidcclxuICAgIGNvbnN0IGF1dGhEYXRhID0ge1xyXG4gICAgICAgIHRva2VuOiAnJyxcclxuICAgICAgICBleHBpcnlNczogMCxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RPcHRpb248UkVRLCBSRVM+IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnIHwgJ1BVVCcgfCAnUE9TVCcgfCAnREVMRVRFJ1xyXG4gICAgICAgIHBhdGg6IHN0cmluZ1xyXG4gICAgICAgIGRhdGE/OiBSRVFcclxuICAgICAgICByZXNwTWFyc2hhbGxlcjogKHI6IG9iamVjdCkgPT4gUkVTXHJcbiAgICB9XHJcblxyXG4gICAgLy8g6K+35rGC5pe255qE6Lqr5Lu96K6k6K+B6YCJ6aG5XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEF1dGhPcHRpb24ge1xyXG4gICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IGJvb2xlYW4gICAgICAgLy8g5piv5ZCm5re75YqgIHRva2VuIOWktFxyXG4gICAgICAgIHJldHJ5T25BdXRoRXJyb3I6IGJvb2xlYW4gICAgICAgLy8g5piv5ZCm6YeN6K+VXHJcbiAgICB9XHJcblxyXG4gICAgLy8g55So5LqO6K+35rGC5rWB56iL566h55CGXHJcbiAgICAvLyAxLiDliKTmlq3or7fmsYLml7bmmK/lkKbpnIDopoHmkLrluKborqTor4Hkv6Hmga/lkozph43or5XpgInpoblcclxuICAgIC8vIDIuIOWwneivleeZu+W9lSDov5vooYzouqvku73pqozor4FcclxuICAgIC8vICAgICAgMi4xIOajgOafpXRva2Vu5ZKMZXhwaXJl5pe26Ze0IOWmguaenOacieaViOS4jeWGjeeZu+W9lVxyXG4gICAgLy8gICAgICAyLjIg5ZCm5YiZ5omn6KGM55m75b2V5bm26K6+572udG9rZW7lkoxleHBpcmVcclxuICAgIC8vIDMuIOiLpemAmui/hyDmiafooYznnJ/mraPnmoTor7fmsYLpgLvovpFcclxuICAgIC8vIDQuIOWQpuWImeajgOafpemUmeivr+exu+WeiyDov5vooYzph43or5XnmbvlvZUgKOmHjeivleasoeaVsOS4ujHmrKEpXHJcbiAgICAvLyA1LiDoi6Xph43or5XlkI7lho3mrKHlh7rnjrDpl67popgg5oqb5Ye66ZSZ6K+vXHJcbiAgICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5PFJFUSwgUkVTPihvOiBSZXF1ZXN0T3B0aW9uPFJFUSwgUkVTPiwgYT86IEF1dGhPcHRpb24pOiBQcm9taXNlPFJFUz4ge1xyXG4gICAgICAgIGNvbnN0IGF1dGhPcHQgPSBhIHx8IHtcclxuICAgICAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogdHJ1ZSxcclxuICAgICAgICAgICAgcmV0cnlPbkF1dGhFcnJvcjogdHJ1ZSxcclxuICAgICAgICB9XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgYXdhaXQgbG9naW4oKSAgIC8vIOimgeS/neivgeWPkeeUn+ivt+axguWJjSDouqvku73pgJrov4forqTor4FcclxuICAgICAgICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0KG8sIGF1dGhPcHQpXHJcbiAgICAgICAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgPT09IEFVVEhfRVJSICYmIGF1dGhPcHQucmV0cnlPbkF1dGhFcnJvcikge1xyXG4gICAgICAgICAgICAgICAgLy8g5riF6ZmkIHRva2VuIOi/m+ihjOmHjeivlVxyXG4gICAgICAgICAgICAgICAgYXV0aERhdGEudG9rZW4gPSAnJ1xyXG4gICAgICAgICAgICAgICAgYXV0aERhdGEuZXhwaXJ5TXMgPSAwXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KG8sIHtcclxuICAgICAgICAgICAgICAgICAgICBhdHRhY2hBdXRoSGVhZGVyOiBhdXRoT3B0LmF0dGFjaEF1dGhIZWFkZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0cnlPbkF1dGhFcnJvcjogZmFsc2UsICAgIC8vIOi/memHjOiuvuS4umZhbHNl6YG/5YWN5q275b6q546vXHJcbiAgICAgICAgICAgICAgICB9KSAgLy8g6ZyA6KaB6YeN6K+VXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBlcnJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5YyF6KOFIHd4IOeahOWOn+eUnyBsb2dpblxyXG4gICAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGxvZ2luKCkge1xyXG4gICAgICAgIC8vIOWmguaenHRva2Vu5pyJ5pWIIOebtOaOpeWPkeS4muWKoeivt+axgiDkuI3nlKjlho1sb2dpblxyXG4gICAgICAgIGlmIChhdXRoRGF0YS50b2tlbiAmJiBhdXRoRGF0YS5leHBpcnlNcyA+PSBEYXRlLm5vdygpKSB7XHJcbiAgICAgICAgICAgIC8vICBjb25zb2xlLmxvZygnaGFzIHRva2VuIGFuZCBleHBpcnkgPiBub3cnKSDnlKjkuo7osIPor5VcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyDosIPnlKjlvq7kv6Fsb2dpbuaOpeWPo+iOt+W+l2NvZGVcclxuICAgICAgICBjb25zdCB3eFJlc3AgPSBhd2FpdCB3eExvZ2luKClcclxuICAgICAgICBjb25zdCByZXFUaW1lTXMgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgLy8g6YCa6L+HY29kZeWQkeWQjuerr+WPkei1t+iupOivgeivt+axglxyXG4gICAgICAgIGNvbnN0IHJlc3AgPSBhd2FpdCBzZW5kUmVxdWVzdDxhdXRoLnYxLklMb2dpblJlcXVlc3QsIGF1dGgudjEuSUxvZ2luUmVzcG9uc2U+KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvYXV0aC9sb2dpbicsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGNvZGU6IHd4UmVzcC5jb2RlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICByZXNwTWFyc2hhbGxlcjogYXV0aC52MS5Mb2dpblJlc3BvbnNlLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgICBhdHRhY2hBdXRoSGVhZGVyOiBmYWxzZSxcclxuICAgICAgICAgICAgcmV0cnlPbkF1dGhFcnJvcjogZmFsc2UsXHJcbiAgICAgICAgfSlcclxuICAgICAgICBhdXRoRGF0YS50b2tlbiA9IHJlc3AuYWNjZXNzVG9rZW4hICAvLyAhIOihqOekuuehruWumuivpeWAvOS4gOWumuaciVxyXG4gICAgICAgIGF1dGhEYXRhLmV4cGlyeU1zID0gcmVxVGltZU1zICsgcmVzcC5leHBpcmVzSW4hICogMTAwMFxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWcqOi6q+S7veiupOivgemAmui/h+WQjuaJp+ihjOecn+ato+eahOivt+axguWkhOeQhlxyXG4gICAgZnVuY3Rpb24gc2VuZFJlcXVlc3Q8UkVRLCBSRVM+KG86IFJlcXVlc3RPcHRpb248UkVRLCBSRVM+LCBhOiBBdXRoT3B0aW9uKTogUHJvbWlzZTxSRVM+IHtcclxuICAgICAgICBjb25zdCBhdXRoT3B0ID0gYSB8fCB7XHJcbiAgICAgICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IHRydWVcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaGVhZGVyOiBSZWNvcmQ8c3RyaW5nLCBhbnk+ID0ge31cclxuXHJcbiAgICAgICAgICAgIGlmIChhdXRoT3B0LmF0dGFjaEF1dGhIZWFkZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChhdXRoRGF0YS50b2tlbiAmJiBhdXRoRGF0YS5leHBpcnlNcyA+PSBEYXRlLm5vdygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaGVhZGVyLmF1dGhvcml6YXRpb24gPSAnQmVhcmVyICcgKyBhdXRoRGF0YS50b2tlblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZWplY3QoQVVUSF9FUlIpICAgIC8vIOeUqOaIt+acieaEj+S9v+eUqGhlYWRlcuadpemqjOivgeS9huaYr+ayoeaciemAmui/hyDmiqXplJnov5Tlm54gQVVUSF9FUlJcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm5cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgd3gucmVxdWVzdCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHNlcnZlckFkZHIgKyBvLnBhdGgsXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6IG8ubWV0aG9kLFxyXG4gICAgICAgICAgICAgICAgZGF0YTogby5kYXRhLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAocmVzLnN0YXR1c0NvZGUgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoQVVUSF9FUlIpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuc3RhdHVzQ29kZSA+PSA0MDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KHJlcylcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKG8ucmVzcE1hcnNoYWxsZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYW1lbGNhc2VLZXlzKHJlcy5kYXRhIGFzIG9iamVjdCwgeyBkZWVwOiB0cnVlIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IHJlamVjdCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBmdW5jdGlvbiB3eExvZ2luKCk6IFByb21pc2U8V2VjaGF0TWluaXByb2dyYW0uTG9naW5TdWNjZXNzQ2FsbGJhY2tSZXN1bHQ+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICB3eC5sb2dpbih7XHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXNvbHZlLFxyXG4gICAgICAgICAgICAgICAgZmFpbDogcmVqZWN0LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0iXX0=