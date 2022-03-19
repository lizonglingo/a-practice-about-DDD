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
            const trip = yield trip_1.TripService.updateTripPos(id);
            let secSinceLastUpdate = 0;
            let lastUpdateDurationSec = trip.current.timestampSec - trip.start.timestampSec;
            this.setData({
                elapsed: durationStr(lastUpdateDurationSec),
                fee: format_1.formatFee(trip.current.feeCent)
            });
            this.timer = setInterval(() => {
                secSinceLastUpdate++;
                if (secSinceLastUpdate % 5 == 0) {
                    trip_1.TripService.updateTripPos(id, {
                        latitude: this.data.location.latitude,
                        longitude: this.data.location.longitude,
                    }).then(trip => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyaXZpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSw2Q0FBZ0Q7QUFDaEQsK0NBQThEO0FBQzlELGlEQUE2QztBQUc3QyxNQUFNLGlCQUFpQixHQUFHLENBQUMsQ0FBQTtBQUUzQixTQUFTLFdBQVcsQ0FBQyxHQUFXO0lBQzVCLE1BQU0sR0FBRyxHQUFHLHVCQUFjLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDL0IsT0FBTyxHQUFHLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsSUFBSSxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUE7QUFDMUMsQ0FBQztBQUVELElBQUksQ0FBQztJQUNELE1BQU0sRUFBRSxFQUFFO0lBQ1YsS0FBSyxFQUFFLFNBQStCO0lBQ3RDLElBQUksRUFBRTtRQUNGLFFBQVEsRUFBRTtZQUNOLFFBQVEsRUFBRSxLQUFLO1lBQ2YsU0FBUyxFQUFFLE1BQU07U0FDcEI7UUFDRCxLQUFLLEVBQUUsRUFBRTtRQUNULE9BQU8sRUFBRSxVQUFVO1FBQ25CLEdBQUcsRUFBRSxNQUFNO0tBQ2Q7SUFFRCxNQUFNLENBQUMsR0FBOEI7UUFDakMsTUFBTSxDQUFDLEdBQXdCLEdBQUcsQ0FBQTtRQUNsQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUE7UUFDdkIsT0FBTyxDQUFDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRXRDLGtCQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQ2hELElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFBO1FBQzNCLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQzlCLENBQUM7SUFFRCxRQUFRO1FBQ0os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QUFBO0lBQ04sQ0FBQztDQUNKLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IFRyaXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvdHJpcFwiXHJcbmltcG9ydCB7IGZvcm1hdER1cmF0aW9uLCBmb3JtYXRGZWUgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZm9ybWF0XCJcclxuaW1wb3J0IHsgcm91dGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9yb3V0aW5nXCJcclxuXHJcbi8vIGNvbnN0IGNlbnRQZXJTZWMgPSAwLjdcclxuY29uc3QgdXBkYXRlSW50ZXJ2YWxTZWMgPSA1IC8vIOavjzXnp5LlkJHmnI3liqHlmajkuIrmiqVsb2NhdGlvblxyXG5cclxuZnVuY3Rpb24gZHVyYXRpb25TdHIoc2VjOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGR1ciA9IGZvcm1hdER1cmF0aW9uKHNlYylcclxuICAgIHJldHVybiBgJHtkdXIuaGh9OiR7ZHVyLm1tfToke2R1ci5zc31gXHJcbn1cclxuXHJcblBhZ2Uoe1xyXG4gICAgdHJpcElEOiAnJyxcclxuICAgIHRpbWVyOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiAzMi45MixcclxuICAgICAgICAgICAgbG9uZ2l0dWRlOiAxMTguNDYsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2FsZTogMTQsXHJcbiAgICAgICAgZWxhcHNlZDogJzAwOjAwOjAwJyxcclxuICAgICAgICBmZWU6ICcwLjAwJyxcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKG9wdDogUmVjb3JkPCd0cmlwX2lkJywgc3RyaW5nPikge1xyXG4gICAgICAgIGNvbnN0IG86IHJvdXRpbmcuRHJpdmluZ09wdHMgPSBvcHRcclxuICAgICAgICB0aGlzLnRyaXBJRCA9IG8udHJpcF9pZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IHRyaXAnLCBvLnRyaXBfaWQpXHJcbiAgICAgICAgLy8gby50cmlwX2lkID0gJzYyMmUxMGI5MTQ1OTJkNWM1MGNjYjdkYydcclxuICAgICAgICBUcmlwU2VydmljZS5nZXRUcmlwKG8udHJpcF9pZCkudGhlbihjb25zb2xlLmxvZylcclxuICAgICAgICB0aGlzLnNldHVwTG9jYXRpb25VcGRhdG9yKClcclxuICAgICAgICB0aGlzLnNldHVwVGltZXIoby50cmlwX2lkKVxyXG4gICAgfSxcclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICB3eC5zdG9wTG9jYXRpb25VcGRhdGUoKVxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcilcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldHVwTG9jYXRpb25VcGRhdG9yKCkge1xyXG4gICAgICAgIHd4LnN0YXJ0TG9jYXRpb25VcGRhdGUoe1xyXG4gICAgICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgICAgICB3eC5vbkxvY2F0aW9uQ2hhbmdlKGxvYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9jYXRpb246ICcsIGxvYylcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGxvYy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb2MubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGFzeW5jIHNldHVwVGltZXIoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIC8vIOWcqOi/m+WFpeaXtuWFiOeci+aVsOaNruW6k1xyXG4gICAgICAgIGNvbnN0IHRyaXAgPSBhd2FpdCBUcmlwU2VydmljZS51cGRhdGVUcmlwUG9zKGlkKVxyXG4gICAgICAgIGxldCBzZWNTaW5jZUxhc3RVcGRhdGUgPSAwICAgICAgLy8g6Led56a75LiK5qyh6K+35rGC5pyN5Yqh5Zmo6L+H5Y6755qE5pe26Ze0XHJcbiAgICAgICAgbGV0IGxhc3RVcGRhdGVEdXJhdGlvblNlYyA9IHRyaXAuY3VycmVudCEudGltZXN0YW1wU2VjISAtIHRyaXAuc3RhcnQhLnRpbWVzdGFtcFNlYyEgICAvLyDkuIrmrKHor6Lpl67mnI3liqHlmajml7Yg5pyN5Yqh5Zmo6L+U5Zue55qE6KGM6am25oC75pe26Ze0XHJcbiAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgZWxhcHNlZDogZHVyYXRpb25TdHIobGFzdFVwZGF0ZUR1cmF0aW9uU2VjKSxcclxuICAgICAgICAgICAgZmVlOiBmb3JtYXRGZWUodHJpcC5jdXJyZW50IS5mZWVDZW50ISlcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICB0aGlzLnRpbWVyID0gc2V0SW50ZXJ2YWwoKCkgPT4ge1xyXG4gICAgICAgICAgICBzZWNTaW5jZUxhc3RVcGRhdGUrK1xyXG4gICAgICAgICAgICBpZiAoc2VjU2luY2VMYXN0VXBkYXRlICUgNSA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBUcmlwU2VydmljZS51cGRhdGVUcmlwUG9zKGlkLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IHRoaXMuZGF0YS5sb2NhdGlvbi5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICBsb25naXR1ZGU6IHRoaXMuZGF0YS5sb2NhdGlvbi5sb25naXR1ZGUsXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKHRyaXAgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RVcGRhdGVEdXJhdGlvblNlYyA9IHRyaXAuY3VycmVudCEudGltZXN0YW1wU2VjISAtIHRyaXAuc3RhcnQhLnRpbWVzdGFtcFNlYyFcclxuICAgICAgICAgICAgICAgICAgICBzZWNTaW5jZUxhc3RVcGRhdGUgPSAwXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmVlOiBmb3JtYXRGZWUodHJpcC5jdXJyZW50IS5mZWVDZW50ISksXHJcbiAgICAgICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKHtcclxuICAgICAgICAgICAgICAgIGVsYXBzZWQ6IGR1cmF0aW9uU3RyKGxhc3RVcGRhdGVEdXJhdGlvblNlYyArIHNlY1NpbmNlTGFzdFVwZGF0ZSksXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgMTAwMClcclxuICAgIH0sXHJcbiAgICBvbkVuZFRyaXBUYXAoKSB7XHJcbiAgICAgICAgVHJpcFNlcnZpY2UuZmluaXNoVHJpcCh0aGlzLnRyaXBJRCkudGhlbigoKSA9PiB7XHJcbiAgICAgICAgICAgIHd4LnJlZGlyZWN0VG8oe1xyXG4gICAgICAgICAgICAgICAgdXJsOiByb3V0aW5nLm15dHJpcHMoKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKVxyXG4gICAgICAgICAgICB3eC5zaG93VG9hc3Qoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6ICfooYznqIvnu5PmnZ8nLFxyXG4gICAgICAgICAgICAgICAgaWNvbjogJ25vbmUnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pIl19