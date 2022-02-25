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
const util_1 = require("./utils/util");
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
                const setting = yield util_1.getSetting();
                if (setting.authSetting['scope.userInfo']) {
                    const userInfoRes = yield util_1.getUserInfo();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsdUNBQXNEO0FBRXRELElBQUksZUFBc0csQ0FBQTtBQUMxRyxJQUFJLGNBQXNDLENBQUE7QUFHMUMsR0FBRyxDQUFhO0lBQ2QsVUFBVSxFQUFFO1FBQ1YsUUFBUSxFQUFFLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLGVBQWUsR0FBRyxPQUFPLENBQUE7WUFDekIsY0FBYyxHQUFHLE1BQU0sQ0FBQTtRQUN6QixDQUFDLENBQUM7S0FDSDtJQUNLLFFBQVE7O1lBR1osRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDUCxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7Z0JBRXZCLENBQUM7YUFDRixDQUFDLENBQUE7WUFJRixJQUFJO2dCQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0saUJBQVUsRUFBRSxDQUFBO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFDekMsTUFBTSxXQUFXLEdBQUcsTUFBTSxrQkFBVyxFQUFFLENBQUE7b0JBQ3ZDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3RDO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDdEI7UUEwQ0gsQ0FBQztLQUFBO0lBRUQsZUFBZSxDQUFDLFFBQW9DO1FBQ2xELGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMzQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgZ2V0U2V0dGluZywgZ2V0VXNlckluZm8gfSBmcm9tIFwiLi91dGlscy91dGlsXCJcblxubGV0IHJlc29sdmVVc2VySW5mbzogKHZhbHVlOiBXZWNoYXRNaW5pcHJvZ3JhbS5Vc2VySW5mbyB8IFByb21pc2VMaWtlPFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvPikgPT4gdm9pZFxubGV0IHJlamVjdFVzZXJJbmZvOiAocmVhc29uPzogYW55KSA9PiB2b2lkXG5cbi8vIGFwcC50c1xuQXBwPElBcHBPcHRpb24+KHtcbiAgZ2xvYmFsRGF0YToge1xuICAgIHVzZXJJbmZvOiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlVXNlckluZm8gPSByZXNvbHZlXG4gICAgICByZWplY3RVc2VySW5mbyA9IHJlamVjdFxuICAgIH0pXG4gIH0sXG4gIGFzeW5jIG9uTGF1bmNoKCkge1xuICAgIFxuICAgIC8vIOeZu+W9lVxuICAgIHd4LmxvZ2luKHtcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKHJlcy5jb2RlKVxuICAgICAgICAvLyDlj5HpgIEgcmVzLmNvZGUg5Yiw5ZCO5Y+w5o2i5Y+WIG9wZW5JZCwgc2Vzc2lvbktleSwgdW5pb25JZFxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLy8g6I635Y+W55So5oi35L+h5oGvIOeJiOacrDNcbiAgICAvLyDkvb/nlKggYXN5bmMgYXdhaXQg6K+t5rOV57OW6I635Y+W55So5oi35L+h5oGvXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNldHRpbmcgPSBhd2FpdCBnZXRTZXR0aW5nKClcbiAgICAgIGlmIChzZXR0aW5nLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgICAgIGNvbnN0IHVzZXJJbmZvUmVzID0gYXdhaXQgZ2V0VXNlckluZm8oKVxuICAgICAgICByZXNvbHZlVXNlckluZm8odXNlckluZm9SZXMudXNlckluZm8pXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdFVzZXJJbmZvKGVycm9yKVxuICAgIH1cblxuXG4gICAgLy8g6I635Y+W55So5oi35L+h5oGvIOeJiOacrDJcbiAgICAvLyDkvb/nlKhQcm9taXNl5pS55YaZ55So5oi35L+h5oGvXG4gICAgLy8gZ2V0U2V0dGluZygpLnRoZW4ocmVzID0+IHtcbiAgICAvLyAgIGlmIChyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10pIHtcbiAgICAvLyAgICAgcmV0dXJuIGdldFVzZXJJbmZvKClcbiAgICAvLyAgIH1cbiAgICAvLyAgIC8vIOWmguaenOayoeacieadg+mZkFxuICAgIC8vICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpXG4gICAgLy8gfSkudGhlbihyZXMgPT4ge1xuICAgIC8vICAgLy8g5aaC5p6c5rKh5pyJ5p2D6ZmQ6Ieq54S25ou/5LiN5Yiw55So5oi35L+h5oGv77yM55u05o6l6L+U5ZueXG4gICAgLy8gICBpZiAoIXJlcykge1xuICAgIC8vICAgICByZXR1cm5cbiAgICAvLyAgIH1cbiAgICAvLyAgIC8vIOWmguaenOaLv+WIsOS/oeaBr+Wwsee7meWHuumAmuefpSDlt7Lnu4/mi7/liLDkv6Hmga9cbiAgICAvLyAgIHJlc29sdmVVc2VySW5mbyhyZXMudXNlckluZm8pXG4gICAgLy8gfSkuY2F0Y2goZXJyID0+IHJlamVjdFVzZXJJbmZvKGVycikpXG5cblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDljp/niYgg54mI5pysMVxuICAgIC8vIOS9v+eUqCBjYWxsYmFjayDltYzlpZcgY2FsbGJhY2sg55qE5pa55byP6I635Y+W55So5oi35L+h5oGvXG4gICAgLy8gd3guZ2V0U2V0dGluZyh7XG4gICAgLy8gICBzdWNjZXNzOiByZXMgPT4ge1xuICAgIC8vICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgLy8gICAgICAgLy8g5bey57uP5o6I5p2D77yM5Y+v5Lul55u05o6l6LCD55SoIGdldFVzZXJJbmZvIOiOt+WPluWktOWDj+aYteensO+8jOS4jeS8muW8ueahhlxuICAgIC8vICAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAvLyAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgLy8gICAgICAgICAgIC8vIOWPr+S7peWwhiByZXMg5Y+R6YCB57uZ5ZCO5Y+w6Kej56CB5Ye6IHVuaW9uSWRcbiAgICAvLyAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gcmVzLnVzZXJJbmZvXG5cbiAgICAvLyAgICAgICAgICAgLy8g55Sx5LqOIGdldFVzZXJJbmZvIOaYr+e9kee7nOivt+axgu+8jOWPr+iDveS8muWcqCBQYWdlLm9uTG9hZCDkuYvlkI7miY3ov5Tlm55cbiAgICAvLyAgICAgICAgICAgLy8g5omA5Lul5q2k5aSE5Yqg5YWlIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxuICAgIC8vICAgICAgICAgICBpZiAodGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2spIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLnVzZXJJbmZvUmVhZHlDYWxsYmFjayhyZXMpXG4gICAgLy8gICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgfSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSxcbiAgICAvLyB9KVxuICB9LFxuXG4gIHJlc29sdmVVc2VySW5mbyh1c2VySW5mbzogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8pIHtcbiAgICByZXNvbHZlVXNlckluZm8odXNlckluZm8pXG4gIH1cbn0pIl19