const cp = require('child_process');
const fs = require('fs');

try {
  const result = cp.execSync('node "d:\\project\\autolegal1\\Custom Office Templates\\auto-legal-drafting-backend\\src\\app.js"', { 
    cwd: 'd:\\project\\autolegal1\\Custom Office Templates\\auto-legal-drafting-backend',
    encoding: 'utf8' 
  });
  fs.writeFileSync('d:\\autolegal1\\diagnostic.log', result);
} catch(e) {
  const errOutput = (e.stdout || '') + '\n' + (e.stderr || '');
  fs.writeFileSync('d:\\autolegal1\\diagnostic.log', errOutput);
}
