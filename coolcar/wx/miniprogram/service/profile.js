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
    function getProfilePhoto() {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'GET',
            path: '/v1/profile/photo',
            respMarshaller: rental_pb_1.rental.v1.GetProfilePhotoResponse.fromObject,
        });
    }
    ProfileService.getProfilePhoto = getProfilePhoto;
    function createProfilePhoto() {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'POST',
            path: '/v1/profile/photo',
            respMarshaller: rental_pb_1.rental.v1.CreateProfilePhotoResponse.fromObject,
        });
    }
    ProfileService.createProfilePhoto = createProfilePhoto;
    function completeProfilePhoto() {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'POST',
            path: '/v1/profile/photo/complete',
            respMarshaller: rental_pb_1.rental.v1.Identity.fromObject,
        });
    }
    ProfileService.completeProfilePhoto = completeProfilePhoto;
    function clearProfilePhoto() {
        return request_1.Coolcar.sendRequestWithAuthRetry({
            method: 'DELETE',
            path: '/v1/profile/photo',
            respMarshaller: rental_pb_1.rental.v1.ClearProfilePhotoResponse.fromObject,
        });
    }
    ProfileService.clearProfilePhoto = clearProfilePhoto;
})(ProfileService = exports.ProfileService || (exports.ProfileService = {}));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsNERBQXNEO0FBQ3RELHVDQUFvQztBQUVwQyxJQUFpQixjQUFjLENBMEQ5QjtBQTFERCxXQUFpQixjQUFjO0lBQzNCLFNBQWdCLFVBQVU7UUFDdEIsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLGFBQWE7WUFDbkIsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1NBQy9DLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFOZSx5QkFBVSxhQU16QixDQUFBO0lBRUQsU0FBZ0IsY0FBYyxDQUFDLEdBQXdCO1FBQ25ELE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSxhQUFhO1lBQ25CLElBQUksRUFBRSxHQUFHO1lBQ1QsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxVQUFVO1NBQy9DLENBQUMsQ0FBQTtJQUNOLENBQUM7SUFQZSw2QkFBYyxpQkFPN0IsQ0FBQTtJQUVELFNBQWdCLFlBQVk7UUFDeEIsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUksRUFBRSxhQUFhO1lBQ25CLGNBQWMsRUFBRSxrQkFBTSxDQUFDLEVBQUUsQ0FBQyxPQUFPLENBQUMsVUFBVTtTQUMvQyxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsMkJBQVksZUFNM0IsQ0FBQTtJQUVELFNBQWdCLGVBQWU7UUFDM0IsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxLQUFLO1lBQ2IsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixjQUFjLEVBQUUsa0JBQU0sQ0FBQyxFQUFFLENBQUMsdUJBQXVCLENBQUMsVUFBVTtTQUMvRCxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsOEJBQWUsa0JBTTlCLENBQUE7SUFFRCxTQUFnQixrQkFBa0I7UUFDOUIsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxNQUFNO1lBQ2QsSUFBSSxFQUFFLG1CQUFtQjtZQUN6QixjQUFjLEVBQUUsa0JBQU0sQ0FBQyxFQUFFLENBQUMsMEJBQTBCLENBQUMsVUFBVTtTQUNsRSxDQUFDLENBQUE7SUFDTixDQUFDO0lBTmUsaUNBQWtCLHFCQU1qQyxDQUFBO0lBRUQsU0FBZ0Isb0JBQW9CO1FBQ2hDLE9BQU8saUJBQU8sQ0FBQyx3QkFBd0IsQ0FBQztZQUNwQyxNQUFNLEVBQUUsTUFBTTtZQUNkLElBQUksRUFBRSw0QkFBNEI7WUFDbEMsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVO1NBQ2hELENBQUMsQ0FBQTtJQUNOLENBQUM7SUFOZSxtQ0FBb0IsdUJBTW5DLENBQUE7SUFFRCxTQUFnQixpQkFBaUI7UUFDN0IsT0FBTyxpQkFBTyxDQUFDLHdCQUF3QixDQUFDO1lBQ3BDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLElBQUksRUFBRSxtQkFBbUI7WUFDekIsY0FBYyxFQUFFLGtCQUFNLENBQUMsRUFBRSxDQUFDLHlCQUF5QixDQUFDLFVBQVU7U0FDakUsQ0FBQyxDQUFBO0lBQ04sQ0FBQztJQU5lLGdDQUFpQixvQkFNaEMsQ0FBQTtBQUVMLENBQUMsRUExRGdCLGNBQWMsR0FBZCxzQkFBYyxLQUFkLHNCQUFjLFFBMEQ5QiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IHJlbnRhbCB9IGZyb20gXCIuL3Byb3RvX2dlbi9yZW50YWwvcmVudGFsX3BiXCI7XHJcbmltcG9ydCB7IENvb2xjYXIgfSBmcm9tIFwiLi9yZXF1ZXN0XCI7XHJcblxyXG5leHBvcnQgbmFtZXNwYWNlIFByb2ZpbGVTZXJ2aWNlIHtcclxuICAgIGV4cG9ydCBmdW5jdGlvbiBnZXRQcm9maWxlKCk6IFByb21pc2U8cmVudGFsLnYxLklQcm9maWxlPiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgcGF0aDogYC92MS9wcm9maWxlYCxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5Qcm9maWxlLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gc3VibWludFByb2ZpbGUocmVxOiByZW50YWwudjEuSUlkZW50aXR5KTogUHJvbWlzZTxyZW50YWwudjEuSVByb2ZpbGU+IHtcclxuICAgICAgICByZXR1cm4gQ29vbGNhci5zZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS9wcm9maWxlJyxcclxuICAgICAgICAgICAgZGF0YTogcmVxLFxyXG4gICAgICAgICAgICByZXNwTWFyc2hhbGxlcjogcmVudGFsLnYxLlByb2ZpbGUuZnJvbU9iamVjdFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUHJvZmlsZSgpOiBQcm9taXNlPHJlbnRhbC52MS5JUHJvZmlsZT4ge1xyXG4gICAgICAgIHJldHVybiBDb29sY2FyLnNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0RFTEVURScsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvcHJvZmlsZScsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuUHJvZmlsZS5mcm9tT2JqZWN0XHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgZnVuY3Rpb24gZ2V0UHJvZmlsZVBob3RvKCk6IFByb21pc2U8cmVudGFsLnYxLklHZXRQcm9maWxlUGhvdG9SZXNwb25zZT4ge1xyXG4gICAgICAgIHJldHVybiBDb29sY2FyLnNlbmRSZXF1ZXN0V2l0aEF1dGhSZXRyeSh7XHJcbiAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvcHJvZmlsZS9waG90bycsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuR2V0UHJvZmlsZVBob3RvUmVzcG9uc2UuZnJvbU9iamVjdCxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjcmVhdGVQcm9maWxlUGhvdG8oKTogUHJvbWlzZTxyZW50YWwudjEuSUNyZWF0ZVByb2ZpbGVQaG90b1Jlc3BvbnNlPiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgIHBhdGg6ICcvdjEvcHJvZmlsZS9waG90bycsXHJcbiAgICAgICAgICAgIHJlc3BNYXJzaGFsbGVyOiByZW50YWwudjEuQ3JlYXRlUHJvZmlsZVBob3RvUmVzcG9uc2UuZnJvbU9iamVjdCxcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBmdW5jdGlvbiBjb21wbGV0ZVByb2ZpbGVQaG90bygpOiBQcm9taXNlPHJlbnRhbC52MS5JSWRlbnRpdHk+IHtcclxuICAgICAgICByZXR1cm4gQ29vbGNhci5zZW5kUmVxdWVzdFdpdGhBdXRoUmV0cnkoe1xyXG4gICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS9wcm9maWxlL3Bob3RvL2NvbXBsZXRlJyxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5JZGVudGl0eS5mcm9tT2JqZWN0LFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUHJvZmlsZVBob3RvKCk6IFByb21pc2U8cmVudGFsLnYxLklDbGVhclByb2ZpbGVQaG90b1Jlc3BvbnNlPiB7XHJcbiAgICAgICAgcmV0dXJuIENvb2xjYXIuc2VuZFJlcXVlc3RXaXRoQXV0aFJldHJ5KHtcclxuICAgICAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcclxuICAgICAgICAgICAgcGF0aDogJy92MS9wcm9maWxlL3Bob3RvJyxcclxuICAgICAgICAgICAgcmVzcE1hcnNoYWxsZXI6IHJlbnRhbC52MS5DbGVhclByb2ZpbGVQaG90b1Jlc3BvbnNlLmZyb21PYmplY3QsXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcbn0iXX0=