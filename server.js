/* Load the HTTP library */
var http = require('http');
var static = require('node-static');
var fs = require('fs');
var url = require('url');
let chorus = require('./init');
const PORT = process.env.PORT || 3030;

var file = new (static.Server)(__dirname);

/* Create an HTTP server to handle responses */
let handleRequest = (request, response) => {
  var q = url.parse(request.url, true);
  var filename = "." + q.pathname;
  var pathname = url.parse(request.url).pathname;
  if (pathname.endsWith('.css')) {
    response.writeHead(200, {
      'Content-Type': 'text/css',
    });
    fs.createReadStream(`.${pathname}`).pipe(response);
    return;
  }
  if (pathname != '/' && pathname.length == 23) {
    var songID = url.parse(request.url).pathname.substr(1);

    chorus.getChorus(songID).then(async value => {
      var htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="stylesheet" href="/style.css">
        <title>Spotify Chorus Finder</title>
      </head>
      <body>
        <h4>Song ID: ${songID}</h4>
        ${value}
      </body>
    </html>
  `;
      var contentLength = Buffer.byteLength(htmlContent, 'utf-8');
      htmlContent += ('<p>' + value + '</p>');
      htmlContent += ('<h4>Song ID: ' + songID + '</h4>');

      response.setHeader('Cache-Control', 'no-store');
      response.writeHead(200, { 'Content-Type': 'text/html', 'Content-Length': contentLength });
      response.write(htmlContent);
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
