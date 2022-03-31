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
const profile_1 = require("../../service/profile");
const rental_pb_1 = require("../../service/proto_gen/rental/rental_pb");
const trip_1 = require("../../service/trip");
const routing_1 = require("../../utils/routing");
Page({
    isPageShowing: false,
    socket: undefined,
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
            let msgReceived = 0;
            this.socket = car_1.CarService.subscribe(msg => {
                msgReceived++;
                console.log(msg);
            });
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
        var _a;
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.close({});
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLDJDQUE4QztBQUM5QyxtREFBc0Q7QUFDdEQsd0VBQWlFO0FBQ2pFLDZDQUFnRDtBQUNoRCxpREFBNkM7QUFFN0MsSUFBSSxDQUFDO0lBQ0gsYUFBYSxFQUFFLEtBQUs7SUFDcEIsTUFBTSxFQUFFLFNBQXFEO0lBQzdELElBQUksRUFBRTtRQUNKLFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsQ0FBQztZQUNULFlBQVksRUFBRSxJQUFJO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixVQUFVLEVBQUUsQ0FBQztZQUNiLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFlBQVksRUFBRSxLQUFLO1lBQ25CLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixlQUFlLEVBQUUsS0FBSztZQUN0QixhQUFhLEVBQUUsS0FBSztTQUNyQjtRQUNELFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxLQUFLO1lBQ2YsU0FBUyxFQUFFLE1BQU07U0FDbEI7UUFDRCxLQUFLLEVBQUUsRUFBRTtRQUNULE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTthQUNYO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsU0FBUyxFQUFFLE1BQU07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QUU7WUFDbkIsSUFBSSxDQUFDLFFBQVEsSUFBSSxHQUFHLENBQUE7WUFDcEIsSUFBSSxDQUFDLFNBQVMsSUFBSSxHQUFHLENBQUE7WUFDckIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQTtZQUN6QixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFBO1lBRTFCLEdBQUcsQ0FBQyxlQUFlLENBQUM7Z0JBQ2xCLFdBQVcsRUFBRTtvQkFDWCxRQUFRLEVBQUUsS0FBSztvQkFDZixTQUFTLEVBQUUsS0FBSztpQkFDakI7Z0JBQ0QsUUFBUSxFQUFFLENBQUM7Z0JBQ1gsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLE1BQU0sRUFBRSxDQUFDO2dCQUNULFFBQVEsRUFBRSxJQUFJO2dCQUNkLFlBQVksRUFBRSxHQUFHLEVBQUU7b0JBQ2pCLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTt3QkFDdEIsT0FBTyxFQUFFLENBQUE7cUJBQ1Y7eUJBQU07d0JBQ0wsSUFBSSxDQUFDLE9BQU8sQ0FBQzs0QkFDWCxxQkFBcUIsRUFBRSxLQUFLOzRCQUM1QixzQkFBc0IsRUFBRSxLQUFLO3lCQUM5QixDQUFDLENBQUE7cUJBQ0g7Z0JBQ0gsQ0FBQzthQUNGLENBQUMsQ0FBQTtRQUNKLENBQUMsQ0FBQTtRQUVELE9BQU8sRUFBRSxDQUFBO0lBQ1gsQ0FBQztDQUNGLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi4vLi4vYXBwb3B0aW9uXCJcbmltcG9ydCB7IENhclNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS9jYXJcIlxuaW1wb3J0IHsgUHJvZmlsZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS9wcm9maWxlXCJcbmltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCJcbmltcG9ydCB7IFRyaXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvdHJpcFwiXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxuXG5QYWdlKHtcbiAgaXNQYWdlU2hvd2luZzogZmFsc2UsXG4gIHNvY2tldDogdW5kZWZpbmVkIGFzIFdlY2hhdE1pbmlwcm9ncmFtLlNvY2tldFRhc2sgfCB1bmRlZmluZWQsXG4gIGRhdGE6IHtcbiAgICBhdmF0YXJVUkw6ICcnLFxuICAgIHNldHRpbmc6IHtcbiAgICAgIHNrZXc6IDAsXG4gICAgICByb3RhdGU6IDAsXG4gICAgICBzaG93TG9jYXRpb246IHRydWUsXG4gICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICBzdWJLZXk6ICcnLFxuICAgICAgbGF5ZXJTdHlsZTogMSxcbiAgICAgIGVuYWJsZVpvb206IHRydWUsXG4gICAgICBlbmFibGVTY3JvbGw6IHRydWUsXG4gICAgICBlbmFibGVSb3RhdGU6IGZhbHNlLFxuICAgICAgc2hvd0NvbXBhc3M6IGZhbHNlLFxuICAgICAgZW5hYmxlM0Q6IGZhbHNlLFxuICAgICAgZW5hYmxlT3Zlcmxvb2tpbmc6IGZhbHNlLFxuICAgICAgZW5hYmxlU2F0ZWxsaXRlOiBmYWxzZSxcbiAgICAgIGVuYWJsZVRyYWZmaWM6IGZhbHNlLFxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgIH0sXG4gICAgc2NhbGU6IDEwLFxuICAgIG1hcmtlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAwLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTQuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAgYXN5bmMgb25Mb2FkKCkge1xuICAgIGxldCBtc2dSZWNlaXZlZCA9IDBcbiAgICAvLyB0ZXN0IHdlYnNvY2tldFxuICAgIHRoaXMuc29ja2V0ID0gQ2FyU2VydmljZS5zdWJzY3JpYmUobXNnID0+IHtcbiAgICAgIG1zZ1JlY2VpdmVkKytcbiAgICAgIGNvbnNvbGUubG9nKG1zZylcbiAgICB9KVxuXG5cbiAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXG4gICAgfSlcbiAgfSxcblxuICBhc3luYyBvblNjYW5UYXAoKSB7XG4gICAgLy8g5omr56CB5LmL5YmN57uZ5LqI5L+d5oqkIOmBv+WFjeWcqOihjOeoi+S4reWIm+W7uuaWsOeahOihjOeoi1xuICAgIGNvbnN0IHRyaXBzID0gYXdhaXQgVHJpcFNlcnZpY2UuZ2V0VHJpcHMocmVudGFsLnYxLlRyaXBTdGF0dXMuSU5fUFJPR1JFU1MpXG4gICAgbGV0IGRvU2NhbkNvZGUgPSBmYWxzZSAgLy8g6ZmQ5Yi25Zyo5by55Ye6TW9kYWzmmK/lvLnlh7rmiavnoIHnlYzpnaJcbiAgICBpZiAoKHRyaXBzLnRyaXBzPy5sZW5ndGggfHwgMCkgPiAwKSB7XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJ+acieacque7k+adn+eahOihjOeoiycsXG4gICAgICAgIGNvbnRlbnQ6ICflsIbot7Povazoh7PooYznqIvpobXpnaInLFxuICAgICAgICBjb25maXJtVGV4dDogXCLot7PovaxcIixcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIC8vIOWmguaenOW3sue7j+acieihjOeoi1xuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogcm91dGluZy5kcml2aW5nKHtcbiAgICAgICAgICAgICAgICB0cmlwX2lkOiB0cmlwcy50cmlwcyFbMF0uaWQhLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmNhbmNlbCkge1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vIC8vIOWmguaenOW3sue7j+acieihjOeoi1xuICAgICAgLy8gd3gubmF2aWdhdGVUbyh7XG4gICAgICAvLyAgIHVybDogcm91dGluZy5kcml2aW5nKHtcbiAgICAgIC8vICAgICB0cmlwX2lkOiB0cmlwcy50cmlwcyFbMF0uaWQhLFxuICAgICAgLy8gICB9KVxuICAgICAgLy8gfSlcbiAgICAgIC8vIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICBkb1NjYW5Db2RlID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChkb1NjYW5Db2RlKSB7XG4gICAgICB3eC5zY2FuQ29kZSh7XG4gICAgICAgIHN1Y2Nlc3M6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyDpppblhYjmn6XnnIvmmK/lkKblt7Lnu4/pgJrov4fouqvku73orqTnnJ8g54S25ZCO5Yaz5a6a5piv5ZCm5by55Ye65qih5oCB5qGGXG4gICAgICAgICAgY29uc3QgcHJvZiA9IGF3YWl0IFByb2ZpbGVTZXJ2aWNlLmdldFByb2ZpbGUoKVxuICAgICAgICAgIGNvbnN0IGNhcklEID0gJzYyNDAwODg3ZjAzNjkzMzUzNmVkZTBkOSdcbiAgICAgICAgICAvLyBjb25zdCByZWRpcmVjdFVSTDogc3RyaW5nID0gYC9wYWdlcy9sb2NrL2xvY2s/Y2FyX2lkPSR7Y2FySUR9YFxuICAgICAgICAgIGNvbnN0IGxvY2tVUkw6IHN0cmluZyA9IHJvdXRpbmcubG9jayh7XG4gICAgICAgICAgICBjYXJfaWQ6IGNhcklELFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHByb2YuaWRlbnRpdHlTdGF0dXMgPT09IHJlbnRhbC52MS5JZGVudGl0eVN0YXR1cy5WRVJJRklFRCkge1xuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogbG9ja1VSTCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiAn6Lqr5Lu96K6k6K+BJyxcbiAgICAgICAgICAgICAgY29udGVudDogJ+iupOivgeWQjuaWueWPr+enn+i9picsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRPRE86IGdldCBjYXIgaWQgZnJvbSBzY2FuIHJlc3VsdFxuXG4gICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyP3JlZGlyZWN0PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VVJMKX1gLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcucmVnaXN0ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VVJMOiBsb2NrVVJMLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxuICAgICAgfSlcbiAgICB9XG5cbiAgfSxcblxuICBvblNob3coKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gdHJ1ZVxuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gZmFsc2VcbiAgfSxcblxuICBvbk15VHJpcHMoKSB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAvLyB1cmw6ICcvcGFnZXMvbXl0cmlwcy9teXRyaXBzJyxcbiAgICAgIHVybDogcm91dGluZy5teXRyaXBzKCksXG4gICAgfSlcbiAgfSxcblxuICBvbk15TG9jYXRpb25UYXAoKSB7XG4gICAgdGhpcy5zb2NrZXQ/LmNsb3NlKHt9KVxuICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgIHR5cGU6ICdnY2owMicsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXMubG9uZ2l0dWRlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICB0aXRsZTogJ+WmguaciemcgOimge+8jOivt+WJjeW+gOiuvue9rumhteaOiOadg+WFgeiuuOiuv+mXruaCqOeahOS9jee9ricsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgbW92ZUNhcnMoKSB7XG4gICAgY29uc3QgbWFwID0gd3guY3JlYXRlTWFwQ29udGV4dChcIm1hcFwiKVxuICAgIGNvbnN0IGRlc3QgPSB7XG4gICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubGF0aXR1ZGUsXG4gICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxvbmdpdHVkZSxcbiAgICB9XG5cbiAgICBjb25zdCBtb3ZlQ2FyID0gKCkgPT4ge1xuICAgICAgZGVzdC5sYXRpdHVkZSArPSAwLjFcbiAgICAgIGRlc3QubG9uZ2l0dWRlICs9IDAuMVxuICAgICAgbGV0IG5vd0xhID0gZGVzdC5sYXRpdHVkZVxuICAgICAgbGV0IG5vd0xvID0gZGVzdC5sb25naXR1ZGVcblxuICAgICAgbWFwLnRyYW5zbGF0ZU1hcmtlcih7XG4gICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgbGF0aXR1ZGU6IG5vd0xhLFxuICAgICAgICAgIGxvbmdpdHVkZTogbm93TG8sXG4gICAgICAgIH0sXG4gICAgICAgIG1hcmtlcklkOiAwLFxuICAgICAgICBhdXRvUm90YXRlOiBmYWxzZSxcbiAgICAgICAgcm90YXRlOiAwLFxuICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgICAgYW5pbWF0aW9uRW5kOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNQYWdlU2hvd2luZykge1xuICAgICAgICAgICAgbW92ZUNhcigpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxhdGl0dWRlJzogbm93TGEsXG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxvbmdpdHVkZSc6IG5vd0xvLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1vdmVDYXIoKVxuICB9XG59KVxuIl19