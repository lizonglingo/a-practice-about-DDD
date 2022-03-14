"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const rental_pb_1 = require("./proto_gen/rental/rental_pb");
const request_1 = require("./request");
var TripService;
(function (TripService) {
    function CreateTrip(req) {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'POST',
            path: '/v1/trip',
            data: req,
            respMarshaller: rental_pb_1.rental.v1.TripEntity.fromObject,
        });
    }
    TripService.CreateTrip = CreateTrip;
    function GetTrip(id) {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'GET',
            path: `/v1/trip/${encodeURIComponent(id)}`,
            respMarshaller: rental_pb_1.rental.v1.Trip.fromObject,
        });
    }
    TripService.GetTrip = GetTrip;
    function GetTrips(s) {
        let path = '/v1/trips';
        if (s) {
            path += `?status=${s}`;
        }
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'GET',
            path,
            respMarshaller: rental_pb_1.rental.v1.GetTripsResponse.fromObject,
        });
    }
    TripService.GetTrips = GetTrips;
})(TripService = exports.TripService || (exports.TripService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXNEO0FBQ3RELHVDQUFvQztBQUVwQyxJQUFpQixXQUFXLENBNkIzQjtBQTdCRCxXQUFpQixXQUFXO0lBQ3hCLFNBQWdCLFVBQVUsQ0FBQyxHQUFpQztRQUN4RCxPQUFPLGlCQUFPLENBQUMsd0JBQXdCLENBQUM7WUFDcEMsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUUsR0FBRztZQUNULGNBQWMsRUFBRSxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVTtTQUNsRCxDQUFDLENBQUE7SUFDTixDQUFDO0lBUGUsc0JBQVUsYUFPekIsQ0FBQTtJQUVELFNBQWdCLE9BQU8sQ0FBQyxFQUFVO1FBQzlCLE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxZQUFZLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzFDLGNBQWMsRUFBRSxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtTQUM1QyxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsbUJBQU8sVUFNdEIsQ0FBQTtJQUVELFNBQWdCLFFBQVEsQ0FBQyxDQUF3QjtRQUM3QyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUE7UUFDdEIsSUFBSSxDQUFDLEVBQUU7WUFDSCxJQUFJLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQTtTQUN6QjtRQUNELE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUk7WUFDSixjQUFjLEVBQUUsa0JBQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVTtTQUN4RCxDQUFDLENBQUE7SUFDTixDQUFDO0lBVmUsb0JBQVEsV0FVdkIsQ0FBQTtBQUNMLENBQUMsRUE3QmdCLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBNkIzQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCI7XHJcbmltcG9ydCB7IENvb2xjYXIgfSBmcm9tIFwiLi9yZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIFRyaXBTZXJ2aWNlIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBDcmVhdGVUcmlwKHJlcTogcmVudGFsLnYxLklDcmVhdGVUcmlwUmVxdWVzdCk6IFByb21pc2U8cmVudGFsLnYxLklUcmlwRW50aXR5PiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvdHJpcCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHJlcSxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5UcmlwRW50aXR5LmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gR2V0VHJpcChpZDogc3RyaW5nKTogUHJvbWlzZTxyZW50YWwudjEuSVRyaXA+e1xyXG4gICAgICAgIHJldHVybiBDb29sY2FyLnNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIHBhdGg6IGAvdjEvdHJpcC8ke2VuY29kZVVSSUNvbXBvbmVudChpZCl9YCxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5UcmlwLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gR2V0VHJpcHMocz86IHJlbnRhbC52MS5UcmlwU3RhdHVzKTogUHJvbWlzZTxyZW50YWwudjEuSUdldFRyaXBzUmVzcG9uc2U+IHtcclxuICAgICAgICBsZXQgcGF0aCA9ICcvdjEvdHJpcHMnXHJcbiAgICAgICAgaWYgKHMpIHtcclxuICAgICAgICAgICAgcGF0aCArPSBgP3N0YXR1cz0ke3N9YFxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gQ29vbGNhci5zZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBwYXRoLFxyXG4gICAgICAgICAgICByZXNwTWFyc2hhbGxlcjogcmVudGFsLnYxLkdldFRyaXBzUmVzcG9uc2UuZnJvbU9iamVjdCxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59Il19