import cpy from 'cpy';
import path from 'path';

/**
 * Script to run after npm install
 *
 * Copy selected files to user's directory
 */

const initPath = process.env.INIT_CWD;
// console.log('current dir:', process.cwd());
// console.log('userPath:', initPath);

function copyProgress(progress) {
  console.log('✓ [oidc-client:copy] ', progress.destinationPath);
}

//TODO: Fragile.. need to find a better way to get the path
const srcDir = '../oidc-client-service-worker/dist/';
const destinationDir = path.join(initPath, 'public');
const FILE_EXISTS_CODE = 'EEXIST';

await cpy([path.join(srcDir,'OidcServiceWorker.js')], destinationDir, {
  overwrite: true,
}).on('progress', copyProgress);

try {
  await cpy([path.join(srcDir,'OidcTrustedDomains.js')], destinationDir, {
    overwrite: false,
  }).on('progress', copyProgress);
} catch (e) {
  if (e.code === FILE_EXISTS_CODE) {
    console.log(
      `✗ [oidc-client:skip] OidcTrustedDomains.js not copied, already exists in ${destinationDir}`
    );
  } else throw e;
}
