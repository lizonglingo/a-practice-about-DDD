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
})(TripService = exports.TripService || (exports.TripService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInRyaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXNEO0FBQ3RELHVDQUFvQztBQUVwQyxJQUFpQixXQUFXLENBUzNCO0FBVEQsV0FBaUIsV0FBVztJQUN4QixTQUFnQixVQUFVLENBQUMsR0FBaUM7UUFDeEQsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLFVBQVU7WUFDaEIsSUFBSSxFQUFFLEdBQUc7WUFDVCxjQUFjLEVBQUUsa0JBQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLFVBQVU7U0FDbEQsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQVBlLHNCQUFVLGFBT3pCLENBQUE7QUFDTCxDQUFDLEVBVGdCLFdBQVcsR0FBWCxtQkFBVyxLQUFYLG1CQUFXLFFBUzNCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgcmVudGFsIH0gZnJvbSBcIi4vcHJvdG9fZ2VuL3JlbnRhbC9yZW50YWxfcGJcIjtcclxuaW1wb3J0IHsgQ29vbGNhciB9IGZyb20gXCIuL3JlcXVlc3RcIjtcclxuXHJcbmV4cG9ydCBuYW1lc3BhY2UgVHJpcFNlcnZpY2Uge1xyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIENyZWF0ZVRyaXAocmVxOiByZW50YWwudjEuSUNyZWF0ZVRyaXBSZXF1ZXN0KTogUHJvbWlzZTxyZW50YWwudjEuSVRyaXBFbnRpdHk+IHtcclxuICAgICAgICByZXR1cm4gQ29vbGNhci5zZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS90cmlwJyxcclxuICAgICAgICAgICAgZGF0YTogcmVxLFxyXG4gICAgICAgICAgICByZXNwTWFyc2hhbGxlcjogcmVudGFsLnYxLlRyaXBFbnRpdHkuZnJvbU9iamVjdCxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59Il19