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
  var headers =  {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, accept",
    "access-control-max-age": 10,
    'Content-Type': "text/plain"
    };

  if(request.url === '/') {
    headers['Content-Type'] = 'text/html';
    response.writeHead(200, headers);
    fs.readFile('../2013-08-chat-client/index.html', personalizedResponse);
  } else if(urlParse[1] !== '1' && urlParse[2] !== 'classes' && urlParse[3] === undefined) {
    response.writeHead(404, headers);
    response.end('Page is not Found.');
  } else if(request.method === 'OPTIONS') {
    response.writeHead(200, headers);
    response.end('');
  } else if(request.method === 'GET') {
    response.writeHead(200, headers);
    fs.readFile('./1/classes', function(err, data) {
      if(!err) {
        if(data.length === 0) {
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
    response.writeHead(201, headers);
    request.addListener("data", function(chunk){
      fs.readFile('./1/classes', function(err, data) {
        var hardD = JSON.parse(data.toString());
        var newMessageData = JSON.parse(chunk.toString());

        if(data.length > 0) {
          newMessageData['createdAt'] = ISODateString(new Date());

          if(hardD[roomName]) {
            hardD[roomName].results.push(newMessageData);
          } else {
            hardD[roomName] = {results : [newMessageData]};
          }
          fs.writeFile('./1/classes', JSON.stringify(hardD), function(err) {
            response.end('');
            if(err) throw err;
          });
        } else {
          var newMessage = {};
          newMessage[roomName] = {results:[newMessageData]};
          fs.writeFile('./1/classes', JSON.stringify(newMessage), personalizedResponse);
        }
      });

    });
  }
  var personalizedResponse = function(err, data) {
    if(err) {
      throw err;
    } else {
      response.end(data.toString());
    }
  };
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
