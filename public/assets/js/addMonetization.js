function addLanguage(){
    var countryId = $("#country").val();
    var title = $("#title").val();
    var price = $("#price").val();
    var description = $("#description").val();
    var duration = $("#duration").val();
    var bannerUrl = $("#bannerUrl").val();
    if(countryId==null||countryId==''||countryId==undefined){
        bootbox.alert("Please select a country");
        return;
    }
    if(title==null||title==''||title==undefined){
        bootbox.alert("Please input title");
        return;
    }
    if(price==null||price==''||price==undefined){
        bootbox.alert("Please input price ");
        return;
    }
    if(bannerUrl==null||bannerUrl==''||bannerUrl==undefined){
        bootbox.alert("Please input bannerUrl");
        return;
    }
    if(description==null||description==''||description==undefined){
        bootbox.alert("Please input description");
        return;
    }
    if(countryId==null||countryId==''||countryId==undefined){
        bootbox.alert("Please select a country");
        return;
    }

    $.ajax({
        url:'/monetization/addLanguage',
        type:'GET',
        data:{countryId:countryId,title:title,price:price,description:description,duration:duration,bannerUrl:bannerUrl},
        success:function(data){
            console.log(data);
            $("[data-dismiss=modal]").trigger({ type: "click" });
            addLanguagePanel(data);
            
            modalInit();
        }
    })
}
function modalInit(){
    $("#country").val();
    $("#title").val('');
    $("#price").val('');
    $("#description").val('');
    $("#duration").val('');
    $("#bannerUrl").val('');
}
var languageIds = [];
jQuery(document).ready(function($) {
    initCollapse();
});
function addLanguagePanel(packageId){
    var countryId = $("#country").val();
    var title = $("#title").val();
    var price = $("#price").val();
    var description = $("#description").val();
    var duration = $("#duration").val();
    var bannerUrl = $("#bannerUrl").val();
    appendPanel(countryId,title,price,description,duration,bannerUrl,packageId);
}
function appendPanel(cId,title,price,description,duration,bannerUrl,packageId){
    languageIds.push(parseInt(packageId));
    var html = "";
    html +='<div class="collapsibleParent" id="language_'+packageId+'">';
    html +='<button  class="remove">X</button>';
    html+='<div class="languageTitle">'+title+'</div>';
    html+='<button class="collapsible"><i class="fa fa-chevron-down" aria-hidden="true"></i></button>';
    html+='</div> <div class="content" style="display:block">'+
	'<div class="row marginForm">'+
	    '<div class="col-md-6">'+
        '<div class="col-md-3 text-right">Name</div>';
    html+='<div class="col-md-9"><input type="text"  class="form-control" value="'+title+'"/></div>';
    html+='</div>'+
    '<div class="col-md-6">'+
    '<div class="col-md-3 text-right">Country</div>'+
    '<div class="col-md-9">'+
        '<select class="form-control">';
    for(var i = 0 ; i < countries.length; i ++){
        if(cId==countries[i].id)
            html +="<option value='"+countries[i].id+"' selected>"+countries[i].name+"</option>";
        else 
            html +="<option value='"+countries[i].id+"' >"+countries[i].name+"</option>";
    }

    html+='</select>'+
            '</div>'+
            '</div>'+  
            '</div>'+
            '<div class="row marginForm">'+
                '<div class="col-md-6">'+
                '<div class="col-md-3 text-right">Price</div>'+
                '<div class="col-md-9">';
    html+='<input type="text" class="form-control" value="'+price+'"/>';
    html+='</div>';
    html+='</div>'+
            '<div class="col-md-6">'+
            '<div class="col-md-3 text-right">PackageId</div>'+
            '<div class="col-md-9">';
    html+='<input type="text"  class="form-control" value="'+packageId+'"/>';
    html+='</div></div></div>';
    html+='<div class="row marginForm">'+
            '<div class="col-md-3 text-right">Description</div>'+
            '<div class="col-md-6"><textarea type="text"  class="form-control" rows=3 >'+description+'</textarea></div>'+
            '</div></div>';
    $("#languagePanel").append(html);
    initCollapse();
}
$("#languagePanel").on("click",".remove",function(e){
    var collapseHeader = this.parentElement;
    var collapseContent = collapseHeader.nextElementSibling;
    var id = collapseHeader.id.replace("language_","");
    $.ajax({
        url:"/monetization/removeLanguage",
        type:"GET",
        data:{id:id},
        success:function(response){
            collapseHeader.remove();
            collapseContent.remove();
            var index = languageIds.indexOf(parseInt(id));
            if(index>-1){
                languageIds.splice(index,1);
            }
        }
    })
})

function addPackage(){
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
        url:'/monetization/addPackage',
        data:{packageTitle:packageTitle,packageDetail:packageDetail,customerId:customerId,languageIds:languageIds},
        type:"GET",
        success:function(response){
            window.location.href = '/monetization/subscription';
        }
    })

}