/* You should implement your request handler function in this file.
 * But you need to pass the function to http.createServer() in
 * basic-server.js.  So you must figure out how to export the function
 * from this file and include it in basic-server.js. Check out the
 * node module documentation at http://nodejs.org/api/modules.html. */

var handleRequest = function(request, response) {
  var fs = require('fs');

  console.log("Serving request type " + request.method + " for url " + request.url);
  var urlParse = request.url.split('/');
  var roomName = urlParse.pop();
  var statusCode = 0;

  if(urlParse[1] !== '1' && urlParse[2] !== 'classes' && urlParse[3] === undefined){
    statusCode = 404;
  } else if(request.method === 'GET') {
    statusCode = 200;
  } else if(request.method === 'POST') {
    statusCode = 201;
  } else if(request.method === 'OPTIONS') {
    statusCode = 200;
  }

  var headers =  {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,
    'Content-Type': "text/plain"
    };
  response.writeHead(statusCode, headers);

  if(statusCode === 404) {
    response.end('Page is not Found.');
  } else if(request.method === 'OPTIONS') {
    response.end('');
  } else if(request.method === 'GET') {
    fs.readFile('./1/classes', function(err, data) {
      if(!err) {
        if(data.length === 0) {
          console.log("in here");
          response.end(JSON.stringify([]));
        } else {
          var hardD = JSON.parse(data.toString());
          response.end(JSON.stringify(sortByDesc(hardD[roomName]['results'])));
        }
      } else {
        response.end(err);
      }
    });
  } else if(request.method === 'POST') {
    request.addListener("data", function(chunk){
      // var statusCode = 201;

      fs.readFile('./1/classes', function(err, data) {
        if(data.length > 0) {
          var hardD = JSON.parse(data.toString());
          var newMessageData = JSON.parse(chunk.toString());
          newMessageData['createdAt'] = ISODateString(new Date());

          if(hardD[roomName]) {
            hardD[roomName].results.push(newMessageData);
          } else {
            hardD[roomName] = {results : [newMessageData]};
          }
          hardD = JSON.stringify(hardD);
          fs.writeFile('./1/classes', hardD, function(err) {
            response.end('');
            if(err) throw err;
          });
        } else {
          chunk = chunk.toString();
          var newMessage = {};
          newMessage[roomName] = {results:[JSON.parse(chunk.toString())]};
          fs.writeFile('./1/classes', JSON.stringify(newMessage), function(err) {
            if(err){
              throw err;
            } else {
              response.end('');
            }
          });
        }
      });

    });
  }
};


var ISODateString = function(d){
  var pad = function(n){
    return n<10 ? '0'+n : n;
  };
  return d.getUTCFullYear()+'-' + pad(d.getUTCMonth()+1)+'-'+ pad(d.getUTCDate())+'T'+ pad(d.getUTCHours())+':'+ pad(d.getUTCMinutes()) + ':' + pad(d.getUTCSeconds())+'Z';
};

var sortByDesc = function(array) {
  var haveSwapped = false;
  while(!haveSwapped) {
    haveSwapped = true;
    for(var i=0; i < array.length - 1; i++) {
      if(array[i]['createdAt'] > array[i+1]['createdAt']) {
        var temp = array[i];
        array[i] = array[i+1];
        array[i+1] = temp;
        haveSwapped = false;
      }
    }
  }
  return array;
};
module.exports.handleRequest = handleRequest;
