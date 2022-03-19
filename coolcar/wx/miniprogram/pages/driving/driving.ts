import { TripService } from "../../service/trip"
import { formatDuration, formatFee } from "../../utils/format"
import { routing } from "../../utils/routing"

// const centPerSec = 0.7
const updateIntervalSec = 5 // 每5秒向服务器上报location

function durationStr(sec: number) {
    const dur = formatDuration(sec)
    return `${dur.hh}:${dur.mm}:${dur.ss}`
}

Page({
    tripID: '',
    timer: undefined as number | undefined,
    data: {
        location: {
            latitude: 32.92,
            longitude: 118.46,
        },
        scale: 14,
        elapsed: '00:00:00',
        fee: '0.00',
    },

    onLoad(opt: Record<'trip_id', string>) {
        const o: routing.DrivingOpts = opt
        this.tripID = o.trip_id
        console.log('current trip', o.trip_id)
        // o.trip_id = '622e10b914592d5c50ccb7dc'
        TripService.getTrip(o.trip_id).then(console.log)
        this.setupLocationUpdator()
        this.setupTimer(o.trip_id)
    },

    onUnload() {
        wx.stopLocationUpdate()
        if (this.timer) {
            clearInterval(this.timer)
        }
    },

    setupLocationUpdator() {
        wx.startLocationUpdate({
            fail: console.error,
        }),
            wx.onLocationChange(loc => {
                console.log('location: ', loc)
                this.setData({
                    location: {
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                    },
                })
            })
    },
    async setupTimer(id: string) {
        // 在进入时先看数据库
        const trip = await TripService.updateTripPos(id)
        let secSinceLastUpdate = 0      // 距离上次请求服务器过去的时间
        let lastUpdateDurationSec = trip.current!.timestampSec! - trip.start!.timestampSec!   // 上次询问服务器时 服务器返回的行驶总时间
        this.setData({
            elapsed: durationStr(lastUpdateDurationSec),
            fee: formatFee(trip.current!.feeCent!)
        })

        this.timer = setInterval(() => {
            secSinceLastUpdate++
            if (secSinceLastUpdate % 5 == 0) {
                TripService.updateTripPos(id, {
                    latitude: this.data.location.latitude,
                    longitude: this.data.location.longitude,
                }).then(trip => {
                    lastUpdateDurationSec = trip.current!.timestampSec! - trip.start!.timestampSec!
                    secSinceLastUpdate = 0
                    this.setData({
                        fee: formatFee(trip.current!.feeCent!),
                    })
                })
            }
            this.setData({
                elapsed: durationStr(lastUpdateDurationSec + secSinceLastUpdate),
            })
        }, 1000)
    },
    onEndTripTap() {
        TripService.finishTrip(this.tripID).then(() => {
            wx.redirectTo({
                url: routing.mytrips()
            })
        }).catch(err => {
            console.error(err)
            wx.showToast({
                title: '行程结束',
                icon: 'none',
            })
        })
    }
})