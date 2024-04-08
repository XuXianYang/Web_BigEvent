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
    $(".layui-form").on('submit', function (e) {
        e.preventDefault()

        let oldPwd = $('input[name=password]').val()
        let newpwd = $('input[name=newpassword]').val()
        $.ajax({
            method: 'POST',
            url: 'my/updatepwd',
            data: { oldPwd: oldPwd, newPwd: newpwd },
            success: function (res) {
                if (res.status === 0) {
                    // 退出到登录页面
                    window.parent.loginOut()
                    layer.msg('密码修改成功')
                } else {
                    layer.msg(res.message)
                    $(this)[0].reset()
                }
            },
            error: function (res) {
                layer.msg(res.message)
                $(this)[0].reset()
            }
        })
    })
})


