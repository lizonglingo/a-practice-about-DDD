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
const shareLocationKey = "share_location";
Page({
    data: {
        shareLocation: false,
        avatarURL: '',
    },
    onLoad() {
        return __awaiter(this, void 0, void 0, function* () {
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
                wx.showLoading({
                    title: '开锁中',
                    mask: true,
                });
                setTimeout(() => {
                    wx.redirectTo({
                        url: '/pages/driving/driving',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUE7QUFDekMsSUFBSSxDQUFDO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsYUFBYSxFQUFFLEtBQUs7UUFDcEIsU0FBUyxFQUFFLEVBQUU7S0FDaEI7SUFFSyxNQUFNOztZQUNSLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxFQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtZQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztnQkFDN0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxLQUFLO2FBQzlELENBQUMsQ0FBQTtRQUNOLENBQUM7S0FBQTtJQUNELGFBQWEsQ0FBQyxDQUFNO1FBQ2hCLE1BQU0sUUFBUSxHQUErQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtRQUM5RCxJQUFJLFFBQVEsRUFBRTtZQUNWLE1BQU0sRUFBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULGFBQWEsRUFBRSxJQUFJO2FBQ3RCLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUMvRDtJQUVMLENBQUM7SUFDRCxlQUFlLENBQUMsQ0FBTTtRQUNsQixNQUFNLGFBQWEsR0FBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUM3QyxFQUFFLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQ3RELENBQUM7SUFDRCxXQUFXO1FBQ1AsRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNYLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLEdBQUcsQ0FBQyxFQUFFO2dCQUNYLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7b0JBQzNCLFFBQVEsRUFBRTt3QkFDTixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7d0JBQ3RCLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztxQkFDM0I7b0JBQ0QsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDaEUsQ0FBQyxDQUFBO2dCQUVFLEVBQUUsQ0FBQyxXQUFXLENBQUM7b0JBQ1gsS0FBSyxFQUFFLEtBQUs7b0JBQ1osSUFBSSxFQUFFLElBQUk7aUJBQ2IsQ0FBQyxDQUFBO2dCQUVGLFVBQVUsQ0FBQyxHQUFHLEVBQUU7b0JBQ1osRUFBRSxDQUFDLFVBQVUsQ0FBQzt3QkFDVixHQUFHLEVBQUUsd0JBQXdCO3dCQUM3QixRQUFRLEVBQUUsR0FBRyxFQUFFOzRCQUNYLEVBQUUsQ0FBQyxXQUFXLEVBQUUsQ0FBQTt3QkFDcEIsQ0FBQztxQkFDSixDQUFDLENBQUE7Z0JBQ04sQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFBO1lBRWhCLENBQUM7WUFFRCxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUNQLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ1QsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLGlCQUFpQjtpQkFDM0IsQ0FBQyxDQUFBO1lBQ04sQ0FBQztTQUNKLENBQUMsQ0FBQTtJQUdOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBzaGFyZUxvY2F0aW9uS2V5ID0gXCJzaGFyZV9sb2NhdGlvblwiXHJcblBhZ2Uoe1xyXG4gICAgZGF0YToge1xyXG4gICAgICAgIHNoYXJlTG9jYXRpb246IGZhbHNlLFxyXG4gICAgICAgIGF2YXRhclVSTDogJycsXHJcbiAgICB9LFxyXG5cclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICAgICAgc2hhcmVMb2NhdGlvbjogd3guZ2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSkgfHwgZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uR2V0VXNlckluZm8oZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvID0gZS5kZXRhaWwudXNlckluZm9cclxuICAgICAgICBpZiAodXNlckluZm8pIHtcclxuICAgICAgICAgICAgZ2V0QXBwPElBcHBPcHRpb24+KCkucmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgc2hhcmVMb2NhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSwgdGhpcy5kYXRhLnNoYXJlTG9jYXRpb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvblNoYXJlTG9jYXRpb24oZTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcmVMb2NhdGlvbjogYm9vbGVhbiA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSwgc2hhcmVMb2NhdGlvbilcclxuICAgIH0sXHJcbiAgICBvblVubG9ja1RhcCgpIHtcclxuICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgIHR5cGU6ICdnY2owMicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGxvYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgYSB0cmlwJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBsb2MubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogbG9jLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhclVSTDogdGhpcy5kYXRhLnNoYXJlTG9jYXRpb24gPyB0aGlzLmRhdGEuYXZhdGFyVVJMIDogJycsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB3eC5zaG93TG9hZGluZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5byA6ZSB5LitJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFzazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgd3gucmVkaXJlY3RUbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcGFnZXMvZHJpdmluZy9kcml2aW5nJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH0sIDMwMDApXHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmFpbDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfor7fliY3lvoDorr7nva7pobXpnaLmjojmnYPmgqjnmoTkvY3nva7kv6Hmga8nLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcblxyXG5cclxuICAgIH1cclxufSkiXX0=