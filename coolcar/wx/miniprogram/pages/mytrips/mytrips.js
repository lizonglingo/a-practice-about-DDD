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
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular: true,
        current: '0',
        promotionItems: [
            {
                img: 'https://img3.mukewang.com/620c5c810001d1f417920764.jpg',
                promotionID: '1',
            },
            {
                img: 'https://img2.mukewang.com/6216fef5000134df17920764.jpg',
                promotionID: '2',
            },
            {
                img: 'https://img4.mukewang.com/62184a9e00011dbd17920764.jpg',
                promotionID: '3',
            },
            {
                img: 'https://img3.mukewang.com/62187adc0001030417920764.jpg',
                promotionID: '4',
            },
            {
                img: 'https://img.mukewang.com/6218389d0001e43e17920764.jpg',
                promotionID: '5',
            },
        ],
        avatarURL: '',
        trips: [],
    },
    onLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            this.populateTrips();
            const userInfo = yield getApp().globalData.userInfo;
            this.setData({
                avatarURL: userInfo.avatarUrl,
            });
        });
    },
    populateTrips() {
        const trips = [];
        for (let i = 0; i < 100; i++) {
            trips.push({
                id: (10001 + i).toString(),
                start: '长桥',
                end: '宿舍',
                distance: '2.4公里',
                duration: '0时12分钟',
                fee: '5.2元'
            });
        }
        this.setData({
            trips: trips,
        });
    },
    onSwiperChange(e) {
        console.log(e);
    },
    onPromotionItemTap(e) {
        console.log(e);
    },
    onRegisterTap() {
        wx.navigateTo({
            url: routing_1.routing.register(),
        });
    },
    onGetUserInfo(e) {
        const userInfo = e.detail.userInfo;
        if (userInfo) {
            getApp().resolveUserInfo(userInfo);
            this.setData({
                avatarURL: userInfo.avatarUrl,
            });
        }
    },
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXl0cmlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15dHJpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxpREFBNkM7QUFXN0MsSUFBSSxDQUFDO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsYUFBYSxFQUFFLElBQUk7UUFDbkIsUUFBUSxFQUFFLEtBQUs7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxHQUFHO1FBQ1osY0FBYyxFQUFFO1lBQ1o7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsd0RBQXdEO2dCQUM3RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtZQUNEO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsdURBQXVEO2dCQUM1RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtTQUNKO1FBQ0QsU0FBUyxFQUFFLEVBQUU7UUFDYixLQUFLLEVBQUUsRUFBYTtLQUN2QjtJQUNLLE1BQU07O1lBQ1IsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFBO1lBQ3BCLE1BQU0sUUFBUSxHQUFHLE1BQU0sTUFBTSxFQUFjLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQTtZQUMvRCxJQUFJLENBQUMsT0FBTyxDQUFDO2dCQUNULFNBQVMsRUFBRSxRQUFRLENBQUMsU0FBUzthQUNoQyxDQUFDLENBQUE7UUFDTixDQUFDO0tBQUE7SUFFRCxhQUFhO1FBQ1QsTUFBTSxLQUFLLEdBQVcsRUFBRSxDQUFBO1FBQ3hCLEtBQUssSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFFLENBQUMsR0FBQyxHQUFHLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDdEIsS0FBSyxDQUFDLElBQUksQ0FBQztnQkFDUCxFQUFFLEVBQUUsQ0FBQyxLQUFLLEdBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFO2dCQUN4QixLQUFLLEVBQUUsSUFBSTtnQkFDWCxHQUFHLEVBQUUsSUFBSTtnQkFDVCxRQUFRLEVBQUUsT0FBTztnQkFDakIsUUFBUSxFQUFFLFFBQVE7Z0JBQ2xCLEdBQUcsRUFBRSxNQUFNO2FBQ2QsQ0FBQyxDQUFBO1NBQ0w7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsS0FBSyxFQUFFLEtBQUs7U0FDZixDQUFDLENBQUE7SUFDTixDQUFDO0lBRUQsY0FBYyxDQUFDLENBQU07UUFDakIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNsQixDQUFDO0lBRUQsa0JBQWtCLENBQUMsQ0FBTTtRQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2xCLENBQUM7SUFFRCxhQUFhO1FBQ1QsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUVWLEdBQUcsRUFBRSxpQkFBTyxDQUFDLFFBQVEsRUFBRTtTQUMxQixDQUFDLENBQUE7SUFDTixDQUFDO0lBQ0QsYUFBYSxDQUFDLENBQU07UUFDaEIsTUFBTSxRQUFRLEdBQStCLENBQUMsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFBO1FBQzlELElBQUksUUFBUSxFQUFFO1lBQ1YsTUFBTSxFQUFjLENBQUMsZUFBZSxDQUFDLFFBQVEsQ0FBQyxDQUFBO1lBQzlDLElBQUksQ0FBQyxPQUFPLENBQUM7Z0JBQ1QsU0FBUyxFQUFFLFFBQVEsQ0FBQyxTQUFTO2FBQ2hDLENBQUMsQ0FBQTtTQUNMO0lBRUwsQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJvdXRpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcm91dGluZ1wiXHJcblxyXG5pbnRlcmZhY2UgVHJpcCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICBzdGFydDogc3RyaW5nXHJcbiAgICBlbmQ6IHN0cmluZ1xyXG4gICAgZHVyYXRpb246IHN0cmluZ1xyXG4gICAgZmVlOiBzdHJpbmdcclxuICAgIGRpc3RhbmNlOiBzdHJpbmdcclxufVxyXG5cclxuUGFnZSh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgaW50ZXJ2YWw6IDMwMDAsXHJcbiAgICAgICAgZHVyYXRpb246IDUwMCxcclxuICAgICAgICBjaXJjdWxhcjogdHJ1ZSxcclxuICAgICAgICBjdXJyZW50OiAnMCcsXHJcbiAgICAgICAgcHJvbW90aW9uSXRlbXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjBjNWM4MTAwMDFkMWY0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnMScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nMi5tdWtld2FuZy5jb20vNjIxNmZlZjUwMDAxMzRkZjE3OTIwNzY0LmpwZycsXHJcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb25JRDogJzInLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzQubXVrZXdhbmcuY29tLzYyMTg0YTllMDAwMTFkYmQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICczJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjE4N2FkYzAwMDEwMzA0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nLm11a2V3YW5nLmNvbS82MjE4Mzg5ZDAwMDFlNDNlMTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxyXG4gICAgICAgIHRyaXBzOiBbXSBhcyBUcmlwIFtdLFxyXG4gICAgfSxcclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLnBvcHVsYXRlVHJpcHMoKVxyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0QXBwPElBcHBPcHRpb24+KCkuZ2xvYmFsRGF0YS51c2VySW5mb1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIHBvcHVsYXRlVHJpcHMoKXtcclxuICAgICAgICBjb25zdCB0cmlwczogVHJpcFtdID0gW11cclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTAwOyBpKyspIHtcclxuICAgICAgICAgICAgdHJpcHMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogKDEwMDAxK2kpLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBzdGFydDogJ+mVv+ahpScsXHJcbiAgICAgICAgICAgICAgICBlbmQ6ICflrr/oiI0nLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6ICcyLjTlhazph4wnLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246ICcw5pe2MTLliIbpkp8nLFxyXG4gICAgICAgICAgICAgICAgZmVlOiAnNS4y5YWDJ1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICB0cmlwczogdHJpcHMsXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgb25Td2lwZXJDaGFuZ2UoZTogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgIH0sXHJcblxyXG4gICAgb25Qcm9tb3Rpb25JdGVtVGFwKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUmVnaXN0ZXJUYXAoKSB7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgIC8vIHVybDogJy9wYWdlcy9yZWdpc3Rlci9yZWdpc3RlcicsXHJcbiAgICAgICAgICAgIHVybDogcm91dGluZy5yZWdpc3RlcigpLFxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgb25HZXRVc2VySW5mbyhlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB1c2VySW5mbzogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8gPSBlLmRldGFpbC51c2VySW5mb1xyXG4gICAgICAgIGlmICh1c2VySW5mbykge1xyXG4gICAgICAgICAgICBnZXRBcHA8SUFwcE9wdGlvbj4oKS5yZXNvbHZlVXNlckluZm8odXNlckluZm8pXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxufSkiXX0=