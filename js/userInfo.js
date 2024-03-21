layui || require("layui")

$(function () {
    var form = layui.form
    var layer = layui.layer
    form.verify({
        // 登录名6-24位数字或者字母
        loginName: [/[\w]{6,24}/, "登录名为6-24位数字或者字母"],
        nickname: [/[\S]+/, "昵称不能为空格"]
    })
    let userName = localStorage.getItem('userInfo')
    let userInfo = JSON.parse(localStorage.getItem(userName))
    // 通过layui的方法给表单赋值
    form.val('formUserInfo', {
        username: userInfo.name,
        nickname: userInfo.nickname ? userInfo.nickname : '',
        email: userInfo.email ? userInfo.email : '',
    })

    // 表单提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        // 模拟网络请求
        setTimeout(function () {
            //获取表单区域所有值
            var data1 = form.val("formUserInfo");
            userInfo['nickname'] = data1.nickname
            userInfo['email'] = data1.email
            localStorage.setItem(userName, JSON.stringify(userInfo))
            layer.msg('修改成功')
            // 调用父页面的刷新方法
            window.parent.reloadSelf()
        }, 100)
    })

    // 重置按钮点击事件
    $('button[type=reset]').on('click',function(e){
        e.preventDefault()
        $('input[name=nickname]').val('')
        $('input[name=email]').val('')
    })

})