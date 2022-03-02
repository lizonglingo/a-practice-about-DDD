"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getSetting = exports.formatTime = void 0;
exports.formatTime = (date) => {
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    return ([hour, minute, second].map(formatNumber).join(':'));
};
const formatNumber = (n) => {
    const s = n.toString();
    return s[1] ? s : '0' + s;
};
function getSetting() {
    return new Promise((resolve, reject) => {
        wx.getSetting({
            success: resolve,
            fail: reject,
        });
    });
}
exports.getSetting = getSetting;
function getUserInfo() {
    return new Promise((resolve, reject) => {
        wx.getUserInfo({
            success: resolve,
            fail: reject,
        });
    });
}
exports.getUserInfo = getUserInfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3hhcGkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ3eGFwaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBYSxRQUFBLFVBQVUsR0FBRyxDQUFDLElBQVUsRUFBRSxFQUFFO0lBSXZDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQTtJQUM1QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUE7SUFDaEMsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFBO0lBRWhDLE9BQU8sQ0FHTCxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FDbkQsQ0FBQTtBQUNILENBQUMsQ0FBQTtBQUVELE1BQU0sWUFBWSxHQUFHLENBQUMsQ0FBUyxFQUFFLEVBQUU7SUFDakMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBQ3RCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDLENBQUE7QUFDM0IsQ0FBQyxDQUFBO0FBRUQsU0FBZ0IsVUFBVTtJQUN4QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDWixPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQVBELGdDQU9DO0FBRUQsU0FBZ0IsV0FBVztJQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1FBQ3JDLEVBQUUsQ0FBQyxXQUFXLENBQUM7WUFDYixPQUFPLEVBQUUsT0FBTztZQUNoQixJQUFJLEVBQUUsTUFBTTtTQUNiLENBQUMsQ0FBQTtJQUNKLENBQUMsQ0FBQyxDQUFBO0FBQ0osQ0FBQztBQVBELGtDQU9DIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IGZvcm1hdFRpbWUgPSAoZGF0ZTogRGF0ZSkgPT4ge1xuICAvLyBjb25zdCB5ZWFyID0gZGF0ZS5nZXRGdWxsWWVhcigpXG4gIC8vIGNvbnN0IG1vbnRoID0gZGF0ZS5nZXRNb250aCgpICsgMVxuICAvLyBjb25zdCBkYXkgPSBkYXRlLmdldERhdGUoKVxuICBjb25zdCBob3VyID0gZGF0ZS5nZXRIb3VycygpXG4gIGNvbnN0IG1pbnV0ZSA9IGRhdGUuZ2V0TWludXRlcygpXG4gIGNvbnN0IHNlY29uZCA9IGRhdGUuZ2V0U2Vjb25kcygpXG5cbiAgcmV0dXJuIChcbiAgICAvLyBbeWVhciwgbW9udGgsIGRheV0ubWFwKGZvcm1hdE51bWJlcikuam9pbignLycpICtcbiAgICAvLyAnICcgK1xuICAgIFtob3VyLCBtaW51dGUsIHNlY29uZF0ubWFwKGZvcm1hdE51bWJlcikuam9pbignOicpXG4gIClcbn1cblxuY29uc3QgZm9ybWF0TnVtYmVyID0gKG46IG51bWJlcikgPT4ge1xuICBjb25zdCBzID0gbi50b1N0cmluZygpXG4gIHJldHVybiBzWzFdID8gcyA6ICcwJyArIHNcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFNldHRpbmcoKTogUHJvbWlzZTxXZWNoYXRNaW5pcHJvZ3JhbS5HZXRTZXR0aW5nU3VjY2Vzc0NhbGxiYWNrUmVzdWx0PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd3guZ2V0U2V0dGluZyh7XG4gICAgICBzdWNjZXNzOiByZXNvbHZlLFxuICAgICAgZmFpbDogcmVqZWN0LFxuICAgIH0pXG4gIH0pXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRVc2VySW5mbygpOiBQcm9taXNlPFdlY2hhdE1pbmlwcm9ncmFtLkdldFVzZXJJbmZvU3VjY2Vzc0NhbGxiYWNrUmVzdWx0PiB7XG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgd3guZ2V0VXNlckluZm8oe1xuICAgICAgc3VjY2VzczogcmVzb2x2ZSxcbiAgICAgIGZhaWw6IHJlamVjdCxcbiAgICB9KVxuICB9KVxufSJdfQ==