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
    onScanClicked() {
        wx.scanCode({
            success: () => {
                wx.navigateTo({
                    url: '/pages/register/register',
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
            url: '/pages/mytrips/mytrips',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxDQUFDO0lBQ0gsYUFBYSxFQUFFLEtBQUs7SUFDcEIsSUFBSSxFQUFFO1FBQ0osU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU0sRUFBRSxDQUFDO1lBQ1QsWUFBWSxFQUFFLElBQUk7WUFDbEIsU0FBUyxFQUFFLElBQUk7WUFDZixNQUFNLEVBQUUsRUFBRTtZQUNWLFVBQVUsRUFBRSxDQUFDO1lBQ2IsVUFBVSxFQUFFLElBQUk7WUFDaEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsUUFBUSxFQUFFLEtBQUs7WUFDZixpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGFBQWEsRUFBRSxLQUFLO1NBQ3JCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLEtBQUs7WUFDZixTQUFTLEVBQUUsTUFBTTtTQUNsQjtRQUNELEtBQUssRUFBRSxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sRUFBRSxFQUFFO2FBQ1g7WUFDRDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLEVBQUU7YUFDWDtTQUNGO0tBQ0Y7SUFFSyxNQUFNOztZQUNWLE1BQU0sUUFBUSxHQUFH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ZSxcbiAgZGF0YToge1xuICAgIGF2YXRhclVSTDogJycsXG4gICAgc2V0dGluZzoge1xuICAgICAgc2tldzogMCxcbiAgICAgIHJvdGF0ZTogMCxcbiAgICAgIHNob3dMb2NhdGlvbjogdHJ1ZSxcbiAgICAgIHNob3dTY2FsZTogdHJ1ZSxcbiAgICAgIHN1YktleTogJycsXG4gICAgICBsYXllclN0eWxlOiAxLFxuICAgICAgZW5hYmxlWm9vbTogdHJ1ZSxcbiAgICAgIGVuYWJsZVNjcm9sbDogdHJ1ZSxcbiAgICAgIGVuYWJsZVJvdGF0ZTogZmFsc2UsXG4gICAgICBzaG93Q29tcGFzczogZmFsc2UsXG4gICAgICBlbmFibGUzRDogZmFsc2UsXG4gICAgICBlbmFibGVPdmVybG9va2luZzogZmFsc2UsXG4gICAgICBlbmFibGVTYXRlbGxpdGU6IGZhbHNlLFxuICAgICAgZW5hYmxlVHJhZmZpYzogZmFsc2UsXG4gICAgfSxcbiAgICBsb2NhdGlvbjoge1xuICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgbG9uZ2l0dWRlOiAxMTMuMzIsXG4gICAgfSxcbiAgICBzY2FsZTogMTAsXG4gICAgbWFya2VyczogW1xuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTMuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb25QYXRoOiBcIi9yZXNvdXJjZXMvY2FyLnBuZ1wiLFxuICAgICAgICBpZDogMSxcbiAgICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgICBsb25naXR1ZGU6IDExNC4zMixcbiAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgfVxuICAgIF1cbiAgfSxcblxuICBhc3luYyBvbkxvYWQoKXtcbiAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cbiAgICB0aGlzLnNldERhdGEoe1xuICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXG4gICAgfSlcbiAgfSxcblxuICBvblNjYW5DbGlja2VkKCkge1xuICAgIHd4LnNjYW5Db2RlKHtcbiAgICAgIHN1Y2Nlc3M6ICgpID0+e1xuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICB1cmw6ICcvcGFnZXMvcmVnaXN0ZXIvcmVnaXN0ZXInLFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6IGNvbnNvbGUuZXJyb3IsXG4gICAgfSlcblxuICB9LFxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLmlzUGFnZVNob3dpbmcgPSB0cnVlXG4gIH0sXG4gIG9uSGlkZSgpIHtcbiAgICB0aGlzLmlzUGFnZVNob3dpbmcgPSBmYWxzZVxuICB9LFxuXG4gIG9uTXlUcmlwcygpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogJy9wYWdlcy9teXRyaXBzL215dHJpcHMnLFxuICAgIH0pXG4gIH0sXG5cbiAgb25NeUxvY2F0aW9uVGFwKCkge1xuICAgIHd4LmdldExvY2F0aW9uKHtcbiAgICAgIHR5cGU6ICdnY2owMicsXG4gICAgICBzdWNjZXNzOiByZXMgPT4ge1xuICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgIGxvY2F0aW9uOiB7XG4gICAgICAgICAgICBsYXRpdHVkZTogcmVzLmxhdGl0dWRlLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiByZXMubG9uZ2l0dWRlLFxuICAgICAgICAgIH0sXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogKCkgPT4ge1xuICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgICAgICAgIGljb246ICdub25lJyxcbiAgICAgICAgICB0aXRsZTogJ+WmguaciemcgOimge+8jOivt+WJjeW+gOiuvue9rumhteaOiOadg+WFgeiuuOiuv+mXruaCqOeahOS9jee9ricsXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgfSlcbiAgfSxcbiAgbW92ZUNhcnMoKSB7XG4gICAgY29uc3QgbWFwID0gd3guY3JlYXRlTWFwQ29udGV4dChcIm1hcFwiKVxuICAgIGNvbnN0IGRlc3QgPSB7XG4gICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubGF0aXR1ZGUsXG4gICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxvbmdpdHVkZSxcbiAgICB9XG5cbiAgICBjb25zdCBtb3ZlQ2FyID0gKCkgPT4ge1xuICAgICAgZGVzdC5sYXRpdHVkZSArPSAwLjFcbiAgICAgIGRlc3QubG9uZ2l0dWRlICs9IDAuMVxuICAgICAgbGV0IG5vd0xhID0gZGVzdC5sYXRpdHVkZVxuICAgICAgbGV0IG5vd0xvID0gZGVzdC5sb25naXR1ZGVcbiAgICAgIFxuICAgICAgbWFwLnRyYW5zbGF0ZU1hcmtlcih7XG4gICAgICAgIGRlc3RpbmF0aW9uOiB7XG4gICAgICAgICAgbGF0aXR1ZGU6IG5vd0xhLFxuICAgICAgICAgIGxvbmdpdHVkZTogbm93TG8sXG4gICAgICAgIH0sXG4gICAgICAgIG1hcmtlcklkOiAwLFxuICAgICAgICBhdXRvUm90YXRlOiBmYWxzZSxcbiAgICAgICAgcm90YXRlOiAwLFxuICAgICAgICBkdXJhdGlvbjogNTAwMCxcbiAgICAgICAgYW5pbWF0aW9uRW5kOiAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMuaXNQYWdlU2hvd2luZykge1xuICAgICAgICAgICAgbW92ZUNhcigpXG4gICAgICAgICAgfSBlbHNlIHsgXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xuICAgICAgICAgICAgICAnbWFya2Vyc1swXS5sYXRpdHVkZSc6IG5vd0xhLFxuICAgICAgICAgICAgICAnbWFya2Vyc1swXS5sb25naXR1ZGUnOiBub3dMbyxcbiAgICAgICAgICAgIH0pXG4gICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgfSlcbiAgICB9XG5cbiAgICBtb3ZlQ2FyKClcbiAgfVxufSlcbiJdfQ==