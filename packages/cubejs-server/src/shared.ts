import path from 'path';
import color from '@oclif/color';
import * as fs from 'fs';

export const displayError = async (text: string|string[], options = {}) => {
  console.error('');
  console.error(color.cyan('Cube.js Error ---------------------------------------'));
  console.error('');

  if (Array.isArray(text)) {
    text.forEach((str) => console.error(str));
  } else {
    console.error(text);
  }

  console.error('');
  console.error(color.yellow('Need some help? -------------------------------------'));

  console.error('');
  console.error(`${color.yellow('  Ask this question in Cube.js Slack:')} https://slack.cube.dev`);
  console.error(`${color.yellow('  Post an issue:')} https://github.com/cube-js/cube.js/issues`);
  console.error('');

  process.exit(1);
};

export const packageExists = (moduleName: string, relative: boolean = false) => {
  if (relative) {
    try {
      // eslint-disable-next-line global-require,import/no-dynamic-require
      require.resolve(`${moduleName}`);

      return true;
    } catch (error) {
      return false;
    }
  }

  const modulePath = path.join(process.cwd(), 'node_modules', moduleName);
  return fs.existsSync(modulePath);
};

const requiredPackageExists = async (moduleName: string, relative: boolean = false) => {
  if (!packageExists(moduleName, relative)) {
    await displayError(
      `${moduleName} dependency not found. Please run this command from project directory.`
    );
  }
};

export const requireFromPackage = async <T = any>(moduleName: string, relative: boolean = false): Promise<T> => {
  await requiredPackageExists(moduleName, relative);

  if (relative) {
    const resolvePath = require.resolve(`${moduleName}`);

    // eslint-disable-next-line global-require,import/no-dynamic-require
    return require(resolvePath);
  }

  // eslint-disable-next-line global-require,import/no-dynamic-require
  return require(path.join(process.cwd(), 'node_modules', moduleName));
};