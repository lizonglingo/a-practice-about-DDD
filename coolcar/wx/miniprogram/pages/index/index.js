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
        motto: 'Hello World from TypeScript!',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBRUEsTUFBTSxHQUFHLEdBQUcsTUFBTSxFQUFjLENBQUE7QUFFaEMsSUFBSSxDQUFDO0lBQ0gsSUFBSSxFQUFFO1FBQ0osS0FBSyxFQUFFLDhCQUE4QjtRQUNyQyxRQUFRLEVBQUUsRUFBRTtRQUNaLFdBQVcsRUFBRSxLQUFLO0tBRW5CO0lBRUQsV0FBVztRQUNULEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDWixHQUFHLEVBQUUsY0FBYztTQUNwQixDQUFDLENBQUE7SUFDSixDQUFDO0lBQ0ssTUFBTTs7WUFLVixNQUFNLFFBQVEsR0FBRyxNQUFNLEdBQUcsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFBO1lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1gsUUFBUTtnQkFDUixXQUFXLEVBQUUsSUFBSTthQUNsQixDQUFDLENBQUE7UUErQkosQ0FBQztLQUFBO0lBQ0QsV0FBVyxDQUFDLENBQU07UUFDaEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUNkLE1BQU0sUUFBUSxHQUErQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtRQUM5RCxHQUFHLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQy9CLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbmRleC50c1xuLy8g6I635Y+W5bqU55So5a6e5L6LXG5jb25zdCBhcHAgPSBnZXRBcHA8SUFwcE9wdGlvbj4oKVxuXG5QYWdlKHtcbiAgZGF0YToge1xuICAgIG1vdHRvOiAnSGVsbG8gV29ybGQgZnJvbSBUeXBlU2NyaXB0IScsXG4gICAgdXNlckluZm86IHt9LFxuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcbiAgICAvLyBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksXG4gIH0sXG4gIC8vIOS6i+S7tuWkhOeQhuWHveaVsFxuICBiaW5kVmlld1RhcCgpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy4uL2xvZ3MvbG9ncycsXG4gICAgfSlcbiAgfSxcbiAgYXN5bmMgb25Mb2FkKCkge1xuXG4gICAgLy8g6YCa55+l54mI5pysIDNcbiAgICAvLyDkvb/nlKggYXN5bmMgYXdhaXTph43lhpnpgJrnn6VcbiAgICAvLyDov5nph4znmoQgdXNlckluZm8g5bCx5piv5LiA5LiqIHByb21pc2Ug5a+56LGhXG4gICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBhcHAuZ2xvYmFsRGF0YS51c2VySW5mb1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICB1c2VySW5mbyxcbiAgICAgIGhhc1VzZXJJbmZvOiB0cnVlXG4gICAgfSlcblxuICAgIC8vIOmAmuefpeeJiOacrCAyXG4gICAgLy8g5L2/55SoUHJvbWlzZemHjeWGmemAmuefpVxuICAgIC8vIGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvLnRoZW4odXNlckluZm8gPT4ge1xuICAgIC8vICAgdGhpcy5zZXREYXRhKHtcbiAgICAvLyAgICAgdXNlckluZm86IHVzZXJJbmZvLFxuICAgIC8vICAgICBoYXNVc2VySW5mbzogdHJ1ZSxcbiAgICAvLyAgIH0pXG4gICAgLy8gfSlcblxuICAgIC8vIOmAmuefpeeJiOacrCAxXG4gICAgLy8g5Y6f5pa55rOV5YiG5Yir5Yik5pat5Zyo6aG16Z2ibG9hZOS5i+WJjeaYr+WQpuWujOaIkOeUqOaIt+S/oeaBr+ivu+WPluW5tui/m+ihjOWIpOaWrVxuICAgIC8vIDEuIOWujOaIkOivu+WPlueahOaDheWGteS4i+ebtOaOpei1i+WAvFxuICAgIC8vIDIuIOWcqOayoeacieWujOaIkOivu+WPlueahOaDheWGteS4i+S9v+eUqOWbnuiwg+WHveaVsOWGjeW8guatpeWujOaIkOaXtui/m+ihjOmAmuefpVxuICAgIC8vIGlmIChhcHAuZ2xvYmFsRGF0YS51c2VySW5mbykge1xuICAgIC8vICAgdGhpcy5zZXREYXRhKHtcbiAgICAvLyAgICAgdXNlckluZm86IGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvLFxuICAgIC8vICAgICBoYXNVc2VySW5mbzogdHJ1ZSxcbiAgICAvLyAgIH0pXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgIC8vIOeUseS6jiBnZXRVc2VySW5mbyDmmK/nvZHnu5zor7fmsYLvvIzlj6/og73kvJrlnKggUGFnZS5vbkxvYWQg5LmL5ZCO5omN6L+U5ZueXG4gICAgLy8gICAvLyDmiYDku6XmraTlpITliqDlhaUgY2FsbGJhY2sg5Lul6Ziy5q2i6L+Z56eN5oOF5Ya1XG4gICAgLy8gICBhcHAudXNlckluZm9SZWFkeUNhbGxiYWNrID0gcmVzID0+IHtcbiAgICAvLyAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAvLyAgICAgICB1c2VySW5mbzogcmVzLnVzZXJJbmZvLFxuICAgIC8vICAgICAgIGhhc1VzZXJJbmZvOiB0cnVlLFxuICAgIC8vICAgICB9KVxuICAgIC8vICAgfVxuICAgIC8vIH1cblxuICB9LFxuICBnZXRVc2VySW5mbyhlOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhlKVxuICAgIGNvbnN0IHVzZXJJbmZvOiBXZWNoYXRNaW5pcHJvZ3JhbS5Vc2VySW5mbyA9IGUuZGV0YWlsLnVzZXJJbmZvXG4gICAgYXBwLnJlc29sdmVVc2VySW5mbyh1c2VySW5mbylcbiAgfSxcbn0pXG4iXX0=