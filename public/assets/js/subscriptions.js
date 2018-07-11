jQuery(document).ready(function($) {
    var selectId = 0;
    drawTable();

    function HideConfirm(){
        var element = $("[data-id="+selectId+"]");
        element.confirmation('dispose');
    }
    function drawTable(){
        var selectCustomerId = localStorage['selectCustomerId'];
        $.getJSON( "/monetization/getpackages?customerId="+selectCustomerId, function( data ) {
            console.log(data);
            var html = '';
            //$('#subscriptionTable').DataTable({searching: false,"bDestroy": true});
            data.forEach(element => {
                html += '<tr><td>' +element.id + '</td><td>' 
                    +element.title + '</td><td>'
                    +element.details+'</td><td>'
                    +'<a href="#" + data-id="'
                    +element.id+'" class="btn btn-outline-danger toggleConfirm" data-toggle="confirmation" data-title="Sure Delete?" data-popout="true">Delete</a><a href="/admin/users/edit/'
                    +element.id+'" class="btn btn-outline-info">Edit</a></td></tr>'
            });
            $("#subscriptionTable tbody").html(html);
            $('#subscriptionTable').DataTable({searching: false,bDestroy:true});
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