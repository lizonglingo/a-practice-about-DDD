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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXl0cmlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15dHJpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSxpREFBNkM7QUFrQzdDLElBQUksQ0FBQztJQUNELFlBQVksRUFBRTtRQUNWLFNBQVMsRUFBRSxFQUE0QjtLQUMxQztJQUNELElBQUksRUFBRTtRQUNGLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxHQUFHO1FBQ2IsUUFBUSxFQUFFLElBQUk7UUFDZCxPQUFPLEVBQUUsR0FBRztRQUNaLGNBQWMsRUFBRTtZQUNaO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsd0RBQXdEO2dCQUM3RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtZQUNEO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHVEQUF1RDtnQkFDNUQsV0FBVyxFQUFFLEdBQUc7YUFDbkI7U0FDSjtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsV0FBVyxFQUFFLENBQUM7UUFDZCxTQUFTLEVBQUUsRUFBZ0I7UUFDM0IsUUFBUSxFQUFFLEVBQWU7UUFDekIsUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsRUFBRTtRQUNkLE1BQU0sRUFBRSxFQUFFO1FBQ1YsU0FBUyxFQUFFLEVBQUU7S0FDaEI7SUFDSyxNQUFNOztZQUNSLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUNwQixNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sRUFBYyxDQUFDLFVBQVUsQ0FBQyxRQUFR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QUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBO1FBQ3JFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixPQUFNO1NBQ1Q7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSztZQUM3QixTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3pDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuaW50ZXJmYWNlIFRyaXAge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgc3RhcnQ6IHN0cmluZ1xyXG4gICAgZW5kOiBzdHJpbmdcclxuICAgIGR1cmF0aW9uOiBzdHJpbmdcclxuICAgIGZlZTogc3RyaW5nXHJcbiAgICBkaXN0YW5jZTogc3RyaW5nXHJcbiAgICBzdGF0dXM6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTWFpbkl0ZW0ge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgbmF2SWQ6IHN0cmluZ1xyXG4gICAgbmF2U2Nyb2xsSWQ6IHN0cmluZ1xyXG4gICAgZGF0YTogVHJpcFxyXG59XHJcblxyXG5pbnRlcmZhY2UgTmF2SXRlbSB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICBtYWluSWQ6IHN0cmluZ1xyXG4gICAgbGFiZWw6IHN0cmluZ1xyXG59XHJcblxyXG5pbnRlcmZhY2UgTWFpbkl0ZW1RdWVyeVJlcXVlc3Qge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgdG9wOiBudW1iZXJcclxuICAgIGRhdGFzZXQ6IHtcclxuICAgICAgICBuYXZJZDogc3RyaW5nXHJcbiAgICAgICAgbmF2U2Nyb2xsSWQ6IHN0cmluZ1xyXG4gICAgfVxyXG59XHJcblxyXG5QYWdlKHtcclxuICAgIHNjcm9sbFN0YXRlczoge1xyXG4gICAgICAgIG1haW5JdGVtczogW10gYXMgTWFpbkl0ZW1RdWVyeVJlcXVlc3RbXSxcclxuICAgIH0sXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgaW50ZXJ2YWw6IDMwMDAsXHJcbiAgICAgICAgZHVyYXRpb246IDUwMCxcclxuICAgICAgICBjaXJjdWxhcjogdHJ1ZSxcclxuICAgICAgICBjdXJyZW50OiAnMCcsXHJcbiAgICAgICAgcHJvbW90aW9uSXRlbXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjBjNWM4MTAwMDFkMWY0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnMScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nMi5tdWtld2FuZy5jb20vNjIxNmZlZjUwMDAxMzRkZjE3OTIwNzY0LmpwZycsXHJcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb25JRDogJzInLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzQubXVrZXdhbmcuY29tLzYyMTg0YTllMDAwMTFkYmQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICczJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjE4N2FkYzAwMDEwMzA0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nLm11a2V3YW5nLmNvbS82MjE4Mzg5ZDAwMDFlNDNlMTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgICAgICBhdmF0YXJVUkw6ICcnLFxyXG4gICAgICAgIHRyaXBzSGVpZ2h0OiAwLFxyXG4gICAgICAgIG1haW5JdGVtczogW10gYXMgTWFpbkl0ZW1bXSxcclxuICAgICAgICBuYXZJdGVtczogW10gYXMgTmF2SXRlbVtdLFxyXG4gICAgICAgIG5hdkNvdW50OiAwLFxyXG4gICAgICAgIG1haW5TY3JvbGw6ICcnLFxyXG4gICAgICAgIG5hdlNlbDogJycsXHJcbiAgICAgICAgbmF2U2Nyb2xsOiAnJyxcclxuICAgIH0sXHJcbiAgICBhc3luYyBvbkxvYWQoKSB7XHJcbiAgICAgICAgdGhpcy5wb3B1bGF0ZVRyaXBzKClcclxuICAgICAgICBjb25zdCB1c2VySW5mbyA9IGF3YWl0IGdldEFwcDxJQXBwT3B0aW9uPigpLmdsb2JhbERhdGEudXNlckluZm9cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIG9uUmVhZHkoKSB7XHJcbiAgICAgICAgd3guY3JlYXRlU2VsZWN0b3JRdWVyeSgpLnNlbGVjdCgnI2hlYWRpbmcnKVxyXG4gICAgICAgIC5ib3VuZGluZ0NsaWVudFJlY3QocmVjdCA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGhlaWdodCA9IHd4LmdldFN5c3RlbUluZm9TeW5jKCkud2luZG93SGVpZ2h0IC0gcmVjdC5oZWlnaHQsXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICB0cmlwc0hlaWdodDogaGVpZ2h0LFxyXG4gICAgICAgICAgICAgICAgbmF2Q291bnQ6IE1hdGgucm91bmQoaGVpZ2h0LzUwKSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KS5leGVjKClcclxuICAgIH0sXHJcbiAgICBwb3B1bGF0ZVRyaXBzKCl7XHJcbiAgICAgICAgY29uc3QgbWFpbkl0ZW1zOiBNYWluSXRlbVtdID0gW11cclxuICAgICAgICBjb25zdCBuYXZJdGVtczogTmF2SXRlbVtdID0gW11cclxuICAgICAgICBsZXQgbmF2U2VsID0gJydcclxuICAgICAgICBsZXQgcHJldk5hdiA9ICcnXHJcbiAgICAgICAgZm9yIChsZXQgaT0wOyBpPDEwMDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmKCFwcmV2TmF2KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2TmF2ID0gJ25hdi0nICsgaVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG1haW5JdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiAnbWFpbi0nICsgaSxcclxuICAgICAgICAgICAgICAgIG5hdklkOiAnbmF2LScgKyBpLFxyXG4gICAgICAgICAgICAgICAgbmF2U2Nyb2xsSWQ6IHByZXZOYXYsXHJcbiAgICAgICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBpZDogKDEwMDAxK2kpLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICAgICAgICBzdGFydDogJ+mVv+ahpScsXHJcbiAgICAgICAgICAgICAgICBlbmQ6ICflrr/oiI0nLFxyXG4gICAgICAgICAgICAgICAgZGlzdGFuY2U6ICcyLjTlhazph4wnLFxyXG4gICAgICAgICAgICAgICAgZHVyYXRpb246ICcw5pe2MTLliIbpkp8nLFxyXG4gICAgICAgICAgICAgICAgZmVlOiAnNS4y5YWDJyxcclxuICAgICAgICAgICAgICAgIHN0YXR1czogJ+W3suWujOaIkCcsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIG5hdkl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICduYXYtJyArIGksXHJcbiAgICAgICAgICAgICAgICBtYWluSWQ6ICdtYWluLScgKyBpLFxyXG4gICAgICAgICAgICAgICAgbGFiZWw6ICgxMDAwMStpKS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBpZiAoaT09PTApIHtcclxuICAgICAgICAgICAgICAgIG5hdlNlbCA9ICduYXYtJyArIGlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwcmV2TmF2ID0gJ25hdi0nICsgaVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBtYWluSXRlbXM6IG1haW5JdGVtcyxcclxuICAgICAgICAgICAgbmF2SXRlbXM6IG5hdkl0ZW1zLFxyXG4gICAgICAgICAgICBuYXZTZWw6IG5hdlNlbCxcclxuICAgICAgICB9LCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMucHJlcGFyZVNjcm9sbFN0YXRlcygpXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgcHJlcGFyZVNjcm9sbFN0YXRlcygpIHtcclxuICAgICAgICB3eC5jcmVhdGVTZWxlY3RvclF1ZXJ5KCkuc2VsZWN0QWxsKCcubWFpbi1pdGVtJylcclxuICAgICAgICAuZmllbGRzKHtcclxuICAgICAgICAgICAgaWQ6IHRydWUsXHJcbiAgICAgICAgICAgIGRhdGFzZXQ6IHRydWUsXHJcbiAgICAgICAgICAgIHJlY3Q6IHRydWVcclxuICAgICAgICB9KS5leGVjKCByZXMgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNjcm9sbFN0YXRlcy5tYWluSXRlbXMgPSByZXNbMF1cclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBvblN3aXBlckNoYW5nZShlOiBhbnkpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlKVxyXG4gICAgfSxcclxuXHJcbiAgICBvblByb21vdGlvbkl0ZW1UYXAoZTogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgIH0sXHJcblxyXG4gICAgb25SZWdpc3RlclRhcCgpIHtcclxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgLy8gdXJsOiAnL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgdXJsOiByb3V0aW5nLnJlZ2lzdGVyKCksXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBvbkdldFVzZXJJbmZvKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBXZWNoYXRNaW5pcHJvZ3JhbS5Vc2VySW5mbyA9IGUuZGV0YWlsLnVzZXJJbmZvXHJcbiAgICAgICAgaWYgKHVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgIGdldEFwcDxJQXBwT3B0aW9uPigpLnJlc29sdmVVc2VySW5mbyh1c2VySW5mbylcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgb25OYXZJdGVtVGFwKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG1haW5JZDogc3RyaW5nID0gZS5jdXJyZW50VGFyZ2V0Py5kYXRhc2V0Py5tYWluSWRcclxuICAgICAgICBjb25zdCBuYXZJZDogc3RyaW5nID0gZS5jdXJyZW50VGFyZ2V0Py5pZFxyXG4gICAgICAgIGlmIChtYWluSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIG1haW5TY3JvbGw6IG1haW5JZCxcclxuICAgICAgICAgICAgICAgIG5hdlNlbDogbmF2SWQsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uTWFpblNjcm9sbChlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB0b3A6IG51bWJlciA9IGUuY3VycmVudFRhcmdldD8ub2Zmc2V0VG9wICsgZS5kZXRhaWw/LnNjcm9sbFRvcFxyXG4gICAgICAgIGlmICh0b3AgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2VsSXRlbSA9ICB0aGlzLnNjcm9sbFN0YXRlcy5tYWluSXRlbXMuZmluZCggdiA9PiB2LnRvcCA+PSB0b3ApXHJcbiAgICAgICAgaWYgKCFzZWxJdGVtKSB7XHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBuYXZTZWw6IHNlbEl0ZW0uZGF0YXNldC5uYXZJZCxcclxuICAgICAgICAgICAgbmF2U2Nyb2xsOiBzZWxJdGVtLmRhdGFzZXQubmF2U2Nyb2xsSWQsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSkiXX0=