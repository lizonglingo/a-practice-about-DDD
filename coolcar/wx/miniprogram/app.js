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
            wx.request({
                url: 'http://localhost:8123/trip/trip112233',
                method: 'GET',
                success: console.log,
                fail: console.error,
            });
            wx.login({
                success: res => {
                    console.log(res.code);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQ0EseUNBQXVEO0FBRXZELElBQUksZUFBc0csQ0FBQTtBQUMxRyxJQUFJLGNBQXNDLENBQUE7QUFHMUMsR0FBRyxDQUFhO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsUUFBUSxFQUFFLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLGVBQWUsR0FBRyxPQUFPLENBQUE7WUFDekIsY0FBYyxHQUFHLE1BQU0sQ0FBQTtRQUN6QixDQUFDLENBQUM7S0FDSDtJQUNLLFFBQVE7O1lBQ1osRUFBRSxDQUFDLE9BQU8sQ0FBQztnQkFDVCxHQUFHLEVBQUUsdUNBQXVDO2dCQUM1QyxNQUFNLEVBQUUsS0FBSztnQkFDYixPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUc7Z0JBQ3BCLElBQUksRUFBRSxPQUFPLENBQUMsS0FBSzthQUNwQixDQUFDLENBQUE7WUFFRixFQUFFLENBQUMsS0FBSyxDQUFDO2dCQUNQLE9BQU8sRUFBRSxHQUFHLENBQUMsRUFBRTtvQkFDYixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQTtnQkFFdkIsQ0FBQzthQUNGLENBQUMsQ0FBQTtZQUlGLElBQUk7Z0JBQ0YsTUFBTSxPQUFPLEdBQUcsTUFBTSxrQkFBVSxFQUFFLENBQUE7Z0JBQ2xDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxFQUFFO29CQUN6QyxNQUFNLFdBQVcsR0FBRyxNQUFNLG1CQUFXLEVBQUUsQ0FBQTtvQkFDdkMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxRQUFRLENBQUMsQ0FBQTtpQkFDdEM7YUFDRjtZQUFDLE9BQU8sS0FBSyxFQUFFO2dCQUNkLGNBQWMsQ0FBQyxLQUFLLENBQUMsQ0FBQTthQUN0QjtRQTBDSCxDQUFDO0tBQUE7SUFFRCxlQUFlLENBQUMsUUFBb0M7UUFDbEQsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzNCLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQXBwT3B0aW9uIH0gZnJvbSBcIi4vYXBwb3B0aW9uXCJcbmltcG9ydCB7IGdldFNldHRpbmcsIGdldFVzZXJJbmZvIH0gZnJvbSBcIi4vdXRpbHMvd3hhcGlcIlxuXG5sZXQgcmVzb2x2ZVVzZXJJbmZvOiAodmFsdWU6IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvIHwgUHJvbWlzZUxpa2U8V2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8+KSA9PiB2b2lkXG5sZXQgcmVqZWN0VXNlckluZm86IChyZWFzb24/OiBhbnkpID0+IHZvaWRcblxuLy8gYXBwLnRzXG5BcHA8SUFwcE9wdGlvbj4oe1xuICBnbG9iYWxEYXRhOiB7XG4gICAgdXNlckluZm86IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgIHJlc29sdmVVc2VySW5mbyA9IHJlc29sdmVcbiAgICAgIHJlamVjdFVzZXJJbmZvID0gcmVqZWN0XG4gICAgfSlcbiAgfSxcbiAgYXN5bmMgb25MYXVuY2goKSB7XG4gICAgd3gucmVxdWVzdCh7XG4gICAgICB1cmw6ICdodHRwOi8vbG9jYWxob3N0OjgxMjMvdHJpcC90cmlwMTEyMjMzJyxcbiAgICAgIG1ldGhvZDogJ0dFVCcsXG4gICAgICBzdWNjZXNzOiBjb25zb2xlLmxvZyxcbiAgICAgIGZhaWw6IGNvbnNvbGUuZXJyb3IsXG4gICAgfSlcbiAgICAvLyDnmbvlvZVcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuY29kZSlcbiAgICAgICAgLy8g5Y+R6YCBIHJlcy5jb2RlIOWIsOWQjuWPsOaNouWPliBvcGVuSWQsIHNlc3Npb25LZXksIHVuaW9uSWRcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDniYjmnKwzXG4gICAgLy8g5L2/55SoIGFzeW5jIGF3YWl0IOivreazleezluiOt+WPlueUqOaIt+S/oeaBr1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzZXR0aW5nID0gYXdhaXQgZ2V0U2V0dGluZygpXG4gICAgICBpZiAoc2V0dGluZy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgICAgICBjb25zdCB1c2VySW5mb1JlcyA9IGF3YWl0IGdldFVzZXJJbmZvKClcbiAgICAgICAgcmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvUmVzLnVzZXJJbmZvKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3RVc2VySW5mbyhlcnJvcilcbiAgICB9XG5cblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDniYjmnKwyXG4gICAgLy8g5L2/55SoUHJvbWlzZeaUueWGmeeUqOaIt+S/oeaBr1xuICAgIC8vIGdldFNldHRpbmcoKS50aGVuKHJlcyA9PiB7XG4gICAgLy8gICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgLy8gICAgIHJldHVybiBnZXRVc2VySW5mbygpXG4gICAgLy8gICB9XG4gICAgLy8gICAvLyDlpoLmnpzmsqHmnInmnYPpmZBcbiAgICAvLyAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKVxuICAgIC8vIH0pLnRoZW4ocmVzID0+IHtcbiAgICAvLyAgIC8vIOWmguaenOayoeacieadg+mZkOiHqueEtuaLv+S4jeWIsOeUqOaIt+S/oeaBr++8jOebtOaOpei/lOWbnlxuICAgIC8vICAgaWYgKCFyZXMpIHtcbiAgICAvLyAgICAgcmV0dXJuXG4gICAgLy8gICB9XG4gICAgLy8gICAvLyDlpoLmnpzmi7/liLDkv6Hmga/lsLHnu5nlh7rpgJrnn6Ug5bey57uP5ou/5Yiw5L+h5oGvXG4gICAgLy8gICByZXNvbHZlVXNlckluZm8ocmVzLnVzZXJJbmZvKVxuICAgIC8vIH0pLmNhdGNoKGVyciA9PiByZWplY3RVc2VySW5mbyhlcnIpKVxuXG5cbiAgICAvLyDojrflj5bnlKjmiLfkv6Hmga8g5Y6f54mIIOeJiOacrDFcbiAgICAvLyDkvb/nlKggY2FsbGJhY2sg5bWM5aWXIGNhbGxiYWNrIOeahOaWueW8j+iOt+WPlueUqOaIt+S/oeaBr1xuICAgIC8vIHd4LmdldFNldHRpbmcoe1xuICAgIC8vICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAvLyAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgIC8vICAgICAgIC8vIOW3sue7j+aOiOadg++8jOWPr+S7peebtOaOpeiwg+eUqCBnZXRVc2VySW5mbyDojrflj5blpLTlg4/mmLXnp7DvvIzkuI3kvJrlvLnmoYZcbiAgICAvLyAgICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgLy8gICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgIC8vICAgICAgICAgICAvLyDlj6/ku6XlsIYgcmVzIOWPkemAgee7meWQjuWPsOino+eggeWHuiB1bmlvbklkXG4gICAgLy8gICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xuXG4gICAgLy8gICAgICAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgLy8gICAgICAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcbiAgICAvLyAgICAgICAgICAgaWYgKHRoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrKSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2socmVzKVxuICAgIC8vICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9LFxuICAgIC8vICAgICAgIH0pXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0sXG4gICAgLy8gfSlcbiAgfSxcblxuICByZXNvbHZlVXNlckluZm8odXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvKSB7XG4gICAgcmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxuICB9XG59KSJdfQ==