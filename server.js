/* Load the HTTP library */
var http = require('http');
var static = require('node-static');
var fs = require('fs');
var url = require('url');
let chorus = require('./init');
const PORT = process.env.PORT || 3030;

var file = new(static.Server)(__dirname);

/* Create an HTTP server to handle responses */
let handleRequest = (request, response) => {
  var q = url.parse(request.url, true);
  var filename = "." + q.pathname;
  var pathname = url.parse(request.url).pathname;
  if (pathname != '/') {
    response.writeHead(200, { 'Content-Type': 'text/enriched', 'Content-Length': ''});
    var songID = url.parse(request.url).pathname.substr(1);
    response.write('Song ID: ' + songID + '\n');
    finalChorus = chorus.getChorus(songID).then(async value => {
      response.write(value);
      response.end();
    })
  }
  else {
    //response.writeHead(200, { 'Content-Type': 'text/html' });
    fs.readFile('./index.html', null, function (error, data) {
      if (error) {
          response.writeHead(404);
          response.write('Whoops! File not found!');
      } else {
          response.write(data);
          // response.write(pathname);
      }
      response.end();
    });
  }
};

server = http.createServer(handleRequest).listen(PORT);

server.on('error', (e) => {
  console.log('Address in use, retrying...');
  setTimeout(() => {
    server.close();
    server.listen(PORT);
  }, 1000);
});
