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
                const carID = 'car123';
                const redirectURL = routing_1.routing.lock({
                    car_id: carID,
                });
                wx.navigateTo({
                    url: routing_1.routing.register({
                        redirectURL: redirectURL,
                    })
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBLGlEQUE2QztBQUU3QyxJQUFJLENBQUM7SUFDSCxhQUFhLEVBQUUsS0FBSztJQUNwQixJQUFJLEVBQUU7UUFDSixTQUFTLEVBQUUsRUFBRTtRQUNiLE9BQU8sRUFBRTtZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLENBQUM7WUFDVCxZQUFZLEVBQUUsSUFBSTtZQUNsQixTQUFTLEVBQUUsSUFBSTtZQUNmLE1BQU0sRUFBRSxFQUFFO1lBQ1YsVUFBVSxFQUFFLENBQUM7WUFDYixVQUFVLEVBQUUsSUFBSTtZQUNoQixZQUFZLEVBQUUsSUFBSTtZQUNsQixZQUFZLEVBQUUsS0FBSztZQUNuQixXQUFXLEVBQUUsS0FBSztZQUNsQixRQUFRLEVBQUUsS0FBSztZQUNmLGlCQUFpQixFQUFFLEtBQUs7WUFDeEIsZUFBZSxFQUFFLEtBQUs7WUFDdEIsYUFBYSxFQUFFLEtBQUs7U0FDckI7UUFDRCxRQUFRLEVBQUU7WUFDUixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxNQUFNO1NBQ2xCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUU7WUFDUDtnQkFDRSxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixFQUFFLEVBQUUsQ0FBQztnQkFDTCxRQUFRLEVBQUUsS0FBSztnQkFDZixTQUFTLEVBQUUsTUFBTTtnQkFDakIsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsTUFBTSxFQUFFLEVBQUU7YUFDWDtZQUNEO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTthQUNYO1NBQ0Y7S0FDRjtJQUVLLE1BQU07O1lBQ1Ys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S0FBSzs0QkFDNUIsc0JBQXNCLEVBQUUsS0FBSzt5QkFDOUIsQ0FBQyxDQUFBO3FCQUNIO2dCQUNILENBQUM7YUFDRixDQUFDLENBQUE7UUFDSixDQUFDLENBQUE7UUFFRCxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7Q0FDRixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxuXG5QYWdlKHtcbiAgaXNQYWdlU2hvd2luZzogZmFsc2UsXG4gIGRhdGE6IHtcbiAgICBhdmF0YXJVUkw6ICcnLFxuICAgIHNldHRpbmc6IHtcbiAgICAgIHNrZXc6IDAsXG4gICAgICByb3RhdGU6IDAsXG4gICAgICBzaG93TG9jYXRpb246IHRydWUsXG4gICAgICBzaG93U2NhbGU6IHRydWUsXG4gICAgICBzdWJLZXk6ICcnLFxuICAgICAgbGF5ZXJTdHlsZTogMSxcbiAgICAgIGVuYWJsZVpvb206IHRydWUsXG4gICAgICBlbmFibGVTY3JvbGw6IHRydWUsXG4gICAgICBlbmFibGVSb3RhdGU6IGZhbHNlLFxuICAgICAgc2hvd0NvbXBhc3M6IGZhbHNlLFxuICAgICAgZW5hYmxlM0Q6IGZhbHNlLFxuICAgICAgZW5hYmxlT3Zlcmxvb2tpbmc6IGZhbHNlLFxuICAgICAgZW5hYmxlU2F0ZWxsaXRlOiBmYWxzZSxcbiAgICAgIGVuYWJsZVRyYWZmaWM6IGZhbHNlLFxuICAgIH0sXG4gICAgbG9jYXRpb246IHtcbiAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgIH0sXG4gICAgc2NhbGU6IDEwLFxuICAgIG1hcmtlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgaWNvblBhdGg6IFwiL3Jlc291cmNlcy9jYXIucG5nXCIsXG4gICAgICAgIGlkOiAwLFxuICAgICAgICBsYXRpdHVkZTogMjMuMDksXG4gICAgICAgIGxvbmdpdHVkZTogMTEzLjMyLFxuICAgICAgICB3aWR0aDogMzAsXG4gICAgICAgIGhlaWdodDogMzAsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDEsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTQuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH1cbiAgICBdXG4gIH0sXG5cbiAgYXN5bmMgb25Mb2FkKCl7XG4gICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBnZXRBcHA8SUFwcE9wdGlvbj4oKS5nbG9iYWxEYXRhLnVzZXJJbmZvXG4gICAgdGhpcy5zZXREYXRhKHtcbiAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxuICAgIH0pXG4gIH0sXG5cbiAgb25TY2FuVGFwKCkge1xuICAgIHd4LnNjYW5Db2RlKHtcbiAgICAgIHN1Y2Nlc3M6ICgpID0+e1xuICAgICAgICAvLyBUT0RPOiBnZXQgY2FyIGlkIGZyb20gc2NhbiByZXN1bHRcbiAgICAgICAgY29uc3QgY2FySUQgPSAnY2FyMTIzJ1xuICAgICAgICAvLyBjb25zdCByZWRpcmVjdFVSTDogc3RyaW5nID0gYC9wYWdlcy9sb2NrL2xvY2s/Y2FyX2lkPSR7Y2FySUR9YFxuICAgICAgICBjb25zdCByZWRpcmVjdFVSTDogc3RyaW5nID0gcm91dGluZy5sb2NrKHtcbiAgICAgICAgICBjYXJfaWQ6IGNhcklELFxuICAgICAgICB9KVxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgICAvLyB1cmw6IGAvcGFnZXMvcmVnaXN0ZXIvcmVnaXN0ZXI/cmVkaXJlY3Q9JHtlbmNvZGVVUklDb21wb25lbnQocmVkaXJlY3RVUkwpfWAsXG4gICAgICAgICAgdXJsOiByb3V0aW5nLnJlZ2lzdGVyKHtcbiAgICAgICAgICAgIHJlZGlyZWN0VVJMOiByZWRpcmVjdFVSTCxcbiAgICAgICAgICB9KVxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6IGNvbnNvbGUuZXJyb3IsXG4gICAgfSlcblxuICB9LFxuXG4gIG9uU2hvdygpIHtcbiAgICB0aGlzLmlzUGFnZVNob3dpbmcgPSB0cnVlXG4gIH0sXG4gIG9uSGlkZSgpIHtcbiAgICB0aGlzLmlzUGFnZVNob3dpbmcgPSBmYWxzZVxuICB9LFxuXG4gIG9uTXlUcmlwcygpIHtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIC8vIHVybDogJy9wYWdlcy9teXRyaXBzL215dHJpcHMnLFxuICAgICAgdXJsOiByb3V0aW5nLm15dHJpcHMoKSxcbiAgICB9KVxuICB9LFxuXG4gIG9uTXlMb2NhdGlvblRhcCgpIHtcbiAgICB3eC5nZXRMb2NhdGlvbih7XG4gICAgICB0eXBlOiAnZ2NqMDInLFxuICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICBsb2NhdGlvbjoge1xuICAgICAgICAgICAgbGF0aXR1ZGU6IHJlcy5sYXRpdHVkZSxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogcmVzLmxvbmdpdHVkZSxcbiAgICAgICAgICB9LFxuICAgICAgICB9KVxuICAgICAgfSxcbiAgICAgIGZhaWw6ICgpID0+IHtcbiAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAgICAgICBpY29uOiAnbm9uZScsXG4gICAgICAgICAgdGl0bGU6ICflpoLmnInpnIDopoHvvIzor7fliY3lvoDorr7nva7pobXmjojmnYPlhYHorrjorr/pl67mgqjnmoTkvY3nva4nLFxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pXG4gIH0sXG4gIG1vdmVDYXJzKCkge1xuICAgIGNvbnN0IG1hcCA9IHd4LmNyZWF0ZU1hcENvbnRleHQoXCJtYXBcIilcbiAgICBjb25zdCBkZXN0ID0ge1xuICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5tYXJrZXJzWzBdLmxhdGl0dWRlLFxuICAgICAgbG9uZ2l0dWRlOiB0aGlzLmRhdGEubWFya2Vyc1swXS5sb25naXR1ZGUsXG4gICAgfVxuXG4gICAgY29uc3QgbW92ZUNhciA9ICgpID0+IHtcbiAgICAgIGRlc3QubGF0aXR1ZGUgKz0gMC4xXG4gICAgICBkZXN0LmxvbmdpdHVkZSArPSAwLjFcbiAgICAgIGxldCBub3dMYSA9IGRlc3QubGF0aXR1ZGVcbiAgICAgIGxldCBub3dMbyA9IGRlc3QubG9uZ2l0dWRlXG4gICAgICBcbiAgICAgIG1hcC50cmFuc2xhdGVNYXJrZXIoe1xuICAgICAgICBkZXN0aW5hdGlvbjoge1xuICAgICAgICAgIGxhdGl0dWRlOiBub3dMYSxcbiAgICAgICAgICBsb25naXR1ZGU6IG5vd0xvLFxuICAgICAgICB9LFxuICAgICAgICBtYXJrZXJJZDogMCxcbiAgICAgICAgYXV0b1JvdGF0ZTogZmFsc2UsXG4gICAgICAgIHJvdGF0ZTogMCxcbiAgICAgICAgZHVyYXRpb246IDUwMDAsXG4gICAgICAgIGFuaW1hdGlvbkVuZDogKCkgPT4ge1xuICAgICAgICAgIGlmICh0aGlzLmlzUGFnZVNob3dpbmcpIHtcbiAgICAgICAgICAgIG1vdmVDYXIoKVxuICAgICAgICAgIH0gZWxzZSB7IFxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgICAgICAgJ21hcmtlcnNbMF0ubGF0aXR1ZGUnOiBub3dMYSxcbiAgICAgICAgICAgICAgJ21hcmtlcnNbMF0ubG9uZ2l0dWRlJzogbm93TG8sXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgIH0pXG4gICAgfVxuXG4gICAgbW92ZUNhcigpXG4gIH1cbn0pXG4iXX0=