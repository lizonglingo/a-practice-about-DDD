"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routing_1 = require("../../utils/routing");
Page({
    data: {
        indicatorDots: true,
        vertical: false,
        autoplay: true,
        interval: 3000,
        duration: 500,
        circular: true,
        current: '0',
        promotionItems: [
            {
                img: 'https://img3.mukewang.com/620c5c810001d1f417920764.jpg',
                promotionID: '1',
            },
            {
                img: 'https://img2.mukewang.com/6216fef5000134df17920764.jpg',
                promotionID: '2',
            },
            {
                img: 'https://img4.mukewang.com/62184a9e00011dbd17920764.jpg',
                promotionID: '3',
            },
            {
                img: 'https://img3.mukewang.com/62187adc0001030417920764.jpg',
                promotionID: '4',
            },
            {
                img: 'https://img.mukewang.com/6218389d0001e43e17920764.jpg',
                promotionID: '5',
            },
        ],
    },
    onSwiperChange(e) {
        console.log(e);
    },
    onPromotionItemTap(e) {
        console.log(e);
    },
    onRegisterTap() {
        wx.navigateTo({
            url: routing_1.routing.register(),
        });
    }
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibXl0cmlwcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm15dHJpcHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpREFBNkM7QUFFN0MsSUFBSSxDQUFDO0lBQ0QsSUFBSSxFQUFFO1FBQ0YsYUFBYSxFQUFFLElBQUk7UUFDbkIsUUFBUSxFQUFFLEtBQUs7UUFDZixRQUFRLEVBQUUsSUFBSTtRQUNkLFFBQVEsRUFBRSxJQUFJO1FBQ2QsUUFBUSxFQUFFLEdBQUc7UUFDYixRQUFRLEVBQUUsSUFBSTtRQUNkLE9BQU8sRUFBRSxHQUFHO1FBQ1osY0FBYyxFQUFFO1lBQ1o7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsd0RBQXdEO2dCQUM3RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtZQUNEO2dCQUNJLEdBQUcsRUFBRSx3REFBd0Q7Z0JBQzdELFdBQVcsRUFBRSxHQUFHO2FBQ25CO1lBQ0Q7Z0JBQ0ksR0FBRyxFQUFFLHdEQUF3RDtnQkFDN0QsV0FBVyxFQUFFLEdBQUc7YUFDbkI7WUFDRDtnQkFDSSxHQUFHLEVBQUUsdURBQXVEO2dCQUM1RCxXQUFXLEVBQUUsR0FBRzthQUNuQjtTQUNKO0tBQ0o7SUFFRCxjQUFjLENBQUMsQ0FBTTtRQUNqQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFBO0lBQ2xCLENBQUM7SUFFRCxrQkFBa0IsQ0FBQyxDQUFNO1FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFDbEIsQ0FBQztJQUVELGFBQWE7UUFDVCxFQUFFLENBQUMsVUFBVSxDQUFDO1lBRVYsR0FBRyxFQUFFLGlCQUFPLENBQUMsUUFBUSxFQUFFO1NBQzFCLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSixDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyByb3V0aW5nIH0gZnJvbSBcIi4uLy4uL3V0aWxzL3JvdXRpbmdcIlxyXG5cclxuUGFnZSh7XHJcbiAgICBkYXRhOiB7XHJcbiAgICAgICAgaW5kaWNhdG9yRG90czogdHJ1ZSxcclxuICAgICAgICB2ZXJ0aWNhbDogZmFsc2UsXHJcbiAgICAgICAgYXV0b3BsYXk6IHRydWUsXHJcbiAgICAgICAgaW50ZXJ2YWw6IDMwMDAsXHJcbiAgICAgICAgZHVyYXRpb246IDUwMCxcclxuICAgICAgICBjaXJjdWxhcjogdHJ1ZSxcclxuICAgICAgICBjdXJyZW50OiAnMCcsXHJcbiAgICAgICAgcHJvbW90aW9uSXRlbXM6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjBjNWM4MTAwMDFkMWY0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnMScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nMi5tdWtld2FuZy5jb20vNjIxNmZlZjUwMDAxMzRkZjE3OTIwNzY0LmpwZycsXHJcbiAgICAgICAgICAgICAgICBwcm9tb3Rpb25JRDogJzInLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICBpbWc6ICdodHRwczovL2ltZzQubXVrZXdhbmcuY29tLzYyMTg0YTllMDAwMTFkYmQxNzkyMDc2NC5qcGcnLFxyXG4gICAgICAgICAgICAgICAgcHJvbW90aW9uSUQ6ICczJyxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgaW1nOiAnaHR0cHM6Ly9pbWczLm11a2V3YW5nLmNvbS82MjE4N2FkYzAwMDEwMzA0MTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNCcsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgIGltZzogJ2h0dHBzOi8vaW1nLm11a2V3YW5nLmNvbS82MjE4Mzg5ZDAwMDFlNDNlMTc5MjA3NjQuanBnJyxcclxuICAgICAgICAgICAgICAgIHByb21vdGlvbklEOiAnNScsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgXSxcclxuICAgIH0sXHJcblxyXG4gICAgb25Td2lwZXJDaGFuZ2UoZTogYW55KSB7XHJcbiAgICAgICAgY29uc29sZS5sb2coZSlcclxuICAgIH0sXHJcblxyXG4gICAgb25Qcm9tb3Rpb25JdGVtVGFwKGU6IGFueSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGUpXHJcbiAgICB9LFxyXG5cclxuICAgIG9uUmVnaXN0ZXJUYXAoKSB7XHJcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7XHJcbiAgICAgICAgICAgIC8vIHVybDogJy9wYWdlcy9yZWdpc3Rlci9yZWdpc3RlcicsXHJcbiAgICAgICAgICAgIHVybDogcm91dGluZy5yZWdpc3RlcigpLFxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcbn0pIl19