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
                        const carID = 'car123';
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUN0RCx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELGlEQUE2QztBQUU3QyxJQUFJLENBQUM7SUFDSCxhQUFhLEVBQUUsS0FBSztJQUNwQixJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLENBQUM7WUFDVCxZQUFZLEVBQUUsSUFBSTtZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxFQUFFO1lBQ1YsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsSUFBSTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixXQUFXLEVBQUUsS0FBSztZQUNsQixRQUFRLEVBQUUsS0FBSztZQUNmLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsZUFBZSxFQUFFLEtBQUs7WUFDdEIsYUFBYSxFQUFFLEtBQUs7U0FDckI7UUFDRCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxNQUFNO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLEVBQUU7YUFDWDtZQUNEO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVB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QUFDO2dCQUNYLFVBQVUsRUFBRSxLQUFLO2dCQUNqQixNQUFNLEVBQUUsQ0FBQztnQkFDVCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxZQUFZLEVBQUUsR0FBRyxFQUFFO29CQUNqQixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7d0JBQ3RCLE9BQU8sRUFBRSxDQUFBO3FCQUNWO3lCQUFNO3dCQUNMLElBQUksQ0FBQyxPQUFPLENBQUM7NEJBQ1gscUJBQXFCLEVBQUUsS0FBSzs0QkFDNUIsc0JBQXNCLEVBQUUsS0FBSzt5QkFDOUIsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDLENBQUE7UUFFRCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQXBwT3B0aW9uIH0gZnJvbSBcIi4uLy4uL2FwcG9wdGlvblwiXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb2ZpbGVcIlxuaW1wb3J0IHsgcmVudGFsIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvcHJvdG9fZ2VuL3JlbnRhbC9yZW50YWxfcGJcIlxuaW1wb3J0IHsgVHJpcFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS90cmlwXCJcbmltcG9ydCB7IHJvdXRpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcm91dGluZ1wiXG5cblBhZ2Uoe1xuICBpc1BhZ2VTaG93aW5nOiBmYWxzZSxcbiAgZGF0YToge1xuICAgIGF2YXRhclVSTDogJycsXG4gICAgc2V0dGluZzoge1xuICAgICAgc2tldzogMCxcbiAgICAgIHJvdGF0ZTogMCxcbiAgICAgIHNob3dMb2NhdGlvbjogdHJ1ZSxcbiAgICAgIHNob3dTY2FsZTogdHJ1ZSxcbiAgICAgIHN1YktleTogJycsXG4gICAgICBsYXllclN0eWxlOiAxLFxuICAgICAgZW5hYmxlWm9vbTogdHJ1ZSxcbiAgICAgIGVuYWJsZVNjcm9sbDogdHJ1ZSxcbiAgICAgIGVuYWJsZVJvdGF0ZTogZmFsc2UsXG4gICAgICBzaG93Q29tcGFzczogZmFsc2UsXG4gICAgICBlbmFibGUzRDogZmFsc2UsXG4gICAgICBlbmFibGVPdmVybG9va2luZzogZmFsc2UsXG4gICAgICBlbmFibGVTYXRlbGxpdGU6IGZhbHNlLFxuICAgICAgZW5hYmxlVHJhZmZpYzogZmFsc2UsXG4gICAgfSxcbiAgICBsb2NhdGlvbjoge1xuICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgbG9uZ2l0dWRlOiAxMTMuMzIsXG4gICAgfSxcbiAgICBzY2FsZTogMTAsXG4gICAgbWFya2VyczogW1xuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTMuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb25QYXRoOiBcIi9yZXNvdXJjZXMvY2FyLnBuZ1wiLFxuICAgICAgICBpZDogMSxcbiAgICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgICBsb25naXR1ZGU6IDExNC4zMixcbiAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgfVxuICAgIF1cbiAgfSxcblxuICBhc3luYyBvbkxvYWQoKSB7XG4gICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBnZXRBcHA8SUFwcE9wdGlvbj4oKS5nbG9iYWxEYXRhLnVzZXJJbmZvXG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxuICAgIH0pXG4gIH0sXG5cbiAgYXN5bmMgb25TY2FuVGFwKCkge1xuICAgIC8vIOaJq+eggeS5i+WJjee7meS6iOS/neaKpCDpgb/lhY3lnKjooYznqIvkuK3liJvlu7rmlrDnmoTooYznqItcbiAgICBjb25zdCB0cmlwcyA9IGF3YWl0IFRyaXBTZXJ2aWNlLmdldFRyaXBzKHJlbnRhbC52MS5UcmlwU3RhdHVzLklOX1BST0dSRVNTKVxuICAgIGxldCBkb1NjYW5Db2RlID0gZmFsc2UgIC8vIOmZkOWItuWcqOW8ueWHuk1vZGFs5piv5by55Ye65omr56CB55WM6Z2iXG4gICAgaWYgKCh0cmlwcy50cmlwcz8ubGVuZ3RoIHx8IDApID4gMCkge1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICfmnInmnKrnu5PmnZ/nmoTooYznqIsnLFxuICAgICAgICBjb250ZW50OiAn5bCG6Lez6L2s6Iez6KGM56iL6aG16Z2iJyxcbiAgICAgICAgY29uZmlybVRleHQ6IFwi6Lez6L2sXCIsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICAvLyDlpoLmnpzlt7Lnu4/mnInooYznqItcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcuZHJpdmluZyh7XG4gICAgICAgICAgICAgICAgdHJpcF9pZDogdHJpcHMudHJpcHMhWzBdLmlkISxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgICByZXR1cm5cbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgICAvLyAvLyDlpoLmnpzlt7Lnu4/mnInooYznqItcbiAgICAgIC8vIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgLy8gICB1cmw6IHJvdXRpbmcuZHJpdmluZyh7XG4gICAgICAvLyAgICAgdHJpcF9pZDogdHJpcHMudHJpcHMhWzBdLmlkISxcbiAgICAgIC8vICAgfSlcbiAgICAgIC8vIH0pXG4gICAgICAvLyByZXR1cm5cbiAgICB9IGVsc2Uge1xuICAgICAgZG9TY2FuQ29kZSA9IHRydWVcbiAgICB9XG5cbiAgICBpZiAoZG9TY2FuQ29kZSkge1xuICAgICAgd3guc2NhbkNvZGUoe1xuICAgICAgICBzdWNjZXNzOiBhc3luYyAoKSA9PiB7XG4gICAgICAgICAgLy8g6aaW5YWI5p+l55yL5piv5ZCm5bey57uP6YCa6L+H6Lqr5Lu96K6k55yfIOeEtuWQjuWGs+WumuaYr+WQpuW8ueWHuuaooeaAgeahhlxuICAgICAgICAgIGNvbnN0IHByb2YgPSBhd2FpdCBQcm9maWxlU2VydmljZS5nZXRQcm9maWxlKClcbiAgICAgICAgICBjb25zdCBjYXJJRCA9ICdjYXIxMjMnXG4gICAgICAgICAgLy8gY29uc3QgcmVkaXJlY3RVUkw6IHN0cmluZyA9IGAvcGFnZXMvbG9jay9sb2NrP2Nhcl9pZD0ke2NhcklEfWBcbiAgICAgICAgICBjb25zdCBsb2NrVVJMOiBzdHJpbmcgPSByb3V0aW5nLmxvY2soe1xuICAgICAgICAgICAgY2FyX2lkOiBjYXJJRCxcbiAgICAgICAgICB9KVxuICAgICAgICAgIGlmIChwcm9mLmlkZW50aXR5U3RhdHVzID09PSByZW50YWwudjEuSWRlbnRpdHlTdGF0dXMuVkVSSUZJRUQpIHtcbiAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgICB1cmw6IGxvY2tVUkwsXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgICB0aXRsZTogJ+i6q+S7veiupOivgScsXG4gICAgICAgICAgICAgIGNvbnRlbnQ6ICforqTor4HlkI7mlrnlj6/np5/ovaYnLFxuICAgICAgICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICAgICAgICAvLyBUT0RPOiBnZXQgY2FyIGlkIGZyb20gc2NhbiByZXN1bHRcblxuICAgICAgICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgICAgICAgIC8vIHVybDogYC9wYWdlcy9yZWdpc3Rlci9yZWdpc3Rlcj9yZWRpcmVjdD0ke2VuY29kZVVSSUNvbXBvbmVudChyZWRpcmVjdFVSTCl9YCxcbiAgICAgICAgICAgICAgICAgICAgdXJsOiByb3V0aW5nLnJlZ2lzdGVyKHtcbiAgICAgICAgICAgICAgICAgICAgICByZWRpcmVjdFVSTDogbG9ja1VSTCxcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgZmFpbDogY29uc29sZS5lcnJvcixcbiAgICAgIH0pXG4gICAgfVxuXG4gIH0sXG5cbiAgb25TaG93KCkge1xuICAgIHRoaXMuaXNQYWdlU2hvd2luZyA9IHRydWVcbiAgfSxcbiAgb25IaWRlKCkge1xuICAgIHRoaXMuaXNQYWdlU2hvd2luZyA9IGZhbHNlXG4gIH0sXG5cbiAgb25NeVRyaXBzKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgLy8gdXJsOiAnL3BhZ2VzL215dHJpcHMvbXl0cmlwcycsXG4gICAgICB1cmw6IHJvdXRpbmcubXl0cmlwcygpLFxuICAgIH0pXG4gIH0sXG5cbiAgb25NeUxvY2F0aW9uVGFwKCkge1xuICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgIHR5cGU6ICdnY2owMicsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXMubG9uZ2l0dWRlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICB0aXRsZTogJ+WmguaciemcgOimge+8jOivt+WJjeW+gOiuvue9rumhteaOiOadg+WFgeiuuOiuv+mXruaCqOeahOS9jee9ricsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgbW92ZUNhcnMoKSB7XG4gICAgY29uc3QgbWFwID0gd3guY3JlYXRlTWFwQ29udGV4dChcIm1hcFwiKVxuICAgIGNvbnN0IGRlc3QgPSB7XG4gICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubGF0aXR1ZGUsXG4gICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxvbmdpdHVkZSxcbiAgICB9XG5cbiAgICBjb25zdCBtb3ZlQ2FyID0gKCkgPT4ge1xuICAgICAgZGVzdC5sYXRpdHVkZSArPSAwLjFcbiAgICAgIGRlc3QubG9uZ2l0dWRlICs9IDAuMVxuICAgICAgbGV0IG5vd0xhID0gZGVzdC5sYXRpdHVkZVxuICAgICAgbGV0IG5vd0xvID0gZGVzdC5sb25naXR1ZGVcblxuICAgICAgbWFwLnRyYW5zbGF0ZU1hcmtlcih7XG4gICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgbGF0aXR1ZGU6IG5vd0xhLFxuICAgICAgICAgIGxvbmdpdHVkZTogbm93TG8sXG4gICAgICAgIH0sXG4gICAgICAgIG1hcmtlcklkOiAwLFxuICAgICAgICBhdXRvUm90YXRlOiBmYWxzZSxcbiAgICAgICAgcm90YXRlOiAwLFxuICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgICAgYW5pbWF0aW9uRW5kOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNQYWdlU2hvd2luZykge1xuICAgICAgICAgICAgbW92ZUNhcigpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxhdGl0dWRlJzogbm93TGEsXG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxvbmdpdHVkZSc6IG5vd0xvLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1vdmVDYXIoKVxuICB9XG59KVxuIl19