const { readdirSync, rmdirSync } = require('fs')
const { join } = require('path');
const { promisify } = require('util');
const {execFileSync} = require('child_process')

const getDirectories = source =>
    readdirSync(source, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name)

const compress = async dirName => {
    console.log(`Compressing ${dirName}`);
    const fullDirName = join(home, dirName);
    const destName = `${fullDirName}.7z`;
    execFileSync("7z", ["-v4480m", "a", destName, fullDirName]);
    console.log(`Removing ${dirName}`);
    rmdirSync(fullDirName, {
        recursive: true
    });
}

const main = async home => {
    if (home) {
        for (const dirName of getDirectories(home)) {
            console.log(`Elaborating ${dirName}`);
            await compress(dirName);
        }
    }
}

const home = process.argv.slice(2)[0];
console.log(`Launching process on folder ${home}`);
main(home).finally(_ignore => console.log(`Exit...`));