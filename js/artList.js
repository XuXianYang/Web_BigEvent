$(function () {
    var form = layui.form;
    var layer = layui.layer
    var laypage = layui.laypage

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    let qobj = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    let cateList = []

    // 把分类的id转化为name
    template.defaults.imports.getCateValue = function (cateId) {
        let name = ''
        $.each(cateList, function (idx, item) {
            if (item.Id === cateId) {
                name = item.name
            }
        })
        return name
    }

    // 模板格式化时间
    template.defaults.imports.dateFormat = function (date) {
        if (!date) return '';
        var dateStr = new Date(date)
        var y = addZero(dateStr.getFullYear())
        var m = addZero(dateStr.getMonth() + 1)
        var d = addZero(dateStr.getDay())
        var h = addZero(dateStr.getHours())
        var min = addZero(dateStr.getMinutes())
        var s = addZero(dateStr.getSeconds())
        return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + s // 注意，过滤器最后一定要 return 一个值
    }
    function addZero(num) {
        return num > 9 ? num : '0' + num
    }

    // 获取分类列表
    function getCateList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/cates',
            success: function (res) {
                if (res.status === 0) {
                    cateList = res.data
                    var htmlStr = template('cateList', { data: res.data })
                    $('select[name=cate_id]').html(htmlStr)
                    form.render('select');
                    getArtList()
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    }

    let artList = []
    // 获取文章列表
    function getArtList() {
        $.ajax({
            method: 'GET',
            url: 'my/article/getArticle',
            success: function (res) {
                if (res.status === 0) {
                    artList = res.data
                    var htmlStr = template('artList', { data: res.data })
                    $('tbody').html(htmlStr)

                    if (artList.length === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        qobj.pagenum = qobj.pagenum === 1 ? 1 : qobj.pagenum - 1
                    }
                    renderPage(res.data.length)
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

    // 定义渲染分页的方法
    //分页和列表无法联动，因为数据是死的，联动需要后台分页查回数据
    function renderPage(total) {
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox', // 分页容器的 Id
            count: total, // 总数据条数
            limit: qobj.pagesize, // 每页显示几条数据
            curr: qobj.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换的时候，触发 jump 回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                // 把最新的页码值，赋值到 q 这个查询参数对象中
                qobj.pagenum = obj.curr
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                qobj.pagesize = obj.limit
                // 根据最新的 q 获取对应的数据列表，并渲染表格
                // initTable()
                if (!first) {
                    getArtList()
                }
            }
        })
    }

    // 筛选提交
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        let newArr = []
        let cate = $('select[name=cate_id]').val()
        let state = $('select[name=state]').val()
        if (cate && state) {
            $.each(artList, function (idx, item) {
                let isCate = parseInt(item.cate_id) === parseInt(cate)
                let isState = item.state === state
                if (isCate && isState) {
                    newArr.push(item)
                }
            })
        } else if (!cate && !state) {
            newArr = artList
        } else if (cate && !state) {
            $.each(artList, function (idx, item) {
                if (parseInt(item.cate_id) === parseInt(cate)) {
                    newArr.push(item)
                }
            })
        } else if (!cate && state) {
            $.each(artList, function (idx, item) {
                if (item.state === state) {
                    newArr.push(item)
                }
            })
        }

        var htmlStr = template('artList', { data: newArr })
        $('tbody').html(htmlStr)
        renderPage(newArr.length)
    })

    // 删除
    $('.layui-table').on('click', '.btn-delete', function () {
        let id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: `my/article/deleteArt/${id}`,
            success: function (res) {
                if (res.status === 0) {
                    layer.msg('文章删除成功')
                    getArtList()
                } else {
                    layer.msg(res.message)
                }
            },
            error: function (res) {
                layer.msg(res.message)
            }
        })
    })

    // 编辑
    $('.layui-table').on('click', '.btnEdit', function () {
        let id = $(this).attr('data-id')
        let objArt = {}
        $.each(artList, function (idx, item) {
            if (parseInt(item.Id) === parseInt(id)) {
                objArt = item
            }
        })
        if(objArt){
            localStorage.setItem('cacheArt',JSON.stringify(objArt))
        }
        location.href = '../html/artPub.html'
    })
})