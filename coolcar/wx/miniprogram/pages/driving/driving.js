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
            const trip = yield trip_1.TripService.updateTripPos(id);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJpdmluZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyaXZpbmcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQSx3RUFBaUU7QUFDakUsNkNBQWdEO0FBQ2hELCtDQUE4RDtBQUM5RCxpREFBNkM7QUFHN0MsTUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUE7QUFFM0IsU0FBUyxXQUFXLENBQUMsR0FBVztJQUM1QixNQUFNLEdBQUcsR0FBRyx1QkFBYyxDQUFDLEdBQUcsQ0FBQyxDQUFBO0lBQy9CLE9BQU8sR0FBRyxHQUFHLENBQUMsRUFBRSxJQUFJLEdBQUcsQ0FBQyxFQUFFLElBQUksR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFBO0FBQzFDLENBQUM7QUFFRCxJQUFJLENBQUM7SUFDRCxNQUFNLEVBQUUsRUFBRTtJQUNWLEtBQUssRUFBRSxTQUErQjtJQUN0QyxJQUFJLEVBQUU7UUFDRixRQUFRLEVBQUU7WUFDTixRQUFRLEVBQUUsS0FBSztZQUNmLFNBQVMsRUFBRSxNQUFNO1NBQ3BCO1FBQ0QsS0FBSyxFQUFFLEVBQUU7UUFDVCxPQUFPLEVBQUUsVUFBVTtRQUNuQixHQUFHLEVBQUUsTUFBTTtLQUNkO0lBRUQsTUFBTSxDQUFDLEdBQThCO1FBQ2pDLE1BQU0sQ0FBQyxHQUF3QixHQUFHLENBQUE7UUFDbEMsSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsT0FBTyxDQUFBO1FBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUV0QyxrQkFBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQTtRQUNoRCxJQUFJLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtRQUMzQixJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lB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LEVBQUU7WUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFBO1lBQ2xCLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1QsS0FBSyxFQUFFLE1BQU07Z0JBQ2IsSUFBSSxFQUFFLE1BQU07YUFDZixDQUFDLENBQUE7UUFDTixDQUFDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW50YWwgfSBmcm9tIFwiLi4vLi4vc2VydmljZS9wcm90b19nZW4vcmVudGFsL3JlbnRhbF9wYlwiXHJcbmltcG9ydCB7IFRyaXBTZXJ2aWNlIH0gZnJvbSBcIi4uLy4uL3NlcnZpY2UvdHJpcFwiXHJcbmltcG9ydCB7IGZvcm1hdER1cmF0aW9uLCBmb3JtYXRGZWUgfSBmcm9tIFwiLi4vLi4vdXRpbHMvZm9ybWF0XCJcclxuaW1wb3J0IHsgcm91dGluZyB9IGZyb20gXCIuLi8uLi91dGlscy9yb3V0aW5nXCJcclxuXHJcbi8vIGNvbnN0IGNlbnRQZXJTZWMgPSAwLjdcclxuY29uc3QgdXBkYXRlSW50ZXJ2YWxTZWMgPSA1IC8vIOavjzXnp5LlkJHmnI3liqHlmajkuIrmiqVsb2NhdGlvblxyXG5cclxuZnVuY3Rpb24gZHVyYXRpb25TdHIoc2VjOiBudW1iZXIpIHtcclxuICAgIGNvbnN0IGR1ciA9IGZvcm1hdER1cmF0aW9uKHNlYylcclxuICAgIHJldHVybiBgJHtkdXIuaGh9OiR7ZHVyLm1tfToke2R1ci5zc31gXHJcbn1cclxuXHJcblBhZ2Uoe1xyXG4gICAgdHJpcElEOiAnJyxcclxuICAgIHRpbWVyOiB1bmRlZmluZWQgYXMgbnVtYmVyIHwgdW5kZWZpbmVkLFxyXG4gICAgZGF0YToge1xyXG4gICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICAgIGxhdGl0dWRlOiAzMi45MixcclxuICAgICAgICAgICAgbG9uZ2l0dWRlOiAxMTguNDYsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzY2FsZTogMTQsXHJcbiAgICAgICAgZWxhcHNlZDogJzAwOjAwOjAwJyxcclxuICAgICAgICBmZWU6ICcwLjAwJyxcclxuICAgIH0sXHJcblxyXG4gICAgb25Mb2FkKG9wdDogUmVjb3JkPCd0cmlwX2lkJywgc3RyaW5nPikge1xyXG4gICAgICAgIGNvbnN0IG86IHJvdXRpbmcuRHJpdmluZ09wdHMgPSBvcHRcclxuICAgICAgICB0aGlzLnRyaXBJRCA9IG8udHJpcF9pZFxyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjdXJyZW50IHRyaXAnLCBvLnRyaXBfaWQpXHJcbiAgICAgICAgLy8gby50cmlwX2lkID0gJzYyMmUxMGI5MTQ1OTJkNWM1MGNjYjdkYydcclxuICAgICAgICBUcmlwU2VydmljZS5nZXRUcmlwKG8udHJpcF9pZCkudGhlbihjb25zb2xlLmxvZylcclxuICAgICAgICB0aGlzLnNldHVwTG9jYXRpb25VcGRhdG9yKClcclxuICAgICAgICB0aGlzLnNldHVwVGltZXIoby50cmlwX2lkKVxyXG4gICAgfSxcclxuXHJcbiAgICBvblVubG9hZCgpIHtcclxuICAgICAgICB3eC5zdG9wTG9jYXRpb25VcGRhdGUoKVxyXG4gICAgICAgIGlmICh0aGlzLnRpbWVyKSB7XHJcbiAgICAgICAgICAgIGNsZWFySW50ZXJ2YWwodGhpcy50aW1lcilcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIHNldHVwTG9jYXRpb25VcGRhdG9yKCkge1xyXG4gICAgICAgIHd4LnN0YXJ0TG9jYXRpb25VcGRhdGUoe1xyXG4gICAgICAgICAgICBmYWlsOiBjb25zb2xlLmVycm9yLFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgICAgICB3eC5vbkxvY2F0aW9uQ2hhbmdlKGxvYyA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbG9jYXRpb246ICcsIGxvYylcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0RGF0YSh7XHJcbiAgICAgICAgICAgICAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGxvYy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiBsb2MubG9uZ2l0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgfSxcclxuICAgIGFzeW5jIHNldHVwVGltZXIoaWQ6IHN0cmluZykge1xyXG4gICAgICAgIC8vIOWcqOi/m+WFpeaXtuWFiOeci+aVsOaNruW6k1xyXG4gICAgICAgIGNvbnN0IHRyaXAgPSBhd2FpdCBUcmlwU2VydmljZS51cGRhdGVUcmlwUG9zKGlkKVxyXG4gICAgICAgIGlmICh0cmlwLnN0YXR1cyAhPT0gcmVudGFsLnYxLlRyaXBTdGF0dXMuSU5fUFJPR1JFU1MpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcigndHJpcCBub3QgaW4gcHJvZ3Jlc3MnKVxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgbGV0IHNlY1NpbmNlTGFzdFVwZGF0ZSA9IDAgICAgICAvLyDot53nprvkuIrmrKHor7fmsYLmnI3liqHlmajov4fljrvnmoTml7bpl7RcclxuICAgICAgICBsZXQgbGFzdFVwZGF0ZUR1cmF0aW9uU2VjID0gdHJpcC5jdXJyZW50IS50aW1lc3RhbXBTZWMhIC0gdHJpcC5zdGFydCEudGltZXN0YW1wU2VjISAgIC8vIOS4iuasoeivoumXruacjeWKoeWZqOaXtiDmnI3liqHlmajov5Tlm57nmoTooYzpqbbmgLvml7bpl7RcclxuICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICBlbGFwc2VkOiBkdXJhdGlvblN0cihsYXN0VXBkYXRlRHVyYXRpb25TZWMpLFxyXG4gICAgICAgICAgICBmZWU6IGZvcm1hdEZlZSh0cmlwLmN1cnJlbnQhLmZlZUNlbnQhKVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIHRoaXMudGltZXIgPSBzZXRJbnRlcnZhbCgoKSA9PiB7XHJcbiAgICAgICAgICAgIHNlY1NpbmNlTGFzdFVwZGF0ZSsrXHJcbiAgICAgICAgICAgIGlmIChzZWNTaW5jZUxhc3RVcGRhdGUgJSA1ID09IDApIHtcclxuICAgICAgICAgICAgICAgIFRyaXBTZXJ2aWNlLnVwZGF0ZVRyaXBQb3MoaWQsIHtcclxuICAgICAgICAgICAgICAgICAgICBsYXRpdHVkZTogdGhpcy5kYXRhLmxvY2F0aW9uLmxhdGl0dWRlLFxyXG4gICAgICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogdGhpcy5kYXRhLmxvY2F0aW9uLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4odHJpcCA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdFVwZGF0ZUR1cmF0aW9uU2VjID0gdHJpcC5jdXJyZW50IS50aW1lc3RhbXBTZWMhIC0gdHJpcC5zdGFydCEudGltZXN0YW1wU2VjIVxyXG4gICAgICAgICAgICAgICAgICAgIHNlY1NpbmNlTGFzdFVwZGF0ZSA9IDBcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmZWU6IGZvcm1hdEZlZSh0cmlwLmN1cnJlbnQhLmZlZUNlbnQhKSxcclxuICAgICAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoe1xyXG4gICAgICAgICAgICAgICAgZWxhcHNlZDogZHVyYXRpb25TdHIobGFzdFVwZGF0ZUR1cmF0aW9uU2VjICsgc2VjU2luY2VMYXN0VXBkYXRlKSxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICB9LCAxMDAwKVxyXG4gICAgfSxcclxuICAgIG9uRW5kVHJpcFRhcCgpIHtcclxuICAgICAgICBUcmlwU2VydmljZS5maW5pc2hUcmlwKHRoaXMudHJpcElEKS50aGVuKCgpID0+IHtcclxuICAgICAgICAgICAgd3gucmVkaXJlY3RUbyh7XHJcbiAgICAgICAgICAgICAgICB1cmw6IHJvdXRpbmcubXl0cmlwcygpXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihlcnIpXHJcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XHJcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+ihjOeoi+e7k+adnycsXHJcbiAgICAgICAgICAgICAgICBpY29uOiAnbm9uZScsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSkiXX0=