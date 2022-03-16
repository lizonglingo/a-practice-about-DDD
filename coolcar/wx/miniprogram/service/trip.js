"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripService = void 0;
const rental_pb_1 = require("./proto_gen/rental/rental_pb");
const request_1 = require("./request");
var TripService;
(function (TripService) {
    function createTrip(req) {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'POST',
            path: '/v1/trip',
            data: req,
            respMarshaller: rental_pb_1.rental.v1.TripEntity.fromObject,
        });
    }
    TripService.createTrip = createTrip;
    function getTrip(id) {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'GET',
            path: `/v1/trip/${encodeURIComponent(id)}`,
            respMarshaller: rental_pb_1.rental.v1.Trip.fromObject,
        });
    }
    TripService.getTrip = getTrip;
    function getTrips(s) {
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
    TripService.getTrips = getTrips;
    function updateTripPos(id, loc) {
        return updateTrip({
            id,
            current: loc,
        });
    }
    TripService.updateTripPos = updateTripPos;
    function finishTrip(id) {
        return updateTrip({
            id: id,
            endTrip: true,
        });
    }
    TripService.finishTrip = finishTrip;
    function updateTrip(r) {
        if (!r.id) {
            return Promise.reject("must specify id");
        }
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'PUT',
            path: `/v1/trip/${encodeURIComponent(r.id)}`,
            data: r,
            respMarshaller: rental_pb_1.rental.v1.Trip.fromObject,
        });
    }
})(TripService = exports.TripService || (exports.TripService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXNEO0FBQ3RELHVDQUFvQztBQUVwQyxJQUFpQixXQUFXLENBMEQzQjtBQTFERCxXQUFpQixXQUFXO0lBQ3hCLFNBQWdCLFVBQVUsQ0FBQyxHQUFpQztRQUN4RCxPQUFPLGlCQUFPLENBQUMsd0JBQXdCLENBQUM7WUFDcEMsTUFBTSxFQUFFLE1BQU07WUFDZCxJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUUsR0FBRztZQUNULGNBQWMsRUFBRSxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsVUFBVTtTQUNsRCxDQUFDLENBQUE7SUFDTixDQUFDO0lBUGUsc0JBQVUsYUFPekIsQ0FBQTtJQUVELFNBQWdCLE9BQU8sQ0FBQyxFQUFVO1FBQzlCLE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUksRUFBRSxZQUFZLGtCQUFrQixDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzFDLGNBQWMsRUFBRSxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsVUFBVTtTQUM1QyxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsbUJBQU8sVUFNdEIsQ0FBQTtJQUVELFNBQWdCLFFBQVEsQ0FBQyxDQUF3QjtRQUM3QyxJQUFJLElBQUksR0FBRyxXQUFXLENBQUE7UUFDdEIsSUFBSSxDQUFDLEVBQUU7WUFDSCxJQUFJLElBQUksV0FBVyxDQUFDLEVBQUUsQ0FBQTtTQUN6QjtRQUNELE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsS0FBSztZQUNiLElBQUk7WUFDSixjQUFjLEVBQUUsa0JBQU0sQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsVUFBVTtTQUN4RCxDQUFDLENBQUE7SUFDTixDQUFDO0lBVmUsb0JBQVEsV0FVdkIsQ0FBQTtJQUdELFNBQWdCLGFBQWEsQ0FBQyxFQUFVLEVBQUUsR0FBeUI7UUFDL0QsT0FBTyxVQUFVLENBQUM7WUFDZCxFQUFFO1lBQ0YsT0FBTyxFQUFFLEdBQUc7U0FDZixDQUFDLENBQUE7SUFDTixDQUFDO0lBTGUseUJBQWEsZ0JBSzVCLENBQUE7SUFFRCxTQUFnQixVQUFVLENBQUMsRUFBVTtRQUNqQyxPQUFPLFVBQVUsQ0FBQztZQUNkLEVBQUUsRUFBRSxFQUFFO1lBQ04sT0FBTyxFQUFFLElBQUk7U0FDaEIsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQUxlLHNCQUFVLGFBS3pCLENBQUE7SUFFRCxTQUFTLFVBQVUsQ0FBQyxDQUErQjtRQUMvQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRTtZQUNQLE9BQU8sT0FBTyxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFBO1NBQzNDO1FBQ0QsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLFlBQVksa0JBQWtCLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQzVDLElBQUksRUFBRSxDQUFDO1lBQ1AsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVO1NBQzVDLENBQUMsQ0FBQTtJQUNOLENBQUM7QUFHTCxDQUFDLEVBMURnQixXQUFXLEdBQVgsbUJBQVcsS0FBWCxtQkFBVyxRQTBEM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW50YWwgfSBmcm9tIFwiLi9wcm90b19nZW4vcmVudGFsL3JlbnRhbF9wYlwiO1xyXG5pbXBvcnQgeyBDb29sY2FyIH0gZnJvbSBcIi4vcmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBUcmlwU2VydmljZSB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gY3JlYXRlVHJpcChyZXE6IHJlbnRhbC52MS5JQ3JlYXRlVHJpcFJlcXVlc3QpOiBQcm9taXNlPHJlbnRhbC52MS5JVHJpcEVudGl0eT4ge1xyXG4gICAgICAgIHJldHVybiBDb29sY2FyLnNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICBwYXRoOiAnL3YxL3RyaXAnLFxyXG4gICAgICAgICAgICBkYXRhOiByZXEsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuVHJpcEVudGl0eS5mcm9tT2JqZWN0LFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFRyaXAoaWQ6IHN0cmluZyk6IFByb21pc2U8cmVudGFsLnYxLklUcmlwPntcclxuICAgICAgICByZXR1cm4gQ29vbGNhci5zZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICBwYXRoOiBgL3YxL3RyaXAvJHtlbmNvZGVVUklDb21wb25lbnQoaWQpfWAsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuVHJpcC5mcm9tT2JqZWN0LFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGdldFRyaXBzKHM/OiByZW50YWwudjEuVHJpcFN0YXR1cyk6IFByb21pc2U8cmVudGFsLnYxLklHZXRUcmlwc1Jlc3BvbnNlPiB7XHJcbiAgICAgICAgbGV0IHBhdGggPSAnL3YxL3RyaXBzJ1xyXG4gICAgICAgIGlmIChzKSB7XHJcbiAgICAgICAgICAgIHBhdGggKz0gYD9zdGF0dXM9JHtzfWBcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgcGF0aCxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5HZXRUcmlwc1Jlc3BvbnNlLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIHVwZGF0ZVRyaXBQb3MoaWQ6IHN0cmluZywgbG9jPzogcmVudGFsLnYxLklMb2NhdGlvbikge1xyXG4gICAgICAgIHJldHVybiB1cGRhdGVUcmlwKHtcclxuICAgICAgICAgICAgaWQsXHJcbiAgICAgICAgICAgIGN1cnJlbnQ6IGxvYyxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBmaW5pc2hUcmlwKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdXBkYXRlVHJpcCh7XHJcbiAgICAgICAgICAgIGlkOiBpZCxcclxuICAgICAgICAgICAgZW5kVHJpcDogdHJ1ZSxcclxuICAgICAgICB9KVxyXG4gICAgfSBcclxuXHJcbiAgICBmdW5jdGlvbiB1cGRhdGVUcmlwKHI6IHJlbnRhbC52MS5JVXBkYXRlVHJpcFJlcXVlc3QpOiBQcm9taXNlPHJlbnRhbC52MS5JVHJpcD4ge1xyXG4gICAgICAgIGlmICghci5pZCkge1xyXG4gICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QoXCJtdXN0IHNwZWNpZnkgaWRcIilcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgcGF0aDogYC92MS90cmlwLyR7ZW5jb2RlVVJJQ29tcG9uZW50KHIuaWQpfWAsXHJcbiAgICAgICAgICAgIGRhdGE6IHIsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuVHJpcC5mcm9tT2JqZWN0LFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxufSJdfQ==