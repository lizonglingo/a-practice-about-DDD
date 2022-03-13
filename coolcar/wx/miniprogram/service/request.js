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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBQ2hELHNEQUErQztBQUUvQyxJQUFpQixPQUFPLENBK0h2QjtBQS9IRCxXQUFpQixPQUFPO0lBQ3BCLE1BQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFBO0lBQzFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQTtJQUMzQixNQUFNLFFBQVEsR0FBRztRQUNiLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7S0FDZCxDQUFBO0lBdUJELFNBQXNCLHdCQUF3QixDQUFXLENBQTBCLEVBQUUsQ0FBYzs7WUFDL0YsTUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJO2dCQUNqQixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixnQkFBZ0IsRUFBRSxJQUFJO2FBQ3pCLENBQUE7WUFDRCxJQUFJO2dCQUNBLE1BQU0sS0FBSyxFQUFFLENBQUE7Z0JBQ2IsT0FBTyxXQUFXLENBQUMsQ0FBQyxFQUFFLE9BQU8sQ0FBQyxDQUFBO2FBQ2pDO1lBQUMsT0FBTyxHQUFHLEVBQUU7Z0JBQ1YsSUFBSSxHQUFHLEtBQUssUUFBUSxJQUFJLE9BQU8sQ0FBQyxnQkFBZ0IsRUFBRTtvQkFFOUMsUUFBUSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUE7b0JBQ25CLFFBQVEsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFBO29CQUNyQixPQUFPLHdCQUF3QixDQUFDLENBQUMsRUFBRTt3QkFDL0IsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLGdCQUFnQjt3QkFDMUMsZ0JBQWdCLEVBQUUsS0FBSztxQkFDMUIsQ0FBQyxDQUFBO2lCQUNMO3FCQUFNO29CQUNILE1BQU0sR0FBRyxDQUFBO2lCQUNaO2FBQ0o7UUFFTCxDQUFDO0tBQUE7SUF0QnFCLGdDQUF3QiwyQkFzQjdDLENBQUE7SUFHRCxTQUFzQixLQUFLOztZQUV2QixJQUFJ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ZWxjYXNlS2V5cyA9IHJlcXVpcmUoXCJjYW1lbGNhc2Uta2V5c1wiKVxyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vcHJvdG9fZ2VuL2F1dGgvYXV0aF9wYlwiXHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIENvb2xjYXIge1xyXG4gICAgY29uc3Qgc2VydmVyQWRkciA9ICdodHRwOi8vbG9jYWxob3N0OjgxMjMnXHJcbiAgICBjb25zdCBBVVRIX0VSUiA9ICdBVVRIX0VSUidcclxuICAgIGNvbnN0IGF1dGhEYXRhID0ge1xyXG4gICAgICAgIHRva2VuOiAnJyxcclxuICAgICAgICBleHBpcnlNczogMCxcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIFJlcXVlc3RPcHRpb248UkVRLCBSRVM+IHtcclxuICAgICAgICBtZXRob2Q6ICdHRVQnIHwgJ1BVVCcgfCAnUE9TVCcgfCAnREVMRVRFJ1xyXG4gICAgICAgIHBhdGg6IHN0cmluZ1xyXG4gICAgICAgIGRhdGE6IFJFUVxyXG4gICAgICAgIHJlc3BNYXJzaGFsbGVyOiAocjogb2JqZWN0KSA9PiBSRVNcclxuICAgIH1cclxuXHJcbiAgICAvLyDor7fmsYLml7bnmoTouqvku73orqTor4HpgInpoblcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgQXV0aE9wdGlvbiB7XHJcbiAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogYm9vbGVhbiAgICAgICAvLyDmmK/lkKbmt7vliqAgdG9rZW4g5aS0XHJcbiAgICAgICAgcmV0cnlPbkF1dGhFcnJvcjogYm9vbGVhbiAgICAgICAvLyDmmK/lkKbph43or5VcclxuICAgIH1cclxuXHJcbiAgICAvLyDnlKjkuo7or7fmsYLmtYHnqIvnrqHnkIZcclxuICAgIC8vIDEuIOWIpOaWreivt+axguaXtuaYr+WQpumcgOimgeaQuuW4puiupOivgeS/oeaBr+WSjOmHjeivlemAiemhuVxyXG4gICAgLy8gMi4g5bCd6K+V55m75b2VIOi/m+ihjOi6q+S7vemqjOivgVxyXG4gICAgLy8gICAgICAyLjEg5qOA5p+ldG9rZW7lkoxleHBpcmXml7bpl7Qg5aaC5p6c5pyJ5pWI5LiN5YaN55m75b2VXHJcbiAgICAvLyAgICAgIDIuMiDlkKbliJnmiafooYznmbvlvZXlubborr7nva50b2tlbuWSjGV4cGlyZVxyXG4gICAgLy8gMy4g6Iul6YCa6L+HIOaJp+ihjOecn+ato+eahOivt+axgumAu+i+kVxyXG4gICAgLy8gNC4g5ZCm5YiZ5qOA5p+l6ZSZ6K+v57G75Z6LIOi/m+ihjOmHjeivleeZu+W9lSAo6YeN6K+V5qyh5pWw5Li6MeasoSlcclxuICAgIC8vIDUuIOiLpemHjeivleWQjuWGjeasoeWHuueOsOmXrumimCDmipvlh7rplJnor69cclxuICAgIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnk8UkVRLCBSRVM+KG86IFJlcXVlc3RPcHRpb248UkVRLCBSRVM+LCBhPzogQXV0aE9wdGlvbik6IFByb21pc2U8UkVTPiB7XHJcbiAgICAgICAgY29uc3QgYXV0aE9wdCA9IGEgfHwge1xyXG4gICAgICAgICAgICBhdHRhY2hBdXRoSGVhZGVyOiB0cnVlLFxyXG4gICAgICAgICAgICByZXRyeU9uQXV0aEVycm9yOiB0cnVlLFxyXG4gICAgICAgIH1cclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICBhd2FpdCBsb2dpbigpICAgLy8g6KaB5L+d6K+B5Y+R55Sf6K+35rGC5YmNIOi6q+S7vemAmui/h+iupOivgVxyXG4gICAgICAgICAgICByZXR1cm4gc2VuZFJlcXVlc3QobywgYXV0aE9wdClcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgICAgaWYgKGVyciA9PT0gQVVUSF9FUlIgJiYgYXV0aE9wdC5yZXRyeU9uQXV0aEVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAvLyDmuIXpmaQgdG9rZW4g6L+b6KGM6YeN6K+VXHJcbiAgICAgICAgICAgICAgICBhdXRoRGF0YS50b2tlbiA9ICcnXHJcbiAgICAgICAgICAgICAgICBhdXRoRGF0YS5leHBpcnlNcyA9IDBcclxuICAgICAgICAgICAgICAgIHJldHVybiBzZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkobywge1xyXG4gICAgICAgICAgICAgICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IGF1dGhPcHQuYXR0YWNoQXV0aEhlYWRlcixcclxuICAgICAgICAgICAgICAgICAgICByZXRyeU9uQXV0aEVycm9yOiBmYWxzZSwgICAgLy8g6L+Z6YeM6K6+5Li6ZmFsc2Xpgb/lhY3mrbvlvqrnjq9cclxuICAgICAgICAgICAgICAgIH0pICAvLyDpnIDopoHph43or5VcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRocm93IGVyclxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyDljIXoo4Ugd3gg55qE5Y6f55SfIGxvZ2luXHJcbiAgICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgLy8g5aaC5p6cdG9rZW7mnInmlYgg55u05o6l5Y+R5Lia5Yqh6K+35rGCIOS4jeeUqOWGjWxvZ2luXHJcbiAgICAgICAgaWYgKGF1dGhEYXRhLnRva2VuICYmIGF1dGhEYXRhLmV4cGlyeU1zID49IERhdGUubm93KCkpIHtcclxuICAgICAgICAgICAgLy8gIGNvbnNvbGUubG9nKCdoYXMgdG9rZW4gYW5kIGV4cGlyeSA+IG5vdycpIOeUqOS6juiwg+ivlVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIOiwg+eUqOW+ruS/oWxvZ2lu5o6l5Y+j6I635b6XY29kZVxyXG4gICAgICAgIGNvbnN0IHd4UmVzcCA9IGF3YWl0IHd4TG9naW4oKVxyXG4gICAgICAgIGNvbnN0IHJlcVRpbWVNcyA9IERhdGUubm93KClcclxuICAgICAgICAvLyDpgJrov4djb2Rl5ZCR5ZCO56uv5Y+R6LW36K6k6K+B6K+35rGCXHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmRSZXF1ZXN0PGF1dGgudjEuSUxvZ2luUmVxdWVzdCwgYXV0aC52MS5JTG9naW5SZXNwb25zZT4oe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS9hdXRoL2xvZ2luJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgY29kZTogd3hSZXNwLmNvZGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiBhdXRoLnYxLkxvZ2luUmVzcG9uc2UuZnJvbU9iamVjdCxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZXRyeU9uQXV0aEVycm9yOiBmYWxzZSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIGF1dGhEYXRhLnRva2VuID0gcmVzcC5hY2Nlc3NUb2tlbiEgIC8vICEg6KGo56S656Gu5a6a6K+l5YC85LiA5a6a5pyJXHJcbiAgICAgICAgYXV0aERhdGEuZXhwaXJ5TXMgPSByZXFUaW1lTXMgKyByZXNwLmV4cGlyZXNJbiEgKiAxMDAwXHJcbiAgICB9XHJcblxyXG4gICAgLy8g5Zyo6Lqr5Lu96K6k6K+B6YCa6L+H5ZCO5omn6KGM55yf5q2j55qE6K+35rGC5aSE55CGXHJcbiAgICBmdW5jdGlvbiBzZW5kUmVxdWVzdDxSRVEsIFJFUz4obzogUmVxdWVzdE9wdGlvbjxSRVEsIFJFUz4sIGE6IEF1dGhPcHRpb24pOiBQcm9taXNlPFJFUz4ge1xyXG4gICAgICAgIGNvbnN0IGF1dGhPcHQgPSBhIHx8IHtcclxuICAgICAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxyXG5cclxuICAgICAgICAgICAgaWYgKGF1dGhPcHQuYXR0YWNoQXV0aEhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dGhEYXRhLnRva2VuICYmIGF1dGhEYXRhLmV4cGlyeU1zID49IERhdGUubm93KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuYXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChBVVRIX0VSUikgICAgLy8g55So5oi35pyJ5oSP5L2/55SoaGVhZGVy5p2l6aqM6K+B5L2G5piv5rKh5pyJ6YCa6L+HIOaKpemUmei/lOWbniBBVVRIX0VSUlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogc2VydmVyQWRkciArIG8ucGF0aCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogby5tZXRob2QsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBvLmRhdGEsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChBVVRIX0VSUilcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoby5yZXNwTWFyc2hhbGxlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbWVsY2FzZUtleXMocmVzLmRhdGEgYXMgb2JqZWN0LCB7IGRlZXA6IHRydWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogcmVqZWN0LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHd4TG9naW4oKTogUHJvbWlzZTxXZWNoYXRNaW5pcHJvZ3JhbS5Mb2dpblN1Y2Nlc3NDYWxsYmFja1Jlc3VsdD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHd4LmxvZ2luKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlc29sdmUsXHJcbiAgICAgICAgICAgICAgICBmYWlsOiByZWplY3QsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSJdfQ==