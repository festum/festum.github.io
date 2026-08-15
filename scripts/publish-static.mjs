import { copyFileSync, cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = process.cwd();
const sourceAssets = resolve(root, 'public', 'assets');
const sourceCssDir = resolve(sourceAssets, 'css');
const sourceImagesDir = resolve(sourceAssets, 'images');
const sourceFontsDir = resolve(sourceAssets, 'fonts');
const sourceWebfontsDir = resolve(sourceAssets, 'webfonts');

const distJs = resolve(root, 'dist', 'app.js');
const distTailwindCss = resolve(root, 'dist', 'tailwind.css');
const picoCss = resolve(root, 'node_modules', '@picocss', 'pico', 'css', 'pico.min.css');
const fileOverridesCss = resolve(root, 'src', 'file-overrides.css');

const deployAssets = resolve(root, 'assets');
const deployIndex = resolve(root, 'index.html');
const deployCssDir = resolve(deployAssets, 'css');

const requiredCssFiles = [
  'bootstrap.min.css',
  'all.min.css',
  'simple-line-icons.css',
  'slick.css',
  'style.css',
];

const requiredPaths = [
  sourceCssDir,
  sourceImagesDir,
  sourceFontsDir,
  sourceWebfontsDir,
  distJs,
  distTailwindCss,
  picoCss,
  fileOverridesCss,
  ...requiredCssFiles.map((name) => resolve(sourceCssDir, name)),
];

for (const filePath of requiredPaths) {
  if (!existsSync(filePath)) {
    throw new Error(`build artifact missing: ${filePath}`);
  }
}

rmSync(deployAssets, { recursive: true, force: true });
mkdirSync(deployAssets, { recursive: true });

cpSync(sourceImagesDir, resolve(deployAssets, 'images'), { recursive: true });
cpSync(sourceFontsDir, resolve(deployAssets, 'fonts'), { recursive: true });
cpSync(sourceWebfontsDir, resolve(deployAssets, 'webfonts'), { recursive: true });

mkdirSync(deployCssDir, { recursive: true });
for (const cssName of requiredCssFiles) {
  copyFileSync(resolve(sourceCssDir, cssName), resolve(deployCssDir, cssName));
}
copyFileSync(picoCss, resolve(deployCssDir, 'pico.min.css'));
copyFileSync(distTailwindCss, resolve(deployCssDir, 'tailwind.css'));
copyFileSync(fileOverridesCss, resolve(deployCssDir, 'file-overrides.css'));
copyFileSync(distJs, resolve(deployAssets, 'app.js'));

writeFileSync(
  deployIndex,
  `<!doctype html>\n<html lang="en-US">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>FesQin</title>\n    <meta name="description" content="Festum Qin" />\n    <link rel="shortcut icon" type="image/x-icon" href="./assets/images/favicon.png" />\n    <link rel="stylesheet" href="./assets/css/pico.min.css" />\n    <link rel="stylesheet" href="./assets/css/bootstrap.min.css" />\n    <link rel="stylesheet" href="./assets/css/all.min.css" />\n    <link rel="stylesheet" href="./assets/css/simple-line-icons.css" />\n    <link rel="stylesheet" href="./assets/css/slick.css" />\n    <link rel="stylesheet" href="./assets/css/style.css" />\n    <link rel="stylesheet" href="./assets/css/tailwind.css" />\n    <link rel="stylesheet" href="./assets/css/file-overrides.css" />\n  </head>\n  <body>\n    <div id="root"></div>\n    <script src="./assets/app.js"></script>\n  </body>\n</html>\n`,
);
