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
const rental_pb_1 = require("../../service/proto_gen/rental/rental_pb");
const trip_1 = require("../../service/trip");
const routing_1 = require("../../utils/routing");
Page({
    isPageShowing: false,
    data: {
        avatarURL: '',
        setting: {
            skew: 0,
            rotate: 0,
            showLocation: true,
            showScale: true,
            subKey: '',
            layerStyle: 1,
            enableZoom: true,
            enableScroll: true,
            enableRotate: false,
            showCompass: false,
            enable3D: false,
            enableOverlooking: false,
            enableSatellite: false,
            enableTraffic: false,
        },
        location: {
            latitude: 23.09,
            longitude: 113.32,
        },
        scale: 10,
        markers: [
            {
                iconPath: "/resources/car.png",
                id: 0,
                latitude: 23.09,
                longitude: 113.32,
                width: 30,
                height: 30,
            },
            {
                iconPath: "/resources/car.png",
                id: 1,
                latitude: 23.09,
                longitude: 114.32,
                width: 30,
                height: 30,
            }
        ]
    },
    onLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const userInfo = yield getApp().globalData.userInfo;
            this.setData({
                avatarURL: userInfo.avatarUrl,
            });
        });
    },
    onScanTap() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const trips = yield trip_1.TripService.getTrips(rental_pb_1.rental.v1.TripStatus.IN_PROGRESS);
            let doScanCode = false;
            if ((((_a = trips.trips) === null || _a === void 0 ? void 0 : _a.length) || 0) > 0) {
                wx.showModal({
                    title: '有未结束的行程',
                    content: '将跳转至行程页面',
                    confirmText: "跳转",
                    showCancel: false,
                    success: (res) => {
                        if (res.confirm) {
                            wx.navigateTo({
                                url: routing_1.routing.driving({
                                    trip_id: trips.trips[0].id,
                                })
                            });
                            return;
                        }
                        else if (res.cancel) {
                        }
                    }
                });
            }
            else {
                doScanCode = true;
            }
            if (doScanCode) {
                wx.scanCode({
                    success: () => {
                        wx.showModal({
                            title: '身份认证',
                            content: '认证后方可租车',
                            success: (res) => {
                                if (res.confirm) {
                                    const carID = 'car123';
                                    const redirectURL = routing_1.routing.lock({
                                        car_id: carID,
                                    });
                                    wx.navigateTo({
                                        url: routing_1.routing.register({
                                            redirectURL: redirectURL,
                                        })
                                    });
                                }
                            },
                        });
                    },
                    fail: console.error,
                });
            }
        });
    },
    onShow() {
        this.isPageShowing = true;
    },
    onHide() {
        this.isPageShowing = false;
    },
    onMyTrips() {
        wx.navigateTo({
            url: routing_1.routing.mytrips(),
        });
    },
    onMyLocationTap() {
        wx.getLocation({
            type: 'gcj02',
            success: res => {
                this.setData({
                    location: {
                        latitude: res.latitude,
                        longitude: res.longitude,
                    },
                });
            },
            fail: () => {
                wx.showToast({
                    icon: 'none',
                    title: '如有需要，请前往设置页授权允许访问您的位置',
                });
            }
        });
    },
    moveCars() {
        const map = wx.createMapContext("map");
        const dest = {
            latitude: this.data.markers[0].latitude,
            longitude: this.data.markers[0].longitude,
        };
        const moveCar = () => {
            dest.latitude += 0.1;
            dest.longitude += 0.1;
            let nowLa = dest.latitude;
            let nowLo = dest.longitude;
            map.translateMarker({
                destination: {
                    latitude: nowLa,
                    longitude: nowLo,
                },
                markerId: 0,
                autoRotate: false,
                rotate: 0,
                duration: 5000,
                animationEnd: () => {
                    if (this.isPageShowing) {
                        moveCar();
                    }
                    else {
                        this.setData({
                            'markers[0].latitude': nowLa,
                            'markers[0].longitude': nowLo,
                        });
                    }
                },
            });
        };
        moveCar();
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLHdFQUFpRTtBQUNqRSw2Q0FBZ0Q7QUFDaEQsaURBQTZDO0FBRTdDLElBQUksQ0FBQztJQUNILGFBQWEsRUFBRSxLQUFLO0lBQ3BCLElBQUksRUFBRTtRQUNKLFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsQ0FBQztZQUNULFlBQVksRUFBRSxJQUFJO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixVQUFVLEVBQUUsQ0FBQztZQUNiLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFlBQVksRUFBRSxLQUFLO1lBQ25CLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixlQUFlLEVBQUUsS0FBSztZQUN0QixhQUFhLEVBQUUsS0FBSztTQUNyQjtRQUNELFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxLQUFLO1lBQ2YsU0FBUyxFQUFFLE1BQU07U0FDbEI7UUFDRCxLQUFLLEVBQUUsRUFBRTtRQUNULE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTthQUNYO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sRUFBRSxFQUFFO2FBQ1g7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RSxLQUFLO3lCQUM5QixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtRQUVELE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi4vLi4vYXBwb3B0aW9uXCJcbmltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCJcbmltcG9ydCB7IFRyaXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvdHJpcFwiXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxuXG5QYWdlKHtcbiAgaXNQYWdlU2hvd2luZzogZmFsc2UsXG4gIGRhdGE6IHtcbiAgICBhdmF0YXJVUkw6ICcnLFxuICAgIHNldHRpbmc6IHtcbiAgICAgIHNrZXc6IDAsXG4gICAgICByb3RhdGU6IDAsXG4gICAgICBzaG93TG9jYXRpb246IHRydWUsXG4gICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICBzdWJLZXk6ICcnLFxuICAgICAgbGF5ZXJTdHlsZTogMSxcbiAgICAgIGVuYWJsZVpvb206IHRydWUsXG4gICAgICBlbmFibGVTY3JvbGw6IHRydWUsXG4gICAgICBlbmFibGVSb3RhdGU6IGZhbHNlLFxuICAgICAgc2hvd0NvbXBhc3M6IGZhbHNlLFxuICAgICAgZW5hYmxlM0Q6IGZhbHNlLFxuICAgICAgZW5hYmxlT3Zlcmxvb2tpbmc6IGZhbHNlLFxuICAgICAgZW5hYmxlU2F0ZWxsaXRlOiBmYWxzZSxcbiAgICAgIGVuYWJsZVRyYWZmaWM6IGZhbHNlLFxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgIH0sXG4gICAgc2NhbGU6IDEwLFxuICAgIG1hcmtlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAwLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTQuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAgYXN5bmMgb25Mb2FkKCkge1xuICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0QXBwPElBcHBPcHRpb24+KCkuZ2xvYmFsRGF0YS51c2VySW5mb1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcbiAgICB9KVxuICB9LFxuXG4gIGFzeW5jIG9uU2NhblRhcCgpIHtcbiAgICAvLyDmiavnoIHkuYvliY3nu5nkuojkv53miqQg6YG/5YWN5Zyo6KGM56iL5Lit5Yib5bu65paw55qE6KGM56iLXG4gICAgY29uc3QgdHJpcHMgPSBhd2FpdCBUcmlwU2VydmljZS5nZXRUcmlwcyhyZW50YWwudjEuVHJpcFN0YXR1cy5JTl9QUk9HUkVTUylcbiAgICBsZXQgZG9TY2FuQ29kZSA9IGZhbHNlICAvLyDpmZDliLblnKjlvLnlh7pNb2RhbOaYr+W8ueWHuuaJq+eggeeVjOmdolxuICAgIGlmICgodHJpcHMudHJpcHM/Lmxlbmd0aCB8fCAwKSA+IDApIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn5pyJ5pyq57uT5p2f55qE6KGM56iLJyxcbiAgICAgICAgY29udGVudDogJ+Wwhui3s+i9rOiHs+ihjOeoi+mhtemdoicsXG4gICAgICAgIGNvbmZpcm1UZXh0OiBcIui3s+i9rFwiLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgICAgLy8g5aaC5p6c5bey57uP5pyJ6KGM56iLXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgdXJsOiByb3V0aW5nLmRyaXZpbmcoe1xuICAgICAgICAgICAgICAgIHRyaXBfaWQ6IHRyaXBzLnRyaXBzIVswXS5pZCEsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gLy8g5aaC5p6c5bey57uP5pyJ6KGM56iLXG4gICAgICAvLyB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIC8vICAgdXJsOiByb3V0aW5nLmRyaXZpbmcoe1xuICAgICAgLy8gICAgIHRyaXBfaWQ6IHRyaXBzLnRyaXBzIVswXS5pZCEsXG4gICAgICAvLyAgIH0pXG4gICAgICAvLyB9KVxuICAgICAgLy8gcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvU2NhbkNvZGUgPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGRvU2NhbkNvZGUpIHtcbiAgICAgIHd4LnNjYW5Db2RlKHtcbiAgICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICB0aXRsZTogJ+i6q+S7veiupOivgScsXG4gICAgICAgICAgICBjb250ZW50OiAn6K6k6K+B5ZCO5pa55Y+v56ef6L2mJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICAgICAgLy8gVE9ETzogZ2V0IGNhciBpZCBmcm9tIHNjYW4gcmVzdWx0XG4gICAgICAgICAgICAgICAgY29uc3QgY2FySUQgPSAnY2FyMTIzJ1xuICAgICAgICAgICAgICAgIC8vIGNvbnN0IHJlZGlyZWN0VVJMOiBzdHJpbmcgPSBgL3BhZ2VzL2xvY2svbG9jaz9jYXJfaWQ9JHtjYXJJRH1gXG4gICAgICAgICAgICAgICAgY29uc3QgcmVkaXJlY3RVUkw6IHN0cmluZyA9IHJvdXRpbmcubG9jayh7XG4gICAgICAgICAgICAgICAgICBjYXJfaWQ6IGNhcklELFxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgICAgICAvLyB1cmw6IGAvcGFnZXMvcmVnaXN0ZXIvcmVnaXN0ZXI/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVUkwpfWAsXG4gICAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcucmVnaXN0ZXIoe1xuICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFVSTDogcmVkaXJlY3RVUkwsXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxuICAgICAgfSlcbiAgICB9XG5cbiAgfSxcblxuICBvblNob3coKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gdHJ1ZVxuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gZmFsc2VcbiAgfSxcblxuICBvbk15VHJpcHMoKSB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAvLyB1cmw6ICcvcGFnZXMvbXl0cmlwcy9teXRyaXBzJyxcbiAgICAgIHVybDogcm91dGluZy5teXRyaXBzKCksXG4gICAgfSlcbiAgfSxcblxuICBvbk15TG9jYXRpb25UYXAoKSB7XG4gICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgdHlwZTogJ2djajAyJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiByZXMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgIHRpdGxlOiAn5aaC5pyJ6ZyA6KaB77yM6K+35YmN5b6A6K6+572u6aG15o6I5p2D5YWB6K646K6/6Zeu5oKo55qE5L2N572uJyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBtb3ZlQ2FycygpIHtcbiAgICBjb25zdCBtYXAgPSB3eC5jcmVhdGVNYXBDb250ZXh0KFwibWFwXCIpXG4gICAgY29uc3QgZGVzdCA9IHtcbiAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubWFya2Vyc1swXS5sYXRpdHVkZSxcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubG9uZ2l0dWRlLFxuICAgIH1cblxuICAgIGNvbnN0IG1vdmVDYXIgPSAoKSA9PiB7XG4gICAgICBkZXN0LmxhdGl0dWRlICs9IDAuMVxuICAgICAgZGVzdC5sb25naXR1ZGUgKz0gMC4xXG4gICAgICBsZXQgbm93TGEgPSBkZXN0LmxhdGl0dWRlXG4gICAgICBsZXQgbm93TG8gPSBkZXN0LmxvbmdpdHVkZVxuXG4gICAgICBtYXAudHJhbnNsYXRlTWFya2VyKHtcbiAgICAgICAgZGVzdGluYXRpb246IHtcbiAgICAgICAgICBsYXRpdHVkZTogbm93TGEsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBub3dMbyxcbiAgICAgICAgfSxcbiAgICAgICAgbWFya2VySWQ6IDAsXG4gICAgICAgIGF1dG9Sb3RhdGU6IGZhbHNlLFxuICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgIGR1cmF0aW9uOiA1MDAwLFxuICAgICAgICBhbmltYXRpb25FbmQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc1BhZ2VTaG93aW5nKSB7XG4gICAgICAgICAgICBtb3ZlQ2FyKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgJ21hcmtlcnNbMF0ubGF0aXR1ZGUnOiBub3dMYSxcbiAgICAgICAgICAgICAgJ21hcmtlcnNbMF0ubG9uZ2l0dWRlJzogbm93TG8sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbW92ZUNhcigpXG4gIH1cbn0pXG4iXX0=