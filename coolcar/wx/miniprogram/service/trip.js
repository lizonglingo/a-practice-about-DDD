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
            respMarshaller: rental_pb_1.rental.v1.CreateTripResponse.fromObject,
        });
    }
    TripService.CreateTrip = CreateTrip;
})(TripService = exports.TripService || (exports.TripService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXNEO0FBQ3RELHVDQUFvQztBQUVwQyxJQUFpQixXQUFXLENBUzNCO0FBVEQsV0FBaUIsV0FBVztJQUN4QixTQUFnQixVQUFVLENBQUMsR0FBaUM7UUFDeEQsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLEdBQUc7WUFDVCxjQUFjLEVBQUUsa0JBQU0sQ0FBQyxFQUFFLENBQUMsa0JBQWtCLENBQUMsVUFBVTtTQUMxRCxDQUFDLENBQUE7SUFDTixDQUFDO0lBUGUsc0JBQVUsYUFPekIsQ0FBQTtBQUNMLENBQUMsRUFUZ0IsV0FBVyxHQUFYLG1CQUFXLEtBQVgsbUJBQVcsUUFTM0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByZW50YWwgfSBmcm9tIFwiLi9wcm90b19nZW4vcmVudGFsL3JlbnRhbF9wYlwiO1xyXG5pbXBvcnQgeyBDb29sY2FyIH0gZnJvbSBcIi4vcmVxdWVzdFwiO1xyXG5cclxuZXhwb3J0IG5hbWVzcGFjZSBUcmlwU2VydmljZSB7XHJcbiAgICBleHBvcnQgZnVuY3Rpb24gQ3JlYXRlVHJpcChyZXE6IHJlbnRhbC52MS5JQ3JlYXRlVHJpcFJlcXVlc3QpOiBQcm9taXNlPHJlbnRhbC52MS5JQ3JlYXRlVHJpcFJlc3BvbnNlPiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvdHJpcCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHJlcSxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5DcmVhdGVUcmlwUmVzcG9uc2UuZnJvbU9iamVjdCxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59Il19