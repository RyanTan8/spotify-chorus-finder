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
        <link
    href="data:image/x-icon;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGDYHg5g2B4zYNceTmDXHk5g2B4zYNgeDgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYNgeC2DXHl5g1x68YNce6WDXHvZg1x72YNce6WDXHrxg1x5eYNgeCwAAAAAAAAAAAAAAAAAAAAAAAAAAYNgeF2DXHp9g1x75YNce/2DXHv9g1x7/YNce/2DXHv9g1x7/YNce+WDXHp9g2B4XAAAAAAAAAAAAAAAAYNgeC2DXHp9g1x7/YNce/2DXHv9g1x7/YNce/2DXHv9g2B7/Ydoe/2DYHv9g1x7/YNcen2DYHgsAAAAAAAAAAGDXHl5g1x74YNce/2DYHv9h2h7/Ydoe/2HaHv9h2R7/XM4e/0qgHf9Vuh3/Ydge/2DXHvlg1x5eAAAAAGDYHg5g1x67Ydge/1a+Hf83bRv/PHsc/0KJHP9Bhxz/OXIb/yxRG/8uVhv/VLgd/2HaHv9g1x7/YNceu2DYHg5g2B4yYNce6GDYHv9czR7/SJkc/z1+HP84cRv/OXMb/0CGHP9OqB3/VLcd/0OMHP9Wvh3/Ydge/2DXHuhg2B4yYNceTmDXHvZh2R7/TaYd/zp2HP9Hlhz/TKMd/0qfHf9DjBz/M2Qb/yI4Gv8oSBr/Vbsd/2HZHv9g1x72YNceTmDXHk5g1x72Ydke/1CtHf8vWhv/JkMa/yQ8Gv8kPhr/KUka/zVoG/9JnBz/V8Ad/0+sHf9byh7/YNge9mDXHk5g2B4yYNce6F7SHv9LoR3/TaUd/1KzHf9TtR3/U7Yd/1O1Hf9OqR3/P4Ic/ydFGv8dKhr/Tqkd/2HaHuhg2B4yYNgeDmHYHrtbyh7/KUoa/xojGf8dKhr/HzAa/x8wGv8cKhr/GiQZ/x4uGv8uVxv/Sp4d/17SHv9g2B67YNgeDgAAAABg2B5eYNce+FnEHv9Nph3/RI8c/0CEHP9AhRz/RZEc/02nHf9XwR3/X9Ue/2HaHv9g1x75YNceXgAAAAAAAAAAYNgeC2DXHp9g2B7/Ydoe/2HaHv9h2h7/Ydoe/2HaHv9h2h7/Ydge/2DXHv9g1x7/YNcen2DYHgsAAAAAAAAAAAAAAABg2B4XYNcen2DXHvlg1x7/YNce/2DXHv9g1x7/YNce/2DXHv9g1x75YNcen2DYHhcAAAAAAAAAAAAAAAAAAAAAAAAAAGDYHgtg1x5dYNcevGDXHulg1x72YNce9mDXHulg1x68YNceXmDYHgsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGDYHg5g2B4zYNceTmDXHk5g2B4zYNgeDgAAAAAAAAAAAAAAAAAAAAAAAAAA//8AAPgfAADgBwAAwAMAAMADAACAAQAAgAEAAIABAACAAQAAgAEAAIABAADAAwAAwAMAAOAHAAD4HwAA//8AAA=="
    rel="icon" type="image/x-icon" />
        <link rel="stylesheet" href="/style.css">
        <title>Spotify Chorus Finder</title>
      </head>
      <body>
        <h4>Song ID: ${songID}</h4>
        <div id="parent" class="container">
        ${value}
        </div>
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
