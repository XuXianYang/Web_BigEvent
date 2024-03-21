$(function () {
    //获取用户信息
    function getUserInfo() {
        let userName = localStorage.getItem('userInfo')
        let userinfo = JSON.parse(localStorage.getItem(userName))

        $('.text-avatar').hide()
        if (userinfo) {
            $('#welcome').text('欢迎 ' + userinfo.name)
        }
    }
    getUserInfo()

    var layer = layui.layer
    // 退出
    $('.loginOut').on('click', function () {
        layer.confirm('是否确认退出', { icon: 2, title: '温馨提示' }, function (index) {
            localStorage.removeItem('userInfo')
            location.href = '../login.html'
            layer.close(index);
        });

    })
})

// 刷新首页，供子页面调用
function reloadSelf(){
    $('iframe[name=fm]').attr('src','../home/dashboard.html')
}

// 退出到登录页
function loginOut(){
    localStorage.removeItem('userInfo')
    location.href = '../login.html'
}

// 设置头像
function setIconHead(data){
    $('.layui-nav-img').attr('src',data)
}