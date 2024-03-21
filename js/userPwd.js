layui || require("layui")

$(function () {
    // 使用layui.js添加表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 数组方式添加验证
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 添加两次密码不一致校验
        repwd: function (value, item) {
            let pwdText = $('.layui-form [name=newpassword]').val()
            if (value !== pwdText) {
                return '密码不一致，请重新输入'
            }
        }
    })

    //提交
    $(".layui-form").on('submit',function(e){
        e.preventDefault()
        let userName = localStorage.getItem('userInfo')
        let userInfo = JSON.parse(localStorage.getItem(userName))
        let oldPwd = $('input[name=password]').val()
        if(userInfo.pwd === oldPwd){
            userInfo.pwd = $('input[name=newpassword]').val()
            localStorage.setItem(userName, JSON.stringify(userInfo))
            // 退出到登录页面
            window.parent.loginOut()
            layer.msg('密码修改成功')
        }else{
            alert('原密码错误，请重新输入')
            $(this)[0].reset()
        }
    })
})

    
