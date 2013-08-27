/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var handleRequest = function(request, response) {
  var fs = require('fs');

  console.log("Serving request type " + request.method + " for url " + request.url);
  var roomName = request.url.split('/')[3];


  var statusCode = 200;
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/plain";
  response.writeHead(statusCode, headers);

  request.addListener("data", function(chunk){
    // console.log(chunk.toString());

    fs.readFile('./1/classes', function(err, data) {
      var hardD = JSON.parse(data.toString());
      var newMessageData = JSON.parse(chunk.toString());

      if(hardD[roomName]) {
        hardD[roomName].results.push(newMessageData);
      } else {
        console.log('its inside the newer part');
        hardD[roomName] = {results : newMessageData};
      }
      hardD = JSON.stringify(hardD);
      fs.writeFile('./1/classes', hardD, function(err) {
        if(err) throw err;
      });
    });

  });

  fs.readFile('./1/classes', function(err, data) {
    if(!err) {
      var hardD = JSON.parse(data.toString());
      response.end(JSON.stringify(hardD[roomName]));
    } else {
      response.end(err);
    }
  });
};


var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports.handleRequest = handleRequest;
