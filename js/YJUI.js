/**
 * @auther liuchuan
 * @time 2019/3/16 14:16
 */
var Urls = {
    about:{
        resume:'/testJson/product.json',
        active:'/testJson/product.json'
    },
    detail:{
        basicinfo:'/testJson/basicinfo.json',
        details:'',
        getchapter:'/testJson/chapter.json',
        getcomments:'/testJson/comment.json',
        buy:'',
        collect:'',
    },
    player:{
        getchapter:'/testJson/chapter.json',
        getrecomment:'/testJson/product.json',
        getcomments:'/testJson/comment.json',
        docomment:'',
        docollect:''
    }
}

function UrlParams(){
    let paramstr = window.location.search.split('?')[1];
    if(paramstr){
        let paramsarr = paramstr.split('&'),
        params = {};
    
        paramsarr.forEach(function(item){
            let p = item.split('=');
            params[p[0]] = p[1]
        })
        
        return params
    }
        
    return {}
}

$.extend($, {
    Urls:Urls,
    UrlParams:UrlParams(),
    FillData:function(obj){
        Object.keys(obj).forEach(function(key){
            $(`#${key}`).text(obj[key])
       });
    },
    // 初始化Tab
    InitTab: function (selector,callbacks) {

        $(selector).find('.tabs-head>span').removeClass('active');
        $(selector).find('.tabs-content>.tabs-content-page').hide();

        // 初始化Tab状态
        let dTab = $(selector).find('.tabs-head>span').first()
        dTab.addClass('active');
        $(dTab.data('page')).show();

        $(selector).find('.tabs-head>span').on('click',function(e){
            $(this).addClass('active').siblings().removeClass('active');
            let Id = $(this).data('page');
            $(Id).show().siblings().hide();
            // Tab切换事件
            callbacks.TabChange&&callbacks.TabChange(Id)
        })

        // Tab初始化事件
        callbacks.Init&&callbacks.Init()
    },
    InitCollapse: function (selector,data,callbacks){
        let content = chapterTpl(data);
        $(selector).html(content);
        $(selector).find('.YJ-collapse-title').on('click',function(e){
            $(this).toggleClass('open')
        })
        $(selector).find('.chapter-play').on('click',function(e){
            let pi = $(this).data('pi'),
                si = $(this).data('si');
            let item = data[Number(pi)]['content'];
            callbacks.Play&&callbacks.Play(item[Number(si)])
        })
    },
    InitComments:function (selector,data,callbacks){
        let commentHtml = commentTpl(data);
        $(selector).html(commentHtml);
        bindEvent();
        
        function bindEvent(){
            $(selector).find('.comment-content').unbind('click');
            $(selector).find('.comment-avatar').unbind('click');
            
            $(selector).find('.comment-content').on('click',function(e){
                let item = data[$(this).data('si')];
                callbacks.ContentClick&&callbacks.ContentClick(item)
            })
            $(selector).find('.comment-avatar').on('click',function(e){
                let item = data[$(this).data('si')];
                callbacks.AvatarClick&&callbacks.AvatarClick(item)
            })
        }

        return {
            AddComment:function(content){
                data.unshift(content)
                $(selector).html(commentTpl(data));
                bindEvent();
            }
        }
    },
    InitProduct:function(selector,data,callbacks){
        let html = productTpl(data);
        $(selector).html(html);
    },
    InitActive:function(selector,data,callbacks){
        let html = activeTpl(data);
        $(selector).html(html);
    },
    Request:function(url,successCallback,errorCallback,config){
        if(!config){
            config = {}
        }
        $.ajax({
            type:config.type||'GET',
            url:url,
            data:config.data,
            success:function(data){
                successCallback&&successCallback(data)
            },
            error:function(status){
                errorCallback&&errorCallback(status)
            }
        })
    },
    Send:function(url,data,successCallback,errorCallback,config){
        if(!config){
            config = {}
        }
        $.ajax({
            type:config.type||'GET',
            url:url,
            data:data,
            success:function(data){
                successCallback&&successCallback(data)
            },
            error:function(status){
                errorCallback&&errorCallback(status)
            }
        })
    }
  });



//   章节模板
  function chapterTpl(data){
    let outer = '';
    
    data.forEach((item,i)=>{
        outer += itemHtml(item,i)
    })
    return outer;
  }

//   评论模板
  function commentTpl(comments){
      let outer = ''
    comments.forEach(function(com,i){

        outer += `
        <div class="comment-item row mb-60">
            <div class="col-1">
                <span class="comment-avatar" data-si="${i}" style="background-image:url(${com.avatar})">

                </span>
            </div>
            <div class="col-11">
                <p class="comment-username fs-26 mb-12">
                    ${com.name}
                    ${picList(com.thumbs)}
                </p>
                <span class="block fs-24 c-153 mb-24">
                    ${com.time}
                </span>
                <p class="comment-content fs-26 c-51" data-si="${i}">
                    ${com.content}
                </p>
            </div>
        </div>
        `
    })

    function picList(pics){
        let list = '';
        if(pics&&pics.length){
            pics.forEach(function(li,i){
                list += `<span class="box-26" style="background-image:url(${li})"></span>`
            })
        }
        
        return list
    }

    return outer;
  }

//   产品模板
  function productTpl(pros){
    let list = '';
    pros.forEach(function(item,i){
        let priceHtml = item.price?`<span class="pull-right c-red fs-36"><b class="fs-24">￥</b>${item.price}</span>`:'';
        list += `
        <div class="product-item ptb-20">
            <div class="thumbs">
                <div class="img-cover"  style="background-image: url(${item.cover})"></div>
            </div>
            <div class="desc">
                <div>
                        <p class="mb-16 fs-28 c-51 fw-bold desc-title">${item.title}</p>
                        <p class="fs-24 c-102 desc-content">${item.content}</p>
                </div>
                <p class="fs-20 c-167">
                    共${item.count}期
                    ${priceHtml}
                </p>
            </div>
        </div>
        `
    })
    return list
  }

//   赢家年会模板
  function activeTpl(actives){
    let list = '';
      actives.forEach(function(item,i){
        let priceHtml = item.price?`<span class="pull-right c-red fs-36"><b class="fs-24">￥</b>${item.price}</span>`:'';
        list += `
          <div class="product-item column pa-20 mb-20">
                <div class="img-cover mb-16" style="padding-bottom:60%;background-image: url(${item.cover})"></div>
                <div class="desc">
                    <p class="mb-16 fs-28 c-51 fw-bold">${item.title}</p>
                    <p class="mb-10 fs-24 c-102">${item.content}</p>
                    <p class="fs-20 c-167">
                        共${item.count}期
                        ${priceHtml}
                    </p>
                </div>
            </div>
          `
      })
      return list;
  }



  function itemHtml(item,i){
    let list = listHtml(item.content,i)
    let outer = `
    <div class="YJ-collapse-item mb-40">
        <div class="YJ-collapse-title row fs-26 fw-bold mb-24 ${item.open?'open':''}">
            <p class="pl-40 col-2">
                    第${i+1}期 &nbsp;&nbsp;
            </p>
            <p class="col-9">
                    ${item.title}
                    <span class="YJ-collapse-toggler pull-right slow">↓</span>
            </p>
            
        </div>
        <div class="collapse-content slow">
                ${list}
        </div>
    </div>
    `;
    return outer
  }

  function listHtml(list,pi){
    let outer = '';
    list.forEach(function(li,i){
        outer += `
        <div class="row mb-24">
            <p class="chapter-play col-2 pl-40" data-pi="${pi}" data-si="${i}" data-source="${li.source}">
                △
            </p>
            <p class="col-9">
                <span class="block fs-22 c-102 mb-12">${li.title}</span>
                <span class="block fs-20 c-167">${Math.ceil(li.duration/60)}分钟</span>
            </p>
            
        </div>
        `
    })
    return outer;
  }