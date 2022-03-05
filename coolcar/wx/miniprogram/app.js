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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQUEsZ0RBQWdEO0FBRWhELDhEQUF1RDtBQUN2RCx5Q0FBdUQ7QUFFdkQsSUFBSSxlQUFzRyxDQUFBO0FBQzFHLElBQUksY0FBc0MsQ0FBQTtBQUcxQyxHQUFHLENBQWE7SUFDZCxVQUFVLEVBQUU7UUFDVixRQUFRLEVBQUUsSUFBSSxPQUFPLENBQUMsQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEMsZUFBZSxHQUFHLE9BQU8sQ0FBQTtZQUN6QixjQUFjLEdBQUcsTUFBTSxDQUFBO1FBQ3pCLENBQUMsQ0FBQztLQUNIO0lBQ0ssUUFBUTs7WUFnQlosRUFBRSxDQUFDLEtBQUssQ0FBQztnQkFDUCxPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7b0JBQ2IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7b0JBRXJCLEVBQUUsQ0FBQyxPQUFPLENBQUM7d0JBQ1QsR0FBRyxFQUFFLHFDQUFxQzt3QkFDMUMsTUFBTSxFQUFFLE1BQU07d0JBQ2QsSUFBSSxFQUFFOzRCQUNKLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTt5QkFDVTt3QkFDMUIsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFOzRCQUNiLE1BQU0sU0FBUyxHQUNmLGNBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FDOUIsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFjLENBQUMsQ0FDbEMsQ0FBQTs0QkFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFBO3dCQUN4QixDQUFDO3dCQUNELElBQUksRUFBRSxPQUFPLENBQUMsS0FBSztxQkFDcEIsQ0FBQyxDQUFBO2dCQUNKLENBQUM7YUFDRixDQUFDLENBQUE7WUFJRixJQUFJO2dCQUNGLE1BQU0sT0FBTyxHQUFHLE1BQU0sa0JBQVUsRUFBRSxDQUFBO2dCQUNsQyxJQUFJLE9BQU8sQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLENBQUMsRUFBRTtvQkFDekMsTUFBTSxXQUFXLEdBQUcsTUFBTSxtQkFBVyxFQUFFLENBQUE7b0JBQ3ZDLGVBQWUsQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLENBQUE7aUJBQ3RDO2FBQ0Y7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDZCxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUE7YUFDdEI7UUEwQ0gsQ0FBQztLQUFBO0lBRUQsZUFBZSxDQUFDLFFBQW9DO1FBQ2xELGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMzQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNhbWVsY2FzZUtleXMgPSByZXF1aXJlKFwiY2FtZWxjYXNlLWtleXNcIilcbmltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi9hcHBvcHRpb25cIlxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCIuL3NlcnZpY2UvcHJvdG9fZ2VuL2F1dGgvYXV0aF9wYlwiXG5pbXBvcnQgeyBnZXRTZXR0aW5nLCBnZXRVc2VySW5mbyB9IGZyb20gXCIuL3V0aWxzL3d4YXBpXCJcblxubGV0IHJlc29sdmVVc2VySW5mbzogKHZhbHVlOiBXZWNoYXRNaW5pcHJvZ3JhbS5Vc2VySW5mbyB8IFByb21pc2VMaWtlPFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvPikgPT4gdm9pZFxubGV0IHJlamVjdFVzZXJJbmZvOiAocmVhc29uPzogYW55KSA9PiB2b2lkXG5cbi8vIGFwcC50c1xuQXBwPElBcHBPcHRpb24+KHtcbiAgZ2xvYmFsRGF0YToge1xuICAgIHVzZXJJbmZvOiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICByZXNvbHZlVXNlckluZm8gPSByZXNvbHZlXG4gICAgICByZWplY3RVc2VySW5mbyA9IHJlamVjdFxuICAgIH0pXG4gIH0sXG4gIGFzeW5jIG9uTGF1bmNoKCkge1xuICAgIC8vIHd4LnJlcXVlc3Qoe1xuICAgIC8vICAgdXJsOiAnaHR0cDovL2xvY2FsaG9zdDo4MTIzL3RyaXAvdHJpcDExMjIzMycsXG4gICAgLy8gICBtZXRob2Q6ICdHRVQnLFxuICAgIC8vICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAvLyAgICAgY29uc3QgZ2V0VHJpcFJlcyA9IGNvb2xjYXIuR2V0VHJpcFJlc3BvbnNlLmZyb21PYmplY3QoXG4gICAgLy8gICAgICAgY2FtZWxjYXNlS2V5cyhyZXMuZGF0YSBhcyBvYmplY3QsIHtcbiAgICAvLyAgICAgICAgIGRlZXA6IHRydWUsXG4gICAgLy8gICAgICAgfSlcbiAgICAvLyAgICAgKVxuICAgIC8vICAgICBjb25zb2xlLmxvZyhnZXRUcmlwUmVzKVxuICAgIC8vICAgICBjb25zb2xlLmxvZyhjb29sY2FyLlRyaXBTdGF0dXNbZ2V0VHJpcFJlcy50cmlwPy5zdGF0dXMhXSlcbiAgICAvLyAgIH0sXG4gICAgLy8gICBmYWlsOiBjb25zb2xlLmVycm9yLFxuICAgIC8vIH0pXG4gICAgLy8g55m75b2VXG4gICAgd3gubG9naW4oe1xuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgY29uc29sZS5sb2cocmVzLmNvZGUpXG4gICAgICAgIC8vIOWPkemAgSByZXMuY29kZSDliLDlkI7lj7DmjaLlj5Ygb3BlbklkLCBzZXNzaW9uS2V5LCB1bmlvbklkXG4gICAgICAgIHd4LnJlcXVlc3Qoe1xuICAgICAgICAgIHVybDogJ2h0dHA6Ly9sb2NhbGhvc3Q6ODEyMy92MS9hdXRoL2xvZ2luJyxcbiAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjb2RlOiByZXMuY29kZVxuICAgICAgICAgIH0gYXMgYXV0aC52MS5JTG9naW5SZXF1ZXN0LFxuICAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgICAgICBjb25zdCBsb2dpblJlc3A6IGF1dGgudjEuSUxvZ2luUmVzcG9uc2UgPSBcbiAgICAgICAgICAgIGF1dGgudjEuTG9naW5SZXNwb25zZS5mcm9tT2JqZWN0KFxuICAgICAgICAgICAgICBjYW1lbGNhc2VLZXlzKHJlcy5kYXRhIGFzIG9iamVjdCksXG4gICAgICAgICAgICApXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhsb2dpblJlc3ApXG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICB9KVxuXG4gICAgLy8g6I635Y+W55So5oi35L+h5oGvIOeJiOacrDNcbiAgICAvLyDkvb/nlKggYXN5bmMgYXdhaXQg6K+t5rOV57OW6I635Y+W55So5oi35L+h5oGvXG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHNldHRpbmcgPSBhd2FpdCBnZXRTZXR0aW5nKClcbiAgICAgIGlmIChzZXR0aW5nLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgICAgIGNvbnN0IHVzZXJJbmZvUmVzID0gYXdhaXQgZ2V0VXNlckluZm8oKVxuICAgICAgICByZXNvbHZlVXNlckluZm8odXNlckluZm9SZXMudXNlckluZm8pXG4gICAgICB9XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIHJlamVjdFVzZXJJbmZvKGVycm9yKVxuICAgIH1cblxuXG4gICAgLy8g6I635Y+W55So5oi35L+h5oGvIOeJiOacrDJcbiAgICAvLyDkvb/nlKhQcm9taXNl5pS55YaZ55So5oi35L+h5oGvXG4gICAgLy8gZ2V0U2V0dGluZygpLnRoZW4ocmVzID0+IHtcbiAgICAvLyAgIGlmIChyZXMuYXV0aFNldHRpbmdbJ3Njb3BlLnVzZXJJbmZvJ10pIHtcbiAgICAvLyAgICAgcmV0dXJuIGdldFVzZXJJbmZvKClcbiAgICAvLyAgIH1cbiAgICAvLyAgIC8vIOWmguaenOayoeacieadg+mZkFxuICAgIC8vICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSh1bmRlZmluZWQpXG4gICAgLy8gfSkudGhlbihyZXMgPT4ge1xuICAgIC8vICAgLy8g5aaC5p6c5rKh5pyJ5p2D6ZmQ6Ieq54S25ou/5LiN5Yiw55So5oi35L+h5oGv77yM55u05o6l6L+U5ZueXG4gICAgLy8gICBpZiAoIXJlcykge1xuICAgIC8vICAgICByZXR1cm5cbiAgICAvLyAgIH1cbiAgICAvLyAgIC8vIOWmguaenOaLv+WIsOS/oeaBr+Wwsee7meWHuumAmuefpSDlt7Lnu4/mi7/liLDkv6Hmga9cbiAgICAvLyAgIHJlc29sdmVVc2VySW5mbyhyZXMudXNlckluZm8pXG4gICAgLy8gfSkuY2F0Y2goZXJyID0+IHJlamVjdFVzZXJJbmZvKGVycikpXG5cblxuICAgIC8vIOiOt+WPlueUqOaIt+S/oeaBryDljp/niYgg54mI5pysMVxuICAgIC8vIOS9v+eUqCBjYWxsYmFjayDltYzlpZcgY2FsbGJhY2sg55qE5pa55byP6I635Y+W55So5oi35L+h5oGvXG4gICAgLy8gd3guZ2V0U2V0dGluZyh7XG4gICAgLy8gICBzdWNjZXNzOiByZXMgPT4ge1xuICAgIC8vICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgLy8gICAgICAgLy8g5bey57uP5o6I5p2D77yM5Y+v5Lul55u05o6l6LCD55SoIGdldFVzZXJJbmZvIOiOt+WPluWktOWDj+aYteensO+8jOS4jeS8muW8ueahhlxuICAgIC8vICAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAvLyAgICAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgLy8gICAgICAgICAgIC8vIOWPr+S7peWwhiByZXMg5Y+R6YCB57uZ5ZCO5Y+w6Kej56CB5Ye6IHVuaW9uSWRcbiAgICAvLyAgICAgICAgICAgdGhpcy5nbG9iYWxEYXRhLnVzZXJJbmZvID0gcmVzLnVzZXJJbmZvXG5cbiAgICAvLyAgICAgICAgICAgLy8g55Sx5LqOIGdldFVzZXJJbmZvIOaYr+e9kee7nOivt+axgu+8jOWPr+iDveS8muWcqCBQYWdlLm9uTG9hZCDkuYvlkI7miY3ov5Tlm55cbiAgICAvLyAgICAgICAgICAgLy8g5omA5Lul5q2k5aSE5Yqg5YWlIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxuICAgIC8vICAgICAgICAgICBpZiAodGhpcy51c2VySW5mb1JlYWR5Q2FsbGJhY2spIHtcbiAgICAvLyAgICAgICAgICAgICB0aGlzLnVzZXJJbmZvUmVhZHlDYWxsYmFjayhyZXMpXG4gICAgLy8gICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIH0sXG4gICAgLy8gICAgICAgfSlcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfSxcbiAgICAvLyB9KVxuICB9LFxuXG4gIHJlc29sdmVVc2VySW5mbyh1c2VySW5mbzogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8pIHtcbiAgICByZXNvbHZlVXNlckluZm8odXNlckluZm8pXG4gIH1cbn0pIl19