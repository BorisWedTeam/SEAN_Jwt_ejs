jQuery(document).ready(function($) {
    initCollapse();
});

function addLanguage(){
    var title = $("#title").val();
    var description = $("#description").val();
    var tags = $("#tags").val();
    var countryId = $("#country").val();
    var smallThumbnail = $("#smallThumbnail").val();
    var mediumThumbnail = $("#mediumThumbnail").val();
    var largeThumbnail = $("#largeThumbnail").val();

    if(title==null||title==''||title==undefined){
        bootbox.alert("Please input title");
        return;
    }
    if(description==null||description==''||description==undefined){
        bootbox.alert("Please input description");
        return;
    }
    if(tags==null||tags==''||tags==undefined){
        bootbox.alert("Please input tags");
        return;
    }
    if(countryId==null||countryId==''||countryId==undefined){
        bootbox.alert("Please select a country");
        return;
    }

    if(smallThumbnail==null||smallThumbnail==''||smallThumbnail==undefined){
        bootbox.alert("Please input smallThumbnail ");
        return;
    }
    if(mediumThumbnail==null||mediumThumbnail==''||mediumThumbnail==undefined){
        bootbox.alert("Please input mediumThumbnail");
        return;
    }
    if(largeThumbnail==null||largeThumbnail==''||largeThumbnail==undefined){
        bootbox.alert("Please input largeThumbnail");
        return;
    }
    appendPanel(countryId,title,description,tags,smallThumbnail,mediumThumbnail,largeThumbnail);
    $("[data-dismiss=modal]").trigger({ type: "click" });
}
function appendPanel(countryId,title,description,tags,smallThumbnail,mediumThumbnail,largeThumbnail){

    var html = "";

    html+='<div class="collapsibleParent">'+
            '<button  class="remove">X</button>'+
            '<div class="languageTitle">'+title+'</div>'+
    '<button class="collapsible"><i class="fa fa-chevron-down" aria-hidden="true"></i></button>'+
'</div><div class="content" style="display:block"><div class="row marginForm"><div class="col-md-6"><div class="col-md-3 text-right">Title</div>'+
            '<div class="col-md-9"><input type="text"  class="form-control" value="'+title+'"/></div>'+
        '</div>';
        html+='<div class="col-md-6">';
        html+='<div class="col-md-3 text-right">Description</div>';
        html+='<div class="col-md-9"><textarea type="text"  class="form-control" rows=3>'+description+'</textarea></div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="row marginForm">';
        html+='<div class="col-md-6">';
        html+='<div class="col-md-3 text-right">Tags</div>';
        html+='<div class="col-md-9"><input type="text" class="form-control" value="'+tags+'"/></div>';
        html+='</div>';
        html+='<div class="col-md-6">';
        html+='<div class="col-md-3 text-right">Country</div>';
        html+='<div class="col-md-9">';
        html+='<select class="form-control">';
        for(var i = 0 ; i < countries.length; i ++){
            if(countryId==countries[i].id)
                html +="<option value='"+countries[i].id+"' selected>"+countries[i].name+"</option>";
            else 
                html +="<option value='"+countries[i].id+"' >"+countries[i].name+"</option>";
        }
        html+='</select>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        html+='<div class="row marginForm">';
        html+='<div class="col-md-9">';
        html+='<div class="col-md-3 text-right">Thumbnails</div>';
        html+='<div class="col-md-9">';
        html+='<div class="row marginForm">';
        html+='<input type="text"  class="form-control" placeholder="small" value="'+smallThumbnail+'"/>';
        html+='</div>';
        html+='<div class="row marginForm">';
        html+='<input type="text" class="form-control" placeholder="medium" value="'+mediumThumbnail+'"/>';
        html+='</div>';
        html+='<div class="row marginForm">';
        html+='<input type="text" class="form-control" placeholder="large" value="'+largeThumbnail+'"/>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        html+='</div>';
        $("#languagePanel").append(html);
        initCollapse();
    
}
$("#languagePanel").on("click",".remove",function(e){
    var collapseHeader = this.parentElement;
    var collapseContent = collapseHeader.nextElementSibling;
    collapseHeader.remove();
    collapseContent.remove();

    // var id = collapseHeader.id.replace("language_","");
    // $.ajax({
    //     url:"/monetization/removeLanguage",
    //     type:"GET",
    //     data:{id:id},
    //     success:function(response){
    //         collapseHeader.remove();
    //         collapseContent.remove();
    //         var index = languageIds.indexOf(parseInt(id));
    //         if(index>-1){
    //             languageIds.splice(index,1);
    //         }
    //     }
    // })
})
