// 导入jQuery，否则没有jQuery的代码提示
jQuery||require("jquery")
layui||require("layui")

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
        repwd : function(value ,item){
            let pwdText = $('.regBox [name=password]').val()
            if(value !== pwdText){
                return '密码不一致，请重新输入'
            }
        }
    })

    // 注册提交事件
    $('.regBox .layui-form').on('submit',function(e){
        e.preventDefault()
        /*
        $.ajax({
            type : 'POST',
            url : 'api/reguser',
            data : {
                username: $('.regBox [name=username]').val(),
                password: $('.regBox [name=password]').val()
            },
            success : function(res){
                console.log('成功' + res);
            },
            error : function(res){
                console.log('失败' + res);
                regSuccess($('.regBox [name=username]').val().trim(),$('.regBox [name=password]').val().trim())
            }
        })
        */
        regSuccess($('.regBox [name=username]').val().trim(),$('.regBox [name=password]').val().trim())
    })

    // 注册成功，保存数据到本地代替后台服务器
    function regSuccess(name,pwd){
        let localUser = localStorage.getItem('user'+name)
        if(localUser){
            layer.msg('注册失败，用户名已存在')
        }else{
            let pwdStr = JSON.stringify({name:name,pwd:pwd})
            localStorage.setItem('user'+name,pwdStr)
            layer.msg('注册成功')
            $('.regBox .layui-form')[0].reset()
            $('.gotoLogin').click()
        }
    }

     // 登录提交事件
     $('.loginBox .layui-form').on('submit',function(e){
        e.preventDefault()
        /*
        $.ajax({
            type : 'POST',
            url : 'api/login',
            data : {
                username: $('.loginBox [name=username]').val(),
                password: $('.loginBox [name=password]').val()
            },
            success : function(res){
                console.log('成功' + res);
            },
            error : function(res){
                console.log('失败' + res);
            }
        })
        */
        loginSuccess($('.loginBox [name=username]').val().trim(),$('.loginBox [name=password]').val().trim())

    })

    // 登录处理，判断用户信息是否一致
    function loginSuccess(name,pwd){
        let localPwd = localStorage.getItem('user'+name)
        let localObj = JSON.parse(localPwd)
        if(pwd === localObj.pwd){
            layer.msg('登录成功')
            // 保存当前登录的用户信息
            localStorage.setItem('userInfo','user'+name)
            location.href = '../index.html'
        }else{
            layer.msg('登录失败，用户名或者密码错误')
        } 
        $('.loginBox .layui-form')[0].reset()       
    }
})