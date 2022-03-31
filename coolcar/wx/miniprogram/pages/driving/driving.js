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
const updateIntervalSec = 5;
function durationStr(sec) {
    const dur = format_1.formatDuration(sec);
    return `${dur.hh}:${dur.mm}:${dur.ss}`;
}
Page({
    tripID: '',
    timer: undefined,
    data: {
        location: {
            latitude: 32.92,
            longitude: 118.46,
        },
        scale: 14,
        elapsed: '00:00:00',
        fee: '0.00',
    },
    onLoad(opt) {
        const o = opt;
        this.tripID = o.trip_id;
        console.log('current trip', o.trip_id);
        trip_1.TripService.getTrip(o.trip_id).then(console.log);
        this.setupLocationUpdator();
        this.setupTimer(o.trip_id);
    },
    onUnload() {
        wx.stopLocationUpdate();
        if (this.timer) {
            clearInterval(this.timer);
        }
    },
    setupLocationUpdator() {
        wx.startLocationUpdate({
            fail: console.error,
        }),
            wx.onLocationChange(loc => {
                console.log('location: ', loc);
                this.setData({
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                });
            });
    },
    setupTimer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const trip = yield trip_1.TripService.getTrip(id);
            if (trip.status !== rental_pb_1.rental.v1.TripStatus.IN_PROGRESS) {
                console.error('trip not in progress');
                return;
            }
            let secSinceLastUpdate = 0;
            let lastUpdateDurationSec = trip.current.timestampSec - trip.start.timestampSec;
            this.setData({
                elapsed: durationStr(lastUpdateDurationSec),
                fee: format_1.formatFee(trip.current.feeCent)
            });
            this.timer = setInterval(() => {
                secSinceLastUpdate++;
                if (secSinceLastUpdate % 5 == 0) {
                    trip_1.TripService.getTrip(id).then(trip => {
                        lastUpdateDurationSec = trip.current.timestampSec - trip.start.timestampSec;
                        secSinceLastUpdate = 0;
                        this.setData({
                            fee: format_1.formatFee(trip.current.feeCent),
                        });
                    });
                }
                this.setData({
                    elapsed: durationStr(lastUpdateDurationSec + secSinceLastUpdate),
                });
            }, 1000);
        });
    },
    onEndTripTap() {
        trip_1.TripService.finishTrip(this.tripID).then(() => {
            wx.redirectTo({
                url: routing_1.routing.mytrips()
            });
        }).catch(err => {
            console.error(err);
            wx.showToast({
                title: '行程结束',
                icon: 'none',
            });
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyaXZpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELCtDQUE4RDtBQUM5RCxpREFBNkM7QUFHN0MsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUE7QUFFM0IsU0FBUyxXQUFXLENBQUMsR0FBVztJQUM1QixNQUFNLEdBQUcsR0FBRyx1QkFBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQy9CLE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUM7SUFDRCxNQUFNLEVBQUUsRUFBRTtJQUNWLEtBQUssRUFBRSxTQUErQjtJQUN0QyxJQUFJLEVBQUU7UUFDRixRQUFRLEVBQUU7WUFDTixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxNQUFNO1NBQ3BCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUUsVUFBVTtRQUNuQixHQUFHLEVBQUUsTUFBTTtLQUNkO0lBRUQsTUFBTSxDQUFDLEdBQThCO1FBQ2pDLE1BQU0sQ0FBQyxHQUF3QixHQUFHLENBQUE7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV0QyxrQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lB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QUNmLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuLi8uLi9zZXJ2aWNlL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCJcclxuaW1wb3J0IHsgVHJpcFNlcnZpY2UgfSBmcm9tIFwiLi4vLi4vc2VydmljZS90cmlwXCJcclxuaW1wb3J0IHsgZm9ybWF0RHVyYXRpb24sIGZvcm1hdEZlZSB9IGZyb20gXCIuLi8uLi91dGlscy9mb3JtYXRcIlxyXG5pbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuLy8gY29uc3QgY2VudFBlclNlYyA9IDAuN1xyXG5jb25zdCB1cGRhdGVJbnRlcnZhbFNlYyA9IDUgLy8g5q+PNeenkuWQkeacjeWKoeWZqOS4iuaKpWxvY2F0aW9uXHJcblxyXG5mdW5jdGlvbiBkdXJhdGlvblN0cihzZWM6IG51bWJlcikge1xyXG4gICAgY29uc3QgZHVyID0gZm9ybWF0RHVyYXRpb24oc2VjKVxyXG4gICAgcmV0dXJuIGAke2R1ci5oaH06JHtkdXIubW19OiR7ZHVyLnNzfWBcclxufVxyXG5cclxuUGFnZSh7XHJcbiAgICB0cmlwSUQ6ICcnLFxyXG4gICAgdGltZXI6IHVuZGVmaW5lZCBhcyBudW1iZXIgfCB1bmRlZmluZWQsXHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgbGF0aXR1ZGU6IDMyLjkyLFxyXG4gICAgICAgICAgICBsb25naXR1ZGU6IDExOC40NixcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNjYWxlOiAxNCxcclxuICAgICAgICBlbGFwc2VkOiAnMDA6MDA6MDAnLFxyXG4gICAgICAgIGZlZTogJzAuMDAnLFxyXG4gICAgfSxcclxuXHJcbiAgICBvbkxvYWQob3B0OiBSZWNvcmQ8J3RyaXBfaWQnLCBzdHJpbmc+KSB7XHJcbiAgICAgICAgY29uc3Qgbzogcm91dGluZy5Ecml2aW5nT3B0cyA9IG9wdFxyXG4gICAgICAgIHRoaXMudHJpcElEID0gby50cmlwX2lkXHJcbiAgICAgICAgY29uc29sZS5sb2coJ2N1cnJlbnQgdHJpcCcsIG8udHJpcF9pZClcclxuICAgICAgICAvLyBvLnRyaXBfaWQgPSAnNjIyZTEwYjkxNDU5MmQ1YzUwY2NiN2RjJ1xyXG4gICAgICAgIFRyaXBTZXJ2aWNlLmdldFRyaXAoby50cmlwX2lkKS50aGVuKGNvbnNvbGUubG9nKVxyXG4gICAgICAgIHRoaXMuc2V0dXBMb2NhdGlvblVwZGF0b3IoKVxyXG4gICAgICAgIHRoaXMuc2V0dXBUaW1lcihvLnRyaXBfaWQpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uVW5sb2FkKCkge1xyXG4gICAgICAgIHd4LnN0b3BMb2NhdGlvblVwZGF0ZSgpXHJcbiAgICAgICAgaWYgKHRoaXMudGltZXIpIHtcclxuICAgICAgICAgICAgY2xlYXJJbnRlcnZhbCh0aGlzLnRpbWVyKVxyXG4gICAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgc2V0dXBMb2NhdGlvblVwZGF0b3IoKSB7XHJcbiAgICAgICAgd3guc3RhcnRMb2NhdGlvblVwZGF0ZSh7XHJcbiAgICAgICAgICAgIGZhaWw6IGNvbnNvbGUuZXJyb3IsXHJcbiAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHd4Lm9uTG9jYXRpb25DaGFuZ2UobG9jID0+IHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdsb2NhdGlvbjogJywgbG9jKVxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogbG9jLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IGxvYy5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgYXN5bmMgc2V0dXBUaW1lcihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgLy8g5Zyo6L+b5YWl5pe25YWI55yL5pWw5o2u5bqTXHJcbiAgICAgICAgY29uc3QgdHJpcCA9IGF3YWl0IFRyaXBTZXJ2aWNlLmdldFRyaXAoaWQpXHJcbiAgICAgICAgaWYgKHRyaXAuc3RhdHVzICE9PSByZW50YWwudjEuVHJpcFN0YXR1cy5JTl9QUk9HUkVTUykge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCd0cmlwIG5vdCBpbiBwcm9ncmVzcycpXHJcbiAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgICBsZXQgc2VjU2luY2VMYXN0VXBkYXRlID0gMCAgICAgIC8vIOi3neemu+S4iuasoeivt+axguacjeWKoeWZqOi/h+WOu+eahOaXtumXtFxyXG4gICAgICAgIGxldCBsYXN0VXBkYXRlRHVyYXRpb25TZWMgPSB0cmlwLmN1cnJlbnQhLnRpbWVzdGFtcFNlYyEgLSB0cmlwLnN0YXJ0IS50aW1lc3RhbXBTZWMhICAgLy8g5LiK5qyh6K+i6Zeu5pyN5Yqh5Zmo5pe2IOacjeWKoeWZqOi/lOWbnueahOihjOmptuaAu+aXtumXtFxyXG4gICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgIGVsYXBzZWQ6IGR1cmF0aW9uU3RyKGxhc3RVcGRhdGVEdXJhdGlvblNlYyksXHJcbiAgICAgICAgICAgIGZlZTogZm9ybWF0RmVlKHRyaXAuY3VycmVudCEuZmVlQ2VudCEpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy50aW1lciA9IHNldEludGVydmFsKCgpID0+IHtcclxuICAgICAgICAgICAgc2VjU2luY2VMYXN0VXBkYXRlKytcclxuICAgICAgICAgICAgaWYgKHNlY1NpbmNlTGFzdFVwZGF0ZSAlIDUgPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgVHJpcFNlcnZpY2UuZ2V0VHJpcChpZCkudGhlbih0cmlwID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBsYXN0VXBkYXRlRHVyYXRpb25TZWMgPSB0cmlwLmN1cnJlbnQhLnRpbWVzdGFtcFNlYyEgLSB0cmlwLnN0YXJ0IS50aW1lc3RhbXBTZWMhXHJcbiAgICAgICAgICAgICAgICAgICAgc2VjU2luY2VMYXN0VXBkYXRlID0gMFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZlZTogZm9ybWF0RmVlKHRyaXAuY3VycmVudCEuZmVlQ2VudCEpLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICBlbGFwc2VkOiBkdXJhdGlvblN0cihsYXN0VXBkYXRlRHVyYXRpb25TZWMgKyBzZWNTaW5jZUxhc3RVcGRhdGUpLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0sIDEwMDApXHJcbiAgICB9LFxyXG4gICAgb25FbmRUcmlwVGFwKCkge1xyXG4gICAgICAgIFRyaXBTZXJ2aWNlLmZpbmlzaFRyaXAodGhpcy50cmlwSUQpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICB3eC5yZWRpcmVjdFRvKHtcclxuICAgICAgICAgICAgICAgIHVybDogcm91dGluZy5teXRyaXBzKClcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KS5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKGVycilcclxuICAgICAgICAgICAgd3guc2hvd1RvYXN0KHtcclxuICAgICAgICAgICAgICAgIHRpdGxlOiAn6KGM56iL57uT5p2fJyxcclxuICAgICAgICAgICAgICAgIGljb246ICdub25lJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59KSJdfQ==