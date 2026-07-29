const { execSync } = require('child_process');

function run(cmd) {
  try {
    const res = execSync(cmd, { encoding: 'utf8', cwd: __dirname });
    console.log(`=== RUNNING: ${cmd} ===`);
    console.log(res);
  } catch (e) {
    console.log(`=== ERROR RUNNING: ${cmd} ===`);
    console.log(e.message);
  }
}

run('git checkout 2655bf9~1 -- imports/duck.png');
run('git status');
