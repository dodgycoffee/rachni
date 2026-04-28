#!/usr/bin/env node

import { copySync, readJsonSync, writeJsonSync, writeFileSync, removeSync } from 'fs-extra'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execa } from 'execa'
import chalk from 'chalk'

const __dirname = dirname(fileURLToPath(import.meta.url))
const src = resolve(__dirname)
const dest = resolve('./')

// Copy files to project root
console.log(`\nCopying starter files to ${dest}...`)

let files = [
    'resources',
    'package-template.json',
    'vite.config.js',
    'vite.config.mix.js',
    'vite.mix.js',
]

files.forEach(file => {
    copySync(resolve(src, file), resolve(dest, file))
})

// Rename package-template.json to package.json
let json = readJsonSync(resolve(dest, 'package-template.json'))
writeJsonSync(resolve(dest, 'package.json'), json, { spaces: 4 })
removeSync(resolve(dest, 'package-template.json'))

// Create .gitignore
writeFileSync(resolve(dest, '.gitignore'), [
    '.vscode',
    'node_modules',
    'web',
].join('\n'))

console.log('Starter setup ' +
    chalk.green('complete.') + ' To view available commands, check your ' +
    chalk.underline.yellow('package.json') + ' file.\n')

// Install packages
console.log('Installing npm packages...')

try {
    await execa('npm', ['install'], { cwd: dest, stdio: 'inherit' })
    console.log('\nAll done! ' + chalk.green('Happy coding.') + '\n')
} catch (e) {
    console.error(chalk.red('npm install failed. Try running it manually.'))
    process.exit(1)
}
