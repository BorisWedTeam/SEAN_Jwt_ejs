function editPackage(packageId){
    var packageTitle = $("#packgeTitle").val();
    var packageDetail = $("#packageDetails").val();
    var customerId = localStorage['selectCustomerId'] ;
    if(packageTitle==null||packageTitle==''){
        bootbox.alert("Please input package title");
        return;
    }
    if(packageDetail==null||packageDetail==''){
        bootbox.alert("Please input package detail");
        return;
    }
    if(languageIds.length<1){
        bootbox.alert("Please insert at least 1 language");
        return;
    }
    $.ajax({
        url:'/monetization/editPackage',
        data:{packageTitle:packageTitle,packageDetail:packageDetail,customerId:customerId,languageIds:languageIds,packageId:packageId},
        type:"GET",
        success:function(response){
            //window.location.href = '/monetization/subscription';
        }
    })
}