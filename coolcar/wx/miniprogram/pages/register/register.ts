import { routing } from "../../utils/routing"

Page({
    redirectURL: '',
    data: {
        licNo: '',
        name: '',
        genderIndex: 0,
        genders: ['未知', '男', '女', '其他'],
        birthDate: '1990-01-01',
        licImgURL: '',
        state: 'UNSUBMITTED' as 'UNSUBMITTED' | 'PENDING' | 'VERIFIED'
    },

    onLoad(opt: Record<'redirect', string>) {
        const o: routing.RegisterOpts = opt
        if (o.redirect) {
            this.redirectURL = decodeURIComponent(o.redirect)
        }
    },

    onUploadLic() {
        wx.chooseImage({
            success: res => {
                if (res.tempFilePaths.length > 0) {
                    this.setData({
                        licImgURL: res.tempFilePaths[0]
                    })
                    // TODO: upload lic
                    // 假设等一秒才拿到解析完
                    setTimeout(() => {
                        this.setData({
                            licNo: '3243633254',
                            name: '张三',
                            genderIndex: 1,
                            birthDate: '1999-12-23',
                        })
                    }, 1000)
                }

            }
        })
    },

    onGenderChange(e: any) {
        this.setData({
            genderIndex: e.detail.value,
        })
    },

    onBirthDateChange(e: any) {
        this.setData({
            birthDate: e.detail.value,
        })
    },

    onSubmit() {
        // TODO: submit the form to server
        this.setData({
            state: 'PENDING',
        })
        setTimeout( () => {
            this.onLicVerified()
        }, 3000)
    },
    onReSubmit() {
        this.setData({
            state: 'UNSUBMITTED',
            licImgURL: '',
        })
    },
    onLicVerified() {
        this.setData({
            state: 'VERIFIED',
        })
        if (this.redirectURL) {
           wx.redirectTo({
            url: this.redirectURL,
            }) 
        }
        
    }
})