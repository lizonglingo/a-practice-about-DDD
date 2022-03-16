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
const trip_1 = require("../../service/trip");
const routing_1 = require("../../utils/routing");
const shareLocationKey = "share_location";
Page({
    carID: '',
    data: {
        shareLocation: false,
        avatarURL: '',
    },
    onLoad(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = opt;
            console.log('unlocking car', o.car_id);
            this.carID = o.car_id;
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
            success: (loc) => __awaiter(this, void 0, void 0, function* () {
                console.log('starting a trip', {
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                    avatarURL: this.data.shareLocation ? this.data.avatarURL : '',
                });
                if (!this.carID) {
                    console.error('no carID specified');
                    return;
                }
                else {
                    console.log('lock.ts 55');
                }
                let trip;
                try {
                    trip = yield trip_1.TripService.createTrip({
                        start: {
                            latitude: loc.latitude,
                            longitude: loc.longitude,
                        },
                        carId: this.carID,
                    });
                    if (!trip.id) {
                        console.error('no tripID in response', trip);
                        return;
                    }
                    else {
                        console.log(trip.id);
                    }
                }
                catch (error) {
                    wx.showToast({
                        title: '创建行程失败',
                        icon: 'none',
                    });
                    return;
                }
                wx.showLoading({
                    title: '开锁中',
                    mask: true,
                });
                setTimeout(() => {
                    wx.redirectTo({
                        url: routing_1.routing.driving({
                            trip_id: trip.id
                        }),
                        complete: () => {
                            wx.hideLoading();
                        }
                    });
                }, 3000);
            }),
            fail: () => {
                wx.showToast({
                    icon: 'none',
                    title: '请前往设置页面授权您的位置信息',
                });
            }
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFFQSw2Q0FBZ0Q7QUFDaEQsaURBQTZDO0FBRTdDLE1BQU0sZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUE7QUFDekMsSUFBSSxDQUFDO0lBQ0QsS0FBSyxFQUFFLEVBQUU7SUFDVCxJQUFJLEVBQUU7UUFDRixhQUFhLEVBQUUsS0FBSztRQUNwQixTQUFTLEVBQUUsRUFBRTtLQUNoQjtJQUVLLE1BQU0sQ0FBQyxHQUE2Qjs7WUFDdEMsTUFBTSxDQUFDLEdBQXFCLEdBQUcsQ0FBQTtZQUMvQixPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUE7WUFDdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO1lBQ3JCLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxFQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtZQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztnQkFDN0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxLQUFLO2FBQzlELENBQUMsQ0FBQTtRQUNOLENBQUM7S0FBQTtJQUNELGFBQWEsQ0FBQyxDQUFNO1FBQ2hCLE1BQU0sUUFBUSxHQUErQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtRQUM5RCxJQUFJLFFBQVEsRUFBRTtZQUNWLE1BQU0sRUFBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULGFBQWEsRUFBRSxJQUFJO2FBQ3RCLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUMvRDtJQUVMLENBQUM7SUFDRCxlQUFlLENBQUMsQ0FBTTtRQUNsQixNQUFNLGFBQWEsR0FBWSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQTtRQUM3QyxFQUFFLENBQUMsY0FBYyxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFBO0lBQ3RELENBQUM7SUFDRCxXQUFXO1FBQ1AsRUFBRSxDQUFDLFdBQVcsQ0FBQztZQUNYLElBQUksRUFBRSxPQUFPO1lBQ2IsT0FBTyxFQUFFLENBQU0sR0FBRyxFQUFDLEVBQUU7Z0JBQ2pCLE9BQU8sQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUU7b0JBQzNCLFFBQVEsRUFBRTt3QkFDTixRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7d0JBQ3RCLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUztxQkFDM0I7b0JBRUQsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtpQkFDaEUsQ0FBQyxDQUFBO2dCQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFO29CQUNiLE9BQU8sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLENBQUMsQ0FBQTtvQkFDbkMsT0FBTTtpQkFDVDtxQkFBTTtvQkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFBO2lCQUM1QjtnQkFFRCxJQUFJLElBQTJCLENBQUE7Z0JBQy9CLElBQUk7b0JBRUEsSUFBSSxHQUFHLE1BQU0sa0JBQVcsQ0FBQyxVQUFVLENBQUM7d0JBQ2hDLEtBQUssRUFBRTs0QkFDSCxRQUFRLEVBQUUsR0FBRyxDQUFDLFFBQVE7NEJBQ3RCLFNBQVMsRUFBRSxHQUFHLENBQUMsU0FBUzt5QkFDM0I7d0JBQ0QsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLO3FCQUNwQixDQUFDLENBQUE7b0JBSUYsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7d0JBQ1YsT0FBTyxDQUFDLEtBQUssQ0FBQyx1QkFBdUIsRUFBRSxJQUFJLENBQUMsQ0FBQTt3QkFDNUMsT0FBTTtxQkFDVDt5QkFBTTt3QkFDSCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtxQkFDdkI7aUJBQ0o7Z0JBQUMsT0FBTyxLQUFLLEVBQUU7b0JBQ1osRUFBRSxDQUFDLFNBQVMsQ0FBQzt3QkFDVCxLQUFLLEVBQUUsUUFBUTt3QkFDZixJQUFJLEVBQUUsTUFBTTtxQkFDZixDQUFDLENBQUE7b0JBQ0YsT0FBTTtpQkFDVDtnQkFHRCxFQUFFLENBQUMsV0FBVyxDQUFDO29CQUNYLEtBQUssRUFBRSxLQUFLO29CQUNaLElBQUksRUFBRSxJQUFJO2lCQUNiLENBQUMsQ0FBQTtnQkFFRixVQUFVLENBQUMsR0FBRyxFQUFFO29CQUNaLEVBQUUsQ0FBQyxVQUFVLENBQUM7d0JBRVYsR0FBRyxFQUFFLGlCQUFPLENBQUMsT0FBTyxDQUFDOzRCQUNqQixPQUFPLEVBQUUsSUFBSSxDQUFDLEVBQUc7eUJBQ3BCLENBQUM7d0JBQ0YsUUFBUSxFQUFFLEdBQUcsRUFBRTs0QkFDWCxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUE7d0JBQ3BCLENBQUM7cUJBQ0osQ0FBQyxDQUFBO2dCQUNOLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUVaLENBQUMsQ0FBQTtZQUVELElBQUksRUFBRSxHQUFHLEVBQUU7Z0JBQ1AsRUFBRSxDQUFDLFNBQVMsQ0FBQztvQkFDVCxJQUFJLEVBQUUsTUFBTTtvQkFDWixLQUFLLEVBQUUsaUJBQWlCO2lCQUMzQixDQUFDLENBQUE7WUFDTixDQUFDO1NBQ0osQ0FBQyxDQUFBO0lBR04sQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi4vLi4vYXBwb3B0aW9uXCJcclxuaW1wb3J0IHsgcmVudGFsIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvcHJvdG9fZ2VuL3JlbnRhbC9yZW50YWxfcGJcIlxyXG5pbXBvcnQgeyBUcmlwU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3RyaXBcIlxyXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuY29uc3Qgc2hhcmVMb2NhdGlvbktleSA9IFwic2hhcmVfbG9jYXRpb25cIlxyXG5QYWdlKHtcclxuICAgIGNhcklEOiAnJyxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBzaGFyZUxvY2F0aW9uOiBmYWxzZSxcclxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBvbkxvYWQob3B0OiBSZWNvcmQ8J2Nhcl9pZCcsIHN0cmluZz4pIHtcclxuICAgICAgICBjb25zdCBvOiByb3V0aW5nLkxvY2tPcHRzID0gb3B0XHJcbiAgICAgICAgY29uc29sZS5sb2coJ3VubG9ja2luZyBjYXInLCBvLmNhcl9pZClcclxuICAgICAgICB0aGlzLmNhcklEID0gby5jYXJfaWRcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICAgICAgc2hhcmVMb2NhdGlvbjogd3guZ2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSkgfHwgZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uR2V0VXNlckluZm8oZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvID0gZS5kZXRhaWwudXNlckluZm9cclxuICAgICAgICBpZiAodXNlckluZm8pIHtcclxuICAgICAgICAgICAgZ2V0QXBwPElBcHBPcHRpb24+KCkucmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgc2hhcmVMb2NhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSwgdGhpcy5kYXRhLnNoYXJlTG9jYXRpb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvblNoYXJlTG9jYXRpb24oZTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgc2hhcmVMb2NhdGlvbjogYm9vbGVhbiA9IGUuZGV0YWlsLnZhbHVlXHJcbiAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSwgc2hhcmVMb2NhdGlvbilcclxuICAgIH0sXHJcbiAgICBvblVubG9ja1RhcCgpIHtcclxuICAgICAgICB3eC5nZXRMb2NhdGlvbih7XHJcbiAgICAgICAgICAgIHR5cGU6ICdnY2owMicsXHJcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGFzeW5jIGxvYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc3RhcnRpbmcgYSB0cmlwJywge1xyXG4gICAgICAgICAgICAgICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxhdGl0dWRlOiBsb2MubGF0aXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogbG9jLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFRPRE86IOmcgOimgeWPjOWQkee7keWumlxyXG4gICAgICAgICAgICAgICAgICAgIGF2YXRhclVSTDogdGhpcy5kYXRhLnNoYXJlTG9jYXRpb24gPyB0aGlzLmRhdGEuYXZhdGFyVVJMIDogJycsXHJcbiAgICAgICAgICAgICAgICB9KVxyXG5cclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYXJJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGNhcklEIHNwZWNpZmllZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2NrLnRzIDU1JylcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdHJpcDogcmVudGFsLnYxLklUcmlwRW50aXR5XHJcbiAgICAgICAgICAgICAgICB0cnkgeyAgIC8vIOWPr+iDveS8muWksei0pSDmiYDku6XlpZflnKggdHJ5LWNhdGNo6YeMXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5byC5q2l55qE5byA6ZSBICDnrYnlvoXliJvlu7rov5Tlm55cclxuICAgICAgICAgICAgICAgICAgICB0cmlwID0gYXdhaXQgVHJpcFNlcnZpY2UuY3JlYXRlVHJpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogbG9jLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb2MubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJJZDogdGhpcy5jYXJJRCxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiAgICAgIC8vIOaaguaXtnJldHVybumBv+WFjemhtemdoui3s+i9rOW4puadpemXrumimFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IHRyaXBJRCA9ICd0cmlwMTIzJ1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyaXAuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gdHJpcElEIGluIHJlc3BvbnNlJywgdHJpcClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codHJpcC5pZClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5Yib5bu66KGM56iL5aSx6LSlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+W8gOmUgeS4rScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFzazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgd3gucmVkaXJlY3RUbyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVybDogYC9wYWdlcy9kcml2aW5nL2RyaXZpbmc/dHJpcF9pZD0ke3RyaXBJRH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcuZHJpdmluZyh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlwX2lkOiB0cmlwLmlkIVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29tcGxldGU6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9LCAzMDAwKVxyXG5cclxuICAgICAgICAgICAgfSxcclxuXHJcbiAgICAgICAgICAgIGZhaWw6ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn6K+35YmN5b6A6K6+572u6aG16Z2i5o6I5p2D5oKo55qE5L2N572u5L+h5oGvJyxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KVxyXG5cclxuXHJcbiAgICB9XHJcbn0pIl19