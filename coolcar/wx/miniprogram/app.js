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
const camelcaseKeys = require("camelcase-keys");
const auth_pb_1 = require("./service/proto_gen/auth/auth_pb");
const wxapi_1 = require("./utils/wxapi");
let resolveUserInfo;
let rejectUserInfo;
App({
    globalData: {
        userInfo: new Promise((resolve, reject) => {
            resolveUserInfo = resolve;
            rejectUserInfo = reject;
        })
    },
    onLaunch() {
        return __awaiter(this, void 0, void 0, function* () {
            wx.login({
                success: res => {
                    console.log(res.code);
                    wx.request({
                        url: 'http://localhost:8123/v1/auth/login',
                        method: 'POST',
                        data: {
                            code: res.code
                        },
                        success: res => {
                            const loginResp = auth_pb_1.auth.v1.LoginResponse.fromObject(camelcaseKeys(res.data));
                            console.log(loginResp);
                            wx.request({
                                url: 'http://localhost:8123/v1/trip',
                                method: 'POST',
                                data: {
                                    start: 'new trip',
                                },
                                header: {
                                    authorization: 'Bearer ' + loginResp.accessToken,
                                }
                            });
                        },
                        fail: console.error,
                    });
                },
            });
            try {
                const setting = yield wxapi_1.getSetting();
                if (setting.authSetting['scope.userInfo']) {
                    const userInfoRes = yield wxapi_1.getUserInfo();
                    resolveUserInfo(userInfoRes.userInfo);
                }
            }
            catch (error) {
                rejectUserInfo(error);
            }
        });
    },
    resolveUserInfo(userInfo) {
        resolveUserInfo(userInfo);
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBRWhELDhEQUF1RDtBQUV2RCx5Q0FBdUQ7QUFFdkQsSUFBSSxlQUFzRyxDQUFBO0FBQzFHLElBQUksY0FBc0MsQ0FBQTtBQUcxQyxHQUFHLENBQWE7SUFDZCxVQUFVLEVBQUU7UUFDVixRQUFRLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEMsZUFBZSxHQUFHLE9BQU8sQ0FBQTtZQUN6QixjQUFjLEdBQUcsTUFBTSxDQUFBO1FBQ3pCLENBQUMsQ0FBQztLQUNIO0lBQ0ssUUFBUTs7WUFnQlosRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDUCxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRXJCLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ1QsR0FBRyxFQUFFLHFDQUFxQzt3QkFDMUMsTUFBTSxFQUFFLE1BQU07d0JBQ2QsSUFBSSxFQUFFOzRCQUNKLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTt5QkFDVTt3QkFDMUIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFOzRCQUNiLE1BQU0sU0FBUyxHQUNmLGNBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDOUIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFjLENBQUMsQ0FDbEMsQ0FBQTs0QkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBOzRCQUN0QixFQUFFLENBQUMsT0FBTyxDQUFDO2dDQUNULEdBQUcsRUFBRSwrQkFBK0I7Z0NBQ3BDLE1BQU0sRUFBRSxNQUFNO2dDQUNkLElBQUksRUFBRTtvQ0FDSixLQUFLLEVBQUUsVUFBVTtpQ0FDYztnQ0FDakMsTUFBTSxFQUFFO29DQUNOLGFBQWEsRUFBRSxTQUFTLEdBQUcsU0FBUyxDQUFDLFdBQVc7aUNBQ2pEOzZCQUNGLENBQUMsQ0FBQTt3QkFDSixDQUFDO3dCQUNELElBQUksRUFBRSxPQUFPLENBQUMsS0FBSztxQkFDcEIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUE7WUFJRixJQUFJO2dCQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sa0JBQVUsRUFBRSxDQUFBO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFDekMsTUFBTSxXQUFXLEdBQUcsTUFBTSxtQkFBVyxFQUFFLENBQUE7b0JBQ3ZDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3RDO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDdEI7UUEwQ0gsQ0FBQztLQUFBO0lBRUQsZUFBZSxDQUFDLFFBQW9DO1FBQ2xELGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMzQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNhbWVsY2FzZUtleXMgPSByZXF1aXJlKFwiY2FtZWxjYXNlLWtleXNcIilcbmltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi9hcHBvcHRpb25cIlxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuL3NlcnZpY2UvcHJvdG9fZ2VuL2F1dGgvYXV0aF9wYlwiXG5pbXBvcnQgeyByZW50YWwgfSBmcm9tIFwiLi9zZXJ2aWNlL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCJcbmltcG9ydCB7IGdldFNldHRpbmcsIGdldFVzZXJJbmZvIH0gZnJvbSBcIi4vdXRpbHMvd3hhcGlcIlxuXG5sZXQgcmVzb2x2ZVVzZXJJbmZvOiAodmFsdWU6IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvIHwgUHJvbWlzZUxpa2U8V2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8+KSA9PiB2b2lkXG5sZXQgcmVqZWN0VXNlckluZm86IChyZWFzb24/OiBhbnkpID0+IHZvaWRcblxuLy8gYXBwLnRzXG5BcHA8SUFwcE9wdGlvbj4oe1xuICBnbG9iYWxEYXRhOiB7XG4gICAgdXNlckluZm86IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc29sdmVVc2VySW5mbyA9IHJlc29sdmVcbiAgICAgIHJlamVjdFVzZXJJbmZvID0gcmVqZWN0XG4gICAgfSlcbiAgfSxcbiAgYXN5bmMgb25MYXVuY2goKSB7XG4gICAgLy8gd3gucmVxdWVzdCh7XG4gICAgLy8gICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgxMjMvdHJpcC90cmlwMTEyMjMzJyxcbiAgICAvLyAgIG1ldGhvZDogJ0dFVCcsXG4gICAgLy8gICBzdWNjZXNzOiByZXMgPT4ge1xuICAgIC8vICAgICBjb25zdCBnZXRUcmlwUmVzID0gY29vbGNhci5HZXRUcmlwUmVzcG9uc2UuZnJvbU9iamVjdChcbiAgICAvLyAgICAgICBjYW1lbGNhc2VLZXlzKHJlcy5kYXRhIGFzIG9iamVjdCwge1xuICAgIC8vICAgICAgICAgZGVlcDogdHJ1ZSxcbiAgICAvLyAgICAgICB9KVxuICAgIC8vICAgICApXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGdldFRyaXBSZXMpXG4gICAgLy8gICAgIGNvbnNvbGUubG9nKGNvb2xjYXIuVHJpcFN0YXR1c1tnZXRUcmlwUmVzLnRyaXA/LnN0YXR1cyFdKVxuICAgIC8vICAgfSxcbiAgICAvLyAgIGZhaWw6IGNvbnNvbGUuZXJyb3IsXG4gICAgLy8gfSlcbiAgICAvLyDnmbvlvZVcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuY29kZSlcbiAgICAgICAgLy8g5Y+R6YCBIHJlcy5jb2RlIOWIsOWQjuWPsOaNouWPliBvcGVuSWQsIHNlc3Npb25LZXksIHVuaW9uSWRcbiAgICAgICAgd3gucmVxdWVzdCh7XG4gICAgICAgICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MTIzL3YxL2F1dGgvbG9naW4nLFxuICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGNvZGU6IHJlcy5jb2RlXG4gICAgICAgICAgfSBhcyBhdXRoLnYxLklMb2dpblJlcXVlc3QsXG4gICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGxvZ2luUmVzcDogYXV0aC52MS5JTG9naW5SZXNwb25zZSA9IFxuICAgICAgICAgICAgYXV0aC52MS5Mb2dpblJlc3BvbnNlLmZyb21PYmplY3QoXG4gICAgICAgICAgICAgIGNhbWVsY2FzZUtleXMocmVzLmRhdGEgYXMgb2JqZWN0KSxcbiAgICAgICAgICAgIClcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGxvZ2luUmVzcClcbiAgICAgICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgxMjMvdjEvdHJpcCcsXG4gICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxuICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc3RhcnQ6ICduZXcgdHJpcCcsXG4gICAgICAgICAgICAgIH0gYXMgcmVudGFsLnYxLklDcmVhdGVUcmlwUmVxdWVzdCxcbiAgICAgICAgICAgICAgaGVhZGVyIDp7XG4gICAgICAgICAgICAgICAgYXV0aG9yaXphdGlvbjogJ0JlYXJlciAnICsgbG9naW5SZXNwLmFjY2Vzc1Rva2VuLFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZmFpbDogY29uc29sZS5lcnJvcixcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDniYjmnKwzXG4gICAgLy8g5L2/55SoIGFzeW5jIGF3YWl0IOivreazleezluiOt+WPlueUqOaIt+S/oeaBr1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzZXR0aW5nID0gYXdhaXQgZ2V0U2V0dGluZygpXG4gICAgICBpZiAoc2V0dGluZy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgICAgICBjb25zdCB1c2VySW5mb1JlcyA9IGF3YWl0IGdldFVzZXJJbmZvKClcbiAgICAgICAgcmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvUmVzLnVzZXJJbmZvKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3RVc2VySW5mbyhlcnJvcilcbiAgICB9XG5cblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDniYjmnKwyXG4gICAgLy8g5L2/55SoUHJvbWlzZeaUueWGmeeUqOaIt+S/oeaBr1xuICAgIC8vIGdldFNldHRpbmcoKS50aGVuKHJlcyA9PiB7XG4gICAgLy8gICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgLy8gICAgIHJldHVybiBnZXRVc2VySW5mbygpXG4gICAgLy8gICB9XG4gICAgLy8gICAvLyDlpoLmnpzmsqHmnInmnYPpmZBcbiAgICAvLyAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKVxuICAgIC8vIH0pLnRoZW4ocmVzID0+IHtcbiAgICAvLyAgIC8vIOWmguaenOayoeacieadg+mZkOiHqueEtuaLv+S4jeWIsOeUqOaIt+S/oeaBr++8jOebtOaOpei/lOWbnlxuICAgIC8vICAgaWYgKCFyZXMpIHtcbiAgICAvLyAgICAgcmV0dXJuXG4gICAgLy8gICB9XG4gICAgLy8gICAvLyDlpoLmnpzmi7/liLDkv6Hmga/lsLHnu5nlh7rpgJrnn6Ug5bey57uP5ou/5Yiw5L+h5oGvXG4gICAgLy8gICByZXNvbHZlVXNlckluZm8ocmVzLnVzZXJJbmZvKVxuICAgIC8vIH0pLmNhdGNoKGVyciA9PiByZWplY3RVc2VySW5mbyhlcnIpKVxuXG5cbiAgICAvLyDojrflj5bnlKjmiLfkv6Hmga8g5Y6f54mIIOeJiOacrDFcbiAgICAvLyDkvb/nlKggY2FsbGJhY2sg5bWM5aWXIGNhbGxiYWNrIOeahOaWueW8j+iOt+WPlueUqOaIt+S/oeaBr1xuICAgIC8vIHd4LmdldFNldHRpbmcoe1xuICAgIC8vICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAvLyAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgIC8vICAgICAgIC8vIOW3sue7j+aOiOadg++8jOWPr+S7peebtOaOpeiwg+eUqCBnZXRVc2VySW5mbyDojrflj5blpLTlg4/mmLXnp7DvvIzkuI3kvJrlvLnmoYZcbiAgICAvLyAgICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgLy8gICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgIC8vICAgICAgICAgICAvLyDlj6/ku6XlsIYgcmVzIOWPkemAgee7meWQjuWPsOino+eggeWHuiB1bmlvbklkXG4gICAgLy8gICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xuXG4gICAgLy8gICAgICAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgLy8gICAgICAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcbiAgICAvLyAgICAgICAgICAgaWYgKHRoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrKSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2socmVzKVxuICAgIC8vICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9LFxuICAgIC8vICAgICAgIH0pXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0sXG4gICAgLy8gfSlcbiAgfSxcblxuICByZXNvbHZlVXNlckluZm8odXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvKSB7XG4gICAgcmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxuICB9XG59KSJdfQ==