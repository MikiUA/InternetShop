const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
var port=8000;
const path=require('path');
const mongoose = require('mongoose');
const { resolve } = require('path');

var mydb = mongoose.connect('mongodb://localhost/testdb', function(err){
	if(err){
		console.log(err);
	} else {
		console.log('connected to mongodb');
	}
});

var shop = new mongoose.Schema({
	name : String,
	server : String
});
var shop_collection = mongoose.model('shops',shop);

var shop_item = new mongoose.Schema({
	image_url : String,
	item_shop : String,
	name : String,
	cost : Number,
	quantity_left : Number
});
var item_collection = mongoose.model('shop_items',shop_item);
// filldb();
function filldb(){
	add_shop('Fast Food restaurant');
	add_shop('A shop with a very strange long name');
	add_shop('Sushi TM');
	add_shop('Borshch');
	add_item('Fast Food restaurant', 'Fries');
	add_item('Fast Food restaurant', 'Burger');
	add_item('Fast Food restaurant', 'Cola');
	add_item('Fast Food restaurant', 'Sous 1');
	add_item('Fast Food restaurant', 'Sauce 2');
	add_item('Fast Food restaurant', 'Nuggets');
	add_item('A shop with a very strange long name', 'A very strange item 1');
	add_item('A shop with a very strange long name', 'Some ponchics');
	add_item('A shop with a very strange long name', 'A poncho');
	add_item('A shop with a very strange long name', 'Sponge Bob');
	add_item('Sushi TM', 'Some sushi');
	add_item('Sushi TM', 'some other sushi');	
	add_item('Sushi TM', 'I don\'t really like sushi');
	add_item('Borshch','Borshch');
	add_item('Borshch','Smetana');
	add_item('Borshch','Pampushki');
	add_item('Borshch','Grechka');
	add_item('Borshch','Makarony');
	add_item('Borshch','kompot');
	add_item('Borshch','Kisel');


}
function add_shop(name){
	let sserver=name.trim()+".default_server";
	new shop_collection({
		'name':name,
		'item_shop':sserver
	}).save(function(err){
			 if(err) throw err;
	 });	
}
function add_item(item_shop,item_name){
	let image="../img/placeholder.jpg";
	let cost=Math.floor(Math.random() * 1400)+2;
	let quantity_left=Math.floor(Math.random() * 1400)+2;
	new item_collection({
		'image_url':image,
		'item_shop':item_shop,
		'name':item_name,
		'cost':cost,
		'quantity_left':quantity_left
	}).save(function(err){
			 if(err) throw err;
	 });	
}


app.use(express.static(path.join(__dirname, "public")));
app.get('/', function(req, res){
	res.setHeader("Content-Type", "text/html");
    res.write(req);
	// res.sendFile(__dirname,"public", 'index.html');
});
io.sockets.on('connection', function(socket){
	

	socket.on('load shop list',function(req,callback){
		shop_collection.find({}, function(err, docs){
			if(err) throw err;
			callback(docs);
		});
	});	
	socket.on('load item list',function(req,callback){
		item_collection.find({item_shop:req}, function(err, docs){
			if(err) throw err;
			callback(docs);
		});
	});	
	socket.on('load item by id',function(req,callback){
		item_collection.find({_id:req}, function(err, docs){
			if(err) throw err;
			callback(docs);
		});
	});

	
	 function GetCostByID(id){
		console.log(id);
		item_collection.find({_id:id}, function(err, docs){
			if(err) throw err;
			console.log(docs.cost);
			// resolve(docs.cost);
			return new Promise(resolve => {
				resolve(docs.cost);
			  });
		});
	}

	async function SubmitSum(orderlist){
		console.log("SubmitSum start",orderlist);
		let total_price=0, keys=Object.keys(orderlist),size=keys.length;

		for (let i=0;i<size;i++){
			let price = await GetCostByID(keys[i]);
			total_price+=price*orderlist[keys[i]];
			console.log(price,orderlist[keys[i]]);
			console.log(total_price);
		}
		return total_price;
	}
	socket.on('post full order',function(req,callback){
		try{
			// req={
			// 	'name':name,
			// 'email':email,
			// 'phone':phone,
			// 'adress':address,
			// 'orderlist':orderlist

			// let price=SubmitSum(req.orderlist);
			// callback(price);
			callback('success');
		}
		catch(e){callback(e);}

	});
	

});











server.listen(port, function(){
	console.log('server is up!');
});


























































// var http = require('http');
// var url = require('url');
// var fs = require('fs');

// var port = 3000;

// var server=http.createServer(function (req, res) {
//     var q = url.parse(req.url, true);
//     var filename = "." + q.pathname;
//     // var filename=(__dirname+"/public"+ '/index.html');
//     console.log(filename);
//     fs.readFile(filename, function(err, data) {
//         console.log(err);
//       if (err) {
//         res.writeHead(404, {'Content-Type': 'text/html'});
//         return res.end("404 Not Found");
//       } 
//       res.writeHead(200, {'Content-Type': 'text/html'});
//       res.write(data);
//       return res.end();
//     });
// });







// server.listen(port,function(){
//     console.log('Server running on port',port);
//     });