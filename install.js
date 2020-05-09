#!/usr/bin/env node

const fs    = require('fs-extra');
const path  = require('path');
const chalk = require('chalk');
const npm   = require('npm');

const src   = path.resolve(__dirname);
const dest  = path.resolve('./');


// Copy files to project root
console.log(`\nCopying starter files to ${dest}...`);
let files = ['resources', 'package-template.json', 'webpack.mix.js'];

files.forEach(file => {
    fs.copySync(path.join(src, file), path.join(dest, file));
});


// Rename project
let json = fs.readJsonSync('./package-template.json');

fs.writeFile('./package.json', JSON.stringify(json, null, 4));
fs.removeSync('./package-template.json');


// Create .gitignore
let ignore = '.vscode\n' + 'node_modules\n' + 'web';
fs.writeFile('./.gitignore', ignore);


// File done
console.log('Starter setup ' +
    chalk.green('complete.') + ' To view available commands, check your ' +
    chalk.underline.yellow('package.json') + ' file.\n');


// Install the packages
console.log('Installing npm packages...');

npm.load({}, function(e,npm) {
    if (e) {
        console.log("Problem running npm install. What did you do?");
        process.exit();
    }
    npm.commands.install();
});