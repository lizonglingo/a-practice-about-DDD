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
const rental_pb_1 = require("../../service/proto_gen/rental/rental_pb");
const trip_1 = require("../../service/trip");
const routing_1 = require("../../utils/routing");
Page({
    scrollStates: {
        mainItems: [],
    },
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
        tripsHeight: 0,
        mainItems: [],
        navItems: [],
        navCount: 0,
        mainScroll: '',
        navSel: '',
        navScroll: '',
    },
    onLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield trip_1.TripService.GetTrips(rental_pb_1.rental.v1.TripStatus.FINISHED);
            this.populateTrips();
            const userInfo = yield getApp().globalData.userInfo;
            this.setData({
                avatarURL: userInfo.avatarUrl,
            });
        });
    },
    onReady() {
        wx.createSelectorQuery().select('#heading')
            .boundingClientRect(rect => {
            const height = wx.getSystemInfoSync().windowHeight - rect.height;
            this.setData({
                tripsHeight: height,
                navCount: Math.round(height / 50),
            });
        }).exec();
    },
    populateTrips() {
        const mainItems = [];
        const navItems = [];
        let navSel = '';
        let prevNav = '';
        for (let i = 0; i < 100; i++) {
            if (!prevNav) {
                prevNav = 'nav-' + i;
            }
            mainItems.push({
                id: 'main-' + i,
                navId: 'nav-' + i,
                navScrollId: prevNav,
                data: {
                    id: (10001 + i).toString(),
                    start: '长桥',
                    end: '宿舍',
                    distance: '2.4公里',
                    duration: '0时12分钟',
                    fee: '5.2元',
                    status: '已完成',
                }
            });
            navItems.push({
                id: 'nav-' + i,
                mainId: 'main-' + i,
                label: (10001 + i).toString(),
            });
            if (i === 0) {
                navSel = 'nav-' + i;
            }
            prevNav = 'nav-' + i;
        }
        this.setData({
            mainItems: mainItems,
            navItems: navItems,
            navSel: navSel,
        }, () => {
            this.prepareScrollStates();
        });
    },
    prepareScrollStates() {
        wx.createSelectorQuery().selectAll('.main-item')
            .fields({
            id: true,
            dataset: true,
            rect: true
        }).exec(res => {
            this.scrollStates.mainItems = res[0];
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
    onNavItemTap(e) {
        var _a, _b, _c;
        const mainId = (_b = (_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.dataset) === null || _b === void 0 ? void 0 : _b.mainId;
        const navId = (_c = e.currentTarget) === null || _c === void 0 ? void 0 : _c.id;
        if (mainId) {
            this.setData({
                mainScroll: mainId,
                navSel: navId,
            });
        }
    },
    onMainScroll(e) {
        var _a, _b;
        const top = ((_a = e.currentTarget) === null || _a === void 0 ? void 0 : _a.offsetTop) + ((_b = e.detail) === null || _b === void 0 ? void 0 : _b.scrollTop);
        if (top === undefined) {
            return;
        }
        const selItem = this.scrollStates.mainItems.find(v => v.top >= top);
        if (!selItem) {
            return;
        }
        this.setData({
            navSel: selItem.dataset.navId,
            navScroll: selItem.dataset.navScrollId,
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXl0cmlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15dHJpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELGlEQUE2QztBQWtDN0MsSUFBSSxDQUFDO0lBQ0QsWUFBWSxFQUFFO1FBQ1YsU0FBUyxFQUFFLEVBQTRCO0tBQzFDO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsYUFBYSxFQUFFLElBQUk7UUFDbkIsUUFBUSxFQUFFLEtBQUs7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxHQUFHO1FBQ1osY0FBYyxFQUFFO1lBQ1o7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsd0RBQXdEO2dCQUM3RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtZQUNEO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsdURBQXVEO2dCQUM1RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtTQUNKO1FBQ0QsU0FBUyxFQUFFLEVBQUU7UUFDYixXQUFXLEVBQUUsQ0FBQztRQUNkLFNBQVMsRUFBRSxFQUFnQjtRQUMzQixRQUFRLEVBQUUsRUFBZTtRQUN6QixRQUFRLEVBQUUsQ0FBQztRQUNYLFVBQVUsRUFBRSxFQUFFO1FBQ2QsTUFBTSxFQUFFLEVBQUU7UUFDVixTQUFTLEVBQUUsRUFBRTtLQUNoQjtJQUNLLE1BQU07O1lBQ1IsTUFBTSxHQUFHLEdBQUcsTUFBTSxrQkFBVyxDQUFDLFFBQVEsQ0FBQyxrQkFBTSxDQUFDLEVB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LENBQUE7UUFDcEUsSUFBSSxHQUFHLEtBQUssU0FBUyxFQUFFO1lBQ25CLE9BQU07U0FDVDtRQUNELE1BQU0sT0FBTyxHQUFJLElBQUksQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBRSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxDQUFDLENBQUE7UUFDckUsSUFBSSxDQUFDLE9BQU8sRUFBRTtZQUNWLE9BQU07U0FDVDtRQUNELElBQUksQ0FBQyxPQUFPLENBQUM7WUFDVCxNQUFNLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxLQUFLO1lBQzdCLFNBQVMsRUFBRSxPQUFPLENBQUMsT0FBTyxDQUFDLFdBQVc7U0FDekMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IElBcHBPcHRpb24gfSBmcm9tIFwiLi4vLi4vYXBwb3B0aW9uXCJcclxuaW1wb3J0IHsgcmVudGFsIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvcHJvdG9fZ2VuL3JlbnRhbC9yZW50YWxfcGJcIlxyXG5pbXBvcnQgeyBUcmlwU2VydmljZSB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3RyaXBcIlxyXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuaW50ZXJmYWNlIFRyaXAge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgc3RhcnQ6IHN0cmluZ1xyXG4gICAgZW5kOiBzdHJpbmdcclxuICAgIGR1cmF0aW9uOiBzdHJpbmdcclxuICAgIGZlZTogc3RyaW5nXHJcbiAgICBkaXN0YW5jZTogc3RyaW5nXHJcbiAgICBzdGF0dXM6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTWFpbkl0ZW0ge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgbmF2SWQ6IHN0cmluZ1xyXG4gICAgbmF2U2Nyb2xsSWQ6IHN0cmluZ1xyXG4gICAgZGF0YTogVHJpcFxyXG59XHJcblxyXG5pbnRlcmZhY2UgTmF2SXRlbSB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICBtYWluSWQ6IHN0cmluZ1xyXG4gICAgbGFiZWw6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTWFpbkl0ZW1RdWVyeVJlcXVlc3Qge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgdG9wOiBudW1iZXJcclxuICAgIGRhdGFzZXQ6IHtcclxuICAgICAgICBuYXZJZDogc3RyaW5nXHJcbiAgICAgICAgbmF2U2Nyb2xsSWQ6IHN0cmluZ1xyXG4gICAgfVxyXG59XHJcblxyXG5QYWdlKHtcclxuICAgIHNjcm9sbFN0YXRlczoge1xyXG4gICAgICAgIG1haW5JdGVtczogW10gYXMgTWFpbkl0ZW1RdWVyeVJlcXVlc3RbXSxcclxuICAgIH0sXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgaW50ZXJ2YWw6IDMwMDAsXHJcbiAgICAgICAgZHVyYXRpb246IDUwMCxcclxuICAgICAgICBjaXJjdWxhcjogdHJ1ZSxcclxuICAgICAgICBjdXJyZW50OiAnMCcsXHJcbiAgICAgICAgcHJvbW90aW9uSXRlbXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjBjNWM4MTAwMDFkMWY0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnMScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nMi5tdWtld2FuZy5jb20vNjIxNmZlZjUwMDAxMzRkZjE3OTIwNzY0LmpwZycsXHJcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb25JRDogJzInLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzQubXVrZXdhbmcuY29tLzYyMTg0YTllMDAwMTFkYmQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICczJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjE4N2FkYzAwMDEwMzA0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nLm11a2V3YW5nLmNvbS82MjE4Mzg5ZDAwMDFlNDNlMTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxyXG4gICAgICAgIHRyaXBzSGVpZ2h0OiAwLFxyXG4gICAgICAgIG1haW5JdGVtczogW10gYXMgTWFpbkl0ZW1bXSxcclxuICAgICAgICBuYXZJdGVtczogW10gYXMgTmF2SXRlbVtdLFxyXG4gICAgICAgIG5hdkNvdW50OiAwLFxyXG4gICAgICAgIG1haW5TY3JvbGw6ICcnLFxyXG4gICAgICAgIG5hdlNlbDogJycsXHJcbiAgICAgICAgbmF2U2Nyb2xsOiAnJyxcclxuICAgIH0sXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgY29uc3QgcmVzID0gYXdhaXQgVHJpcFNlcnZpY2UuR2V0VHJpcHMocmVudGFsLnYxLlRyaXBTdGF0dXMuRklOSVNIRUQpXHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVRyaXBzKClcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgd3guY3JlYXRlU2VsZWN0b3JRdWVyeSgpLnNlbGVjdCgnI2hlYWRpbmcnKVxyXG4gICAgICAgIC5ib3VuZGluZ0NsaWVudFJlY3QocmVjdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkud2luZG93SGVpZ2h0IC0gcmVjdC5oZWlnaHRcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIHRyaXBzSGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICBuYXZDb3VudDogTWF0aC5yb3VuZChoZWlnaHQvNTApLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pLmV4ZWMoKVxyXG4gICAgfSxcclxuICAgIHBvcHVsYXRlVHJpcHMoKXtcclxuICAgICAgICBjb25zdCBtYWluSXRlbXM6IE1haW5JdGVtW10gPSBbXVxyXG4gICAgICAgIGNvbnN0IG5hdkl0ZW1zOiBOYXZJdGVtW10gPSBbXVxyXG4gICAgICAgIGxldCBuYXZTZWwgPSAnJ1xyXG4gICAgICAgIGxldCBwcmV2TmF2ID0gJydcclxuICAgICAgICBmb3IgKGxldCBpPTA7IGk8MTAwOyBpKyspIHtcclxuICAgICAgICAgICAgaWYoIXByZXZOYXYpIHtcclxuICAgICAgICAgICAgICAgIHByZXZOYXYgPSAnbmF2LScgKyBpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFpbkl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICdtYWluLScgKyBpLFxyXG4gICAgICAgICAgICAgICAgbmF2SWQ6ICduYXYtJyArIGksXHJcbiAgICAgICAgICAgICAgICBuYXZTY3JvbGxJZDogcHJldk5hdixcclxuICAgICAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGlkOiAoMTAwMDEraSkudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0OiAn6ZW/5qGlJyxcclxuICAgICAgICAgICAgICAgIGVuZDogJ+Wuv+iIjScsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogJzIuNOWFrOmHjCcsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogJzDml7YxMuWIhumSnycsXHJcbiAgICAgICAgICAgICAgICBmZWU6ICc1LjLlhYMnLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiAn5bey5a6M5oiQJyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgbmF2SXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogJ25hdi0nICsgaSxcclxuICAgICAgICAgICAgICAgIG1haW5JZDogJ21haW4tJyArIGksXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogKDEwMDAxK2kpLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChpPT09MCkge1xyXG4gICAgICAgICAgICAgICAgbmF2U2VsID0gJ25hdi0nICsgaVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXZOYXYgPSAnbmF2LScgKyBpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIG1haW5JdGVtczogbWFpbkl0ZW1zLFxyXG4gICAgICAgICAgICBuYXZJdGVtczogbmF2SXRlbXMsXHJcbiAgICAgICAgICAgIG5hdlNlbDogbmF2U2VsLFxyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlU2Nyb2xsU3RhdGVzKClcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBwcmVwYXJlU2Nyb2xsU3RhdGVzKCkge1xyXG4gICAgICAgIHd4LmNyZWF0ZVNlbGVjdG9yUXVlcnkoKS5zZWxlY3RBbGwoJy5tYWluLWl0ZW0nKVxyXG4gICAgICAgIC5maWVsZHMoe1xyXG4gICAgICAgICAgICBpZDogdHJ1ZSxcclxuICAgICAgICAgICAgZGF0YXNldDogdHJ1ZSxcclxuICAgICAgICAgICAgcmVjdDogdHJ1ZVxyXG4gICAgICAgIH0pLmV4ZWMoIHJlcyA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2Nyb2xsU3RhdGVzLm1haW5JdGVtcyA9IHJlc1swXVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG9uU3dpcGVyQ2hhbmdlKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUHJvbW90aW9uSXRlbVRhcChlOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgfSxcclxuXHJcbiAgICBvblJlZ2lzdGVyVGFwKCkge1xyXG4gICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xyXG4gICAgICAgICAgICAvLyB1cmw6ICcvcGFnZXMvcmVnaXN0ZXIvcmVnaXN0ZXInLFxyXG4gICAgICAgICAgICB1cmw6IHJvdXRpbmcucmVnaXN0ZXIoKSxcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uR2V0VXNlckluZm8oZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdXNlckluZm86IFdlY2hhdE1pbmlwcm9ncmFtLlVzZXJJbmZvID0gZS5kZXRhaWwudXNlckluZm9cclxuICAgICAgICBpZiAodXNlckluZm8pIHtcclxuICAgICAgICAgICAgZ2V0QXBwPElBcHBPcHRpb24+KCkucmVzb2x2ZVVzZXJJbmZvKHVzZXJJbmZvKVxyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0sXHJcbiAgICBvbk5hdkl0ZW1UYXAoZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgbWFpbklkOiBzdHJpbmcgPSBlLmN1cnJlbnRUYXJnZXQ/LmRhdGFzZXQ/Lm1haW5JZFxyXG4gICAgICAgIGNvbnN0IG5hdklkOiBzdHJpbmcgPSBlLmN1cnJlbnRUYXJnZXQ/LmlkXHJcbiAgICAgICAgaWYgKG1haW5JZCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgbWFpblNjcm9sbDogbWFpbklkLFxyXG4gICAgICAgICAgICAgICAgbmF2U2VsOiBuYXZJZCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgb25NYWluU2Nyb2xsKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHRvcDogbnVtYmVyID0gZS5jdXJyZW50VGFyZ2V0Py5vZmZzZXRUb3AgKyBlLmRldGFpbD8uc2Nyb2xsVG9wXHJcbiAgICAgICAgaWYgKHRvcCA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBjb25zdCBzZWxJdGVtID0gIHRoaXMuc2Nyb2xsU3RhdGVzLm1haW5JdGVtcy5maW5kKCB2ID0+IHYudG9wID49IHRvcClcclxuICAgICAgICBpZiAoIXNlbEl0ZW0pIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIG5hdlNlbDogc2VsSXRlbS5kYXRhc2V0Lm5hdklkLFxyXG4gICAgICAgICAgICBuYXZTY3JvbGw6IHNlbEl0ZW0uZGF0YXNldC5uYXZTY3JvbGxJZCxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59KSJdfQ==