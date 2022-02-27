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
    onScanTap() {
        wx.scanCode({
            success: () => {
                const carID = 'car123';
                const redirectURL = `/pages/lock/lock?car_id=${carID}`;
                wx.navigateTo({
                    url: `/pages/register/register?redirect=${encodeURIComponent(redirectURL)}`,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxDQUFDO0lBQ0gsYUFBYSxFQUFFLEtBQUs7SUFDcEIsSUFBSSxFQUFFO1FBQ0osU0FBUyxFQUFFLEVBQUU7UUFDYixPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQztZQUNQLE1BQU0sRUFBRSxDQUFDO1lBQ1QsWUFBWSxFQUFFLElBQUk7WUFDbEIsU0FBUyxFQUFFLElBQUk7WUFDZixNQUFNLEVBQUUsRUFBRTtZQUNWLFVBQVUsRUFBRSxDQUFDO1lBQ2IsVUFBVSxFQUFFLElBQUk7WUFDaEIsWUFBWSxFQUFFLElBQUk7WUFDbEIsWUFBWSxFQUFFLEtBQUs7WUFDbkIsV0FBVyxFQUFFLEtBQUs7WUFDbEIsUUFBUSxFQUFFLEtBQUs7WUFDZixpQkFBaUIsRUFBRSxLQUFLO1lBQ3hCLGVBQWUsRUFBRSxLQUFLO1lBQ3RCLGFBQWEsRUFBRSxLQUFLO1NBQ3JCO1FBQ0QsUUFBUSxFQUFFO1lBQ1IsUUFBUSxFQUFFLEtBQUs7WUFDZixTQUFTLEVBQUUsTUFBTTtTQUNsQjtRQUNELEtBQUssRUFBRSxFQUFFO1FBQ1QsT0FBTyxFQUFFO1lBQ1A7Z0JBQ0UsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sRUFBRSxFQUFFO2FBQ1g7WUFDRDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLEVBQUU7YUFDWDtTQUNGO0tBQ0Y7SUFFSyxNQUFNOztZQUNWLE1BQU0sUUFBUSxHQUFH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QUFDLENBQUE7UUFFRCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJQYWdlKHtcbiAgaXNQYWdlU2hvd2luZzogZmFsc2UsXG4gIGRhdGE6IHtcbiAgICBhdmF0YXJVUkw6ICcnLFxuICAgIHNldHRpbmc6IHtcbiAgICAgIHNrZXc6IDAsXG4gICAgICByb3RhdGU6IDAsXG4gICAgICBzaG93TG9jYXRpb246IHRydWUsXG4gICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICBzdWJLZXk6ICcnLFxuICAgICAgbGF5ZXJTdHlsZTogMSxcbiAgICAgIGVuYWJsZVpvb206IHRydWUsXG4gICAgICBlbmFibGVTY3JvbGw6IHRydWUsXG4gICAgICBlbmFibGVSb3RhdGU6IGZhbHNlLFxuICAgICAgc2hvd0NvbXBhc3M6IGZhbHNlLFxuICAgICAgZW5hYmxlM0Q6IGZhbHNlLFxuICAgICAgZW5hYmxlT3Zlcmxvb2tpbmc6IGZhbHNlLFxuICAgICAgZW5hYmxlU2F0ZWxsaXRlOiBmYWxzZSxcbiAgICAgIGVuYWJsZVRyYWZmaWM6IGZhbHNlLFxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgIH0sXG4gICAgc2NhbGU6IDEwLFxuICAgIG1hcmtlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAwLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTQuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAgYXN5bmMgb25Mb2FkKCl7XG4gICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBnZXRBcHA8SUFwcE9wdGlvbj4oKS5nbG9iYWxEYXRhLnVzZXJJbmZvXG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxuICAgIH0pXG4gIH0sXG5cbiAgb25TY2FuVGFwKCkge1xuICAgIHd4LnNjYW5Db2RlKHtcbiAgICAgIHN1Y2Nlc3M6ICgpID0+e1xuICAgICAgICAvLyBUT0RPOiBnZXQgY2FyIGlkIGZyb20gc2NhbiByZXN1bHRcbiAgICAgICAgY29uc3QgY2FySUQgPSAnY2FyMTIzJ1xuICAgICAgICBjb25zdCByZWRpcmVjdFVSTDogc3RyaW5nID0gYC9wYWdlcy9sb2NrL2xvY2s/Y2FyX2lkPSR7Y2FySUR9YFxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICB1cmw6IGAvcGFnZXMvcmVnaXN0ZXIvcmVnaXN0ZXI/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVUkwpfWAsXG4gICAgICAgIH0pXG4gICAgICB9LFxuICAgICAgZmFpbDogY29uc29sZS5lcnJvcixcbiAgICB9KVxuXG4gIH0sXG5cbiAgb25TaG93KCkge1xuICAgIHRoaXMuaXNQYWdlU2hvd2luZyA9IHRydWVcbiAgfSxcbiAgb25IaWRlKCkge1xuICAgIHRoaXMuaXNQYWdlU2hvd2luZyA9IGZhbHNlXG4gIH0sXG5cbiAgb25NeVRyaXBzKCkge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnL3BhZ2VzL215dHJpcHMvbXl0cmlwcycsXG4gICAgfSlcbiAgfSxcblxuICBvbk15TG9jYXRpb25UYXAoKSB7XG4gICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgdHlwZTogJ2djajAyJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiByZXMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgIHRpdGxlOiAn5aaC5pyJ6ZyA6KaB77yM6K+35YmN5b6A6K6+572u6aG15o6I5p2D5YWB6K646K6/6Zeu5oKo55qE5L2N572uJyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBtb3ZlQ2FycygpIHtcbiAgICBjb25zdCBtYXAgPSB3eC5jcmVhdGVNYXBDb250ZXh0KFwibWFwXCIpXG4gICAgY29uc3QgZGVzdCA9IHtcbiAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubWFya2Vyc1swXS5sYXRpdHVkZSxcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubG9uZ2l0dWRlLFxuICAgIH1cblxuICAgIGNvbnN0IG1vdmVDYXIgPSAoKSA9PiB7XG4gICAgICBkZXN0LmxhdGl0dWRlICs9IDAuMVxuICAgICAgZGVzdC5sb25naXR1ZGUgKz0gMC4xXG4gICAgICBsZXQgbm93TGEgPSBkZXN0LmxhdGl0dWRlXG4gICAgICBsZXQgbm93TG8gPSBkZXN0LmxvbmdpdHVkZVxuICAgICAgXG4gICAgICBtYXAudHJhbnNsYXRlTWFya2VyKHtcbiAgICAgICAgZGVzdGluYXRpb246IHtcbiAgICAgICAgICBsYXRpdHVkZTogbm93TGEsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBub3dMbyxcbiAgICAgICAgfSxcbiAgICAgICAgbWFya2VySWQ6IDAsXG4gICAgICAgIGF1dG9Sb3RhdGU6IGZhbHNlLFxuICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgIGR1cmF0aW9uOiA1MDAwLFxuICAgICAgICBhbmltYXRpb25FbmQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc1BhZ2VTaG93aW5nKSB7XG4gICAgICAgICAgICBtb3ZlQ2FyKClcbiAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxhdGl0dWRlJzogbm93TGEsXG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxvbmdpdHVkZSc6IG5vd0xvLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1vdmVDYXIoKVxuICB9XG59KVxuIl19