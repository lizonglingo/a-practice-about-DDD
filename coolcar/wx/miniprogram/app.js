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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEseUNBQXVEO0FBRXZELElBQUksZUFBc0csQ0FBQTtBQUMxRyxJQUFJLGNBQXNDLENBQUE7QUFHMUMsR0FBRyxDQUFhO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsUUFBUSxFQUFFLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLGVBQWUsR0FBRyxPQUFPLENBQUE7WUFDekIsY0FBYyxHQUFHLE1BQU0sQ0FBQTtRQUN6QixDQUFDLENBQUM7S0FDSDtJQUNLLFFBQVE7O1lBR1osRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDUCxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLENBQUM7YUFDRixDQUFDLENBQUE7WUFJRixJQUFJO2dCQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sa0JBQVUsRUFBRSxDQUFBO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFDekMsTUFBTSxXQUFXLEdBQUcsTUFBTSxtQkFBVyxFQUFFLENBQUE7b0JBQ3ZDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3RDO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDdEI7UUEwQ0gsQ0FBQztLQUFBO0lBRUQsZUFBZSxDQUFDLFFBQW9DO1FBQ2xELGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMzQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2V0dGluZywgZ2V0VXNlckluZm8gfSBmcm9tIFwiLi91dGlscy93eGFwaVwiXG5cbmxldCByZXNvbHZlVXNlckluZm86ICh2YWx1ZTogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8gfCBQcm9taXNlTGlrZTxXZWNoYXRNaW5pcHJvZ3JhbS5Vc2VySW5mbz4pID0+IHZvaWRcbmxldCByZWplY3RVc2VySW5mbzogKHJlYXNvbj86IGFueSkgPT4gdm9pZFxuXG4vLyBhcHAudHNcbkFwcDxJQXBwT3B0aW9uPih7XG4gIGdsb2JhbERhdGE6IHtcbiAgICB1c2VySW5mbzogbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgcmVzb2x2ZVVzZXJJbmZvID0gcmVzb2x2ZVxuICAgICAgcmVqZWN0VXNlckluZm8gPSByZWplY3RcbiAgICB9KVxuICB9LFxuICBhc3luYyBvbkxhdW5jaCgpIHtcbiAgICBcbiAgICAvLyDnmbvlvZVcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXMuY29kZSlcbiAgICAgICAgLy8g5Y+R6YCBIHJlcy5jb2RlIOWIsOWQjuWPsOaNouWPliBvcGVuSWQsIHNlc3Npb25LZXksIHVuaW9uSWRcbiAgICAgIH0sXG4gICAgfSlcblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDniYjmnKwzXG4gICAgLy8g5L2/55SoIGFzeW5jIGF3YWl0IOivreazleezluiOt+WPlueUqOaIt+S/oeaBr1xuICAgIHRyeSB7XG4gICAgICBjb25zdCBzZXR0aW5nID0gYXdhaXQgZ2V0U2V0dGluZygpXG4gICAgICBpZiAoc2V0dGluZy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgICAgICBjb25zdCB1c2VySW5mb1JlcyA9IGF3YWl0IGdldFVzZXJJbmZvKClcbiAgICAgICAgcmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvUmVzLnVzZXJJbmZvKVxuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICByZWplY3RVc2VySW5mbyhlcnJvcilcbiAgICB9XG5cblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDniYjmnKwyXG4gICAgLy8g5L2/55SoUHJvbWlzZeaUueWGmeeUqOaIt+S/oeaBr1xuICAgIC8vIGdldFNldHRpbmcoKS50aGVuKHJlcyA9PiB7XG4gICAgLy8gICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgLy8gICAgIHJldHVybiBnZXRVc2VySW5mbygpXG4gICAgLy8gICB9XG4gICAgLy8gICAvLyDlpoLmnpzmsqHmnInmnYPpmZBcbiAgICAvLyAgIHJldHVybiBQcm9taXNlLnJlc29sdmUodW5kZWZpbmVkKVxuICAgIC8vIH0pLnRoZW4ocmVzID0+IHtcbiAgICAvLyAgIC8vIOWmguaenOayoeacieadg+mZkOiHqueEtuaLv+S4jeWIsOeUqOaIt+S/oeaBr++8jOebtOaOpei/lOWbnlxuICAgIC8vICAgaWYgKCFyZXMpIHtcbiAgICAvLyAgICAgcmV0dXJuXG4gICAgLy8gICB9XG4gICAgLy8gICAvLyDlpoLmnpzmi7/liLDkv6Hmga/lsLHnu5nlh7rpgJrnn6Ug5bey57uP5ou/5Yiw5L+h5oGvXG4gICAgLy8gICByZXNvbHZlVXNlckluZm8ocmVzLnVzZXJJbmZvKVxuICAgIC8vIH0pLmNhdGNoKGVyciA9PiByZWplY3RVc2VySW5mbyhlcnIpKVxuXG5cbiAgICAvLyDojrflj5bnlKjmiLfkv6Hmga8g5Y6f54mIIOeJiOacrDFcbiAgICAvLyDkvb/nlKggY2FsbGJhY2sg5bWM5aWXIGNhbGxiYWNrIOeahOaWueW8j+iOt+WPlueUqOaIt+S/oeaBr1xuICAgIC8vIHd4LmdldFNldHRpbmcoe1xuICAgIC8vICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAvLyAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgIC8vICAgICAgIC8vIOW3sue7j+aOiOadg++8jOWPr+S7peebtOaOpeiwg+eUqCBnZXRVc2VySW5mbyDojrflj5blpLTlg4/mmLXnp7DvvIzkuI3kvJrlvLnmoYZcbiAgICAvLyAgICAgICB3eC5nZXRVc2VySW5mbyh7XG4gICAgLy8gICAgICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgIC8vICAgICAgICAgICAvLyDlj6/ku6XlsIYgcmVzIOWPkemAgee7meWQjuWPsOino+eggeWHuiB1bmlvbklkXG4gICAgLy8gICAgICAgICAgIHRoaXMuZ2xvYmFsRGF0YS51c2VySW5mbyA9IHJlcy51c2VySW5mb1xuXG4gICAgLy8gICAgICAgICAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgLy8gICAgICAgICAgIC8vIOaJgOS7peatpOWkhOWKoOWFpSBjYWxsYmFjayDku6XpmLLmraLov5nnp43mg4XlhrVcbiAgICAvLyAgICAgICAgICAgaWYgKHRoaXMudXNlckluZm9SZWFkeUNhbGxiYWNrKSB7XG4gICAgLy8gICAgICAgICAgICAgdGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2socmVzKVxuICAgIC8vICAgICAgICAgICB9XG4gICAgLy8gICAgICAgICB9LFxuICAgIC8vICAgICAgIH0pXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0sXG4gICAgLy8gfSlcbiAgfSxcblxuICByZXNvbHZlVXNlckluZm8odXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvKSB7XG4gICAgcmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxuICB9XG59KSJdfQ==