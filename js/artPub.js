$(function () {
    // 初始化富文本编辑器
    initEditor()

    var form = layui.form;
    var layer = layui.layer

    function getCateList() {
        let dataA = localStorage.getItem('cate')
        let dataArr = JSON.parse(dataA)
        let cateArr = []

        $.each(dataArr, function (index, item) {
            cateArr.push(item.name)
        })
        var htmlStr = template('cateList', { data: cateArr })
        $('select[name=cate]').html(htmlStr)
        form.render('select');
    }

    let editObj = {}
    function getCachEditData(){
        let dataA = localStorage.getItem('editArt')
        let editO = JSON.parse(dataA)
        if(editO){
            editObj = editO
            form.val('pubForm',{
                title:editObj.title,
                cate:editObj.cate,
                content:editObj.content,
            })
        }
    }

    getCateList()
    getCachEditData()

    // 1. 初始化图片裁剪器
    var $image = $('#image')
    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 3. 初始化裁剪区域
    $image.cropper(options)


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

    // 发布按钮
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        saveData(1)
    })

    // 保存草稿
    $('.saveContent').on('click', function(){
        saveData(2)
    })

    function saveData(type){
        
        let formData = form.val('pubForm')
        if(type === 1){
            formData['type'] = '已发布'
            layer.msg('文章发布成功')
        }else{
            formData['type'] = '草稿'
            layer.msg('草稿已保存')
        }
        let date = new Date()
        formData['time'] = date.toLocaleString()

        let artList = []
        let dataA = localStorage.getItem('artList')
        if(dataA){
            artList = JSON.parse(dataA)
        }
        artList.push(formData)
        // 如果是编辑页面跳转回来的，编辑之后则删除原来的数据
        $.each(artList,function(idx,item){
            if(item && editObj && editObj.time === item.time){
                artList.splice(idx,1)
            }
        })

        let localList = JSON.stringify(artList)
        localStorage.setItem('artList', localList)

        location.href = '../html/artList.html'
    }
})