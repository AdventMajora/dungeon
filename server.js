var express = require('express');
var fs = require('fs');
var async = require('async');
var xml2js = require('xml2js');
var _ = require('cloneextend');
var body_parser = require('body-parser');
var app = express();

app.use(express.static(__dirname));

//build the room configs
var parser = new xml2js.Parser();	//for parsing the Tiled maps
var configs_all = [];
var configs_inside = [];
var configs_outside = [];

var files = fs.readdirSync('./assets/rooms');
var inside_files = fs.readdirSync('./assets/rooms/inside');
var outside_files = fs.readdirSync('./assets/rooms/outside');

var room_data,inside_data,outside_data;

console.log('Building configs...');
async.parallel([
	function(callback) {
		async.eachSeries(files, function(file_name, callback) {
			if (file_name.indexOf('.tmx') > -1) {
				console.log(file_name);
				var data = fs.readFileSync(__dirname + '/assets/rooms/'+file_name);
				parser.parseString(data, function (err, result) {
					var config = [	
						result.map.layer[0].data[0]._.replace(/\r\n/g,'').split(','),
						result.map.layer[1].data[0]._.replace(/\r\n/g,'').split(','),
						result.map.layer[2].data[0]._.replace(/\r\n/g,'').split(',')
					];
					configs_all.push({name:file_name.substring(0,file_name.length-4), map: config});
					callback();
				});
			} else {
				callback();
			}	
		}, function() {
			room_data = "var configs = [\n"
			for (var i=0; i<configs_all.length; i++) {
				room_data+='\t'+JSON.stringify(configs_all[i])+',\n'
			}
			room_data+="];";
			callback();
			//fs.writeFileSync('configurations.js', file_data);
		});
	},
	function(callback) {
		async.eachSeries(inside_files, function(file_name, callback) {
			if (file_name.indexOf('.tmx') > -1) {
				console.log(file_name);
				var data = fs.readFileSync(__dirname + '/assets/rooms/inside/'+file_name);
				parser.parseString(data, function (err, result) {
					var config = [	
						result.map.layer[0].data[0]._.replace(/\r\n/g,'').split(','),
						result.map.layer[1].data[0]._.replace(/\r\n/g,'').split(','),
						result.map.layer[2].data[0]._.replace(/\r\n/g,'').split(',')
					];
					configs_inside.push({name:file_name.substring(0,file_name.length-4), map: config});
					callback();
				});
			} else {
				callback();
			}	
		}, function() {
			inside_data = "var inside_configs = [\n"
			for (var i=0; i<configs_inside.length; i++) {
				inside_data+='\t'+JSON.stringify(configs_inside[i])+',\n'
			}
			inside_data+="];";
			callback();
			//fs.writeFileSync('configurations.js', file_data);
		});
	},
	function(callback) {
		async.eachSeries(outside_files, function(file_name, callback) {
			if (file_name.indexOf('.tmx') > -1) {
				console.log(file_name);
				var data = fs.readFileSync(__dirname + '/assets/rooms/outside/'+file_name);
				parser.parseString(data, function (err, result) {
					var config = [	
						result.map.layer[0].data[0]._.replace(/\r\n/g,'').split(','),
						result.map.layer[1].data[0]._.replace(/\r\n/g,'').split(','),
						result.map.layer[2].data[0]._.replace(/\r\n/g,'').split(',')
					];
					configs_outside.push({name:file_name.substring(0,file_name.length-4), map: config});
					callback();
				});
			} else {
				callback();
			}	
		}, function() {
			outside_data = "var outside_configs = [\n"
			for (var i=0; i<configs_outside.length; i++) {
				outside_data+='\t'+JSON.stringify(configs_outside[i])+',\n'
			}
			outside_data+="];";
			callback();
			//fs.writeFileSync('configurations.js', file_data);
		});
	}
],function() {
	var final_data = room_data+"\n"+inside_data+"\n"+outside_data;
	fs.writeFileSync('configurations.js',final_data);
});




var server = require('http').createServer(app).listen(8081);
console.log('Server running!');

