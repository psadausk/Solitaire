/// <reference path="../../typings/tsd.d.ts" />

var nodeStatic = require('node-static');
var http = require('http');
var port = 5858;


var file = new nodeStatic.Server('./', {
    cache: 0,
    gzip: true,
    
});

http.createServer( function( req, res) {
    req.addListener('end', function(){
        file.serve(req, res);
    }).resume();
}).listen(port);