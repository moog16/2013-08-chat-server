/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var handleRequest = function(request, response) {
  var fs = require('fs');

  console.log("Serving request type " + request.method + " for url " + request.url);
  console.log(request.headers);
  var roomName = (request.url.split('/')).pop();


  var statusCode = 200;
  var headers = defaultCorsHeaders;
  // request.addListener("data", function(chunk){
  // });

  fs.readFile('./1/classes', function(err, data) {
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode, headers);
    if(!err) {
      // debugger;
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
