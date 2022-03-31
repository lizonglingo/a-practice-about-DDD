"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarService = void 0;
const camelcaseKeys = require("camelcase-keys");
const car_pb_1 = require("./proto_gen/car/car_pb");
const request_1 = require("./request");
var CarService;
(function (CarService) {
    function subscribe(onMsg) {
        const socket = wx.connectSocket({
            url: request_1.Coolcar.wsAddr + "/ws"
        });
        socket.onMessage(msg => {
            const obj = JSON.parse(msg.data);
            onMsg(car_pb_1.car.v1.CarEntity.fromObject(camelcaseKeys(obj, {
                deep: true,
            })));
        });
        return socket;
    }
    CarService.subscribe = subscribe;
    function getCar(id) {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'GET',
            path: `/v1/car/${encodeURIComponent(id)}`,
            respMarshaller: car_pb_1.car.v1.Car.fromObject,
        });
    }
    CarService.getCar = getCar;
})(CarService = exports.CarService || (exports.CarService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2FyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLGdEQUFpRDtBQUNqRCxtREFBNkM7QUFDN0MsdUNBQW9DO0FBRXBDLElBQWlCLFVBQVUsQ0F5QjFCO0FBekJELFdBQWlCLFVBQVU7SUFDdkIsU0FBZ0IsU0FBUyxDQUFDLEtBQXFDO1FBQzNELE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQyxhQUFhLENBQUM7WUFDNUIsR0FBRyxFQUFFLGlCQUFPLENBQUMsTUFBTSxHQUFHLEtBQUs7U0FDOUIsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNuQixNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFjLENBQUMsQ0FBQTtZQUMxQyxLQUFLLENBQUMsWUFBRyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUM3QixhQUFhLENBQUMsR0FBRyxFQUFFO2dCQUNmLElBQUksRUFBRSxJQUFJO2FBQ2IsQ0FBQyxDQUNMLENBQUMsQ0FBQTtRQUNOLENBQUMsQ0FBQyxDQUFBO1FBQ0YsT0FBTyxNQUFNLENBQUE7SUFDakIsQ0FBQztJQWJlLG9CQUFTLFlBYXhCLENBQUE7SUFFRCxTQUFnQixNQUFNLENBQUMsRUFBVTtRQUM3QixPQUFPLGlCQUFPLENBQUMsd0JBQXdCLENBQUM7WUFDcEMsTUFBTSxFQUFFLEtBQUs7WUFDYixJQUFJLEVBQUUsV0FBVyxrQkFBa0IsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN6QyxjQUFjLEVBQUUsWUFBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsVUFBVTtTQUN4QyxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsaUJBQU0sU0FNckIsQ0FBQTtBQUdMLENBQUMsRUF6QmdCLFVBQVUsR0FBVixrQkFBVSxLQUFWLGtCQUFVLFFBeUIxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjYW1lbGNhc2VLZXlzID0gcmVxdWlyZShcImNhbWVsY2FzZS1rZXlzXCIpO1xyXG5pbXBvcnQgeyBjYXIgfSBmcm9tIFwiLi9wcm90b19nZW4vY2FyL2Nhcl9wYlwiO1xyXG5pbXBvcnQgeyBDb29sY2FyIH0gZnJvbSBcIi4vcmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBDYXJTZXJ2aWNlIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBzdWJzY3JpYmUob25Nc2c6IChjOiBjYXIudjEuSUNhckVudGl0eSkgPT4gdm9pZCkge1xyXG4gICAgICAgIGNvbnN0IHNvY2tldCA9IHd4LmNvbm5lY3RTb2NrZXQoe1xyXG4gICAgICAgICAgICB1cmw6IENvb2xjYXIud3NBZGRyICsgXCIvd3NcIlxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgc29ja2V0Lm9uTWVzc2FnZShtc2cgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvYmogPSBKU09OLnBhcnNlKG1zZy5kYXRhIGFzIHN0cmluZylcclxuICAgICAgICAgICAgb25Nc2coY2FyLnYxLkNhckVudGl0eS5mcm9tT2JqZWN0KFxyXG4gICAgICAgICAgICAgICAgY2FtZWxjYXNlS2V5cyhvYmosIHtcclxuICAgICAgICAgICAgICAgICAgICBkZWVwOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICB9KVxyXG4gICAgICAgIHJldHVybiBzb2NrZXRcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0Q2FyKGlkOiBzdHJpbmcpOiBQcm9taXNlPGNhci52MS5JQ2FyPiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgcGF0aDogYC92MS9jYXIvJHtlbmNvZGVVUklDb21wb25lbnQoaWQpfWAsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiBjYXIudjEuQ2FyLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG59Il19