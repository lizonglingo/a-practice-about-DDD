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
const app = getApp();
Page({
    data: {
        motto: 'testing',
        userInfo: {},
        hasUserInfo: false,
    },
    bindViewTap() {
        wx.navigateTo({
            url: '../logs/logs',
        });
    },
    onLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield app.globalData.userInfo;
            this.setData({
                userInfo,
                hasUserInfo: true
            });
        });
    },
    getUserInfo(e) {
        console.log(e);
        const userInfo = e.detail.userInfo;
        app.resolveUserInfo(userInfo);
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFjLENBQUE7QUFFaEMsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osS0FBSyxFQUFFLFNBQVM7UUFDaEIsUUFBUSxFQUFFLEVBQUU7UUFDWixXQUFXLEVBQUUsS0FBSztLQUVuQjtJQUVELFdBQVc7UUFDVCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLGNBQWM7U0FDcEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNLLE1BQU07O1lBS1YsTUFBTSxRQUFRLEdBQUcsTUFBTSxHQUFHLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtZQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNYLFFBQVE7Z0JBQ1IsV0FBVyxFQUFFLElBQUk7YUFDbEIsQ0FBQyxDQUFBO1FBK0JKLENBQUM7S0FBQTtJQUNELFdBQVcsQ0FBQyxDQUFNO1FBQ2hCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDZCxNQUFNLFFBQVEsR0FBK0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUE7UUFDOUQsR0FBRyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUMvQixDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW5kZXgudHNcbi8vIOiOt+WPluW6lOeUqOWunuS+i1xuY29uc3QgYXBwID0gZ2V0QXBwPElBcHBPcHRpb24+KClcblxuUGFnZSh7XG4gIGRhdGE6IHtcbiAgICBtb3R0bzogJ3Rlc3RpbmcnLFxuICAgIHVzZXJJbmZvOiB7fSxcbiAgICBoYXNVc2VySW5mbzogZmFsc2UsXG4gICAgLy8gY2FuSVVzZTogd3guY2FuSVVzZSgnYnV0dG9uLm9wZW4tdHlwZS5nZXRVc2VySW5mbycpLFxuICB9LFxuICAvLyDkuovku7blpITnkIblh73mlbBcbiAgYmluZFZpZXdUYXAoKSB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcuLi9sb2dzL2xvZ3MnLFxuICAgIH0pXG4gIH0sXG4gIGFzeW5jIG9uTG9hZCgpIHtcblxuICAgIC8vIOmAmuefpeeJiOacrCAzXG4gICAgLy8g5L2/55SoIGFzeW5jIGF3YWl06YeN5YaZ6YCa55+lXG4gICAgLy8g6L+Z6YeM55qEIHVzZXJJbmZvIOWwseaYr+S4gOS4qiBwcm9taXNlIOWvueixoVxuICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgYXBwLmdsb2JhbERhdGEudXNlckluZm9cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgdXNlckluZm8sXG4gICAgICBoYXNVc2VySW5mbzogdHJ1ZVxuICAgIH0pXG5cbiAgICAvLyDpgJrnn6XniYjmnKwgMlxuICAgIC8vIOS9v+eUqFByb21pc2Xph43lhpnpgJrnn6VcbiAgICAvLyBhcHAuZ2xvYmFsRGF0YS51c2VySW5mby50aGVuKHVzZXJJbmZvID0+IHtcbiAgICAvLyAgIHRoaXMuc2V0RGF0YSh7XG4gICAgLy8gICAgIHVzZXJJbmZvOiB1c2VySW5mbyxcbiAgICAvLyAgICAgaGFzVXNlckluZm86IHRydWUsXG4gICAgLy8gICB9KVxuICAgIC8vIH0pXG5cbiAgICAvLyDpgJrnn6XniYjmnKwgMVxuICAgIC8vIOWOn+aWueazleWIhuWIq+WIpOaWreWcqOmhtemdomxvYWTkuYvliY3mmK/lkKblrozmiJDnlKjmiLfkv6Hmga/or7vlj5blubbov5vooYzliKTmlq1cbiAgICAvLyAxLiDlrozmiJDor7vlj5bnmoTmg4XlhrXkuIvnm7TmjqXotYvlgLxcbiAgICAvLyAyLiDlnKjmsqHmnInlrozmiJDor7vlj5bnmoTmg4XlhrXkuIvkvb/nlKjlm57osIPlh73mlbDlho3lvILmraXlrozmiJDml7bov5vooYzpgJrnn6VcbiAgICAvLyBpZiAoYXBwLmdsb2JhbERhdGEudXNlckluZm8pIHtcbiAgICAvLyAgIHRoaXMuc2V0RGF0YSh7XG4gICAgLy8gICAgIHVzZXJJbmZvOiBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyxcbiAgICAvLyAgICAgaGFzVXNlckluZm86IHRydWUsXG4gICAgLy8gICB9KVxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICAvLyDnlLHkuo4gZ2V0VXNlckluZm8g5piv572R57uc6K+35rGC77yM5Y+v6IO95Lya5ZyoIFBhZ2Uub25Mb2FkIOS5i+WQjuaJjei/lOWbnlxuICAgIC8vICAgLy8g5omA5Lul5q2k5aSE5Yqg5YWlIGNhbGxiYWNrIOS7pemYsuatoui/meenjeaDheWGtVxuICAgIC8vICAgYXBwLnVzZXJJbmZvUmVhZHlDYWxsYmFjayA9IHJlcyA9PiB7XG4gICAgLy8gICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgLy8gICAgICAgdXNlckluZm86IHJlcy51c2VySW5mbyxcbiAgICAvLyAgICAgICBoYXNVc2VySW5mbzogdHJ1ZSxcbiAgICAvLyAgICAgfSlcbiAgICAvLyAgIH1cbiAgICAvLyB9XG5cbiAgfSxcbiAgZ2V0VXNlckluZm8oZTogYW55KSB7XG4gICAgY29uc29sZS5sb2coZSlcbiAgICBjb25zdCB1c2VySW5mbzogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8gPSBlLmRldGFpbC51c2VySW5mb1xuICAgIGFwcC5yZXNvbHZlVXNlckluZm8odXNlckluZm8pXG4gIH0sXG59KVxuIl19