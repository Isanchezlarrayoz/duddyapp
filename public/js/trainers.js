"use strict";

  var num_trainers = 0;
    $(document).ready(function () {

 	$("#alertKO").hide();
     getTrainers();
     getClients();

    });


    function getTrainers(){
       $.ajax({
            type: "GET",
            url: "/getTrainers",
            success: function (res) {
                num_trainers =res.length;
                var num = 1;
                for(var i in res){
                  
                 $('#trainers').append('' +
                   '<label>Entrenador'+num+'</label>'+
                    '<div class="row col-xs-12">'+
                        '<div class="col-md-1 align-baseline" style="margin-top: 9px">'+
                        'Nombre'+
                        '</div>'+
                      '<div class="col-md-2">'+
                        '<input id="name'+i+'" type="text" class="form-control" placeholder="Nombre" value="'+res[i].name+'">'+
                      '</div>'+
                      '<div class="col-md-1" style="margin-top: 9px">'+
                        'Valoración'+
                        '</div>'+
                      '<div class="col-md-1">'+
                        '<input id="reputation'+i+'" type="text" class="form-control" placeholder="" value="'+res[i].reputation+'">'+
                      '</div>'+
                      '<div class="col-md-3" style="margin-top: 9px">'+
                        'Máximo número de clientes'+
                        '</div>'+
                      '<div class="col-md-1">'+
                        '<input id="disp'+i+'" type="number" Max="10" min="0" class="form-control" value="'+res[i].disp+'">'+
                      '</div>'+
                    '</div>'+
                    '<hr class="row col-xs-9 col-md-9">'+
                   
                     '');
                 num++;
                }

            },
            error: function (err) {
               console.log("err");
            },
            dataType: "json",
            contentType: "application/json"
        });

    }

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

    
   $("#btnCalculate").click(function (e){
       e.preventDefault();


        var trainers = [];
        for(var i = 0; i < num_trainers; i++ ){
          var single_trainer = {};
          single_trainer.name = $('#name'+i).val();
          single_trainer.reputation = $('#reputation'+i).val();
          single_trainer.disp = $('#disp'+i).val();
          trainers.push(single_trainer);
        }


        $.ajax({
            type: "POST",
            url: "/calculate",
            data: JSON.stringify(trainers),
            success: function (res) {
                console.log("result"); 
                $("#alertKO").hide();

                $('#trainer_tab').hide();
                 $('#results').removeAttr('hidden');

                 var pos = 1;
                for(var i in res){
                 	
                   $('#results_cards').append('' +
                    '<div id="trainer_tab" class="col-xs-8 col-md-4" style="margin-bottom: 20px">'+
                      '<div>'+
                        '<div class="card text-center h-100">'+
                          '<div id="cardTitle" class="card-header">Entrenador'+
                            pos+'<i class="fas fa-info-circle float-right" data-toggle="tooltip" data-html="true" data-placement="top" title="Valoración: '+
                            res[i].reputation+' Max clientes: '+res[i].disp+'"></i>'+
                          '</div>'+
                          '<div  class="card-body row">'+
                          	'<div class="col-xs-2 col-md-2">'+
                          	'<i class="fas fa-user-circle fa-2x	"></i>'+
                          	'</div>'+
                          	'<div class="col-xs-10 col-md-10">'+
                          		'<label>'+res[i].name+'</label><br>'+
                            	'Clientes asignados: '+
                            	'<ul id=trainerBody'+i+'>'+
                            	'</ul>'+
                            '</div>'+
                          '</div>'+
                          '<div class="card-footer text-muted">'+
                            res[i].clients.length+' Clientes asignados'+
                          '</div>'+
                        '</div>'+
                      '</div>'+
                    '</div>'+
                    '');

                   pos++;
                }

                for(var i in res){
                  for(var v in res[i].clients){
                     $('#trainerBody'+i).append('' +
                      '<li>'+res[i].clients[v].name+'</li>'
                      );

                  }
                }
                conjuntoSat(res);

            },
            error: function (err) {
               console.log("err");
               $("#alertKO").show();
               $("#alertKO").html("La valoración del entrendador debe ser entre 0 y 5");
            },
            dataType: "json",
            contentType: "application/json"
        });


    });

   $("#btnVolver").click(function (e){
       e.preventDefault();

       $('#trainer_tab').show();
        $('#results').prop('hidden', true);
        $('#results_cards').html("");
        $('#results_val').html("");
     });


   function conjuntoSat(trainers){

   		console.log(trainers);
   		 for(var i in trainers){

   		 	var clients = trainers[i].clients
                  for(var v in clients){

                  	$('#results_val').append('' +
                  		'<li>'+clients[v].name+': '+calculateSatisfaction(trainers[i].reputation, clients[v].importance)+
                  		'</li>');
                  }
                }

   }

   function calculateSatisfaction(trainer, client){


   		  if( parseFloat(trainer) > 4.0){

         	return "Muy satisfecho";

         }else if ( parseFloat(trainer) > 3.0){

         	if (client > 7.0) {
         	    return "Satisfecho";
         	}else {
         		return "Muy Satisfecho";	
         	}

         }else if ( parseFloat(trainer) > 2.0){

         	if (client > 8.0) {
         	    return "Insatisfecho";
         	}else if (client > 5.0){
         		return "Satisfecho";	
         	}else {
         		return "Muy satisfecho";	
         	}

         }else{

         	if (client > 8.0) {
         	    return "Muy insatisfecho";
         	}else if (client > 5.0){
         		return "Insatisfecho";	
         	}else {
         		return "Satisfecho ";	
         	}
         }
   }