const fsExtra = require('fs-extra');
const { dependRequire } = require('react-app-rewired/scripts/utils/dependRequire');
const spawn = dependRequire('react-dev-utils/crossSpawn');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const paths = require('react-scripts/config/paths');
const args = process.argv.slice(2);

const DEFAULT_PORT = parseInt(process.env.PORT, 10) || 3000;
const HOST = process.env.HOST || '0.0.0.0';
const isHotReloadChrome = process.env.CHROME_HOT === 'true';

function copyPublicFolder() {
  fsExtra.copySync(paths.appPublic, paths.appBuild, {
    dereference: true,
    filter: (file) => file !== paths.appHtml,
  });
}

choosePort(HOST, DEFAULT_PORT).then((port) => {
  // 赋值PORT
  process.env.PORT = port;
  if (isHotReloadChrome) {
    fsExtra.emptyDirSync(paths.appBuild);
    // Merge with the public folder
    copyPublicFolder();
  }
  const scriptIndex = args.findIndex(
    (x) => x === 'build' || x === 'eject' || x === 'start' || x === 'test',
  );
  const script = scriptIndex === -1 ? args[0] : args[scriptIndex];
  const nodeArgs = scriptIndex > 0 ? args.slice(0, scriptIndex) : [];

  switch (script) {
    case 'build':
    case 'eject':
    case 'start':
    case 'test': {
      const result = spawn.sync(
        'node',
        nodeArgs
          .concat(require.resolve('react-app-rewired/scripts/' + script))
          .concat(args.slice(scriptIndex + 1)),
        { stdio: 'inherit' },
      );
      if (result.signal) {
        if (result.signal === 'SIGKILL') {
          console.log(
            'The build failed because the process exited too early. ' +
              'This probably means the system ran out of memory or someone called ' +
              '`kill -9` on the process.',
          );
        } else if (result.signal === 'SIGTERM') {
          console.log(
            'The build failed because the process exited too early. ' +
              'Someone might have called `kill` or `killall`, or the system could ' +
              'be shutting down.',
          );
        }
        process.exit(1);
      }
      process.exit(result.status);
      break;
    }
    default:
      console.log('Unknown script "' + script + '".');
      console.log('Perhaps you need to update react-scripts?');
      console.log(
        'See: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#updating-to-new-releases',
      );
      break;
  }
});
