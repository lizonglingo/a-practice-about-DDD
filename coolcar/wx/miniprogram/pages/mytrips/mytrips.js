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
const format_1 = require("../../utils/format");
const routing_1 = require("../../utils/routing");
const tripStatusMap = new Map([
    [rental_pb_1.rental.v1.TripStatus.IN_PROGRESS, '进行中'],
    [rental_pb_1.rental.v1.TripStatus.FINISHED, '已完成'],
]);
Page({
    scrollStates: {
        mainItems: [],
    },
    layoutReslover: undefined,
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
            const layoutReady = new Promise((resolve) => {
                this.layoutReslover = resolve;
            });
            const [trips] = yield Promise.all([trip_1.TripService.getTrips(), layoutReady]);
            this.populateTrips(trips.trips);
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
            }, () => {
                if (this.layoutReslover) {
                    this.layoutReslover(1);
                }
            });
        }).exec();
    },
    populateTrips(trips) {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const mainItems = [];
        const navItems = [];
        let navSel = '';
        let prevNav = '';
        for (let i = 0; i < trips.length; i++) {
            const trip = trips[i];
            const mainId = 'main-' + i;
            const navId = 'nav-' + i;
            const shortId = (_a = trip.id) === null || _a === void 0 ? void 0 : _a.substring(trip.id.length - 6);
            if (!prevNav) {
                prevNav = navId;
            }
            const tripData = {
                id: trip.id,
                shortId: '****' + shortId,
                start: ((_c = (_b = trip.trip) === null || _b === void 0 ? void 0 : _b.start) === null || _c === void 0 ? void 0 : _c.poiName) || '未知',
                end: '',
                distance: '',
                duration: '',
                fee: '',
                status: tripStatusMap.get((_d = trip.trip) === null || _d === void 0 ? void 0 : _d.status) || '未知',
            };
            const end = (_e = trip.trip) === null || _e === void 0 ? void 0 : _e.end;
            if (end) {
                tripData.end = end.poiName || '未知';
                tripData.distance = ((_f = end.kmDriven) === null || _f === void 0 ? void 0 : _f.toFixed(1)) + '公里';
                tripData.fee = format_1.formatFee(end.feeCent || 0);
                const dur = format_1.formatDuration((end.timestampSec || 0) - (((_h = (_g = trip.trip) === null || _g === void 0 ? void 0 : _g.start) === null || _h === void 0 ? void 0 : _h.timestampSec) || 0));
                tripData.duration = `${dur.hh}时${dur.mm}fen`;
            }
            console.log(trips);
            mainItems.push({
                id: mainId,
                navId: navId,
                navScrollId: prevNav,
                data: tripData,
            });
            navItems.push({
                id: navId,
                mainId: mainId,
                label: shortId || '',
            });
            if (i === 0) {
                navSel = navId;
            }
            prevNav = navId;
        }
        console.log('nav count:', this.data.navCount);
        for (let i = 0; i < this.data.navCount - 1; i++) {
            navItems.push({
                id: '',
                mainId: '',
                label: '',
            });
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
    },
    onPromotionItemTap(e) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXl0cmlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15dHJpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFDQSx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELCtDQUE4RDtBQUM5RCxpREFBNkM7QUFvQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDO0lBQzFCLENBQUMsa0JBQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsRUFBRSxLQUFLLENBQUM7SUFDekMsQ0FBQyxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQztDQUV6QyxDQUFDLENBQUE7QUFFRixJQUFJLENBQUM7SUFDRCxZQUFZLEVBQUU7UUFDVixTQUFTLEVBQUUsRUFBNEI7S0FDMUM7SUFFRCxjQUFjLEVBQUUsU0FBaUQ7SUFFakUsSUFBSSxFQUFFO1FBQ0YsYUFBYSxFQUFFLElBQUk7UUFDbkIsUUFBUSxFQUFFLEtBQUs7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxHQUFHO1FBQ1osY0FBYyxFQUFFO1lBQ1o7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsd0RBQXdEO2dCQUM3RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtZQUNEO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsdURBQXVEO2dCQUM1RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtTQUNKO1FBQ0QsU0FBUyxFQUFFLEVBQUU7UUFDYixXQUFX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T0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFXO1NBQ3pDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJQXBwT3B0aW9uIH0gZnJvbSBcIi4uLy4uL2FwcG9wdGlvblwiXHJcbmltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCJcclxuaW1wb3J0IHsgVHJpcFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS90cmlwXCJcclxuaW1wb3J0IHsgZm9ybWF0RHVyYXRpb24sIGZvcm1hdEZlZSB9IGZyb20gXCIuLi8uLi91dGlscy9mb3JtYXRcIlxyXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuaW50ZXJmYWNlIFRyaXAge1xyXG4gICAgaWQ6IHN0cmluZ1xyXG4gICAgc2hvcnRJZDogc3RyaW5nXHJcbiAgICBzdGFydDogc3RyaW5nXHJcbiAgICBlbmQ6IHN0cmluZ1xyXG4gICAgZHVyYXRpb246IHN0cmluZ1xyXG4gICAgZmVlOiBzdHJpbmdcclxuICAgIGRpc3RhbmNlOiBzdHJpbmdcclxuICAgIHN0YXR1czogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBNYWluSXRlbSB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICBuYXZJZDogc3RyaW5nXHJcbiAgICBuYXZTY3JvbGxJZDogc3RyaW5nXHJcbiAgICBkYXRhOiBUcmlwXHJcbn1cclxuXHJcbmludGVyZmFjZSBOYXZJdGVtIHtcclxuICAgIGlkOiBzdHJpbmdcclxuICAgIG1haW5JZDogc3RyaW5nXHJcbiAgICBsYWJlbDogc3RyaW5nXHJcbn1cclxuXHJcbmludGVyZmFjZSBNYWluSXRlbVF1ZXJ5UmVxdWVzdCB7XHJcbiAgICBpZDogc3RyaW5nXHJcbiAgICB0b3A6IG51bWJlclxyXG4gICAgZGF0YXNldDoge1xyXG4gICAgICAgIG5hdklkOiBzdHJpbmdcclxuICAgICAgICBuYXZTY3JvbGxJZDogc3RyaW5nXHJcbiAgICB9XHJcbn1cclxuXHJcblxyXG5jb25zdCB0cmlwU3RhdHVzTWFwID0gbmV3IE1hcChbXHJcbiAgICBbcmVudGFsLnYxLlRyaXBTdGF0dXMuSU5fUFJPR1JFU1MsICfov5vooYzkuK0nXSxcclxuICAgIFtyZW50YWwudjEuVHJpcFN0YXR1cy5GSU5JU0hFRCwgJ+W3suWujOaIkCddLFxyXG4gICAgLy9bcmVudGFsLnYxLlRyaXBTdGF0dXMuVFNfTk9UX1NQRUNJRklFRCwgJ+acquefpSddLFxyXG5dKVxyXG5cclxuUGFnZSh7XHJcbiAgICBzY3JvbGxTdGF0ZXM6IHtcclxuICAgICAgICBtYWluSXRlbXM6IFtdIGFzIE1haW5JdGVtUXVlcnlSZXF1ZXN0W10sXHJcbiAgICB9LFxyXG5cclxuICAgIGxheW91dFJlc2xvdmVyOiB1bmRlZmluZWQgYXMgKCh2YWx1ZTogdW5rbm93bik9PnZvaWQpIHwgdW5kZWZpbmVkLFxyXG5cclxuICAgIGRhdGE6IHtcclxuICAgICAgICBpbmRpY2F0b3JEb3RzOiB0cnVlLFxyXG4gICAgICAgIHZlcnRpY2FsOiBmYWxzZSxcclxuICAgICAgICBhdXRvcGxheTogdHJ1ZSxcclxuICAgICAgICBpbnRlcnZhbDogMzAwMCxcclxuICAgICAgICBkdXJhdGlvbjogNTAwLFxyXG4gICAgICAgIGNpcmN1bGFyOiB0cnVlLFxyXG4gICAgICAgIGN1cnJlbnQ6ICcwJyxcclxuICAgICAgICBwcm9tb3Rpb25JdGVtczogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzMubXVrZXdhbmcuY29tLzYyMGM1YzgxMDAwMWQxZjQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICcxJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWcyLm11a2V3YW5nLmNvbS82MjE2ZmVmNTAwMDEzNGRmMTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnMicsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nNC5tdWtld2FuZy5jb20vNjIxODRhOWUwMDAxMWRiZDE3OTIwNzY0LmpwZycsXHJcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb25JRDogJzMnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzMubXVrZXdhbmcuY29tLzYyMTg3YWRjMDAwMTAzMDQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICc0JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWcubXVrZXdhbmcuY29tLzYyMTgzODlkMDAwMWU0M2UxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICc1JyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdLFxyXG4gICAgICAgIGF2YXRhclVSTDogJycsXHJcbiAgICAgICAgdHJpcHNIZWlnaHQ6IDAsXHJcbiAgICAgICAgbWFpbkl0ZW1zOiBbXSBhcyBNYWluSXRlbVtdLFxyXG4gICAgICAgIG5hdkl0ZW1zOiBbXSBhcyBOYXZJdGVtW10sXHJcbiAgICAgICAgbmF2Q291bnQ6IDAsXHJcbiAgICAgICAgbWFpblNjcm9sbDogJycsXHJcbiAgICAgICAgbmF2U2VsOiAnJyxcclxuICAgICAgICBuYXZTY3JvbGw6ICcnLFxyXG4gICAgfSxcclxuICAgIGFzeW5jIG9uTG9hZCgpIHtcclxuICAgICAgICBjb25zdCBsYXlvdXRSZWFkeSA9IG5ldyBQcm9taXNlICgocmVzb2x2ZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLmxheW91dFJlc2xvdmVyID0gcmVzb2x2ZVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnN0IFt0cmlwc10gPSBhd2FpdCBQcm9taXNlLmFsbChbVHJpcFNlcnZpY2UuZ2V0VHJpcHMoKSwgbGF5b3V0UmVhZHldKVxyXG4gICAgICAgIHRoaXMucG9wdWxhdGVUcmlwcyh0cmlwcy50cmlwcyEpXHJcbiAgICAgICAgY29uc3QgdXNlckluZm8gPSBhd2FpdCBnZXRBcHA8SUFwcE9wdGlvbj4oKS5nbG9iYWxEYXRhLnVzZXJJbmZvXHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgYXZhdGFyVVJMOiB1c2VySW5mby5hdmF0YXJVcmwsXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBvblJlYWR5KCkge1xyXG5cclxuICAgICAgICB3eC5jcmVhdGVTZWxlY3RvclF1ZXJ5KCkuc2VsZWN0KCcjaGVhZGluZycpXHJcbiAgICAgICAgICAgIC5ib3VuZGluZ0NsaWVudFJlY3QocmVjdCA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBoZWlnaHQgPSB3eC5nZXRTeXN0ZW1JbmZvU3luYygpLndpbmRvd0hlaWdodCAtIHJlY3QuaGVpZ2h0XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRyaXBzSGVpZ2h0OiBoZWlnaHQsXHJcbiAgICAgICAgICAgICAgICAgICAgbmF2Q291bnQ6IE1hdGgucm91bmQoaGVpZ2h0IC8gNTApLFxyXG4gICAgICAgICAgICAgICAgfSwgKCk9PntcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5sYXlvdXRSZXNsb3Zlcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmxheW91dFJlc2xvdmVyKDEpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSkuZXhlYygpXHJcbiAgICB9LFxyXG4gICAgcG9wdWxhdGVUcmlwcyh0cmlwczogcmVudGFsLnYxLklUcmlwRW50aXR5W10pIHtcclxuICAgICAgICBjb25zdCBtYWluSXRlbXM6IE1haW5JdGVtW10gPSBbXVxyXG4gICAgICAgIGNvbnN0IG5hdkl0ZW1zOiBOYXZJdGVtW10gPSBbXVxyXG4gICAgICAgIGxldCBuYXZTZWwgPSAnJ1xyXG4gICAgICAgIGxldCBwcmV2TmF2ID0gJydcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRyaXBzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRyaXAgPSB0cmlwc1tpXVxyXG4gICAgICAgICAgICBjb25zdCBtYWluSWQgPSAnbWFpbi0nICsgaVxyXG4gICAgICAgICAgICBjb25zdCBuYXZJZCA9ICduYXYtJyArIGlcclxuICAgICAgICAgICAgY29uc3Qgc2hvcnRJZCA9IHRyaXAuaWQ/LnN1YnN0cmluZyh0cmlwLmlkLmxlbmd0aCAtIDYpXHJcbiAgICAgICAgICAgIGlmICghcHJldk5hdikge1xyXG4gICAgICAgICAgICAgICAgcHJldk5hdiA9IG5hdklkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gZW5kOiAn5a6/6IiNJyxcclxuICAgICAgICAgICAgLy8gZGlzdGFuY2U6ICcyLjTlhazph4wnLFxyXG4gICAgICAgICAgICAvLyBkdXJhdGlvbjogJzDml7YxMuWIhumSnycsXHJcbiAgICAgICAgICAgIC8vIGZlZTogJzUuMuWFgycsXHJcbiAgICAgICAgICAgIGNvbnN0IHRyaXBEYXRhOiBUcmlwID0ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IHRyaXAuaWQhLFxyXG4gICAgICAgICAgICAgICAgc2hvcnRJZDogJyoqKionK3Nob3J0SWQsXHJcbiAgICAgICAgICAgICAgICBzdGFydDogdHJpcC50cmlwPy5zdGFydD8ucG9pTmFtZSB8fCAn5pyq55+lJyxcclxuICAgICAgICAgICAgICAgIGVuZDogJycsXHJcbiAgICAgICAgICAgICAgICBkaXN0YW5jZTogJycsXHJcbiAgICAgICAgICAgICAgICBkdXJhdGlvbjogJycsXHJcbiAgICAgICAgICAgICAgICBmZWU6ICcnLFxyXG4gICAgICAgICAgICAgICAgc3RhdHVzOiB0cmlwU3RhdHVzTWFwLmdldCh0cmlwLnRyaXA/LnN0YXR1cyEpIHx8ICfmnKrnn6UnLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNvbnN0IGVuZCA9IHRyaXAudHJpcD8uZW5kXHJcbiAgICAgICAgICAgIGlmIChlbmQpIHtcclxuICAgICAgICAgICAgICAgIHRyaXBEYXRhLmVuZCA9IGVuZC5wb2lOYW1lIHx8ICfmnKrnn6UnXHJcbiAgICAgICAgICAgICAgICB0cmlwRGF0YS5kaXN0YW5jZSA9IGVuZC5rbURyaXZlbj8udG9GaXhlZCgxKSArICflhazph4wnXHJcbiAgICAgICAgICAgICAgICB0cmlwRGF0YS5mZWUgPSBmb3JtYXRGZWUoZW5kLmZlZUNlbnR8fDApXHJcbiAgICAgICAgICAgICAgICBjb25zdCBkdXIgPSBmb3JtYXREdXJhdGlvbigoZW5kLnRpbWVzdGFtcFNlY3x8MCkgLSAodHJpcC50cmlwPy5zdGFydD8udGltZXN0YW1wU2VjfHwwKSlcclxuICAgICAgICAgICAgICAgIHRyaXBEYXRhLmR1cmF0aW9uID0gYCR7ZHVyLmhofeaXtiR7ZHVyLm1tfWZlbmBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh0cmlwcylcclxuICAgICAgICAgICAgbWFpbkl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IG1haW5JZCxcclxuICAgICAgICAgICAgICAgIG5hdklkOiBuYXZJZCxcclxuICAgICAgICAgICAgICAgIG5hdlNjcm9sbElkOiBwcmV2TmF2LFxyXG4gICAgICAgICAgICAgICAgZGF0YTogdHJpcERhdGEsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIG5hdkl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6IG5hdklkLFxyXG4gICAgICAgICAgICAgICAgbWFpbklkOiBtYWluSWQsXHJcbiAgICAgICAgICAgICAgICBsYWJlbDogc2hvcnRJZHx8JycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIGlmIChpID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBuYXZTZWwgPSBuYXZJZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHByZXZOYXYgPSBuYXZJZFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coJ25hdiBjb3VudDonLCB0aGlzLmRhdGEubmF2Q291bnQpXHJcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaTx0aGlzLmRhdGEubmF2Q291bnQtMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIG5hdkl0ZW1zLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgaWQ6ICcnLFxyXG4gICAgICAgICAgICAgICAgbWFpbklkOiAnJyxcclxuICAgICAgICAgICAgICAgIGxhYmVsOiAnJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIG1haW5JdGVtczogbWFpbkl0ZW1zLFxyXG4gICAgICAgICAgICBuYXZJdGVtczogbmF2SXRlbXMsXHJcbiAgICAgICAgICAgIG5hdlNlbDogbmF2U2VsLFxyXG4gICAgICAgIH0sICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5wcmVwYXJlU2Nyb2xsU3RhdGVzKClcclxuICAgICAgICB9KVxyXG4gICAgfSxcclxuXHJcbiAgICBwcmVwYXJlU2Nyb2xsU3RhdGVzKCkge1xyXG4gICAgICAgIHd4LmNyZWF0ZVNlbGVjdG9yUXVlcnkoKS5zZWxlY3RBbGwoJy5tYWluLWl0ZW0nKVxyXG4gICAgICAgICAgICAuZmllbGRzKHtcclxuICAgICAgICAgICAgICAgIGlkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGF0YXNldDogdHJ1ZSxcclxuICAgICAgICAgICAgICAgIHJlY3Q6IHRydWVcclxuICAgICAgICAgICAgfSkuZXhlYyhyZXMgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zY3JvbGxTdGF0ZXMubWFpbkl0ZW1zID0gcmVzWzBdXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9LFxyXG5cclxuICAgIG9uU3dpcGVyQ2hhbmdlKGU6IGFueSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZSlcclxuICAgIH0sXHJcblxyXG4gICAgb25Qcm9tb3Rpb25JdGVtVGFwKGU6IGFueSkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZSlcclxuICAgIH0sXHJcblxyXG4gICAgb25SZWdpc3RlclRhcCgpIHtcclxuICAgICAgICB3eC5uYXZpZ2F0ZVRvKHtcclxuICAgICAgICAgICAgLy8gdXJsOiAnL3BhZ2VzL3JlZ2lzdGVyL3JlZ2lzdGVyJyxcclxuICAgICAgICAgICAgdXJsOiByb3V0aW5nLnJlZ2lzdGVyKCksXHJcbiAgICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBvbkdldFVzZXJJbmZvKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IHVzZXJJbmZvOiBXZWNoYXRNaW5pcHJvZ3JhbS5Vc2VySW5mbyA9IGUuZGV0YWlsLnVzZXJJbmZvXHJcbiAgICAgICAgaWYgKHVzZXJJbmZvKSB7XHJcbiAgICAgICAgICAgIGdldEFwcDxJQXBwT3B0aW9uPigpLnJlc29sdmVVc2VySW5mbyh1c2VySW5mbylcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIGF2YXRhclVSTDogdXNlckluZm8uYXZhdGFyVXJsLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgb25OYXZJdGVtVGFwKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG1haW5JZDogc3RyaW5nID0gZS5jdXJyZW50VGFyZ2V0Py5kYXRhc2V0Py5tYWluSWRcclxuICAgICAgICBjb25zdCBuYXZJZDogc3RyaW5nID0gZS5jdXJyZW50VGFyZ2V0Py5pZFxyXG4gICAgICAgIGlmIChtYWluSWQpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIG1haW5TY3JvbGw6IG1haW5JZCxcclxuICAgICAgICAgICAgICAgIG5hdlNlbDogbmF2SWQsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIG9uTWFpblNjcm9sbChlOiBhbnkpIHtcclxuICAgICAgICBjb25zdCB0b3A6IG51bWJlciA9IGUuY3VycmVudFRhcmdldD8ub2Zmc2V0VG9wICsgZS5kZXRhaWw/LnNjcm9sbFRvcFxyXG4gICAgICAgIGlmICh0b3AgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgc2VsSXRlbSA9IHRoaXMuc2Nyb2xsU3RhdGVzLm1haW5JdGVtcy5maW5kKHYgPT4gdi50b3AgPj0gdG9wKVxyXG4gICAgICAgIGlmICghc2VsSXRlbSkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgbmF2U2VsOiBzZWxJdGVtLmRhdGFzZXQubmF2SWQsXHJcbiAgICAgICAgICAgIG5hdlNjcm9sbDogc2VsSXRlbS5kYXRhc2V0Lm5hdlNjcm9sbElkLFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pIl19