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
const car_1 = require("../../service/car");
const car_pb_1 = require("../../service/proto_gen/car/car_pb");
const trip_1 = require("../../service/trip");
const routing_1 = require("../../utils/routing");
const shareLocationKey = "share_location";
Page({
    carID: '',
    carRefresher: 0,
    data: {
        shareLocation: false,
        avatarURL: '',
    },
    onLoad(opt) {
        return __awaiter(this, void 0, void 0, function* () {
            const o = opt;
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
        this.data.shareLocation = e.detail.value;
        wx.setStorageSync(shareLocationKey, this.data.shareLocation);
    },
    onUnlockTap() {
        wx.getLocation({
            type: 'gcj02',
            success: (loc) => __awaiter(this, void 0, void 0, function* () {
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
                        avatarUrl: this.data.shareLocation ? this.data.avatarURL : '',
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
                this.carRefresher = setInterval(() => __awaiter(this, void 0, void 0, function* () {
                    const c = yield car_1.CarService.getCar(this.carID);
                    if (c.status === car_pb_1.car.v1.CarStatus.UNLOCKED) {
                        this.clearCarRefresher();
                        wx.redirectTo({
                            url: routing_1.routing.driving({
                                trip_id: trip.id
                            }),
                            complete: () => {
                                wx.hideLoading();
                            }
                        });
                    }
                }), 2000);
            }),
            fail: () => {
                wx.showToast({
                    icon: 'none',
                    title: '请前往设置页面授权您的位置信息',
                });
            }
        });
    },
    onUnload() {
        this.clearCarRefresher();
        wx.hideLoading();
    },
    clearCarRefresher() {
        if (this.carRefresher) {
            clearInterval(this.carRefresher);
            this.carRefresher = 0;
        }
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibG9jay5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxvY2sudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSwyQ0FBOEM7QUFDOUMsK0RBQXdEO0FBRXhELDZDQUFnRDtBQUNoRCxpREFBNkM7QUFFN0MsTUFBTSxnQkFBZ0IsR0FBRyxnQkFBZ0IsQ0FBQTtBQUN6QyxJQUFJLENBQUM7SUFDRCxLQUFLLEVBQUUsRUFBRTtJQUNULFlBQVksRUFBRSxDQUFDO0lBQ2YsSUFBSSxFQUFFO1FBQ0YsYUFBYSxFQUFFLEtBQUs7UUFDcEIsU0FBUyxFQUFFLEVBQUU7S0FDaEI7SUFFSyxNQUFNLENBQUMsR0FBNkI7O1lBQ3RDLE1BQU0sQ0FBQyxHQUFxQixHQUFHLENBQUE7WUFFL0IsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFBO1lBQ3JCLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxFQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtZQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUztnQkFDN0IsYUFBYSxFQUFFLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxLQUFLO2FBQzlELENBQUMsQ0FBQTtRQUNOLENBQUM7S0FBQTtJQUNELGFBQWEsQ0FBQyxDQUFNO1FBQ2hCLE1BQU0sUUFBUSxHQUErQixDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQTtRQUM5RCxJQUFJLFFBQVEsRUFBRTtZQUNWLE1BQU0sRUFBYyxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQTtZQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULGFBQWEsRUFBRSxJQUFJO2FBQ3RCLENBQUMsQ0FBQTtZQUNGLEVBQUUsQ0FBQyxjQUFjLENBQUMsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQTtTQUMvRDtJQUVMLENB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LENBQUE7SUFDcEIsQ0FBQztJQUVELGlCQUFpQjtRQUNiLElBQUksSUFBSSxDQUFDLFlBQVksRUFBRTtZQUNuQixhQUFhLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFBO1lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsQ0FBQyxDQUFBO1NBQ3hCO0lBQ0wsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi4vLi4vYXBwb3B0aW9uXCJcclxuaW1wb3J0IHsgQ2FyU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL2NhclwiXHJcbmltcG9ydCB7IGNhciB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb3RvX2dlbi9jYXIvY2FyX3BiXCJcclxuaW1wb3J0IHsgcmVudGFsIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvcHJvdG9fZ2VuL3JlbnRhbC9yZW50YWxfcGJcIlxyXG5pbXBvcnQgeyBUcmlwU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3RyaXBcIlxyXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuY29uc3Qgc2hhcmVMb2NhdGlvbktleSA9IFwic2hhcmVfbG9jYXRpb25cIlxyXG5QYWdlKHtcclxuICAgIGNhcklEOiAnJyxcclxuICAgIGNhclJlZnJlc2hlcjogMCxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBzaGFyZUxvY2F0aW9uOiBmYWxzZSxcclxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxyXG4gICAgfSxcclxuXHJcbiAgICBhc3luYyBvbkxvYWQob3B0OiBSZWNvcmQ8J2Nhcl9pZCcsIHN0cmluZz4pIHtcclxuICAgICAgICBjb25zdCBvOiByb3V0aW5nLkxvY2tPcHRzID0gb3B0XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ3VubG9ja2luZyBjYXInLCBvLmNhcl9pZClcclxuICAgICAgICB0aGlzLmNhcklEID0gby5jYXJfaWRcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICAgICAgc2hhcmVMb2NhdGlvbjogd3guZ2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSkgfHwgZmFsc2VcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uR2V0VXNlckluZm8oZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvID0gZS5kZXRhaWwudXNlckluZm9cclxuICAgICAgICBpZiAodXNlckluZm8pIHtcclxuICAgICAgICAgICAgZ2V0QXBwPElBcHBPcHRpb24+KCkucmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgc2hhcmVMb2NhdGlvbjogdHJ1ZSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoc2hhcmVMb2NhdGlvbktleSwgdGhpcy5kYXRhLnNoYXJlTG9jYXRpb24pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvblNoYXJlTG9jYXRpb24oZTogYW55KSB7XHJcbiAgICAgICAgdGhpcy5kYXRhLnNoYXJlTG9jYXRpb24gPSBlLmRldGFpbC52YWx1ZVxyXG4gICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKHNoYXJlTG9jYXRpb25LZXksIHRoaXMuZGF0YS5zaGFyZUxvY2F0aW9uKVxyXG4gICAgfSxcclxuICAgIG9uVW5sb2NrVGFwKCkge1xyXG4gICAgICAgIHd4LmdldExvY2F0aW9uKHtcclxuICAgICAgICAgICAgdHlwZTogJ2djajAyJyxcclxuICAgICAgICAgICAgc3VjY2VzczogYXN5bmMgbG9jID0+IHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYXJJRCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ25vIGNhcklEIHNwZWNpZmllZCcpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2NrLnRzIDU1JylcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBsZXQgdHJpcDogcmVudGFsLnYxLklUcmlwRW50aXR5XHJcbiAgICAgICAgICAgICAgICB0cnkgeyAgIC8vIOWPr+iDveS8muWksei0pSDmiYDku6XlpZflnKggdHJ5LWNhdGNo6YeMXHJcbiAgICAgICAgICAgICAgICAgICAgLy8g5byC5q2l55qE5byA6ZSBICDnrYnlvoXliJvlu7rov5Tlm55cclxuICAgICAgICAgICAgICAgICAgICB0cmlwID0gYXdhaXQgVHJpcFNlcnZpY2UuY3JlYXRlVHJpcCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0OiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogbG9jLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb2MubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjYXJJZDogdGhpcy5jYXJJRCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXZhdGFyVXJsOiB0aGlzLmRhdGEuc2hhcmVMb2NhdGlvbiA/IHRoaXMuZGF0YS5hdmF0YXJVUkwgOiAnJyxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiAgICAgIC8vIOaaguaXtnJldHVybumBv+WFjemhtemdoui3s+i9rOW4puadpemXrumimFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnN0IHRyaXBJRCA9ICd0cmlwMTIzJ1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRyaXAuaWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcignbm8gdHJpcElEIGluIHJlc3BvbnNlJywgdHJpcClcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codHJpcC5pZClcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5Yib5bu66KGM56iL5aSx6LSlJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICAgICAgICAgIHd4LnNob3dMb2FkaW5nKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ+W8gOmUgeS4rScsXHJcbiAgICAgICAgICAgICAgICAgICAgbWFzazogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIH0pXHJcblxyXG5cclxuICAgICAgICAgICAgICAgIC8vIOWFiOWIpOaWrei9pueahOeKtuaAgVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jYXJSZWZyZXNoZXIgPSBzZXRJbnRlcnZhbChhc3luYyAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgYyA9IGF3YWl0IENhclNlcnZpY2UuZ2V0Q2FyKHRoaXMuY2FySUQpXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoYy5zdGF0dXM9PT1jYXIudjEuQ2FyU3RhdHVzLlVOTE9DS0VEKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJDYXJSZWZyZXNoZXIoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDova7or6LmiJDlip/lho1yZWRpcmVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3eC5yZWRpcmVjdFRvKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVybDogYC9wYWdlcy9kcml2aW5nL2RyaXZpbmc/dHJpcF9pZD0ke3RyaXBJRH1gLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiByb3V0aW5nLmRyaXZpbmcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaXBfaWQ6IHRyaXAuaWQhXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd3guaGlkZUxvYWRpbmcoKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0sIDIwMDApXHJcblxyXG4gICAgICAgICAgICB9LFxyXG5cclxuICAgICAgICAgICAgZmFpbDogKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICfor7fliY3lvoDorr7nva7pobXpnaLmjojmnYPmgqjnmoTkvY3nva7kv6Hmga8nLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXJDYXJSZWZyZXNoZXIoKVxyXG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKClcclxuICAgIH0sXHJcblxyXG4gICAgY2xlYXJDYXJSZWZyZXNoZXIoKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuY2FyUmVmcmVzaGVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy5jYXJSZWZyZXNoZXIpXHJcbiAgICAgICAgICAgIHRoaXMuY2FyUmVmcmVzaGVyID0gMFxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkiXX0=