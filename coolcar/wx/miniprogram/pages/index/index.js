"use strict";
Page({
    isPageShowing: false,
    data: {
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
    onShow() {
        this.isPageShowing = true;
    },
    onHide() {
        this.isPageShowing = false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsSUFBSSxDQUFDO0lBQ0gsYUFBYSxFQUFFLEtBQUs7SUFDcEIsSUFBSSxFQUFFO1FBQ0osT0FBTyxFQUFFO1lBQ1AsSUFBSSxFQUFFLENBQUM7WUFDUCxNQUFNLEVBQUUsQ0FBQztZQUNULFlBQVksRUFBRSxJQUFJO1lBQ2xCLFNBQVMsRUFBRSxJQUFJO1lBQ2YsTUFBTSxFQUFFLEVBQUU7WUFDVixVQUFVLEVBQUUsQ0FBQztZQUNiLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLFlBQVksRUFBRSxLQUFLO1lBQ25CLFdBQVcsRUFBRSxLQUFLO1lBQ2xCLFFBQVEsRUFBRSxLQUFLO1lBQ2YsaUJBQWlCLEVBQUUsS0FBSztZQUN4QixlQUFlLEVBQUUsS0FBSztZQUN0QixhQUFhLEVBQUUsS0FBSztTQUNyQjtRQUNELFFBQVEsRUFBRTtZQUNSLFFBQVEsRUFBRSxLQUFLO1lBQ2YsU0FBUyxFQUFFLE1BQU07U0FDbEI7UUFDRCxLQUFLLEVBQUUsRUFBRTtRQUNULE9BQU8sRUFBRTtZQUNQO2dCQUNFLFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLEVBQUUsRUFBRSxDQUFDO2dCQUNMLFFBQVEsRUFBRSxLQUFLO2dCQUNmLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixLQUFLLEVBQUUsRUFBRTtnQkFDVCxNQUFNLEVBQUUsRUFBRTthQUNYO1lBQ0Q7Z0JBQ0UsUUFBUSxFQUFFLG9CQUFvQjtnQkFDOUIsRUFBRSxFQUFFLENBQUM7Z0JBQ0wsUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsU0FBUyxFQUFFLE1BQU07Z0JBQ2pCLEtBQUssRUFBRSxFQUFFO2dCQUNULE1BQU0sRUFBRSxFQUFFO2FBQ1g7U0FDRjtLQUNGO0lBRUQsTUFBTTtRQUNKLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFBO0lBQzNCLENBQUM7SUFDRCxNQUFNO1FBQ0osSUFBSSxDQUFDLGFBQWEsR0FBRyxLQUFLLENBQUE7SUFDNUIsQ0FBQztJQUVELGVBQWU7UUFDYixFQUFFLENBQUMsV0FBVyxDQUFDO1lBQ2IsSUFBSSxFQUFFLE9BQU87WUFDYixPQUFPLEVBQUUsR0FBRyxDQUFDLEVBQUU7Z0JBQ2IsSUFBSSxDQUFDLE9BQU8sQ0FBQztvQkFDWCxRQUFRLEVBQUU7d0JBQ1IsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRO3dCQUN0QixTQUFTLEVBQUUsR0FBRyxDQUFDLFNBQVM7cUJBQ3pCO2lCQUNGLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUNULEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ1gsSUFBSSxFQUFFLE1BQU07b0JBQ1osS0FBSyxFQUFFLHVCQUF1QjtpQkFDL0IsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDRCxRQUFRO1FBQ04sTUFBTSxHQUFHLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ3RDLE1BQU0sSUFBSSxHQUFHO1lBQ1gsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVE7WUFDdkMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVM7U0FDMUMsQ0FBQTtRQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsRUFBRTtZQUNuQixJQUFJLENBQUMsUUFBUSxJQUFJLEdBQUcsQ0FBQTtZQUNwQixJQUFJLENBQUMsU0FBUyxJQUFJLEdBQUcsQ0FBQTtZQUNyQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFBO1lBQ3pCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUE7WUFFMUIsR0FBRyxDQUFDLGVBQWUsQ0FBQztnQkFDbEIsV0FBVyxFQUFFO29CQUNYLFFBQVEsRUFBRSxLQUFLO29CQUNmLFNBQVMsRUFBRSxLQUFLO2lCQUNqQjtnQkFDRCxRQUFRLEVBQUUsQ0FBQztnQkFDWCxVQUFVLEVBQUUsS0FBSztnQkFDakIsTUFBTSxFQUFFLENBQUM7Z0JBQ1QsUUFBUSxFQUFFLElBQUk7Z0JBQ2QsWUFBWSxFQUFFLEdBQUcsRUFBRTtvQkFDakIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO3dCQUN0QixPQUFPLEVBQUUsQ0FBQTtxQkFDVjt5QkFBTTt3QkFDTCxJQUFJLENBQUMsT0FBTyxDQUFDOzRCQUNYLHFCQUFxQixFQUFFLEtBQUs7NEJBQzVCLHNCQUFzQixFQUFFLEtBQUs7eUJBQzlCLENBQUMsQ0FBQTtxQkFDSDtnQkFDSCxDQUFDO2FBQ0YsQ0FBQyxDQUFBO1FBQ0osQ0FBQyxDQUFBO1FBRUQsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0NBQ0YsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiUGFnZSh7XG4gIGlzUGFnZVNob3dpbmc6IGZhbHNlLFxuICBkYXRhOiB7XG4gICAgc2V0dGluZzoge1xuICAgICAgc2tldzogMCxcbiAgICAgIHJvdGF0ZTogMCxcbiAgICAgIHNob3dMb2NhdGlvbjogdHJ1ZSxcbiAgICAgIHNob3dTY2FsZTogdHJ1ZSxcbiAgICAgIHN1YktleTogJycsXG4gICAgICBsYXllclN0eWxlOiAxLFxuICAgICAgZW5hYmxlWm9vbTogdHJ1ZSxcbiAgICAgIGVuYWJsZVNjcm9sbDogdHJ1ZSxcbiAgICAgIGVuYWJsZVJvdGF0ZTogZmFsc2UsXG4gICAgICBzaG93Q29tcGFzczogZmFsc2UsXG4gICAgICBlbmFibGUzRDogZmFsc2UsXG4gICAgICBlbmFibGVPdmVybG9va2luZzogZmFsc2UsXG4gICAgICBlbmFibGVTYXRlbGxpdGU6IGZhbHNlLFxuICAgICAgZW5hYmxlVHJhZmZpYzogZmFsc2UsXG4gICAgfSxcbiAgICBsb2NhdGlvbjoge1xuICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgbG9uZ2l0dWRlOiAxMTMuMzIsXG4gICAgfSxcbiAgICBzY2FsZTogMTAsXG4gICAgbWFya2VyczogW1xuICAgICAge1xuICAgICAgICBpY29uUGF0aDogXCIvcmVzb3VyY2VzL2Nhci5wbmdcIixcbiAgICAgICAgaWQ6IDAsXG4gICAgICAgIGxhdGl0dWRlOiAyMy4wOSxcbiAgICAgICAgbG9uZ2l0dWRlOiAxMTMuMzIsXG4gICAgICAgIHdpZHRoOiAzMCxcbiAgICAgICAgaGVpZ2h0OiAzMCxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGljb25QYXRoOiBcIi9yZXNvdXJjZXMvY2FyLnBuZ1wiLFxuICAgICAgICBpZDogMSxcbiAgICAgICAgbGF0aXR1ZGU6IDIzLjA5LFxuICAgICAgICBsb25naXR1ZGU6IDExNC4zMixcbiAgICAgICAgd2lkdGg6IDMwLFxuICAgICAgICBoZWlnaHQ6IDMwLFxuICAgICAgfVxuICAgIF1cbiAgfSxcblxuICBvblNob3coKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gdHJ1ZVxuICB9LFxuICBvbkhpZGUoKSB7XG4gICAgdGhpcy5pc1BhZ2VTaG93aW5nID0gZmFsc2VcbiAgfSxcblxuICBvbk15TG9jYXRpb25UYXAoKSB7XG4gICAgd3guZ2V0TG9jYXRpb24oe1xuICAgICAgdHlwZTogJ2djajAyJyxcbiAgICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgbG9jYXRpb246IHtcbiAgICAgICAgICAgIGxhdGl0dWRlOiByZXMubGF0aXR1ZGUsXG4gICAgICAgICAgICBsb25naXR1ZGU6IHJlcy5sb25naXR1ZGUsXG4gICAgICAgICAgfSxcbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiAoKSA9PiB7XG4gICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgaWNvbjogJ25vbmUnLFxuICAgICAgICAgIHRpdGxlOiAn5aaC5pyJ6ZyA6KaB77yM6K+35YmN5b6A6K6+572u6aG15o6I5p2D5YWB6K646K6/6Zeu5oKo55qE5L2N572uJyxcbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KVxuICB9LFxuICBtb3ZlQ2FycygpIHtcbiAgICBjb25zdCBtYXAgPSB3eC5jcmVhdGVNYXBDb250ZXh0KFwibWFwXCIpXG4gICAgY29uc3QgZGVzdCA9IHtcbiAgICAgIGxhdGl0dWRlOiB0aGlzLmRhdGEubWFya2Vyc1swXS5sYXRpdHVkZSxcbiAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLm1hcmtlcnNbMF0ubG9uZ2l0dWRlLFxuICAgIH1cblxuICAgIGNvbnN0IG1vdmVDYXIgPSAoKSA9PiB7XG4gICAgICBkZXN0LmxhdGl0dWRlICs9IDAuMVxuICAgICAgZGVzdC5sb25naXR1ZGUgKz0gMC4xXG4gICAgICBsZXQgbm93TGEgPSBkZXN0LmxhdGl0dWRlXG4gICAgICBsZXQgbm93TG8gPSBkZXN0LmxvbmdpdHVkZVxuICAgICAgXG4gICAgICBtYXAudHJhbnNsYXRlTWFya2VyKHtcbiAgICAgICAgZGVzdGluYXRpb246IHtcbiAgICAgICAgICBsYXRpdHVkZTogbm93TGEsXG4gICAgICAgICAgbG9uZ2l0dWRlOiBub3dMbyxcbiAgICAgICAgfSxcbiAgICAgICAgbWFya2VySWQ6IDAsXG4gICAgICAgIGF1dG9Sb3RhdGU6IGZhbHNlLFxuICAgICAgICByb3RhdGU6IDAsXG4gICAgICAgIGR1cmF0aW9uOiA1MDAwLFxuICAgICAgICBhbmltYXRpb25FbmQ6ICgpID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5pc1BhZ2VTaG93aW5nKSB7XG4gICAgICAgICAgICBtb3ZlQ2FyKClcbiAgICAgICAgICB9IGVsc2UgeyBcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxhdGl0dWRlJzogbm93TGEsXG4gICAgICAgICAgICAgICdtYXJrZXJzWzBdLmxvbmdpdHVkZSc6IG5vd0xvLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICB9KVxuICAgIH1cblxuICAgIG1vdmVDYXIoKVxuICB9XG59KVxuIl19