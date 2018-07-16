jQuery(document).ready(function($) {
    var selectId = 0;
    drawTable();

    function HideConfirm(){
        var element = $("[data-id="+selectId+"]");
        element.confirmation('dispose');
    }
    function drawTable(){
        var selectCustomerId = localStorage['selectCustomerId'];
        $.getJSON( "/mobileUsers/display?customerId="+selectCustomerId, function( data ) {
            console.log(data);
            var html = '';
            //$('#subscriptionTable').DataTable({searching: false,"bDestroy": true});
            data.forEach(element => {
                html += '<tr><td>' +element.email + '</td><td>' 
                    +element.fullName + '</td><td>'
                    +element.country+'</td><td>'
                    +element.title+'</td><td>'
                    +element.last_active.substring(0,19)+'</td><td>'
                    +element.device_id+'</td><td>'
                    +element.user_status+'</td><td>'
                    +'<a href="#" + data-id="'
                    +element.id+'" class="btn btn-outline-danger toggleConfirm" data-toggle="confirmation" data-title="Sure Delete?" data-popout="true">Delete</a><a href="/monetization/editPack/'
                    +element.id+'" class="btn btn-outline-info">Edit</a></td></tr>'
            });
            $("#mobileUserTable tbody").html(html);
            $('#mobileUserTable').DataTable({searching: false,bDestroy:true});
            $('[data-toggle=confirmation]').confirmation({
                rootSelector: '[data-toggle=confirmation]',
                onConfirm:function(){
                    console.log("confirm");
                    console.log(this.id);
                    selectId = this.id;
                    $.ajax({
                        url:'/monetization/deletePackage',
                        data:{packageId:selectId},
                        type:'GET',
                        success:function(response){
                            location.reload();
                        }
                    })
                },
                onCancel:function(){
                    selectId = this.id;
                    $("[data-id="+selectId+"]").trigger("click");
                }
                // other options
            });
        });
    
    }

});