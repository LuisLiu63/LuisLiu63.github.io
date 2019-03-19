$(function(){

    var urls = $.Urls.detail,
        params = $.UrlParams;
    console.log(params)

    // 初始化Tab组件，位于UJUI.js
    $.InitTab('.YJ-Tabs',{
        Init:function(){

        },
        TabChange:function(e){
            console.log(e)
        }
    })

    // 获取章节
    $.Request(urls.getchapter,function(data){
        console.log(data)
        $.InitCollapse('.YJ-Collapse',data.data,{
            Play:function(item){
                console.log(item)
            }
        })
    })

    // 获取评论列表
    $.Request(urls.getcomments,function(data){
        console.log(data)
        YJ_comment=$.InitComments('.YJ-Comment',data.data,{
            AvatarClick:function(e){
                console.log(e)
            },
            ContentClick:function(e){
                console.log(e)
            }
        })
    })

    // 获取商品基本信息
    $.Request(urls.basicinfo,function(data){
        $.FillData(data.data)
    },null,{
        type:'post',
        data:{
            id:params.id
        }
    })

    // 收藏
    $('#collectThis').on('click',function(e){

    })
    
    
})