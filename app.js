var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');


//carga de datos de los entrenadores y clientes a modo de DB
var clients = [{'name':'q', 'importance':2.6},{'name':'r', 'importance':3.7},{'name':'s', 'importance':8.5},{'name':'t', 'importance':9.7}
,{'name':'u', 'importance':2.6},{'name':'v', 'importance':4.7},{'name':'w', 'importance':5.6},{'name':'x', 'importance':3.7}
,{'name':'y', 'importance':8.1},{'name':'z', 'importance':2.5}];

var trainers = [{'name':'A', 'reputation':4.5, 'disp':1},{'name':'B', 'reputation':3.2, 'disp':4},{'name':'C', 'reputation':1.2, 'disp':3}
,{'name':'D', 'reputation':3.4, 'disp':2}];
///

//var index = require('./index');

app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({ extended : true }));
//app.use('/', index);
app.use(express.static(__dirname + '/public'));
app.use('/trainers', function(req,res){
    res.sendFile(path.join(__dirname+'/public/html/trainers.html'));
  });


app.listen(process.env.PORT || 3000, function () {
  console.log('Dudy app listening on port 3000!');
});

app.get('/getTrainers', function(req, res) {
      res.status(200).json(trainers);
});

app.get('/getClients', function(req, res) {
      res.status(200).json(clients);
});

app.post('/calculate', function(req, res){

  //recibimos los datos de los entrenadores necesarios para el cálculo del front: nombre, reputacion y plazas disponibles
  var trainers = req.body;
 	var clients_sort = [];

  //reordenar los clientes de mayor importancia a menor
  clients = clients.sort(function(a, b) {
    return parseFloat(b.importance) - parseFloat(a.importance);
	});

  //clonado del array de clientes a uno auxiliar para trabajar sobre ese
  for(var i in clients){
      clients_sort.push(clients[i]);
  }

  //reordenar los entrenadores de mayor reputacion a menor
 	var trainers_sort = trainers.sort(function(a, b) {
    return parseFloat(b.reputation) - parseFloat(a.reputation);
	});


  //matcheo de clientes con los entrenadoress
 	for(i in trainers_sort){
 		
    //si la reputacion no esta en el intervalo [0,5] devuelve error.
    if(trainers_sort[i].reputation > 5 || trainers_sort[i].reputation < 0){
      
      return res.status(401).json({msg:'ERR'});
    }
 		
    trainers[i].clients = [];

    var disponibles = trainers_sort[i].disp;

 		while(disponibles >0){


 			if(clients_sort.length != 0){
        
   			trainers_sort[i].clients.push(clients_sort[0]);
   			clients_sort.shift();
   			disponibles = disponibles - 1;
  
 			}else{
 				break;
 			}
 		}

    
  
 	}
	 res.status(200).json(trainers_sort);
});

module.exports = app;