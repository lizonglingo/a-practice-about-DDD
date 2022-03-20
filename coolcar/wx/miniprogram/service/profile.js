"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileService = void 0;
const rental_pb_1 = require("./proto_gen/rental/rental_pb");
const request_1 = require("./request");
var ProfileService;
(function (ProfileService) {
    function getProfile() {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'GET',
            path: `/v1/profile`,
            respMarshaller: rental_pb_1.rental.v1.Profile.fromObject,
        });
    }
    ProfileService.getProfile = getProfile;
    function submintProfile(req) {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'POST',
            path: '/v1/profile',
            data: req,
            respMarshaller: rental_pb_1.rental.v1.Profile.fromObject
        });
    }
    ProfileService.submintProfile = submintProfile;
    function clearProfile() {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'DELETE',
            path: '/v1/profile',
            respMarshaller: rental_pb_1.rental.v1.Profile.fromObject
        });
    }
    ProfileService.clearProfile = clearProfile;
})(ProfileService = exports.ProfileService || (exports.ProfileService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXNEO0FBQ3RELHVDQUFvQztBQUVwQyxJQUFpQixjQUFjLENBeUI5QjtBQXpCRCxXQUFpQixjQUFjO0lBQzNCLFNBQWdCLFVBQVU7UUFDdEIsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLGFBQWE7WUFDbkIsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1NBQy9DLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFOZSx5QkFBVSxhQU16QixDQUFBO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLEdBQXdCO1FBQ25ELE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxhQUFhO1lBQ25CLElBQUksRUFBRSxHQUFHO1lBQ1QsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1NBQy9DLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFQZSw2QkFBYyxpQkFPN0IsQ0FBQTtJQUVELFNBQWdCLFlBQVk7UUFDeEIsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUksRUFBRSxhQUFhO1lBQ25CLGNBQWMsRUFBRSxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVTtTQUMvQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsMkJBQVksZUFNM0IsQ0FBQTtBQUNMLENBQUMsRUF6QmdCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBeUI5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCI7XHJcbmltcG9ydCB7IENvb2xjYXIgfSBmcm9tIFwiLi9yZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIFByb2ZpbGVTZXJ2aWNlIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRQcm9maWxlKCk6IFByb21pc2U8cmVudGFsLnYxLklQcm9maWxlPiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgcGF0aDogYC92MS9wcm9maWxlYCxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5Qcm9maWxlLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc3VibWludFByb2ZpbGUocmVxOiByZW50YWwudjEuSUlkZW50aXR5KTogUHJvbWlzZTxyZW50YWwudjEuSVByb2ZpbGU+IHtcclxuICAgICAgICByZXR1cm4gQ29vbGNhci5zZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS9wcm9maWxlJyxcclxuICAgICAgICAgICAgZGF0YTogcmVxLFxyXG4gICAgICAgICAgICByZXNwTWFyc2hhbGxlcjogcmVudGFsLnYxLlByb2ZpbGUuZnJvbU9iamVjdFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUHJvZmlsZSgpOiBQcm9taXNlPHJlbnRhbC52MS5JUHJvZmlsZT4ge1xyXG4gICAgICAgIHJldHVybiBDb29sY2FyLnNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvcHJvZmlsZScsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuUHJvZmlsZS5mcm9tT2JqZWN0XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufSJdfQ==