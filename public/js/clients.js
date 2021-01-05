'use strict' 

 function getClients(){
       $.ajax({
            type: "GET",
            url: "/getClients",
            success: function (res) {
               
                for(var i in res){

                    $('#tbClients').prepend('' +
                        '<tr>' +
                            '<td class="details-control">'+res[i].name+'</td>' +
                            '<td class="details-control">'+res[i].importance+'</td>' +
                        '</tr>');
                }
            },
            error: function (err) {
               console.log("err");
            },
            dataType: "json",
            contentType: "application/json"
        });

    }