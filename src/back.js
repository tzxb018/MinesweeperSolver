import fs from 'fs';
import http from 'http';
import IssueReport from 'objects/IssueReport';

http.createServer((req, res) => {
  // IssueReport emailing
  if (req.method === 'POST' && req.url === '/report') {
    let body = [];
    req.on('data', chunk => {
      body.push(chunk);
    })
    .on('end', () => {
      body = Buffer.concat(body);
      const attachment = {
        filename: 'instance.json',
        content: body,
        contentType: 'application/json',
      };
      const report = new IssueReport('TEST1', body.toString(), attachment);
      report.sendReport();
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
    });

  // XML file loading
  } else if (req.method === 'GET' && req.url.length > 1) {
    fs.readFile(`problems${req.url}`, (err, data) => {
      if (!err) {
        res.writeHead(200, {
          'Access-Control-Allow-Origin': '*',
        });
        res.write(data.toString());
        res.end();
      } else {
        res.writeHead(404, {
          'Access-Control-Allow-Origin': '*',
        });
        res.end();
      }
    });

  // default behavior
  } else {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    res.end('ok');
  }
}).listen(8000);
