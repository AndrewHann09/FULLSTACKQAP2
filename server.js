const http = require('http');
const url = require('url');
const fs = require('fs');
const EventEmitter = require('events');

const myEmitter = new EventEmitter();

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  console.log(`Route accessed: ${pathname}`);

  function servePage(filePath, pageTitle) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      } else {
        console.log(`${pageTitle} page served successfully`);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.write(data);
        res.end();
      }
    });
  }

  switch (pathname) {
    case '/about':
      servePage('views/about.html', 'About');
      break;
    case '/contact':
      servePage('views/contact.html', 'Contact');
      break;
    case '/products':
      servePage('views/products.html', 'Products');
      break;
    case '/subscribe':
      servePage('views/subscribe.html', 'Subscribe');
      break;
    default:
      console.log('Default page or route not found');
      servePage('views/default.html', 'Default');
      break;
  }

  res.on('finish', () => {
    myEmitter.emit('httpStatus', res.statusCode);
  });
});

const port = 3000;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

server.on('error', (error) => {
  console.error(`Server error: ${error.message}`);
});

myEmitter.on('httpStatus', (statusCode) => {
  console.log(`HTTP Status Code: ${statusCode}`);
});
