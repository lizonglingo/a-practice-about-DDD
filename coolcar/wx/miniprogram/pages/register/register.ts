import { ProfileService } from "../../service/profile"
import { rental } from "../../service/proto_gen/rental/rental_pb"
import { formatDuration, padString } from "../../utils/format"
import { routing } from "../../utils/routing"


function formatDate(millis: number) {
    const dt = new Date(millis)
    const y = dt.getFullYear()
    const m = dt.getMonth() + 1
    const d = dt.getDate()
    return `${padString(y)}-${padString(m)}-${padString(d)}`
}

Page({
    redirectURL: '',
    profileRefresher: 0,
    data: {
        licNo: '',
        name: '',
        genderIndex: 0,
        genders: ['未知', '男', '女'],
        birthDate: '1990-01-01',
        licImgURL: '',
        state: rental.v1.IdentityStatus[rental.v1.IdentityStatus.UNSUBMITTED]
    },

    renderProfile(p: rental.v1.IProfile) {
        this.setData({
            licNo: p.identity?.licNumber || '',
            name: p.identity?.name || '',
            genderIndex: p.identity?.gender || 0,
            birthDate: formatDate(p.identity?.brithDateMillis || 0),
            state: rental.v1.IdentityStatus[p.identityStatus || 0]
        })
    },

    onLoad(opt: Record<'redirect', string>) {
        const o: routing.RegisterOpts = opt
        if (o.redirect) {
            this.redirectURL = decodeURIComponent(o.redirect)
        }

        ProfileService.getProfile().then(p => this.renderProfile(p))
    },

    onUnload() {
        this.clearProfileRefresher()
    },

    onUploadLic() {
        wx.chooseImage({
            success: res => {
                if (res.tempFilePaths.length > 0) {
                    this.setData({
                        licImgURL: res.tempFilePaths[0]
                    })
                    // TODO: upload lic
                    const data = wx.getFileSystemManager().readFileSync(res.tempFilePaths[0])
                    wx.request({
                        method: 'GET',
                        url: 'https://coolcar-1258527714.cos.ap-chengdu.myqcloud.com/account_8/623962c2ab5141315d22813e?q-sign-algorithm=sha1&q-ak=AKIDkJdhX7SXNyJPJyNWQ5UdXBajdHgpjQt7&q-sign-time=1647928686%3B1647929286&q-key-time=1647928686%3B1647929286&q-header-list=host&q-url-param-list=&q-signature=646370db95bf9ba5fc3046ba52e9df8a393e6777',
                        data: data,
                        header: {'Content-Type': 'image/jpeg'},
                        success: console.log,
                        fail: console.error,
                    })
                    // 假设等一秒才拿到解析完
                    // setTimeout(() => {
                    //     this.setData({
                    //         licNo: '3243633254',
                    //         name: '张三',
                    //         genderIndex: 1,
                    //         birthDate: '1999-12-23',
                    //     })
                    // }, 1000)
                }

            }
        })
    },

    onGenderChange(e: any) {
        this.setData({
            genderIndex: parseInt(e.detail.value),
        })
    },

    onBirthDateChange(e: any) {
        this.setData({
            birthDate: e.detail.value,
        })
    },

    onSubmit() {
        ProfileService.submintProfile({
            licNumber: this.data.licNo,
            name: this.data.name,
            gender: this.data.genderIndex,
            brithDateMillis: Date.parse(this.data.birthDate)
        }).then(p => {
            this.renderProfile(p)
            this.scheduleProfileRefresher()
        })
    },

    scheduleProfileRefresher() {
        // 每秒进行轮询
        this.profileRefresher = setInterval(() => {
            ProfileService.getProfile().then(p => {
                this.renderProfile(p)
                if (p.identityStatus !== rental.v1.IdentityStatus.PENDING) {
                    this.clearProfileRefresher()
                }
                if (p.identityStatus === rental.v1.IdentityStatus.VERIFIED) {
                    this.onLicVerified()
                }
            })
        }, 1000)
    },

    clearProfileRefresher() {
        if (this.profileRefresher) {
            clearInterval(this.profileRefresher)
            this.profileRefresher = 0
        }
    },

    onReSubmit() {
        ProfileService.clearProfile().then(p => this.renderProfile(p))
    },
    onLicVerified() {
        // this.setData({
        //     state: 'VERIFIED',
        // })
        if (this.redirectURL) {
            wx.redirectTo({
                url: this.redirectURL,
            })
        }

    }
})