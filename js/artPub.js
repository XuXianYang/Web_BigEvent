$(function () {
    // 初始化富文本编辑器
    initEditor()

    var form = layui.form;
    var layer = layui.layer

    // 获取编辑跳转过来的缓存数据
    let cacheArt = localStorage.getItem('cacheArt')
    let artObj = JSON.parse(cacheArt)

    window.addEventListener('beforeunload', (event) => {
        localStorage.removeItem('cacheArt')
    })
    window.addEventListener('unload', (event) => {
        localStorage.removeItem('cacheArt')
    })

    // 获取分类列表，并渲染在下拉列表上
    function getCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status === 0) {
                    var htmlStr = template('cateList', { data: res.data })
                    $('select[name=cate_id]').html(htmlStr)
                    // 从缓存数据获取分类的名称
                    if (artObj && artObj.cate_id) {
                        $.each(res.data, (idx, item) => {
                            if (parseInt(item.Id) === parseInt(artObj.cate_id)) {
                                $('select[name=cate_id]').val(item.Id).attr('selected', item.name)
                            }
                        })
                    }
                    form.render('select');
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    }

    getCateList()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 从缓存数据给表单赋值
    if (artObj&&artObj.cover_img) {
        form.val('pubForm', artObj)

        // 拼接图片地址
        let picUrl = 'http://127.0.0.1:3007' + artObj.cover_img
        let file = null

        // 获取图片的file类型
        getFileFromUrl(picUrl, artObj.cover_img)
            .then((response) => {
                file = response
                //重新渲染裁剪区域
                var newImgURL = URL.createObjectURL(file)
                $image
                    .cropper('destroy')      // 销毁旧的裁剪区域
                    .attr('src', newImgURL)  // 重新设置图片路径
                    .cropper(options)        // 重新初始化裁剪区域
            })
            .catch((e) => {
                layer.msg(e.message)
                console.error(e)
            });
    }

    // 把url地址的图片转为文件流，再转为file类型
    function getFileFromUrl(url, fileName) {
        return new Promise((resolve, reject) => {
            var blob = null;
            var xhr = new XMLHttpRequest();
            xhr.open("GET", url);
            xhr.setRequestHeader('Accept', 'image/png');
            xhr.responseType = "blob";
            // 加载时处理
            xhr.onload = () => {
                // 获取返回结果
                blob = xhr.response;
                let file = new File([blob], fileName, { type: 'image/png' });
                // 返回结果
                resolve(file);
            };
            xhr.onerror = (e) => {
                reject(e)
            };
            // 发送
            xhr.send();
        });
    }

    // 点击事件调用文件选择框的change事件
    $('.layui-btn-danger').on('click', function () {
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

    let state = '草稿'
    // 发布按钮
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        state = '已发布'
        saveData()
    })

    // 保存草稿
    $('.saveContent').on('click', function () {
        saveData()
    })

    // 获取表单数据
    function saveData() {
        var formData = new FormData($('.layui-form')[0])
        formData.append('state', state)
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 将文件对象，存储到 fd 中
                // formData['cover_img'] = blob
                formData.append('cover_img', blob)
                // 6. 发起 ajax 数据请求
                if (artObj && artObj.Id) {
                    formData.append('Id', artObj.Id)
                    updateArticle(formData)
                } else {
                    publishArticle(formData)
                }
            })
    }

    // 更新文章
    function updateArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'my/article/updateArticle',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('文章更新成功')
                    location.href = '../html/artList.html'
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    }

    // 发布文章
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: 'my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('文章发布成功')
                    location.href = '../html/artList.html'
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    }
})