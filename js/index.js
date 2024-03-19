$(function () {


    //获取用户信息
    function getUserInfo() {
        let userinfo = JSON.parse(localStorage.getItem('userInfo'))
        console.log('用户信息' + userinfo);
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