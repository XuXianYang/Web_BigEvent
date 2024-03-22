$(function () {
    let layer = layui.layer
    let form = layui.form

    getCateList()

    // 获取缓存数据，渲染分类列表
    function getCateList() {
        let dataA = localStorage.getItem('cate')
        let dataArr = []
        if (dataA) {
            dataArr = JSON.parse(dataA)
            var htmlStr = template('cateList', { data: dataArr })
            $('tbody').html(htmlStr)
        }
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

    // 通过委托绑定表单提交事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        let dataA = localStorage.getItem('cate')
        let dataArr = []
        if (dataA) {
            dataArr = JSON.parse(dataA)
        }
        let name = $('#form-add input[name=name]').val()
        let alias = $('#form-add input[name=alias]').val()

        $.each(dataArr, function (index,item) {
            if (item.name === name) {
                return layer.msg('分类已添加')
            }
        })
        dataArr.push({ name: name, alias: alias })

        let localD = JSON.stringify(dataArr)
        localStorage.setItem('cate', localD)

        layer.close(addLayer)
        layer.msg('添加成功')
        getCateList()
    })

    // 编辑事件
    let editLayer = null
    let cateIndex = 0
    $('body').on('click', '.btn-edit', function (e) {
        var id = $(this).attr('data-id')
        // 打开页面弹出层
        editLayer = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        })
        let cateObj = {}
        let dataA = localStorage.getItem('cate')
        let dataArr = JSON.parse(dataA)
        $.each(dataArr, function (index,item) {
            if (item.name === id) {
                cateObj = item
                cateIndex = index
            }
        })
        $('#form-edit input[name=name]').val(cateObj.name)
        $('#form-edit input[name=alias]').val(cateObj.alias)
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        let dataA = localStorage.getItem('cate')
        let dataArr = JSON.parse(dataA)
        
        let name = $('#form-edit input[name=name]').val()
        let alias = $('#form-edit input[name=alias]').val()

        $.each(dataArr, function (index,item) {
            if (index !== cateIndex && name===item.name) {
                return layer.msg('分类已添加')
            }
        })        
        dataArr[cateIndex] = { name: name, alias: alias }
       
        let localD = JSON.stringify(dataArr)
        localStorage.setItem('cate', localD)

        layer.close(editLayer)
        layer.msg('修改成功')
        getCateList()
    })
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')

        let dataA = localStorage.getItem('cate')
        let dataArr = JSON.parse(dataA)
        $.each(dataArr, function (index,item) {
            if (item && item.name === id) {
                dataArr.splice(index,1)
            }
        })
        let localD = JSON.stringify(dataArr)
        localStorage.setItem('cate', localD)

        layer.msg('删除成功')
        getCateList()
    })
})