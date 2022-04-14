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
    Coolcar.serverAddr = 'http://139.155.64.232';
    Coolcar.wsAddr = 'ws://localhost:9090';
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
                url: Coolcar.serverAddr + o.path,
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
    function uploadfile(o) {
        const data = wx.getFileSystemManager().readFileSync(o.localPath);
        return new Promise((resolve, reject) => {
            wx.request({
                method: 'PUT',
                url: o.url,
                data: data,
                header: { 'Content-Type': 'image/jpeg' },
                success: res => {
                    if (res.statusCode >= 400) {
                        reject(res);
                    }
                    else {
                        resolve();
                    }
                },
                fail: reject,
            });
        });
    }
    Coolcar.uploadfile = uploadfile;
})(Coolcar = exports.Coolcar || (exports.Coolcar = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVxdWVzdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlcXVlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBQ2hELHNEQUErQztBQUUvQyxJQUFpQixPQUFPLENBNEp2QjtBQTVKRCxXQUFpQixPQUFPO0lBQ1Asa0JBQVUsR0FBRyx1QkFBdUIsQ0FBQTtJQUdwQyxjQUFNLEdBQUcscUJBQXFCLENBQUE7SUFDM0MsTUFBTSxRQUFRLEdBQUcsVUFBVSxDQUFBO0lBQzNCLE1BQU0sUUFBUSxHQUFHO1FBQ2IsS0FBSyxFQUFFLEVBQUU7UUFDVCxRQUFRLEVBQUUsQ0FBQztLQUNkLENBQUE7SUF1QkQsU0FBc0Isd0JBQXdCLENBQVcsQ0FBMEIsRUFBRSxDQUFjOztZQUMvRixNQUFNLE9BQU8sR0FBRyxDQUFDLElBQUk7Z0JBQ2pCLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGdCQUFnQixFQUFFLElBQUk7YUFDekIsQ0FBQTtZQUNELElBQUk7Z0JBQ0EsTUFBTSxLQUFLLEVBQUUsQ0FBQTtnQkFDYixPQUFPLFdBQVcsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUE7YUFDakM7WUFBQyxPQUFPLEdBQUcsRUFBRTtnQkFDVixJQUFJLEdBQUcsS0FBSyxRQUFRLElBQUksT0FBTyxDQUFDLGdCQUFnQixFQUFFO29CQUU5QyxRQUFRLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQTtvQkFDbkIsUUFBUSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUE7b0JBQ3JCLE9BQU8sd0JBQXdCLENBQUMsQ0FBQyxFQUFFO3dCQUMvQixnQkFBZ0IsRUFBRSxPQUFPLENBQUMsZ0JBQWdCO3dCQUMxQyxnQkFBZ0IsRUFBRSxLQUFLO3FCQUMxQixDQUFDLENBQUE7aUJBQ0w7cUJBQU07b0JBQ0gsTUFBTSxHQUFHLENBQUE7aUJBQ1o7YUFDSjtRQUVMLENBQUM7S0FBQTtJQXRCcUIsZ0NBQXdCLDJCQXNCN0MsQ0FBQTtJQUdE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RSxDQUFDLG9CQUFvQixFQUFFLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUNoRSxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBRW5DLEVBQUUsQ0FBQyxPQUFPLENBQUM7Z0JBQ1AsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHO2dCQUNWLElBQUksRUFBRSxJQUFJO2dCQUNWLE1BQU0sRUFBRSxFQUFFLGNBQWMsRUFBRSxZQUFZLEVBQUU7Z0JBQ3hDLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDWCxJQUFJLEdBQUcsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFO3dCQUN2QixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUE7cUJBQ2Q7eUJBQU07d0JBQ0gsT0FBTyxFQUFFLENBQUE7cUJBQ1o7Z0JBQ0wsQ0FBQztnQkFDRCxJQUFJLEVBQUUsTUFBTTthQUNmLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBRU4sQ0FBQztJQXBCZSxrQkFBVSxhQW9CekIsQ0FBQTtBQUNMLENBQUMsRUE1SmdCLE9BQU8sR0FBUCxlQUFPLEtBQVAsZUFBTyxRQTRKdkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgY2FtZWxjYXNlS2V5cyA9IHJlcXVpcmUoXCJjYW1lbGNhc2Uta2V5c1wiKVxyXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIi4vcHJvdG9fZ2VuL2F1dGgvYXV0aF9wYlwiXHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIENvb2xjYXIge1xyXG4gICAgZXhwb3J0IGNvbnN0IHNlcnZlckFkZHIgPSAnaHR0cDovLzEzOS4xNTUuNjQuMjMyJ1xyXG4gICAgLy8gZXhwb3J0IGNvbnN0IHNlcnZlckFkZHIgPSAnaHR0cDovL2xvY2FsaG9zdDo4MTIzJ1xyXG4gICAgLy8gZXhwb3J0IGNvbnN0IHNlcnZlckFkZHIgPSAnaHR0cDovLzE5Mi4xNjguMjMwLjExOjMxMjEzJ1xyXG4gICAgZXhwb3J0IGNvbnN0IHdzQWRkciA9ICd3czovL2xvY2FsaG9zdDo5MDkwJ1xyXG4gICAgY29uc3QgQVVUSF9FUlIgPSAnQVVUSF9FUlInXHJcbiAgICBjb25zdCBhdXRoRGF0YSA9IHtcclxuICAgICAgICB0b2tlbjogJycsXHJcbiAgICAgICAgZXhwaXJ5TXM6IDAsXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBSZXF1ZXN0T3B0aW9uPFJFUSwgUkVTPiB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyB8ICdQVVQnIHwgJ1BPU1QnIHwgJ0RFTEVURSdcclxuICAgICAgICBwYXRoOiBzdHJpbmdcclxuICAgICAgICBkYXRhPzogUkVRXHJcbiAgICAgICAgcmVzcE1hcnNoYWxsZXI6IChyOiBvYmplY3QpID0+IFJFU1xyXG4gICAgfVxyXG5cclxuICAgIC8vIOivt+axguaXtueahOi6q+S7veiupOivgemAiemhuVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBBdXRoT3B0aW9uIHtcclxuICAgICAgICBhdHRhY2hBdXRoSGVhZGVyOiBib29sZWFuICAgICAgIC8vIOaYr+WQpua3u+WKoCB0b2tlbiDlpLRcclxuICAgICAgICByZXRyeU9uQXV0aEVycm9yOiBib29sZWFuICAgICAgIC8vIOaYr+WQpumHjeivlVxyXG4gICAgfVxyXG5cclxuICAgIC8vIOeUqOS6juivt+axgua1geeoi+euoeeQhlxyXG4gICAgLy8gMS4g5Yik5pat6K+35rGC5pe25piv5ZCm6ZyA6KaB5pC65bim6K6k6K+B5L+h5oGv5ZKM6YeN6K+V6YCJ6aG5XHJcbiAgICAvLyAyLiDlsJ3or5XnmbvlvZUg6L+b6KGM6Lqr5Lu96aqM6K+BXHJcbiAgICAvLyAgICAgIDIuMSDmo4Dmn6V0b2tlbuWSjGV4cGlyZeaXtumXtCDlpoLmnpzmnInmlYjkuI3lho3nmbvlvZVcclxuICAgIC8vICAgICAgMi4yIOWQpuWImeaJp+ihjOeZu+W9leW5tuiuvue9rnRva2Vu5ZKMZXhwaXJlXHJcbiAgICAvLyAzLiDoi6XpgJrov4cg5omn6KGM55yf5q2j55qE6K+35rGC6YC76L6RXHJcbiAgICAvLyA0LiDlkKbliJnmo4Dmn6XplJnor6/nsbvlnosg6L+b6KGM6YeN6K+V55m75b2VICjph43or5XmrKHmlbDkuLox5qyhKVxyXG4gICAgLy8gNS4g6Iul6YeN6K+V5ZCO5YaN5qyh5Ye6546w6Zeu6aKYIOaKm+WHuumUmeivr1xyXG4gICAgZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeTxSRVEsIFJFUz4obzogUmVxdWVzdE9wdGlvbjxSRVEsIFJFUz4sIGE/OiBBdXRoT3B0aW9uKTogUHJvbWlzZTxSRVM+IHtcclxuICAgICAgICBjb25zdCBhdXRoT3B0ID0gYSB8fCB7XHJcbiAgICAgICAgICAgIGF0dGFjaEF1dGhIZWFkZXI6IHRydWUsXHJcbiAgICAgICAgICAgIHJldHJ5T25BdXRoRXJyb3I6IHRydWUsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGF3YWl0IGxvZ2luKCkgICAvLyDopoHkv53or4Hlj5HnlJ/or7fmsYLliY0g6Lqr5Lu96YCa6L+H6K6k6K+BXHJcbiAgICAgICAgICAgIHJldHVybiBzZW5kUmVxdWVzdChvLCBhdXRoT3B0KVxyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgICBpZiAoZXJyID09PSBBVVRIX0VSUiAmJiBhdXRoT3B0LnJldHJ5T25BdXRoRXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIC8vIOa4hemZpCB0b2tlbiDov5vooYzph43or5VcclxuICAgICAgICAgICAgICAgIGF1dGhEYXRhLnRva2VuID0gJydcclxuICAgICAgICAgICAgICAgIGF1dGhEYXRhLmV4cGlyeU1zID0gMFxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeShvLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogYXV0aE9wdC5hdHRhY2hBdXRoSGVhZGVyLFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHJ5T25BdXRoRXJyb3I6IGZhbHNlLCAgICAvLyDov5nph4zorr7kuLpmYWxzZemBv+WFjeatu+W+queOr1xyXG4gICAgICAgICAgICAgICAgfSkgIC8vIOmcgOimgemHjeivlVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgZXJyXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIOWMheijhSB3eCDnmoTljp/nlJ8gbG9naW5cclxuICAgIGV4cG9ydCBhc3luYyBmdW5jdGlvbiBsb2dpbigpIHtcclxuICAgICAgICAvLyDlpoLmnpx0b2tlbuacieaViCDnm7TmjqXlj5HkuJrliqHor7fmsYIg5LiN55So5YaNbG9naW5cclxuICAgICAgICBpZiAoYXV0aERhdGEudG9rZW4gJiYgYXV0aERhdGEuZXhwaXJ5TXMgPj0gRGF0ZS5ub3coKSkge1xyXG4gICAgICAgICAgICAvLyAgY29uc29sZS5sb2coJ2hhcyB0b2tlbiBhbmQgZXhwaXJ5ID4gbm93Jykg55So5LqO6LCD6K+VXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g6LCD55So5b6u5L+hbG9naW7mjqXlj6Pojrflvpdjb2RlXHJcbiAgICAgICAgY29uc3Qgd3hSZXNwID0gYXdhaXQgd3hMb2dpbigpXHJcbiAgICAgICAgY29uc3QgcmVxVGltZU1zID0gRGF0ZS5ub3coKVxyXG4gICAgICAgIC8vIOmAmui/h2NvZGXlkJHlkI7nq6/lj5HotbforqTor4Hor7fmsYJcclxuICAgICAgICBjb25zdCByZXNwID0gYXdhaXQgc2VuZFJlcXVlc3Q8YXV0aC52MS5JTG9naW5SZXF1ZXN0LCBhdXRoLnYxLklMb2dpblJlc3BvbnNlPih7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBwYXRoOiAnL3YxL2F1dGgvbG9naW4nLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBjb2RlOiB3eFJlc3AuY29kZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IGF1dGgudjEuTG9naW5SZXNwb25zZS5mcm9tT2JqZWN0LFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgICAgYXR0YWNoQXV0aEhlYWRlcjogZmFsc2UsXHJcbiAgICAgICAgICAgIHJldHJ5T25BdXRoRXJyb3I6IGZhbHNlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgYXV0aERhdGEudG9rZW4gPSByZXNwLmFjY2Vzc1Rva2VuISAgLy8gISDooajnpLrnoa7lrpror6XlgLzkuIDlrprmnIlcclxuICAgICAgICBhdXRoRGF0YS5leHBpcnlNcyA9IHJlcVRpbWVNcyArIHJlc3AuZXhwaXJlc0luISAqIDEwMDBcclxuICAgIH1cclxuXHJcbiAgICAvLyDlnKjouqvku73orqTor4HpgJrov4flkI7miafooYznnJ/mraPnmoTor7fmsYLlpITnkIZcclxuICAgIGZ1bmN0aW9uIHNlbmRSZXF1ZXN0PFJFUSwgUkVTPihvOiBSZXF1ZXN0T3B0aW9uPFJFUSwgUkVTPiwgYTogQXV0aE9wdGlvbik6IFByb21pc2U8UkVTPiB7XHJcbiAgICAgICAgY29uc3QgYXV0aE9wdCA9IGEgfHwge1xyXG4gICAgICAgICAgICBhdHRhY2hBdXRoSGVhZGVyOiB0cnVlXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlYWRlcjogUmVjb3JkPHN0cmluZywgYW55PiA9IHt9XHJcblxyXG4gICAgICAgICAgICBpZiAoYXV0aE9wdC5hdHRhY2hBdXRoSGVhZGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYXV0aERhdGEudG9rZW4gJiYgYXV0aERhdGEuZXhwaXJ5TXMgPj0gRGF0ZS5ub3coKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGhlYWRlci5hdXRob3JpemF0aW9uID0gJ0JlYXJlciAnICsgYXV0aERhdGEudG9rZW5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEFVVEhfRVJSKSAgICAvLyDnlKjmiLfmnInmhI/kvb/nlKhoZWFkZXLmnaXpqozor4HkvYbmmK/msqHmnInpgJrov4cg5oql6ZSZ6L+U5ZueIEFVVEhfRVJSXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiBzZXJ2ZXJBZGRyICsgby5wYXRoLFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiBvLm1ldGhvZCxcclxuICAgICAgICAgICAgICAgIGRhdGE6IG8uZGF0YSxcclxuICAgICAgICAgICAgICAgIGhlYWRlcixcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID09PSA0MDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KEFVVEhfRVJSKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAocmVzLnN0YXR1c0NvZGUgPj0gNDAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChyZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShvLnJlc3BNYXJzaGFsbGVyKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FtZWxjYXNlS2V5cyhyZXMuZGF0YSBhcyBvYmplY3QsIHsgZGVlcDogdHJ1ZSB9KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiByZWplY3QsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgZnVuY3Rpb24gd3hMb2dpbigpOiBQcm9taXNlPFdlY2hhdE1pbmlwcm9ncmFtLkxvZ2luU3VjY2Vzc0NhbGxiYWNrUmVzdWx0PiB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgd3gubG9naW4oe1xyXG4gICAgICAgICAgICAgICAgc3VjY2VzczogcmVzb2x2ZSxcclxuICAgICAgICAgICAgICAgIGZhaWw6IHJlamVjdCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkRmlsZXNPcHRzIHtcclxuICAgICAgICBsb2NhbFBhdGg6IHN0cmluZ1xyXG4gICAgICAgIHVybDogc3RyaW5nXHJcbiAgICB9XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gdXBsb2FkZmlsZShvOiBVcGxvYWRGaWxlc09wdHMpOiBQcm9taXNlPHZvaWQ+IHtcclxuICAgICAgICBjb25zdCBkYXRhID0gd3guZ2V0RmlsZVN5c3RlbU1hbmFnZXIoKS5yZWFkRmlsZVN5bmMoby5sb2NhbFBhdGgpXHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgLy8g5rWL6K+V5LiK5LygXHJcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIHVybDogby51cmwsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxyXG4gICAgICAgICAgICAgICAgaGVhZGVyOiB7ICdDb250ZW50LVR5cGUnOiAnaW1hZ2UvanBlZycgfSxcclxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlcy5zdGF0dXNDb2RlID49IDQwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QocmVzKVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBmYWlsOiByZWplY3QsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICB9XHJcbn0iXX0=