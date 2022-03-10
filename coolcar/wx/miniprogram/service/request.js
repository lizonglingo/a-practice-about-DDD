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
                console.log('has token and expiry > now');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBQ2hELHNEQUErQztBQUUvQyxJQUFpQixPQUFPLENBb0h2QjtBQXBIRCxXQUFpQixPQUFPO0lBQ3BCLE1BQU0sVUFBVSxHQUFHLHVCQUF1QixDQUFBO0lBQzFDLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQTtJQUMzQixNQUFNLFFBQVEsR0FBRztRQUNiLEtBQUssRUFBRSxFQUFFO1FBQ1QsUUFBUSxFQUFFLENBQUM7S0FDZCxDQUFBO0lBZUQsU0FBc0Isd0JBQXdCLENBQVcsQ0FBMEIsRUFBRSxDQUFjOztZQUMvRixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUk7Z0JBQ2pCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGdCQUFnQixFQUFFLElBQUk7YUFDekIsQ0FBQTtZQUNELElBQUk7Z0JBQ0EsTUFBTSxLQUFLLEVBQUUsQ0FBQTtnQkFDYixPQUFPLFdBQVcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixJQUFJLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO29CQUU5QyxRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtvQkFDbkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7b0JBQ3JCLE9BQU8sd0JBQXdCLENBQUMsQ0FBQyxFQUFFO3dCQUMvQixnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCO3dCQUMxQyxnQkFBZ0IsRUFBRSxLQUFLO3FCQUMxQixDQUFDLENBQUE7aUJBQ0w7cUJBQU07b0JBQ0gsTUFBTSxHQUFHLENBQUE7aUJBQ1o7YUFDSjtRQUVMLENBQUM7S0FBQTtJQXRCcUIsZ0NBQXdCLDJCQXNCN0MsQ0FBQTtJQUdELFNBQXNCLEtBQUs7O1lBRXZCLElBQUks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LGVBQU8sUUFvSHZCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNhbWVsY2FzZUtleXMgPSByZXF1aXJlKFwiY2FtZWxjYXNlLWtleXNcIilcclxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuL3Byb3RvX2dlbi9hdXRoL2F1dGhfcGJcIlxyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBDb29sY2FyIHtcclxuICAgIGNvbnN0IHNlcnZlckFkZHIgPSAnaHR0cDovL2xvY2FsaG9zdDo4MTIzJ1xyXG4gICAgY29uc3QgQVVUSF9FUlIgPSAnQVVUSF9FUlInXHJcbiAgICBjb25zdCBhdXRoRGF0YSA9IHtcclxuICAgICAgICB0b2tlbjogJycsXHJcbiAgICAgICAgZXhwaXJ5TXM6IDAsXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0T3B0aW9uPFJFUSwgUkVTPiB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyB8ICdQVVQnIHwgJ1BPU1QnIHwgJ0RFTEVURSdcclxuICAgICAgICBwYXRoOiBzdHJpbmdcclxuICAgICAgICBkYXRhOiBSRVFcclxuICAgICAgICByZXNwTWFyc2hhbGxlcjogKHI6IG9iamVjdCkgPT4gUkVTXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBBdXRoT3B0aW9uIHtcclxuICAgICAgICBhdHRhY2hBdXRoSGVhZGVyOiBib29sZWFuXHJcbiAgICAgICAgcmV0cnlPbkF1dGhFcnJvcjogYm9vbGVhblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOeUqOS6juivt+axgua1geeoi+euoeeQhlxyXG4gICAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeTxSRVEsIFJFUz4obzogUmVxdWVzdE9wdGlvbjxSRVEsIFJFUz4sIGE/OiBBdXRoT3B0aW9uKTogUHJvbWlzZTxSRVM+IHtcclxuICAgICAgICBjb25zdCBhdXRoT3B0ID0gYSB8fCB7XHJcbiAgICAgICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IHRydWUsXHJcbiAgICAgICAgICAgIHJldHJ5T25BdXRoRXJyb3I6IHRydWUsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGxvZ2luKCkgICAvLyDopoHkv53or4Hlj5HnlJ/or7fmsYLliY0g6Lqr5Lu96YCa6L+H6K6k6K+BXHJcbiAgICAgICAgICAgIHJldHVybiBzZW5kUmVxdWVzdChvLCBhdXRoT3B0KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyID09PSBBVVRIX0VSUiAmJiBhdXRoT3B0LnJldHJ5T25BdXRoRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIC8vIOa4hemZpCB0b2tlbiDov5vooYzph43or5VcclxuICAgICAgICAgICAgICAgIGF1dGhEYXRhLnRva2VuID0gJydcclxuICAgICAgICAgICAgICAgIGF1dGhEYXRhLmV4cGlyeU1zID0gMFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeShvLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogYXV0aE9wdC5hdHRhY2hBdXRoSGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHJ5T25BdXRoRXJyb3I6IGZhbHNlLCAgICAvLyDov5nph4zorr7kuLpmYWxzZemBv+WFjeatu+W+queOr1xyXG4gICAgICAgICAgICAgICAgfSkgIC8vIOmcgOimgemHjeivlVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBleHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgLy8g5aaC5p6cdG9rZW7mnInmlYgg55u05o6l5Y+R5Lia5Yqh6K+35rGCIOS4jeeUqOWGjWxvZ2luXHJcbiAgICAgICAgaWYgKGF1dGhEYXRhLnRva2VuICYmIGF1dGhEYXRhLmV4cGlyeU1zID49IERhdGUubm93KCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ2hhcyB0b2tlbiBhbmQgZXhwaXJ5ID4gbm93JylcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCB3eFJlc3AgPSBhd2FpdCB3eExvZ2luKClcclxuICAgICAgICBjb25zdCByZXFUaW1lTXMgPSBEYXRlLm5vdygpXHJcbiAgICAgICAgY29uc3QgcmVzcCA9IGF3YWl0IHNlbmRSZXF1ZXN0PGF1dGgudjEuSUxvZ2luUmVxdWVzdCwgYXV0aC52MS5JTG9naW5SZXNwb25zZT4oe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS9hdXRoL2xvZ2luJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgY29kZTogd3hSZXNwLmNvZGUsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiBhdXRoLnYxLkxvZ2luUmVzcG9uc2UuZnJvbU9iamVjdCxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICByZXRyeU9uQXV0aEVycm9yOiBmYWxzZSxcclxuICAgICAgICB9KVxyXG4gICAgICAgIGF1dGhEYXRhLnRva2VuID0gcmVzcC5hY2Nlc3NUb2tlbiFcclxuICAgICAgICBhdXRoRGF0YS5leHBpcnlNcyA9IHJlcVRpbWVNcyArIHJlc3AuZXhwaXJlc0luISAqIDEwMDBcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBzZW5kUmVxdWVzdDxSRVEsIFJFUz4obzogUmVxdWVzdE9wdGlvbjxSRVEsIFJFUz4sIGE6IEF1dGhPcHRpb24pOiBQcm9taXNlPFJFUz4ge1xyXG4gICAgICAgIGNvbnN0IGF1dGhPcHQgPSBhIHx8IHtcclxuICAgICAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogdHJ1ZVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBoZWFkZXI6IFJlY29yZDxzdHJpbmcsIGFueT4gPSB7fVxyXG5cclxuICAgICAgICAgICAgaWYgKGF1dGhPcHQuYXR0YWNoQXV0aEhlYWRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGF1dGhEYXRhLnRva2VuICYmIGF1dGhEYXRhLmV4cGlyeU1zID49IERhdGUubm93KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXIuYXV0aG9yaXphdGlvbiA9ICdCZWFyZXIgJyArIGF1dGhEYXRhLnRva2VuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlamVjdChBVVRIX0VSUikgICAgLy8g55So5oi35pyJ5oSP5L2/55SoaGVhZGVy5p2l6aqM6K+B5L2G5piv5rKh5pyJ6YCa6L+HIOaKpemUmei/lOWbniBBVVRIX0VSUlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB3eC5yZXF1ZXN0KHtcclxuICAgICAgICAgICAgICAgIHVybDogc2VydmVyQWRkciArIG8ucGF0aCxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogby5tZXRob2QsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBvLmRhdGEsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXIsXHJcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXMuc3RhdHVzQ29kZSA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChBVVRIX0VSUilcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoby5yZXNwTWFyc2hhbGxlcihcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhbWVsY2FzZUtleXMocmVzLmRhdGEgYXMgb2JqZWN0LCB7IGRlZXA6IHRydWUgfSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgZmFpbDogcmVqZWN0LFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuICAgIGZ1bmN0aW9uIHd4TG9naW4oKTogUHJvbWlzZTxXZWNoYXRNaW5pcHJvZ3JhbS5Mb2dpblN1Y2Nlc3NDYWxsYmFja1Jlc3VsdD4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIHd4LmxvZ2luKHtcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlc29sdmUsXHJcbiAgICAgICAgICAgICAgICBmYWlsOiByZWplY3QsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSJdfQ==