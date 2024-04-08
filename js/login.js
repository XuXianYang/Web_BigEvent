// 导入jQuery，否则没有jQuery的代码提示
jQuery || require("jquery")
layui || require("layui")

$(function () {
    // 添加登录注册切换
    $('.gotoLogin').on('click', function (e) {
        $('.loginBox').show()
        $('.regBox').hide()
    })
    $('.gotoreg').on('click', function (e) {
        $('.regBox').show()
        $('.loginBox').hide()
    })

    // 使用layui.js添加表单验证
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 函数方式添加验证
        user: function (value, item) {
            if (!/[\w]{6,24}/.test(value)) {
                return "用户名为6-24位字母或者数字"
            }
        },
        // 数组方式添加验证
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 添加两次密码不一致校验
        repwd: function (value, item) {
            let pwdText = $('.regBox [name=password]').val()
            if (value !== pwdText) {
                return '密码不一致，请重新输入'
            }
        }
    })

    // 注册提交事件
    $('.regBox .layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: 'api/reguser',
            data: {
                username: $('.regBox [name=username]').val(),
                password: $('.regBox [name=password]').val()
            },
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('注册成功')
                    $('.regBox .layui-form')[0].reset()
                    $('.gotoLogin').click()
                } else {
                    layer.msg('注册失败,' + res.msg)
                }
            },
            error: function (res) {
                layer.msg('注册失败,' + res.msg)
            }
        })
    })

    // 登录提交事件
    $('.loginBox .layui-form').on('submit', function (e) {
        e.preventDefault()

        $.ajax({
            type: 'POST',
            url: 'api/login',
            data: {
                username: $('.loginBox [name=username]').val(),
                password: $('.loginBox [name=password]').val()
            },
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('登录成功')
                    // 保存当前登录的用户信息
                    localStorage.setItem('token', res.token)
                    location.href = '../index.html'
                    $('.loginBox .layui-form')[0].reset()
                } else {
                    layer.msg('登录失败,' + res.msg);
                    $('.loginBox .layui-form')[0].reset()
                }
            },
            error: function (res) {
                layer.msg('登录失败,' + res.msg);
                $('.loginBox .layui-form')[0].reset()
            }
        })
    })
})