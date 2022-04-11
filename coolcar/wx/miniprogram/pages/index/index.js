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
const defaultAvatar = "/resources/car.png";
const initailLat = 30;
const initialLng = 120;
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
            latitude: initailLat,
            longitude: initialLng,
        },
        scale: 10,
        markers: []
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
                        const carID = '624008016fb6dec1ea420df2';
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
        console.log("In onshow");
        if (!this.socket) {
            this.setData({
                markers: [],
            }, () => {
                this.setupCarPosUpdater();
            });
        }
    },
    onHide() {
        this.isPageShowing = false;
        if (this.socket) {
            this.socket.close({
                success: () => {
                    this.socket = undefined;
                }
            });
        }
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
    setupCarPosUpdater() {
        const map = wx.createMapContext("map");
        const markersByCarID = new Map();
        let translationInProgress = false;
        const endTranslation = () => {
            translationInProgress = false;
        };
        this.socket = car_1.CarService.subscribe(car => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
            if (!car.id || translationInProgress || !this.isPageShowing) {
                console.log("Dropped!");
                return;
            }
            const marker = markersByCarID.get(car.id);
            if (!marker) {
                console.log("create new marker");
                const newMarker = {
                    id: this.data.markers.length,
                    iconPath: ((_b = (_a = car.car) === null || _a === void 0 ? void 0 : _a.driver) === null || _b === void 0 ? void 0 : _b.avatarUrl) || defaultAvatar,
                    latitude: ((_d = (_c = car.car) === null || _c === void 0 ? void 0 : _c.position) === null || _d === void 0 ? void 0 : _d.latitude) || initailLat,
                    longitude: ((_f = (_e = car.car) === null || _e === void 0 ? void 0 : _e.position) === null || _f === void 0 ? void 0 : _f.longitude) || initialLng,
                    height: 20,
                    width: 20,
                };
                markersByCarID.set(car.id, newMarker);
                this.data.markers.push(newMarker);
                translationInProgress = true;
                this.setData({
                    markers: this.data.markers,
                }, endTranslation);
                return;
            }
            const newAvatar = ((_h = (_g = car.car) === null || _g === void 0 ? void 0 : _g.driver) === null || _h === void 0 ? void 0 : _h.avatarUrl) || defaultAvatar;
            const newLat = ((_k = (_j = car.car) === null || _j === void 0 ? void 0 : _j.position) === null || _k === void 0 ? void 0 : _k.latitude) || initailLat;
            const newLng = ((_m = (_l = car.car) === null || _l === void 0 ? void 0 : _l.position) === null || _m === void 0 ? void 0 : _m.longitude) || initialLng;
            if (marker.iconPath !== newAvatar) {
                console.log("change marker icon");
                marker.iconPath = newAvatar;
                marker.latitude = newLat;
                marker.longitude = newLng;
                translationInProgress = true;
                this.setData({
                    markers: this.data.markers
                }, endTranslation);
                return;
            }
            if (marker.latitude !== newLat || marker.longitude !== newLng) {
                translationInProgress = true;
                map.translateMarker({
                    markerId: marker.id,
                    destination: {
                        latitude: newLat,
                        longitude: newLng,
                    },
                    autoRotate: false,
                    rotate: 0,
                    duration: 90,
                    animationEnd: endTranslation,
                });
            }
        });
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLDJDQUE4QztBQUM5QyxtREFBc0Q7QUFDdEQsd0VBQWlFO0FBQ2pFLDZDQUFnRDtBQUNoRCxpREFBNkM7QUFpQjdDLE1BQU0sYUFBYSxHQUFHLG9CQUFvQixDQUFBO0FBQzFDLE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQTtBQUNyQixNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUE7QUFFdEIsSUFBSSxDQUFDO0lBQ0gsYUFBYSxFQUFFLEtBQUs7SUFDcEIsTUFBTSxFQUFFLFNBQXFEO0lBQzdELElBQUksRUFBRTtRQUNKLFNBQVMsRUFBRSxFQUFFO1FBQ2IsT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsQ0FBQztZQUNULFlBQVksRUFBRSxJQUFJO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixVQUFVLEVBQUUsQ0FBQztZQUNiLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFlBQVksRUFBRSxLQUFLO1lBQ25CLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixlQUFlLEVBQUUsS0FBSztZQUN0QixhQUFhLEVBQUUsS0FBSztTQUNyQjtRQUNELFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxVQUFVO1lBQ3BCLFNBQVMsRUFBRSxVQUFVO1NBQ3RCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUUsRUFBYztLQUN4QjtJQUVLLE1BQU07O1lBRVYsTUFBTSxRQUFRLEdBQUcsTUFBTSxNQUFNLEVBQWMsQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFBO1lBQy9ELElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1gsU0FBUyxFQUFFLFFBQVEsQ0FBQyxT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bnRlbnQiOlsiaW1wb3J0IHsgSUFwcE9wdGlvbiB9IGZyb20gXCIuLi8uLi9hcHBvcHRpb25cIlxuaW1wb3J0IHsgQ2FyU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL2NhclwiXG5pbXBvcnQgeyBQcm9maWxlU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb2ZpbGVcIlxuaW1wb3J0IHsgcmVudGFsIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvcHJvdG9fZ2VuL3JlbnRhbC9yZW50YWxfcGJcIlxuaW1wb3J0IHsgVHJpcFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS90cmlwXCJcbmltcG9ydCB7IHJvdXRpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcm91dGluZ1wiXG5cbmludGVyZmFjZSBNYXJrZXIge1xuICAgIC8vIGljb25QYXRoOiBcIi9yZXNvdXJjZXMvY2FyLnBuZ1wiLFxuICAgIC8vIGlkOiAwLFxuICAgIC8vIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAvLyBsb25naXR1ZGU6IDExMy4zMixcbiAgICAvLyB3aWR0aDogMzAsXG4gICAgLy8gaGVpZ2h0OiAzMCxcbiAgICBpY29uUGF0aDogc3RyaW5nLFxuICAgIGlkOiBudW1iZXIsXG4gICAgbGF0aXR1ZGU6IG51bWJlcixcbiAgICBsb25naXR1ZGU6IG51bWJlcixcbiAgICB3aWR0aDogbnVtYmVyLFxuICAgIGhlaWdodDogbnVtYmVyLFxufVxuXG5jb25zdCBkZWZhdWx0QXZhdGFyID0gXCIvcmVzb3VyY2VzL2Nhci5wbmdcIlxuY29uc3QgaW5pdGFpbExhdCA9IDMwXG5jb25zdCBpbml0aWFsTG5nID0gMTIwXG5cblBhZ2Uoe1xuICBpc1BhZ2VTaG93aW5nOiBmYWxzZSxcbiAgc29ja2V0OiB1bmRlZmluZWQgYXMgV2VjaGF0TWluaXByb2dyYW0uU29ja2V0VGFzayB8IHVuZGVmaW5lZCxcbiAgZGF0YToge1xuICAgIGF2YXRhclVSTDogJycsXG4gICAgc2V0dGluZzoge1xuICAgICAgc2tldzogMCxcbiAgICAgIHJvdGF0ZTogMCxcbiAgICAgIHNob3dMb2NhdGlvbjogdHJ1ZSxcbiAgICAgIHNob3dTY2FsZTogdHJ1ZSxcbiAgICAgIHN1YktleTogJycsXG4gICAgICBsYXllclN0eWxlOiAxLFxuICAgICAgZW5hYmxlWm9vbTogdHJ1ZSxcbiAgICAgIGVuYWJsZVNjcm9sbDogdHJ1ZSxcbiAgICAgIGVuYWJsZVJvdGF0ZTogZmFsc2UsXG4gICAgICBzaG93Q29tcGFzczogZmFsc2UsXG4gICAgICBlbmFibGUzRDogZmFsc2UsXG4gICAgICBlbmFibGVPdmVybG9va2luZzogZmFsc2UsXG4gICAgICBlbmFibGVTYXRlbGxpdGU6IGZhbHNlLFxuICAgICAgZW5hYmxlVHJhZmZpYzogZmFsc2UsXG4gICAgfSxcbiAgICBsb2NhdGlvbjoge1xuICAgICAgbGF0aXR1ZGU6IGluaXRhaWxMYXQsXG4gICAgICBsb25naXR1ZGU6IGluaXRpYWxMbmcsXG4gICAgfSxcbiAgICBzY2FsZTogMTAsXG4gICAgbWFya2VyczogW10gYXMgTWFya2VyW11cbiAgfSxcblxuICBhc3luYyBvbkxvYWQoKSB7XG4gICBcbiAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXG4gICAgfSlcbiAgfSxcblxuICBhc3luYyBvblNjYW5UYXAoKSB7XG4gICAgLy8g5omr56CB5LmL5YmN57uZ5LqI5L+d5oqkIOmBv+WFjeWcqOihjOeoi+S4reWIm+W7uuaWsOeahOihjOeoi1xuICAgIGNvbnN0IHRyaXBzID0gYXdhaXQgVHJpcFNlcnZpY2UuZ2V0VHJpcHMocmVudGFsLnYxLlRyaXBTdGF0dXMuSU5fUFJPR1JFU1MpXG4gICAgbGV0IGRvU2NhbkNvZGUgPSBmYWxzZSAgLy8g6ZmQ5Yi25Zyo5by55Ye6TW9kYWzmmK/lvLnlh7rmiavnoIHnlYzpnaJcbiAgICBpZiAoKHRyaXBzLnRyaXBzPy5sZW5ndGggfHwgMCkgPiAwKSB7XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJ+acieacque7k+adn+eahOihjOeoiycsXG4gICAgICAgIGNvbnRlbnQ6ICflsIbot7Povazoh7PooYznqIvpobXpnaInLFxuICAgICAgICBjb25maXJtVGV4dDogXCLot7PovaxcIixcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgIC8vIOWmguaenOW3sue7j+acieihjOeoi1xuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogcm91dGluZy5kcml2aW5nKHtcbiAgICAgICAgICAgICAgICB0cmlwX2lkOiB0cmlwcy50cmlwcyFbMF0uaWQhLFxuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIHJldHVyblxuICAgICAgICAgIH0gZWxzZSBpZiAocmVzLmNhbmNlbCkge1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSlcbiAgICAgIC8vIC8vIOWmguaenOW3sue7j+acieihjOeoi1xuICAgICAgLy8gd3gubmF2aWdhdGVUbyh7XG4gICAgICAvLyAgIHVybDogcm91dGluZy5kcml2aW5nKHtcbiAgICAgIC8vICAgICB0cmlwX2lkOiB0cmlwcy50cmlwcyFbMF0uaWQhLFxuICAgICAgLy8gICB9KVxuICAgICAgLy8gfSlcbiAgICAgIC8vIHJldHVyblxuICAgIH0gZWxzZSB7XG4gICAgICBkb1NjYW5Db2RlID0gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChkb1NjYW5Db2RlKSB7XG4gICAgICB3eC5zY2FuQ29kZSh7XG4gICAgICAgIHN1Y2Nlc3M6IGFzeW5jICgpID0+IHtcbiAgICAgICAgICAvLyDpppblhYjmn6XnnIvmmK/lkKblt7Lnu4/pgJrov4fouqvku73orqTnnJ8g54S25ZCO5Yaz5a6a5piv5ZCm5by55Ye65qih5oCB5qGGXG4gICAgICAgICAgY29uc3QgcHJvZiA9IGF3YWl0IFByb2ZpbGVTZXJ2aWNlLmdldFByb2ZpbGUoKVxuICAgICAgICAgIGNvbnN0IGNhcklEID0gJzYyNDAwODAxNmZiNmRlYzFlYTQyMGRmMidcbiAgICAgICAgICAvLyBjb25zdCByZWRpcmVjdFVSTDogc3RyaW5nID0gYC9wYWdlcy9sb2NrL2xvY2s/Y2FyX2lkPSR7Y2FySUR9YFxuICAgICAgICAgIGNvbnN0IGxvY2tVUkw6IHN0cmluZyA9IHJvdXRpbmcubG9jayh7XG4gICAgICAgICAgICBjYXJfaWQ6IGNhcklELFxuICAgICAgICAgIH0pXG4gICAgICAgICAgaWYgKHByb2YuaWRlbnRpdHlTdGF0dXMgPT09IHJlbnRhbC52MS5JZGVudGl0eVN0YXR1cy5WRVJJRklFRCkge1xuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogbG9ja1VSTCxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgIHRpdGxlOiAn6Lqr5Lu96K6k6K+BJyxcbiAgICAgICAgICAgICAgY29udGVudDogJ+iupOivgeWQjuaWueWPr+enn+i9picsXG4gICAgICAgICAgICAgIHN1Y2Nlc3M6IChyZXMpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgICAgIC8vIFRPRE86IGdldCBjYXIgaWQgZnJvbSBzY2FuIHJlc3VsdFxuXG4gICAgICAgICAgICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyP3JlZGlyZWN0PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VVJMKX1gLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcucmVnaXN0ZXIoe1xuICAgICAgICAgICAgICAgICAgICAgIHJlZGlyZWN0VVJMOiBsb2NrVVJMLFxuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxuICAgICAgfSlcbiAgICB9XG5cbiAgfSxcblxuICBvblNob3coKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gdHJ1ZVxuICAgIGNvbnNvbGUubG9nKFwiSW4gb25zaG93XCIpXG4gICAgaWYgKCF0aGlzLnNvY2tldCkge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgbWFya2VyczogW10sXG4gICAgICB9LCAoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0dXBDYXJQb3NVcGRhdGVyKClcbiAgICAgIH0pXG4gICAgfVxuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gZmFsc2VcbiAgICBpZiAodGhpcy5zb2NrZXQpIHtcbiAgICAgIHRoaXMuc29ja2V0LmNsb3NlKHtcbiAgICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICAgIHRoaXMuc29ja2V0ID0gdW5kZWZpbmVkXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9LFxuXG4gIG9uTXlUcmlwcygpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIC8vIHVybDogJy9wYWdlcy9teXRyaXBzL215dHJpcHMnLFxuICAgICAgdXJsOiByb3V0aW5nLm15dHJpcHMoKSxcbiAgICB9KVxuICB9LFxuXG4gIG9uTXlMb2NhdGlvblRhcCgpIHtcbiAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICB0eXBlOiAnZ2NqMDInLFxuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IHJlcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcmVzLmxvbmdpdHVkZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6ICgpID0+IHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgdGl0bGU6ICflpoLmnInpnIDopoHvvIzor7fliY3lvoDorr7nva7pobXmjojmnYPlhYHorrjorr/pl67mgqjnmoTkvY3nva4nLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgc2V0dXBDYXJQb3NVcGRhdGVyKCkge1xuICAgIGNvbnN0IG1hcCA9IHd4LmNyZWF0ZU1hcENvbnRleHQoXCJtYXBcIilcbiAgICAvLyDlsIZNYWtlcuWSjENhcklE6IGU57O76LW35p2lXG4gICAgY29uc3QgbWFya2Vyc0J5Q2FySUQgPSBuZXcgTWFwPHN0cmluZywgTWFya2VyPigpXG4gICAgbGV0IHRyYW5zbGF0aW9uSW5Qcm9ncmVzcyA9IGZhbHNlXG4gICAgY29uc3QgZW5kVHJhbnNsYXRpb24gPSAoKSA9PiB7XG4gICAgICB0cmFuc2xhdGlvbkluUHJvZ3Jlc3MgPSBmYWxzZVxuICAgIH1cbiAgICB0aGlzLnNvY2tldCA9IENhclNlcnZpY2Uuc3Vic2NyaWJlKGNhciA9PiB7XG4gICAgICBpZighY2FyLmlkIHx8IHRyYW5zbGF0aW9uSW5Qcm9ncmVzcyB8fCAhdGhpcy5pc1BhZ2VTaG93aW5nKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwiRHJvcHBlZCFcIilcbiAgICAgICAgcmV0dXJuXG4gICAgICB9XG4gICAgICBjb25zdCBtYXJrZXIgPSBtYXJrZXJzQnlDYXJJRC5nZXQoY2FyLmlkKVxuICAgICAgLy8gY29uc29sZS5sb2coXCJnZXQgY2FyIGlkXCIsIG1hcmtlcilcbiAgICAgIGlmICghbWFya2VyKSB7XG4gICAgICAgIC8vIOaWsOW7uuS4gOS4quaxvei9puWbvuagh1xuICAgICAgICBjb25zb2xlLmxvZyhcImNyZWF0ZSBuZXcgbWFya2VyXCIpXG4gICAgICAgIGNvbnN0IG5ld01hcmtlcjogTWFya2VyID0ge1xuICAgICAgICAgIGlkOiB0aGlzLmRhdGEubWFya2Vycy5sZW5ndGgsXG4gICAgICAgICAgaWNvblBhdGg6IGNhci5jYXI/LmRyaXZlcj8uYXZhdGFyVXJsIHx8IGRlZmF1bHRBdmF0YXIsXG4gICAgICAgICAgbGF0aXR1ZGU6IGNhci5jYXI/LnBvc2l0aW9uPy5sYXRpdHVkZSB8fCBpbml0YWlsTGF0LFxuICAgICAgICAgIGxvbmdpdHVkZTogY2FyLmNhcj8ucG9zaXRpb24/LmxvbmdpdHVkZSB8fCBpbml0aWFsTG5nLFxuICAgICAgICAgIGhlaWdodDogMjAsXG4gICAgICAgICAgd2lkdGg6IDIwLFxuICAgICAgICB9XG4gICAgICAgIG1hcmtlcnNCeUNhcklELnNldChjYXIuaWQsIG5ld01hcmtlcilcbiAgICAgICAgdGhpcy5kYXRhLm1hcmtlcnMucHVzaChuZXdNYXJrZXIpXG4gICAgICAgIHRyYW5zbGF0aW9uSW5Qcm9ncmVzcyA9IHRydWUgXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbWFya2VyczogdGhpcy5kYXRhLm1hcmtlcnMsXG4gICAgICAgIH0sIGVuZFRyYW5zbGF0aW9uKVxuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIFxuICAgICAgY29uc3QgbmV3QXZhdGFyID0gY2FyLmNhcj8uZHJpdmVyPy5hdmF0YXJVcmwgfHwgZGVmYXVsdEF2YXRhclxuICAgICAgY29uc3QgbmV3TGF0ID0gY2FyLmNhcj8ucG9zaXRpb24/LmxhdGl0dWRlIHx8IGluaXRhaWxMYXRcbiAgICAgIGNvbnN0IG5ld0xuZyA9IGNhci5jYXI/LnBvc2l0aW9uPy5sb25naXR1ZGUgfHwgaW5pdGlhbExuZ1xuXG4gICAgICBpZiAobWFya2VyLmljb25QYXRoICE9PSBuZXdBdmF0YXIpIHtcbiAgICAgICAgLy8g5aaC5p6c5aS05YOP5o2i5LqGXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY2hhbmdlIG1hcmtlciBpY29uXCIpXG4gICAgICAgIG1hcmtlci5pY29uUGF0aCA9IG5ld0F2YXRhclxuICAgICAgICBtYXJrZXIubGF0aXR1ZGUgPSBuZXdMYXRcbiAgICAgICAgbWFya2VyLmxvbmdpdHVkZSA9IG5ld0xuZ1xuICAgICAgICB0cmFuc2xhdGlvbkluUHJvZ3Jlc3MgPSB0cnVlXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbWFya2VyczogdGhpcy5kYXRhLm1hcmtlcnNcbiAgICAgICAgfSwgZW5kVHJhbnNsYXRpb24pXG4gICAgICAgIHJldHVyblxuICAgICAgfVxuXG4gICAgICBpZiAobWFya2VyLmxhdGl0dWRlICE9PSBuZXdMYXQgfHwgbWFya2VyLmxvbmdpdHVkZSAhPT0gbmV3TG5nKSB7XG4gICAgICAgIC8vIOi/m+ihjOenu+WKqFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcIm1vdmUgbWFya2VyXCIpXG4gICAgICAgIHRyYW5zbGF0aW9uSW5Qcm9ncmVzcyA9IHRydWVcbiAgICAgICAgbWFwLnRyYW5zbGF0ZU1hcmtlcih7XG4gICAgICAgICAgbWFya2VySWQ6IG1hcmtlci5pZCxcbiAgICAgICAgICBkZXN0aW5hdGlvbjoge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IG5ld0xhdCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogbmV3TG5nLFxuICAgICAgICAgIH0sXG4gICAgICAgICAgYXV0b1JvdGF0ZTogZmFsc2UsXG4gICAgICAgICAgcm90YXRlOiAwLFxuICAgICAgICAgIGR1cmF0aW9uOiA5MCxcbiAgICAgICAgICBhbmltYXRpb25FbmQ6IGVuZFRyYW5zbGF0aW9uLCAgIC8vIOeUqOadpeaOp+WItuWKqOeUu+e7k+adn1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG5cbiAgLy8gbW92ZUNhcnMoKSB7XG4gIC8vICAgY29uc3QgbWFwID0gd3guY3JlYXRlTWFwQ29udGV4dChcIm1hcFwiKVxuICAvLyAgIGNvbnN0IGRlc3QgPSB7XG4gIC8vICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubGF0aXR1ZGUsXG4gIC8vICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxvbmdpdHVkZSxcbiAgLy8gICB9XG5cbiAgLy8gICBjb25zdCBtb3ZlQ2FyID0gKCkgPT4ge1xuICAvLyAgICAgZGVzdC5sYXRpdHVkZSArPSAwLjFcbiAgLy8gICAgIGRlc3QubG9uZ2l0dWRlICs9IDAuMVxuICAvLyAgICAgbGV0IG5vd0xhID0gZGVzdC5sYXRpdHVkZVxuICAvLyAgICAgbGV0IG5vd0xvID0gZGVzdC5sb25naXR1ZGVcblxuICAvLyAgICAgbWFwLnRyYW5zbGF0ZU1hcmtlcih7XG4gIC8vICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gIC8vICAgICAgICAgbGF0aXR1ZGU6IG5vd0xhLFxuICAvLyAgICAgICAgIGxvbmdpdHVkZTogbm93TG8sXG4gIC8vICAgICAgIH0sXG4gIC8vICAgICAgIG1hcmtlcklkOiAwLFxuICAvLyAgICAgICBhdXRvUm90YXRlOiBmYWxzZSxcbiAgLy8gICAgICAgcm90YXRlOiAwLFxuICAvLyAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgLy8gICAgICAgYW5pbWF0aW9uRW5kOiAoKSA9PiB7XG4gIC8vICAgICAgICAgaWYgKHRoaXMuaXNQYWdlU2hvd2luZykge1xuICAvLyAgICAgICAgICAgbW92ZUNhcigpXG4gIC8vICAgICAgICAgfSBlbHNlIHtcbiAgLy8gICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gIC8vICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxhdGl0dWRlJzogbm93TGEsXG4gIC8vICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxvbmdpdHVkZSc6IG5vd0xvLFxuICAvLyAgICAgICAgICAgfSlcbiAgLy8gICAgICAgICB9XG4gIC8vICAgICAgIH0sXG4gIC8vICAgICB9KVxuICAvLyAgIH1cblxuICAvLyAgIG1vdmVDYXIoKVxuICAvLyB9XG59KVxuIl19