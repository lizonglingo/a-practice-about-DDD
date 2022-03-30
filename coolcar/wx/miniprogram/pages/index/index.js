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
            this.socket = wx.connectSocket({
                url: 'ws://localhost:9090/ws'
            });
            let msgReceived = 0;
            this.socket.onMessage(msg => {
                msgReceived++;
                console.log(msg);
            });
            setInterval(() => {
                var _a;
                (_a = this.socket) === null || _a === void 0 ? void 0 : _a.send({
                    data: JSON.stringify({
                        msg_received: msgReceived,
                    })
                });
            }, 3000);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLG1EQUFzRDtBQUN0RCx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELGlEQUE2QztBQUU3QyxJQUFJLENBQUM7SUFDSCxhQUFhLEVBQUUsS0FBSztJQUNwQixNQUFNLEVBQUUsU0FBcUQ7SUFDN0QsSUFBSSxFQUFFO1FBQ0osU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU0sRUFBRSxDQUFDO1lBQ1QsWUFBWSxFQUFFLElBQUk7WUFDbEIsU0FBUyxFQUFFLElBQUk7WUFDZixNQUFNLEVBQUUsRUFBRTtZQUNWLFVBQVUsRUFBRSxDQUFDO1lBQ2IsVUFBVSxFQUFFLElBQUk7WUFDaEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsUUFBUSxFQUFFLEtBQUs7WUFDZixpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGFBQWEsRUFBRSxLQUFLO1NBQ3JCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLEtBQUs7WUFDZixTQUFTLEVBQUUsTUFBTTtTQUNsQjtRQUNELEtBQUssRUFBRSxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sRUFBRSxFQUFFO2FBQ1g7WUFDRDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxF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Q3RDLE1BQU0sSUFBSSxHQUFHO1lBQ1gsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7WUFDdkMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDMUMsQ0FBQTtRQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNuQixJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQTtZQUNwQixJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQTtZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO1lBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7WUFFMUIsR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDbEIsV0FBVyxFQUFFO29CQUNYLFFBQVEsRUFBRSxLQUFLO29CQUNmLFNBQVMsRUFBRSxLQUFLO2lCQUNqQjtnQkFDRCxRQUFRLEVBQUUsQ0FBQztnQkFDWCxVQUFVLEVBQUUsS0FBSztnQkFDakIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsWUFBWSxFQUFFLEdBQUcsRUFBRTtvQkFDakIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUN0QixPQUFPLEVBQUUsQ0FBQTtxQkFDVjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUNYLHFCQUFxQixFQUFFLEtBQUs7NEJBQzVCLHNCQUFzQixFQUFFLEtBQUs7eUJBQzlCLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBO1FBRUQsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUFwcE9wdGlvbiB9IGZyb20gXCIuLi8uLi9hcHBvcHRpb25cIlxuaW1wb3J0IHsgUHJvZmlsZVNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS9wcm9maWxlXCJcbmltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCJcbmltcG9ydCB7IFRyaXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvdHJpcFwiXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxuXG5QYWdlKHtcbiAgaXNQYWdlU2hvd2luZzogZmFsc2UsXG4gIHNvY2tldDogdW5kZWZpbmVkIGFzIFdlY2hhdE1pbmlwcm9ncmFtLlNvY2tldFRhc2sgfCB1bmRlZmluZWQsXG4gIGRhdGE6IHtcbiAgICBhdmF0YXJVUkw6ICcnLFxuICAgIHNldHRpbmc6IHtcbiAgICAgIHNrZXc6IDAsXG4gICAgICByb3RhdGU6IDAsXG4gICAgICBzaG93TG9jYXRpb246IHRydWUsXG4gICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICBzdWJLZXk6ICcnLFxuICAgICAgbGF5ZXJTdHlsZTogMSxcbiAgICAgIGVuYWJsZVpvb206IHRydWUsXG4gICAgICBlbmFibGVTY3JvbGw6IHRydWUsXG4gICAgICBlbmFibGVSb3RhdGU6IGZhbHNlLFxuICAgICAgc2hvd0NvbXBhc3M6IGZhbHNlLFxuICAgICAgZW5hYmxlM0Q6IGZhbHNlLFxuICAgICAgZW5hYmxlT3Zlcmxvb2tpbmc6IGZhbHNlLFxuICAgICAgZW5hYmxlU2F0ZWxsaXRlOiBmYWxzZSxcbiAgICAgIGVuYWJsZVRyYWZmaWM6IGZhbHNlLFxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgIH0sXG4gICAgc2NhbGU6IDEwLFxuICAgIG1hcmtlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAwLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTQuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAgYXN5bmMgb25Mb2FkKCkge1xuXG4gICAgLy8gdGVzdCB3ZWJzb2NrZXRcbiAgICB0aGlzLnNvY2tldCA9IHd4LmNvbm5lY3RTb2NrZXQoe1xuICAgICAgdXJsOiAnd3M6Ly9sb2NhbGhvc3Q6OTA5MC93cydcbiAgICB9KVxuXG4gICAgbGV0IG1zZ1JlY2VpdmVkID0gMFxuICAgIHRoaXMuc29ja2V0Lm9uTWVzc2FnZShtc2cgPT4ge1xuICAgICAgbXNnUmVjZWl2ZWQrK1xuICAgICAgY29uc29sZS5sb2cobXNnKVxuICAgIH0pXG4gICAgXG4gICAgc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgdGhpcy5zb2NrZXQ/LnNlbmQoe1xuICAgICAgICBkYXRhOiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgbXNnX3JlY2VpdmVkOiBtc2dSZWNlaXZlZCxcbiAgICAgICAgfSlcbiAgICAgIH0pXG4gICAgfSwgMzAwMClcblxuICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0QXBwPElBcHBPcHRpb24+KCkuZ2xvYmFsRGF0YS51c2VySW5mb1xuICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcbiAgICB9KVxuICB9LFxuXG4gIGFzeW5jIG9uU2NhblRhcCgpIHtcbiAgICAvLyDmiavnoIHkuYvliY3nu5nkuojkv53miqQg6YG/5YWN5Zyo6KGM56iL5Lit5Yib5bu65paw55qE6KGM56iLXG4gICAgY29uc3QgdHJpcHMgPSBhd2FpdCBUcmlwU2VydmljZS5nZXRUcmlwcyhyZW50YWwudjEuVHJpcFN0YXR1cy5JTl9QUk9HUkVTUylcbiAgICBsZXQgZG9TY2FuQ29kZSA9IGZhbHNlICAvLyDpmZDliLblnKjlvLnlh7pNb2RhbOaYr+W8ueWHuuaJq+eggeeVjOmdolxuICAgIGlmICgodHJpcHMudHJpcHM/Lmxlbmd0aCB8fCAwKSA+IDApIHtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAn5pyJ5pyq57uT5p2f55qE6KGM56iLJyxcbiAgICAgICAgY29udGVudDogJ+Wwhui3s+i9rOiHs+ihjOeoi+mhtemdoicsXG4gICAgICAgIGNvbmZpcm1UZXh0OiBcIui3s+i9rFwiLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgICAgLy8g5aaC5p6c5bey57uP5pyJ6KGM56iLXG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgdXJsOiByb3V0aW5nLmRyaXZpbmcoe1xuICAgICAgICAgICAgICAgIHRyaXBfaWQ6IHRyaXBzLnRyaXBzIVswXS5pZCEsXG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgcmV0dXJuXG4gICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KVxuICAgICAgLy8gLy8g5aaC5p6c5bey57uP5pyJ6KGM56iLXG4gICAgICAvLyB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIC8vICAgdXJsOiByb3V0aW5nLmRyaXZpbmcoe1xuICAgICAgLy8gICAgIHRyaXBfaWQ6IHRyaXBzLnRyaXBzIVswXS5pZCEsXG4gICAgICAvLyAgIH0pXG4gICAgICAvLyB9KVxuICAgICAgLy8gcmV0dXJuXG4gICAgfSBlbHNlIHtcbiAgICAgIGRvU2NhbkNvZGUgPSB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGRvU2NhbkNvZGUpIHtcbiAgICAgIHd4LnNjYW5Db2RlKHtcbiAgICAgICAgc3VjY2VzczogYXN5bmMgKCkgPT4ge1xuICAgICAgICAgIC8vIOmmluWFiOafpeeci+aYr+WQpuW3sue7j+mAmui/h+i6q+S7veiupOecnyDnhLblkI7lhrPlrprmmK/lkKblvLnlh7rmqKHmgIHmoYZcbiAgICAgICAgICBjb25zdCBwcm9mID0gYXdhaXQgUHJvZmlsZVNlcnZpY2UuZ2V0UHJvZmlsZSgpXG4gICAgICAgICAgY29uc3QgY2FySUQgPSAnNjI0MDA4ODdmMDM2OTMzNTM2ZWRlMGQ5J1xuICAgICAgICAgIC8vIGNvbnN0IHJlZGlyZWN0VVJMOiBzdHJpbmcgPSBgL3BhZ2VzL2xvY2svbG9jaz9jYXJfaWQ9JHtjYXJJRH1gXG4gICAgICAgICAgY29uc3QgbG9ja1VSTDogc3RyaW5nID0gcm91dGluZy5sb2NrKHtcbiAgICAgICAgICAgIGNhcl9pZDogY2FySUQsXG4gICAgICAgICAgfSlcbiAgICAgICAgICBpZiAocHJvZi5pZGVudGl0eVN0YXR1cyA9PT0gcmVudGFsLnYxLklkZW50aXR5U3RhdHVzLlZFUklGSUVEKSB7XG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgdXJsOiBsb2NrVVJMLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICfouqvku73orqTor4EnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn6K6k6K+B5ZCO5pa55Y+v56ef6L2mJyxcbiAgICAgICAgICAgICAgc3VjY2VzczogKHJlcykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgICAgICAgICAgLy8gVE9ETzogZ2V0IGNhciBpZCBmcm9tIHNjYW4gcmVzdWx0XG5cbiAgICAgICAgICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgICAgICAgICAvLyB1cmw6IGAvcGFnZXMvcmVnaXN0ZXIvcmVnaXN0ZXI/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVUkwpfWAsXG4gICAgICAgICAgICAgICAgICAgIHVybDogcm91dGluZy5yZWdpc3Rlcih7XG4gICAgICAgICAgICAgICAgICAgICAgcmVkaXJlY3RVUkw6IGxvY2tVUkwsXG4gICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGZhaWw6IGNvbnNvbGUuZXJyb3IsXG4gICAgICB9KVxuICAgIH1cblxuICB9LFxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLmlzUGFnZVNob3dpbmcgPSB0cnVlXG4gIH0sXG4gIG9uSGlkZSgpIHtcbiAgICB0aGlzLmlzUGFnZVNob3dpbmcgPSBmYWxzZVxuICB9LFxuXG4gIG9uTXlUcmlwcygpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIC8vIHVybDogJy9wYWdlcy9teXRyaXBzL215dHJpcHMnLFxuICAgICAgdXJsOiByb3V0aW5nLm15dHJpcHMoKSxcbiAgICB9KVxuICB9LFxuXG4gIG9uTXlMb2NhdGlvblRhcCgpIHtcbiAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICB0eXBlOiAnZ2NqMDInLFxuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IHJlcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcmVzLmxvbmdpdHVkZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6ICgpID0+IHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgdGl0bGU6ICflpoLmnInpnIDopoHvvIzor7fliY3lvoDorr7nva7pobXmjojmnYPlhYHorrjorr/pl67mgqjnmoTkvY3nva4nLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIG1vdmVDYXJzKCkge1xuICAgIGNvbnN0IG1hcCA9IHd4LmNyZWF0ZU1hcENvbnRleHQoXCJtYXBcIilcbiAgICBjb25zdCBkZXN0ID0ge1xuICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxhdGl0dWRlLFxuICAgICAgbG9uZ2l0dWRlOiB0aGlzLmRhdGEubWFya2Vyc1swXS5sb25naXR1ZGUsXG4gICAgfVxuXG4gICAgY29uc3QgbW92ZUNhciA9ICgpID0+IHtcbiAgICAgIGRlc3QubGF0aXR1ZGUgKz0gMC4xXG4gICAgICBkZXN0LmxvbmdpdHVkZSArPSAwLjFcbiAgICAgIGxldCBub3dMYSA9IGRlc3QubGF0aXR1ZGVcbiAgICAgIGxldCBub3dMbyA9IGRlc3QubG9uZ2l0dWRlXG5cbiAgICAgIG1hcC50cmFuc2xhdGVNYXJrZXIoe1xuICAgICAgICBkZXN0aW5hdGlvbjoge1xuICAgICAgICAgIGxhdGl0dWRlOiBub3dMYSxcbiAgICAgICAgICBsb25naXR1ZGU6IG5vd0xvLFxuICAgICAgICB9LFxuICAgICAgICBtYXJrZXJJZDogMCxcbiAgICAgICAgYXV0b1JvdGF0ZTogZmFsc2UsXG4gICAgICAgIHJvdGF0ZTogMCxcbiAgICAgICAgZHVyYXRpb246IDUwMDAsXG4gICAgICAgIGFuaW1hdGlvbkVuZDogKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzUGFnZVNob3dpbmcpIHtcbiAgICAgICAgICAgIG1vdmVDYXIoKVxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgICAnbWFya2Vyc1swXS5sYXRpdHVkZSc6IG5vd0xhLFxuICAgICAgICAgICAgICAnbWFya2Vyc1swXS5sb25naXR1ZGUnOiBub3dMbyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlQ2FyKClcbiAgfVxufSlcbiJdfQ==