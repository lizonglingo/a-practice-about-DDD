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
const routing_1 = require("../../utils/routing");
const shareLocationKey = "share_location";
Page({
    data: {
        shareLocation: false,
        avatarURL: '',
    },
    onLoad(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = opt;
            console.log('unlocking car', o.car_id);
            const userInfo = yield getApp().globalData.userInfo;
            this.setData({
                avatarURL: userInfo.avatarUrl,
                shareLocation: wx.getStorageSync(shareLocationKey) || false
            });
        });
    },
    onGetUserInfo(e) {
        const userInfo = e.detail.userInfo;
        if (userInfo) {
            getApp().resolveUserInfo(userInfo);
            this.setData({
                shareLocation: true,
            });
            wx.setStorageSync(shareLocationKey, this.data.shareLocation);
        }
    },
    onShareLocation(e) {
        const shareLocation = e.detail.value;
        wx.setStorageSync(shareLocationKey, shareLocation);
    },
    onUnlockTap() {
        wx.getLocation({
            type: 'gcj02',
            success: loc => {
                console.log('starting a trip', {
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                    avatarURL: this.data.shareLocation ? this.data.avatarURL : '',
                });
                const tripID = 'trip123';
                wx.showLoading({
                    title: '开锁中',
                    mask: true,
                });
                setTimeout(() => {
                    wx.redirectTo({
                        url: routing_1.routing.driving({
                            trip_id: tripID
                        }),
                        complete: () => {
                            wx.hideLoading();
                        }
                    });
                }, 3000);
            },
            fail: () => {
                wx.showToast({
                    icon: 'none',
                    title: '请前往设置页面授权您的位置信息',
                });
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxpREFBNkM7QUFFN0MsTUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQTtBQUN6QyxJQUFJLENBQUM7SUFDRCxJQUFJLEVBQUU7UUFDRixhQUFhLEVBQUUsS0FBSztRQUNwQixTQUFTLEVBQUUsRUFBRTtLQUNoQjtJQUVLLE1BQU0sQ0FBQyxHQUE2Qjs7WUFDdEMsTUFBTSxDQUFDLEdBQXFCLEdBQUcsQ0FBQTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdEMsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLEVBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFBO1lBQy9ELElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1QsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO2dCQUM3QixhQUFhLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEtBQUs7YUFDOUQsQ0FBQyxDQUFBO1FBQ04sQ0FBQztLQUFBO0lBQ0QsYUFBYSxDQUFDLENBQU07UUFDaEIsTUFBTSxRQUFRLEdBQStCLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQzlELElBQUksUUFBUSxFQUFFO1lBQ1YsTUFBTSxFQUFjLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1QsYUFBYSxFQUFFLElBQUk7YUFDdEIsQ0FBQyxDQUFBO1lBQ0YsRUFBRSxDQUFDLGNBQWMsQ0FBQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFBO1NBQy9EO0lBRUwsQ0FBQztJQUNELGVBQWUsQ0FBQyxDQUFNO1FBQ2xCLE1BQU0sYUFBYSxHQUFZLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFBO1FBQzdDLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsYUFBYSxDQUFDLENBQUE7SUFDdEQsQ0FBQztJQUNELFdBQVc7UUFDUCxFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ1gsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ1gsT0FBTyxDQUFDLEdBQUcsQ0FBQyxpQkFBaUIsRUFBRTtvQkFDM0IsUUFBUSxFQUFFO3dCQUNOLFFBQVEsRUFBRSxHQUFHLENBQUMsUUFBUTt3QkFDdEIsU0FBUyxFQUFFLEdBQUcsQ0FBQyxTQUFTO3FCQUMzQjtvQkFFRCxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFO2lCQUNoRSxDQUFDLENBQUE7Z0JBQ0YsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFBO2dCQUVwQixFQUFFLENBQUMsV0FBVyxDQUFDO29CQUNYLEtBQUssRUFBRSxLQUFLO29CQUNaLElBQUksRUFBRSxJQUFJO2lCQUNiLENBQUMsQ0FBQTtnQkFFRixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNaLEVBQUUsQ0FBQyxVQUFVLENBQUM7d0JBRVYsR0FBRyxFQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDOzRCQUNqQixPQUFPLEVBQUUsTUFBTTt5QkFDbEIsQ0FBQzt3QkFDRixRQUFRLEVBQUUsR0FBRyxFQUFFOzRCQUNYLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTt3QkFDcEIsQ0FBQztxQkFDSixDQUFDLENBQUE7Z0JBQ04sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRWhCLENBQUM7WUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUNQLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ1QsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLGlCQUFpQjtpQkFDM0IsQ0FBQyxDQUFBO1lBQ04sQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUdOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQXBwT3B0aW9uIH0gZnJvbSBcIi4uLy4uL2FwcG9wdGlvblwiXHJcbmltcG9ydCB7IHJvdXRpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcm91dGluZ1wiXHJcblxyXG5jb25zdCBzaGFyZUxvY2F0aW9uS2V5ID0gXCJzaGFyZV9sb2NhdGlvblwiXHJcblBhZ2Uoe1xyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHNoYXJlTG9jYXRpb246IGZhbHNlLFxyXG4gICAgICAgIGF2YXRhclVSTDogJycsXHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIG9uTG9hZChvcHQ6IFJlY29yZDwnY2FyX2lkJywgc3RyaW5nPikge1xyXG4gICAgICAgIGNvbnN0IG86IHJvdXRpbmcuTG9ja09wdHMgPSBvcHRcclxuICAgICAgICBjb25zb2xlLmxvZygndW5sb2NraW5nIGNhcicsIG8uY2FyX2lkKVxyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0QXBwPElBcHBPcHRpb24+KCkuZ2xvYmFsRGF0YS51c2VySW5mb1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxyXG4gICAgICAgICAgICBzaGFyZUxvY2F0aW9uOiB3eC5nZXRTdG9yYWdlU3luYyhzaGFyZUxvY2F0aW9uS2V5KSB8fCBmYWxzZVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgb25HZXRVc2VySW5mbyhlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB1c2VySW5mbzogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8gPSBlLmRldGFpbC51c2VySW5mb1xyXG4gICAgICAgIGlmICh1c2VySW5mbykge1xyXG4gICAgICAgICAgICBnZXRBcHA8SUFwcE9wdGlvbj4oKS5yZXNvbHZlVXNlckluZm8odXNlckluZm8pXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBzaGFyZUxvY2F0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyhzaGFyZUxvY2F0aW9uS2V5LCB0aGlzLmRhdGEuc2hhcmVMb2NhdGlvbilcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIG9uU2hhcmVMb2NhdGlvbihlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBzaGFyZUxvY2F0aW9uOiBib29sZWFuID0gZS5kZXRhaWwudmFsdWVcclxuICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyhzaGFyZUxvY2F0aW9uS2V5LCBzaGFyZUxvY2F0aW9uKVxyXG4gICAgfSxcclxuICAgIG9uVW5sb2NrVGFwKCkge1xyXG4gICAgICAgIHd4LmdldExvY2F0aW9uKHtcclxuICAgICAgICAgICAgdHlwZTogJ2djajAyJyxcclxuICAgICAgICAgICAgc3VjY2VzczogbG9jID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzdGFydGluZyBhIHRyaXAnLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGxvYy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb2MubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVE9ETzog6ZyA6KaB5Y+M5ZCR57uR5a6aXHJcbiAgICAgICAgICAgICAgICAgICAgYXZhdGFyVVJMOiB0aGlzLmRhdGEuc2hhcmVMb2NhdGlvbiA/IHRoaXMuZGF0YS5hdmF0YXJVUkwgOiAnJyxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICBjb25zdCB0cmlwSUQgPSAndHJpcDEyMydcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgd3guc2hvd0xvYWRpbmcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+W8gOmUgeS4rScsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1hc2s6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnJlZGlyZWN0VG8oe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL2RyaXZpbmcvZHJpdmluZz90cmlwX2lkPSR7dHJpcElEfWAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcuZHJpdmluZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpcF9pZDogdHJpcElEXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMDApXHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmFpbDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfor7fliY3lvoDorr7nva7pobXpnaLmjojmnYPmgqjnmoTkvY3nva7kv6Hmga8nLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG5cclxuICAgIH1cclxufSkiXX0=