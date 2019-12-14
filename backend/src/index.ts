'use strict';
import express from 'express';
import compression from 'compression';
import { readFileSync, writeFileSync } from 'fs';

const _port = 4100;
const _app_folder = 'dist';
const baseHref = process.env.BASE_HREF || '/';
const indexHtml = readFileSync('./dist/index.html', { encoding: 'utf-8' });
const resultHtml = indexHtml.replace(
  '</head>',
  `<script>window.__baseHref = '${baseHref}'</script></head>`
);
writeFileSync('./dist/index-output.html', resultHtml);

const app = express();
app.use(compression());

// ---- SERVE STATIC FILES ---- //
app.get('*.*', express.static(_app_folder, { maxAge: '1y' }));

// ---- SERVE APPLICATION PATHS ---- //
app.all('*', function(req, res) {
  res.status(200).sendFile(`/index-output.html`, { root: _app_folder });
});

// ---- START UP THE NODE SERVER  ----
app.listen(_port, function() {
  console.log(
    'Node Express server for ' +
      app.name +
      ' listening on http://localhost:' +
      _port
  );
});
