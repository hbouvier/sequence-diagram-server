'use strict';

const mirv    = require('mirv'),
      express = require('express'),
      fs      = require('fs'),
      spawn   = require('child_process').spawn;
const root_directory = './web/build';

mirv.supervisor(mirv.rest(routes));

function routes(app, config, logger) {
  app.use(express.static(root_directory));
  app.post('/generate-sequence-diagram', (req, res) => {
    const filename = "sequence-diagram";
    fs.writeFile(`${root_directory}/static/media/${filename}.diag`, `seqdiag { ${req.body.value} }`, err => {
      if(err) {
        console.log('write error:', err);
        return res.status(400).json({ok: false, err: JSON.stringify(err)}).end();
      }
      generate(filename, (err, png_filename) => {
        if(err) {
          console.log('generate error:', err);
          return res.status(400).json({ok: false, err: JSON.stringify(err)}).end();
        }
        res.json({ok: true}).end();
      });
    }); 
  });
}

function generate(filename, next) {
  const command  = '/usr/local/bin/seqdiag',
        options = {
            "cwd": "."
        },
        args = [
            '--antialias',
            '--font', '/Library/Fonts/Courier New.ttf',
            '--size', '4096x4096',
            `${root_directory}/static/media/${filename}.diag`
        ];
  var mutable_output = '';
                
  const child = spawn(command, args, options);
  child.on('exit', code => {
    if (code === 0) {
      next(null, `${root_directory}/static/media/${filename}.png`);
    } else {
      console.log('spawn code:', code, ', output:', mutable_output)
      next(new Error(mutable_output));
    }
  });
  child.stdout.on('data', data => {
    mutable_output += 'STDOUT:'+ data + '\n';
  });
  child.stderr.on('data', data => {
    mutable_output += 'STDERR:' + data + '\n';
  });
}
