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
      body = JSON.parse(body);
      const attachment = {
        filename: 'instance.xml',
        content: body.xmlDoc,
        contentType: 'text/xml',
      };
      const emailBody = `Description of the issue:\n${body.description}\n\nAffected cells:\n${body.cells}`;
      const report = new IssueReport('TEST1', emailBody, attachment);
      report.sendReport();
      res.writeHead(200, {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      });
      res.end();
    });

  // Test instance loading
  } else if (req.method === 'GET' && req.url.substring(0, 15) === '/test-instances') {
    const numInstances = parseInt(req.url.substring(15), 10);
    const filenames = fs.readdirSync('src/tests/cases').slice(0, numInstances);
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
    });
    const files = filenames.map(filename => new Promise((resolve, reject) => {
      fs.readFile(`src/tests/cases/${filename}`, (err, data) => {
        if (!err) {
          resolve(data.toString());
        } else {
          reject(err);
        }
      });
    }));
    Promise.all(files).then(response => {
      res.write(JSON.stringify(response));
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
