$(function(){
    let urls = $.Urls.player;

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
    
    var YJ_comment = null;
    $.Request(urls.getcomments,function(data){
        console.log(data)
        YJ_comment = $.InitComments('.YJ-Comment',data.data,{
            AvatarClick:function(e){
                console.log(e)
            },
            ContentClick:function(e){
                console.log(e)
            }
        })
    })

    // 获取推荐列表
    $.Request(urls.getrecomment,function(data){
        console.log(data)
        $.InitProduct('.YJ-Product',data.data,{
            
        })
    })

    // 发送评论
    $('#sendComment').on('click',function(e){
        console.log(e)
        sendComment()
    })

    $('#comment-texter').on('keypress',function(e){
        if(e.keyCode == 13){
            window.alert(e.keyCode)
            sendComment()
        }
    })

    function sendComment(){
        $.Request(urls.docomment,function(data){
            console.log(data)
            YJ_comment.AddComment({
                id:'11',
                avatar:'/images/bg6.jpg',
                name:'新用户',
                time:'2019-3-19',
                content:'评论内容评论内容评论内容评论内容容评论内容',
                thumbs:['/images/bg4.jpg','/images/bg5.jpg','/images/bg7.jpg']
            })
        },null,{
            type:'post',
            data:$('#comment-texter').val(),
        })
    }

    // 收藏文章
    $('#collectThis').on('click',function(e){
        $.Request(urls.docollect,function(data){
            console.log(data)
        },null,{
            type:'post',
            data:{
                id:11
            },
        })
    })
})