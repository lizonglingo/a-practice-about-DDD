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
const profile_1 = require("../../service/profile");
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
                    success: () => __awaiter(this, void 0, void 0, function* () {
                        const prof = yield profile_1.ProfileService.getProfile();
                        const carID = '62400887f036933536ede0d9';
                        const lockURL = routing_1.routing.lock({
                            car_id: carID,
                        });
                        if (prof.identityStatus === rental_pb_1.rental.v1.IdentityStatus.VERIFIED) {
                            wx.navigateTo({
                                url: lockURL,
                            });
                        }
                        else {
                            wx.showModal({
                                title: '身份认证',
                                content: '认证后方可租车',
                                success: (res) => {
                                    if (res.confirm) {
                                        wx.navigateTo({
                                            url: routing_1.routing.register({
                                                redirectURL: lockURL,
                                            })
                                        });
                                    }
                                },
                            });
                        }
                    }),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUN0RCx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELGlEQUE2QztBQUU3QyxJQUFJLENBQUM7SUFDSCxhQUFhLEVBQUUsS0FBSztJQUNwQixJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLENBQUM7WUFDVCxZQUFZLEVBQUUsSUFBSTtZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxFQUFFO1lBQ1YsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsSUFBSTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixXQUFXLEVBQUUsS0FBSztZQUNsQixRQUFRLEVBQUUsS0FBSztZQUNmLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsZUFBZSxFQUFFLEtBQUs7WUFDdEIsYUFBYSxFQUFFLEtBQUs7U0FDckI7UUFDRCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxNQUFNO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLEVBQUU7YUFDWDtZQUNEO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVB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LENBQUM7Z0JBQ1gsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJO2dCQUNkLFlBQVksRUFBRSxHQUFHLEVBQUU7b0JBQ2pCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDdEIsT0FBTyxFQUFFLENBQUE7cUJBQ1Y7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQzs0QkFDWCxxQkFBcUIsRUFBRSxLQUFLOzRCQUM1QixzQkFBc0IsRUFBRSxLQUFLO3lCQUM5QixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtRQUVELE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi4vLi4vYXBwb3B0aW9uXCJcbmltcG9ydCB7IFByb2ZpbGVTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvcHJvZmlsZVwiXG5pbXBvcnQgeyByZW50YWwgfSBmcm9tIFwiLi4vLi4vc2VydmljZS9wcm90b19nZW4vcmVudGFsL3JlbnRhbF9wYlwiXG5pbXBvcnQgeyBUcmlwU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3RyaXBcIlxuaW1wb3J0IHsgcm91dGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9yb3V0aW5nXCJcblxuUGFnZSh7XG4gIGlzUGFnZVNob3dpbmc6IGZhbHNlLFxuICBkYXRhOiB7XG4gICAgYXZhdGFyVVJMOiAnJyxcbiAgICBzZXR0aW5nOiB7XG4gICAgICBza2V3OiAwLFxuICAgICAgcm90YXRlOiAwLFxuICAgICAgc2hvd0xvY2F0aW9uOiB0cnVlLFxuICAgICAgc2hvd1NjYWxlOiB0cnVlLFxuICAgICAgc3ViS2V5OiAnJyxcbiAgICAgIGxheWVyU3R5bGU6IDEsXG4gICAgICBlbmFibGVab29tOiB0cnVlLFxuICAgICAgZW5hYmxlU2Nyb2xsOiB0cnVlLFxuICAgICAgZW5hYmxlUm90YXRlOiBmYWxzZSxcbiAgICAgIHNob3dDb21wYXNzOiBmYWxzZSxcbiAgICAgIGVuYWJsZTNEOiBmYWxzZSxcbiAgICAgIGVuYWJsZU92ZXJsb29raW5nOiBmYWxzZSxcbiAgICAgIGVuYWJsZVNhdGVsbGl0ZTogZmFsc2UsXG4gICAgICBlbmFibGVUcmFmZmljOiBmYWxzZSxcbiAgICB9LFxuICAgIGxvY2F0aW9uOiB7XG4gICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICBsb25naXR1ZGU6IDExMy4zMixcbiAgICB9LFxuICAgIHNjYWxlOiAxMCxcbiAgICBtYXJrZXJzOiBbXG4gICAgICB7XG4gICAgICAgIGljb25QYXRoOiBcIi9yZXNvdXJjZXMvY2FyLnBuZ1wiLFxuICAgICAgICBpZDogMCxcbiAgICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgICBsb25naXR1ZGU6IDExMy4zMixcbiAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAxLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTE0LjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9XG4gICAgXVxuICB9LFxuXG4gIGFzeW5jIG9uTG9hZCgpIHtcbiAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXG4gICAgfSlcbiAgfSxcblxuICBhc3luYyBvblNjYW5UYXAoKSB7XG4gICAgLy8g5omr56CB5LmL5YmN57uZ5LqI5L+d5oqkIOmBv+WFjeWcqOihjOeoi+S4reWIm+W7uuaWsOeahOihjOeoi1xuICAgIGNvbnN0IHRyaXBzID0gYXdhaXQgVHJpcFNlcnZpY2UuZ2V0VHJpcHMocmVudGFsLnYxLlRyaXBTdGF0dXMuSU5fUFJPR1JFU1MpXG4gICAgbGV0IGRvU2NhbkNvZGUgPSBmYWxzZSAgLy8g6ZmQ5Yi25Zyo5by55Ye6TW9kYWzmmK/lvLnlh7rmiavnoIHnlYzpnaJcbiAgICBpZiAoKHRyaXBzLnRyaXBzPy5sZW5ndGggfHwgMCkgPiAwKSB7XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJ+acieacque7k+adn+eahOihjOeoiycsXG4gICAgICAgIGNvbnRlbnQ6ICflsIbot7Povazoh7PooYznqIvpobXpnaInLFxuICAgICAgICBjb25maXJtVGV4dDogXCLot7PovaxcIixcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIC8vIOWmguaenOW3sue7j+acieihjOeoi1xuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogcm91dGluZy5kcml2aW5nKHtcbiAgICAgICAgICAgICAgICB0cmlwX2lkOiB0cmlwcy50cmlwcyFbMF0uaWQhLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmNhbmNlbCkge1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vIC8vIOWmguaenOW3sue7j+acieihjOeoi1xuICAgICAgLy8gd3gubmF2aWdhdGVUbyh7XG4gICAgICAvLyAgIHVybDogcm91dGluZy5kcml2aW5nKHtcbiAgICAgIC8vICAgICB0cmlwX2lkOiB0cmlwcy50cmlwcyFbMF0uaWQhLFxuICAgICAgLy8gICB9KVxuICAgICAgLy8gfSlcbiAgICAgIC8vIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICBkb1NjYW5Db2RlID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChkb1NjYW5Db2RlKSB7XG4gICAgICB3eC5zY2FuQ29kZSh7XG4gICAgICAgIHN1Y2Nlc3M6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyDpppblhYjmn6XnnIvmmK/lkKblt7Lnu4/pgJrov4fouqvku73orqTnnJ8g54S25ZCO5Yaz5a6a5piv5ZCm5by55Ye65qih5oCB5qGGXG4gICAgICAgICAgY29uc3QgcHJvZiA9IGF3YWl0IFByb2ZpbGVTZXJ2aWNlLmdldFByb2ZpbGUoKVxuICAgICAgICAgIGNvbnN0IGNhcklEID0gJzYyNDAwODg3ZjAzNjkzMzUzNmVkZTBkOSdcbiAgICAgICAgICAvLyBjb25zdCByZWRpcmVjdFVSTDogc3RyaW5nID0gYC9wYWdlcy9sb2NrL2xvY2s/Y2FyX2lkPSR7Y2FySUR9YFxuICAgICAgICAgIGNvbnN0IGxvY2tVUkw6IHN0cmluZyA9IHJvdXRpbmcubG9jayh7XG4gICAgICAgICAgICBjYXJfaWQ6IGNhcklELFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHByb2YuaWRlbnRpdHlTdGF0dXMgPT09IHJlbnRhbC52MS5JZGVudGl0eVN0YXR1cy5WRVJJRklFRCkge1xuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogbG9ja1VSTCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiAn6Lqr5Lu96K6k6K+BJyxcbiAgICAgICAgICAgICAgY29udGVudDogJ+iupOivgeWQjuaWueWPr+enn+i9picsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRPRE86IGdldCBjYXIgaWQgZnJvbSBzY2FuIHJlc3VsdFxuXG4gICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyP3JlZGlyZWN0PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VVJMKX1gLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcucmVnaXN0ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VVJMOiBsb2NrVVJMLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxuICAgICAgfSlcbiAgICB9XG5cbiAgfSxcblxuICBvblNob3coKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gdHJ1ZVxuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gZmFsc2VcbiAgfSxcblxuICBvbk15VHJpcHMoKSB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAvLyB1cmw6ICcvcGFnZXMvbXl0cmlwcy9teXRyaXBzJyxcbiAgICAgIHVybDogcm91dGluZy5teXRyaXBzKCksXG4gICAgfSlcbiAgfSxcblxuICBvbk15TG9jYXRpb25UYXAoKSB7XG4gICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgdHlwZTogJ2djajAyJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiByZXMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgIHRpdGxlOiAn5aaC5pyJ6ZyA6KaB77yM6K+35YmN5b6A6K6+572u6aG15o6I5p2D5YWB6K646K6/6Zeu5oKo55qE5L2N572uJyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBtb3ZlQ2FycygpIHtcbiAgICBjb25zdCBtYXAgPSB3eC5jcmVhdGVNYXBDb250ZXh0KFwibWFwXCIpXG4gICAgY29uc3QgZGVzdCA9IHtcbiAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubWFya2Vyc1swXS5sYXRpdHVkZSxcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubG9uZ2l0dWRlLFxuICAgIH1cblxuICAgIGNvbnN0IG1vdmVDYXIgPSAoKSA9PiB7XG4gICAgICBkZXN0LmxhdGl0dWRlICs9IDAuMVxuICAgICAgZGVzdC5sb25naXR1ZGUgKz0gMC4xXG4gICAgICBsZXQgbm93TGEgPSBkZXN0LmxhdGl0dWRlXG4gICAgICBsZXQgbm93TG8gPSBkZXN0LmxvbmdpdHVkZVxuXG4gICAgICBtYXAudHJhbnNsYXRlTWFya2VyKHtcbiAgICAgICAgZGVzdGluYXRpb246IHtcbiAgICAgICAgICBsYXRpdHVkZTogbm93TGEsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBub3dMbyxcbiAgICAgICAgfSxcbiAgICAgICAgbWFya2VySWQ6IDAsXG4gICAgICAgIGF1dG9Sb3RhdGU6IGZhbHNlLFxuICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgIGR1cmF0aW9uOiA1MDAwLFxuICAgICAgICBhbmltYXRpb25FbmQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc1BhZ2VTaG93aW5nKSB7XG4gICAgICAgICAgICBtb3ZlQ2FyKClcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgJ21hcmtlcnNbMF0ubGF0aXR1ZGUnOiBub3dMYSxcbiAgICAgICAgICAgICAgJ21hcmtlcnNbMF0ubG9uZ2l0dWRlJzogbm93TG8sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbW92ZUNhcigpXG4gIH1cbn0pXG4iXX0=