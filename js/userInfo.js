layui || require("layui")
jQuery || require("jquery")

$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 登录名6-24位数字或者字母
        loginName: [/[\w]{6,24}/, "登录名为6-24位数字或者字母"],
        nickname: [/[\S]+/, "昵称不能为空格"]
    })
    
    // 获取用户信息
    $.ajax({
        method: 'GET',
        url: 'my/userinfo',
        success: function (res) {
            if (res.status === 0) {
                // 通过layui的方法给表单赋值
                form.val('formUserInfo', {
                    username: res.data.username,
                    nickname: res.data.nickname ? res.data.nickname : '',
                    email: res.data.email ? res.data.email : '',
                })
            } else {
                layer.msg(res.message)
            }
        },
        error: function (res) {
            layer.msg(res.message)
        }
    })

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: 'my/userinfo',
            data :form.val("formUserInfo"),
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('修改成功')
                    // 调用父页面的刷新方法
                    window.parent.reloadSelf()
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    })

    // 重置按钮点击事件
    $('button[type=reset]').on('click', function (e) {
        e.preventDefault()
        $('input[name=nickname]').val('')
        $('input[name=email]').val('')
    })
})
