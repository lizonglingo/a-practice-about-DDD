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
                        method: 'PUT',
                        url: 'https://coolcar-1258527714.cos.ap-chengdu.myqcloud.com/account_7/6238aff191d403467ac7896b?q-sign-algorithm=sha1&q-ak=AKIDkJdhX7SXNyJPJyNWQ5UdXBajdHgpjQt7&q-sign-time=1647882225%3B1647883225&q-key-time=1647882225%3B1647883225&q-header-list=content-type%3Bhost&q-url-param-list=&q-signature=e61cdf9a01088cffadc5f1246701c24967c80656',
                        data: data,
                        header: {'content-type': 'image/jpeg'},
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