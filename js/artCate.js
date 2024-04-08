$(function () {
    let layer = layui.layer
    let form = layui.form

    getCateList()

    // 获取数据，渲染分类列表
    function getCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status === 0) {
                    var htmlStr = template('cateList', { data: res.data })
                    $('tbody').html(htmlStr)
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    }

    // 添加分类点击事件
    var addLayer = null
    $('.layui-btn-sm').on('click', function () {
        // 打开页面弹出层
        addLayer = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 通过委托绑定表单提交事件,添加分类提交
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        let name = $('#form-add input[name=name]').val()
        let alias = $('#form-add input[name=alias]').val()

        $.ajax({
            method: 'POST',
            url: 'my/article/addCates',
            data: { name: name, alias: alias },
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('文章分类添加成功')
                    layer.close(addLayer)
                    getCateList()
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    })

    // 编辑事件
    let editLayer = null
    let cateIndex = 0
    $('body').on('click', '.btn-edit', function (e) {
        // 打开页面弹出层
        editLayer = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })

        // 根据id获取文章分类
        var id = $(this).attr('data-id')
        cateIndex = id
        $.ajax({
            method: 'GET',
            url: `my/article/cates/${id}`,
            success: function (res) {
                if (res.status === 0) {
                    $('#form-edit input[name=name]').val(res.data.name)
                    $('#form-edit input[name=alias]').val(res.data.alias)
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    })

    // 编辑分类提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        let name = $('#form-edit input[name=name]').val()
        let alias = $('#form-edit input[name=alias]').val()

        $.ajax({
            method: 'POST',
            url: 'my/article/updatecate',
            data: { Id: cateIndex, name: name, alias: alias },
            success: function (res) {
                if (res.status === 0) {
                    layer.close(editLayer)
                    layer.msg('修改成功')
                    getCateList()
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    })

    // 删除文章分类
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')

        $.ajax({
            method: 'GET',
            url: `my/article/deletecate/${id}`,
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('删除成功')
                    getCateList()
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    })
})