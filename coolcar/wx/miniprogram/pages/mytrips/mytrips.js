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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXl0cmlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15dHJpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSxpREFBNkM7QUFrQzdDLElBQUksQ0FBQztJQUNELFlBQVksRUFBRTtRQUNWLFNBQVMsRUFBRSxFQUE0QjtLQUMxQztJQUNELElBQUksRUFBRTtRQUNGLGFBQWEsRUFBRSxJQUFJO1FBQ25CLFFBQVEsRUFBRSxLQUFLO1FBQ2YsUUFBUSxFQUFFLElBQUk7UUFDZCxRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxHQUFHO1FBQ2IsUUFBUSxFQUFFLElBQUk7UUFDZCxPQUFPLEVBQUUsR0FBRztRQUNaLGNBQWMsRUFBRTtZQUNaO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsd0RBQXdEO2dCQUM3RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtZQUNEO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHVEQUF1RDtnQkFDNUQsV0FBVyxFQUFFLEdBQUc7YUFDbkI7U0FDSjtRQUNELFNBQVMsRUFBRSxFQUFFO1FBQ2IsV0FBVyxFQUFFLENBQUM7UUFDZCxTQUFTLEVBQUUsRUFBZ0I7UUFDM0IsUUFBUSxFQUFFLEVBQWU7UUFDekIsUUFBUSxFQUFFLENBQUM7UUFDWCxVQUFVLEVBQUUsRUFBRTtRQUNkLE1BQU0sRUFBRSxFQUFFO1FBQ1YsU0FBUyxFQUFFLEVBQUU7S0FDaEI7SUFDSyxNQUFNOztZQUNSLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQTtZQUNwQixNQUFNLFFBQVEsR0FBRyxNQUFNLE1BQU0sRUFBYyxDQUFDLFVBQVUsQ0FBQyxRQUFR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QUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxDQUFBO1FBQ3JFLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDVixPQUFNO1NBQ1Q7UUFDRCxJQUFJLENBQUMsT0FBTyxDQUFDO1lBQ1QsTUFBTSxFQUFFLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSztZQUM3QixTQUFTLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3pDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQXBwT3B0aW9uIH0gZnJvbSBcIi4uLy4uL2FwcG9wdGlvblwiXHJcbmltcG9ydCB7IHJvdXRpbmcgfSBmcm9tIFwiLi4vLi4vdXRpbHMvcm91dGluZ1wiXHJcblxyXG5pbnRlcmZhY2UgVHJpcCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICBzdGFydDogc3RyaW5nXHJcbiAgICBlbmQ6IHN0cmluZ1xyXG4gICAgZHVyYXRpb246IHN0cmluZ1xyXG4gICAgZmVlOiBzdHJpbmdcclxuICAgIGRpc3RhbmNlOiBzdHJpbmdcclxuICAgIHN0YXR1czogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBNYWluSXRlbSB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICBuYXZJZDogc3RyaW5nXHJcbiAgICBuYXZTY3JvbGxJZDogc3RyaW5nXHJcbiAgICBkYXRhOiBUcmlwXHJcbn1cclxuXHJcbmludGVyZmFjZSBOYXZJdGVtIHtcclxuICAgIGlkOiBzdHJpbmdcclxuICAgIG1haW5JZDogc3RyaW5nXHJcbiAgICBsYWJlbDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBNYWluSXRlbVF1ZXJ5UmVxdWVzdCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICB0b3A6IG51bWJlclxyXG4gICAgZGF0YXNldDoge1xyXG4gICAgICAgIG5hdklkOiBzdHJpbmdcclxuICAgICAgICBuYXZTY3JvbGxJZDogc3RyaW5nXHJcbiAgICB9XHJcbn1cclxuXHJcblBhZ2Uoe1xyXG4gICAgc2Nyb2xsU3RhdGVzOiB7XHJcbiAgICAgICAgbWFpbkl0ZW1zOiBbXSBhcyBNYWluSXRlbVF1ZXJ5UmVxdWVzdFtdLFxyXG4gICAgfSxcclxuICAgIGRhdGE6IHtcclxuICAgICAgICBpbmRpY2F0b3JEb3RzOiB0cnVlLFxyXG4gICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICBpbnRlcnZhbDogMzAwMCxcclxuICAgICAgICBkdXJhdGlvbjogNTAwLFxyXG4gICAgICAgIGNpcmN1bGFyOiB0cnVlLFxyXG4gICAgICAgIGN1cnJlbnQ6ICcwJyxcclxuICAgICAgICBwcm9tb3Rpb25JdGVtczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzMubXVrZXdhbmcuY29tLzYyMGM1YzgxMDAwMWQxZjQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICcxJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWcyLm11a2V3YW5nLmNvbS82MjE2ZmVmNTAwMDEzNGRmMTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnMicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nNC5tdWtld2FuZy5jb20vNjIxODRhOWUwMDAxMWRiZDE3OTIwNzY0LmpwZycsXHJcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb25JRDogJzMnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzMubXVrZXdhbmcuY29tLzYyMTg3YWRjMDAwMTAzMDQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICc0JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWcubXVrZXdhbmcuY29tLzYyMTgzODlkMDAwMWU0M2UxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICc1JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGF2YXRhclVSTDogJycsXHJcbiAgICAgICAgdHJpcHNIZWlnaHQ6IDAsXHJcbiAgICAgICAgbWFpbkl0ZW1zOiBbXSBhcyBNYWluSXRlbVtdLFxyXG4gICAgICAgIG5hdkl0ZW1zOiBbXSBhcyBOYXZJdGVtW10sXHJcbiAgICAgICAgbmF2Q291bnQ6IDAsXHJcbiAgICAgICAgbWFpblNjcm9sbDogJycsXHJcbiAgICAgICAgbmF2U2VsOiAnJyxcclxuICAgICAgICBuYXZTY3JvbGw6ICcnLFxyXG4gICAgfSxcclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICB0aGlzLnBvcHVsYXRlVHJpcHMoKVxyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvID0gYXdhaXQgZ2V0QXBwPElBcHBPcHRpb24+KCkuZ2xvYmFsRGF0YS51c2VySW5mb1xyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgb25SZWFkeSgpIHtcclxuICAgICAgICB3eC5jcmVhdGVTZWxlY3RvclF1ZXJ5KCkuc2VsZWN0KCcjaGVhZGluZycpXHJcbiAgICAgICAgLmJvdW5kaW5nQ2xpZW50UmVjdChyZWN0ID0+IHtcclxuICAgICAgICAgICAgY29uc3QgaGVpZ2h0ID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKS53aW5kb3dIZWlnaHQgLSByZWN0LmhlaWdodFxyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgdHJpcHNIZWlnaHQ6IGhlaWdodCxcclxuICAgICAgICAgICAgICAgIG5hdkNvdW50OiBNYXRoLnJvdW5kKGhlaWdodC81MCksXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkuZXhlYygpXHJcbiAgICB9LFxyXG4gICAgcG9wdWxhdGVUcmlwcygpe1xyXG4gICAgICAgIGNvbnN0IG1haW5JdGVtczogTWFpbkl0ZW1bXSA9IFtdXHJcbiAgICAgICAgY29uc3QgbmF2SXRlbXM6IE5hdkl0ZW1bXSA9IFtdXHJcbiAgICAgICAgbGV0IG5hdlNlbCA9ICcnXHJcbiAgICAgICAgbGV0IHByZXZOYXYgPSAnJ1xyXG4gICAgICAgIGZvciAobGV0IGk9MDsgaTwxMDA7IGkrKykge1xyXG4gICAgICAgICAgICBpZighcHJldk5hdikge1xyXG4gICAgICAgICAgICAgICAgcHJldk5hdiA9ICduYXYtJyArIGlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYWluSXRlbXMucHVzaCh7XHJcbiAgICAgICAgICAgICAgICBpZDogJ21haW4tJyArIGksXHJcbiAgICAgICAgICAgICAgICBuYXZJZDogJ25hdi0nICsgaSxcclxuICAgICAgICAgICAgICAgIG5hdlNjcm9sbElkOiBwcmV2TmF2LFxyXG4gICAgICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgaWQ6ICgxMDAwMStpKS50b1N0cmluZygpLFxyXG4gICAgICAgICAgICAgICAgc3RhcnQ6ICfplb/moaUnLFxyXG4gICAgICAgICAgICAgICAgZW5kOiAn5a6/6IiNJyxcclxuICAgICAgICAgICAgICAgIGRpc3RhbmNlOiAnMi405YWs6YeMJyxcclxuICAgICAgICAgICAgICAgIGR1cmF0aW9uOiAnMOaXtjEy5YiG6ZKfJyxcclxuICAgICAgICAgICAgICAgIGZlZTogJzUuMuWFgycsXHJcbiAgICAgICAgICAgICAgICBzdGF0dXM6ICflt7LlrozmiJAnLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICBuYXZJdGVtcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgIGlkOiAnbmF2LScgKyBpLFxyXG4gICAgICAgICAgICAgICAgbWFpbklkOiAnbWFpbi0nICsgaSxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAoMTAwMDEraSkudG9TdHJpbmcoKSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgaWYgKGk9PT0wKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZTZWwgPSAnbmF2LScgKyBpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcHJldk5hdiA9ICduYXYtJyArIGlcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgbWFpbkl0ZW1zOiBtYWluSXRlbXMsXHJcbiAgICAgICAgICAgIG5hdkl0ZW1zOiBuYXZJdGVtcyxcclxuICAgICAgICAgICAgbmF2U2VsOiBuYXZTZWwsXHJcbiAgICAgICAgfSwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnByZXBhcmVTY3JvbGxTdGF0ZXMoKVxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIHByZXBhcmVTY3JvbGxTdGF0ZXMoKSB7XHJcbiAgICAgICAgd3guY3JlYXRlU2VsZWN0b3JRdWVyeSgpLnNlbGVjdEFsbCgnLm1haW4taXRlbScpXHJcbiAgICAgICAgLmZpZWxkcyh7XHJcbiAgICAgICAgICAgIGlkOiB0cnVlLFxyXG4gICAgICAgICAgICBkYXRhc2V0OiB0cnVlLFxyXG4gICAgICAgICAgICByZWN0OiB0cnVlXHJcbiAgICAgICAgfSkuZXhlYyggcmVzID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zY3JvbGxTdGF0ZXMubWFpbkl0ZW1zID0gcmVzWzBdXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcblxyXG4gICAgb25Td2lwZXJDaGFuZ2UoZTogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgIH0sXHJcblxyXG4gICAgb25Qcm9tb3Rpb25JdGVtVGFwKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUmVnaXN0ZXJUYXAoKSB7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgIC8vIHVybDogJy9wYWdlcy9yZWdpc3Rlci9yZWdpc3RlcicsXHJcbiAgICAgICAgICAgIHVybDogcm91dGluZy5yZWdpc3RlcigpLFxyXG4gICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgb25HZXRVc2VySW5mbyhlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB1c2VySW5mbzogV2VjaGF0TWluaXByb2dyYW0uVXNlckluZm8gPSBlLmRldGFpbC51c2VySW5mb1xyXG4gICAgICAgIGlmICh1c2VySW5mbykge1xyXG4gICAgICAgICAgICBnZXRBcHA8SUFwcE9wdGlvbj4oKS5yZXNvbHZlVXNlckluZm8odXNlckluZm8pXHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBhdmF0YXJVUkw6IHVzZXJJbmZvLmF2YXRhclVybCxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIG9uTmF2SXRlbVRhcChlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBtYWluSWQ6IHN0cmluZyA9IGUuY3VycmVudFRhcmdldD8uZGF0YXNldD8ubWFpbklkXHJcbiAgICAgICAgY29uc3QgbmF2SWQ6IHN0cmluZyA9IGUuY3VycmVudFRhcmdldD8uaWRcclxuICAgICAgICBpZiAobWFpbklkKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBtYWluU2Nyb2xsOiBtYWluSWQsXHJcbiAgICAgICAgICAgICAgICBuYXZTZWw6IG5hdklkLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbk1haW5TY3JvbGwoZTogYW55KSB7XHJcbiAgICAgICAgY29uc3QgdG9wOiBudW1iZXIgPSBlLmN1cnJlbnRUYXJnZXQ/Lm9mZnNldFRvcCArIGUuZGV0YWlsPy5zY3JvbGxUb3BcclxuICAgICAgICBpZiAodG9wID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IHNlbEl0ZW0gPSAgdGhpcy5zY3JvbGxTdGF0ZXMubWFpbkl0ZW1zLmZpbmQoIHYgPT4gdi50b3AgPj0gdG9wKVxyXG4gICAgICAgIGlmICghc2VsSXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgbmF2U2VsOiBzZWxJdGVtLmRhdGFzZXQubmF2SWQsXHJcbiAgICAgICAgICAgIG5hdlNjcm9sbDogc2VsSXRlbS5kYXRhc2V0Lm5hdlNjcm9sbElkLFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pIl19