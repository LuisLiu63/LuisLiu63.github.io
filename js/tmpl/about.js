$(function(){
    var urls = $.Urls.about;

    $.Request(urls.resume,function(data){
        console.log(data)
        data.data.forEach(function(item){
            delete item.price
        })
        $.InitProduct('.YJ-Product',data.data,{

        })
    })
    $.Request(urls.active,function(data){
        console.log(data)
        $.InitActive('.YJ-Active',data.data,{

        })
    })
})