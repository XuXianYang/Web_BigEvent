$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 点击事件调用文件选择框的change事件
    $('.uploadBtn').on('click', function () {
        $('.uploadFile').click()
    })

    // 文件选择框绑定change事件
    $('.uploadFile').on('change', function (e) {
        //获取选中的图片
        let file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址
        var newImgURL = URL.createObjectURL(file)

        // 重新渲染裁剪区域
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    layer = layui.layer

    // 点击确定上传文件
    $('.layui-btn-danger').on('click', function () {
        // 获取裁剪区域的图片并转换为base64格式
        var dataURL = $image
            // 创建一个 Canvas 画布
            .cropper('getCroppedCanvas', {
                width: 100,
                height: 100
            })
            // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
            .toDataURL('image/png')

            layer.msg('上传成功')
            // 上传成功，渲染头像
            window.parent.setIconHead(dataURL)
            // 返回首页
            window.parent.reloadSelf()
    })
})