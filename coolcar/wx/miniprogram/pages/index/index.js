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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUNBLGlEQUE2QztBQUU3QyxJQUFJLENBQUM7SUFDSCxhQUFhLEVBQUUsS0FBSztJQUNwQixJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLENBQUM7WUFDVCxZQUFZLEVBQUUsSUFBSTtZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxFQUFFO1lBQ1YsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsSUFBSTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixXQUFXLEVBQUUsS0FBSztZQUNsQixRQUFRLEVBQUUsS0FBSztZQUNmLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsZUFBZSxFQUFFLEtBQUs7WUFDdEIsYUFBYSxFQUFFLEtBQUs7U0FDckI7UUFDRCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxNQUFNO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLEVBQUU7YUFDWDtZQUNEO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTthQUNYO1NBQ0Y7S0FDRjtJQUVLLE1BQU07O1lBQ1Ys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TSxFQUFFLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsWUFBWSxFQUFFLEdBQUcsRUFBRTtvQkFDakIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUN0QixPQUFPLEVBQUUsQ0FBQTtxQkFDVjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUNYLHFCQUFxQixFQUFFLEtBQUs7NEJBQzVCLHNCQUFzQixFQUFFLEtBQUs7eUJBQzlCLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBO1FBRUQsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSUFwcE9wdGlvbiB9IGZyb20gXCIuLi8uLi9hcHBvcHRpb25cIlxuaW1wb3J0IHsgcm91dGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9yb3V0aW5nXCJcblxuUGFnZSh7XG4gIGlzUGFnZVNob3dpbmc6IGZhbHNlLFxuICBkYXRhOiB7XG4gICAgYXZhdGFyVVJMOiAnJyxcbiAgICBzZXR0aW5nOiB7XG4gICAgICBza2V3OiAwLFxuICAgICAgcm90YXRlOiAwLFxuICAgICAgc2hvd0xvY2F0aW9uOiB0cnVlLFxuICAgICAgc2hvd1NjYWxlOiB0cnVlLFxuICAgICAgc3ViS2V5OiAnJyxcbiAgICAgIGxheWVyU3R5bGU6IDEsXG4gICAgICBlbmFibGVab29tOiB0cnVlLFxuICAgICAgZW5hYmxlU2Nyb2xsOiB0cnVlLFxuICAgICAgZW5hYmxlUm90YXRlOiBmYWxzZSxcbiAgICAgIHNob3dDb21wYXNzOiBmYWxzZSxcbiAgICAgIGVuYWJsZTNEOiBmYWxzZSxcbiAgICAgIGVuYWJsZU92ZXJsb29raW5nOiBmYWxzZSxcbiAgICAgIGVuYWJsZVNhdGVsbGl0ZTogZmFsc2UsXG4gICAgICBlbmFibGVUcmFmZmljOiBmYWxzZSxcbiAgICB9LFxuICAgIGxvY2F0aW9uOiB7XG4gICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICBsb25naXR1ZGU6IDExMy4zMixcbiAgICB9LFxuICAgIHNjYWxlOiAxMCxcbiAgICBtYXJrZXJzOiBbXG4gICAgICB7XG4gICAgICAgIGljb25QYXRoOiBcIi9yZXNvdXJjZXMvY2FyLnBuZ1wiLFxuICAgICAgICBpZDogMCxcbiAgICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgICBsb25naXR1ZGU6IDExMy4zMixcbiAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAxLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTE0LjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9XG4gICAgXVxuICB9LFxuXG4gIGFzeW5jIG9uTG9hZCgpIHtcbiAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXG4gICAgfSlcbiAgfSxcblxuICBvblNjYW5UYXAoKSB7XG4gICAgd3guc2NhbkNvZGUoe1xuICAgICAgc3VjY2VzczogKCkgPT4ge1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAn6Lqr5Lu96K6k6K+BJyxcbiAgICAgICAgICBjb250ZW50OiAn6K6k6K+B5ZCO5pa55Y+v56ef6L2mJyxcbiAgICAgICAgICBzdWNjZXNzOiAocmVzKSA9PiB7XG4gICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgLy8gVE9ETzogZ2V0IGNhciBpZCBmcm9tIHNjYW4gcmVzdWx0XG4gICAgICAgICAgICAgIGNvbnN0IGNhcklEID0gJ2NhcjEyMydcbiAgICAgICAgICAgICAgLy8gY29uc3QgcmVkaXJlY3RVUkw6IHN0cmluZyA9IGAvcGFnZXMvbG9jay9sb2NrP2Nhcl9pZD0ke2NhcklEfWBcbiAgICAgICAgICAgICAgY29uc3QgcmVkaXJlY3RVUkw6IHN0cmluZyA9IHJvdXRpbmcubG9jayh7XG4gICAgICAgICAgICAgICAgY2FyX2lkOiBjYXJJRCxcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgICAgLy8gdXJsOiBgL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyP3JlZGlyZWN0PSR7ZW5jb2RlVVJJQ29tcG9uZW50KHJlZGlyZWN0VVJMKX1gLFxuICAgICAgICAgICAgICAgIHVybDogcm91dGluZy5yZWdpc3Rlcih7XG4gICAgICAgICAgICAgICAgICByZWRpcmVjdFVSTDogcmVkaXJlY3RVUkwsXG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9LFxuXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogY29uc29sZS5lcnJvcixcbiAgICB9KVxuXG4gIH0sXG5cbiAgb25TaG93KCkge1xuICAgIHRoaXMuaXNQYWdlU2hvd2luZyA9IHRydWVcbiAgfSxcbiAgb25IaWRlKCkge1xuICAgIHRoaXMuaXNQYWdlU2hvd2luZyA9IGZhbHNlXG4gIH0sXG5cbiAgb25NeVRyaXBzKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgLy8gdXJsOiAnL3BhZ2VzL215dHJpcHMvbXl0cmlwcycsXG4gICAgICB1cmw6IHJvdXRpbmcubXl0cmlwcygpLFxuICAgIH0pXG4gIH0sXG5cbiAgb25NeUxvY2F0aW9uVGFwKCkge1xuICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgIHR5cGU6ICdnY2owMicsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXMubG9uZ2l0dWRlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICB0aXRsZTogJ+WmguaciemcgOimge+8jOivt+WJjeW+gOiuvue9rumhteaOiOadg+WFgeiuuOiuv+mXruaCqOeahOS9jee9ricsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgbW92ZUNhcnMoKSB7XG4gICAgY29uc3QgbWFwID0gd3guY3JlYXRlTWFwQ29udGV4dChcIm1hcFwiKVxuICAgIGNvbnN0IGRlc3QgPSB7XG4gICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubGF0aXR1ZGUsXG4gICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxvbmdpdHVkZSxcbiAgICB9XG5cbiAgICBjb25zdCBtb3ZlQ2FyID0gKCkgPT4ge1xuICAgICAgZGVzdC5sYXRpdHVkZSArPSAwLjFcbiAgICAgIGRlc3QubG9uZ2l0dWRlICs9IDAuMVxuICAgICAgbGV0IG5vd0xhID0gZGVzdC5sYXRpdHVkZVxuICAgICAgbGV0IG5vd0xvID0gZGVzdC5sb25naXR1ZGVcblxuICAgICAgbWFwLnRyYW5zbGF0ZU1hcmtlcih7XG4gICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgbGF0aXR1ZGU6IG5vd0xhLFxuICAgICAgICAgIGxvbmdpdHVkZTogbm93TG8sXG4gICAgICAgIH0sXG4gICAgICAgIG1hcmtlcklkOiAwLFxuICAgICAgICBhdXRvUm90YXRlOiBmYWxzZSxcbiAgICAgICAgcm90YXRlOiAwLFxuICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgICAgYW5pbWF0aW9uRW5kOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNQYWdlU2hvd2luZykge1xuICAgICAgICAgICAgbW92ZUNhcigpXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxhdGl0dWRlJzogbm93TGEsXG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxvbmdpdHVkZSc6IG5vd0xvLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1vdmVDYXIoKVxuICB9XG59KVxuIl19