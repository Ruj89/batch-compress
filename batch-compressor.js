const { readdirSync, rmdirSync } = require("fs");
const { join } = require("path");
const { execFileSync } = require("child_process");

function getDirectories(source) {
  return readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
}

function compress(
  compressingRootFolder,
  folderName,
  removeOriginalFolder,
  destinationPath
) {
  console.log(`Compressing ${folderName}`);
  const folderPath = join(compressingRootFolder, folderName);
  const destName = `${join(destinationPath, folderName)}.7z`;
  execFileSync("7z", ["-v4480m", "a", destName, folderPath]);
  if (removeOriginalFolder) {
    console.log(`Removing ${folderName}`);
    rmdirSync(folderPath, {
      recursive: true,
    });
  }
}

function main(
  compressingRootFolder,
  removeOriginalFolder,
  destinationPath,
  ignoringFolders
) {
  if (!destinationPath) destinationPath = compressingRootFolder;

  if (compressingRootFolder) {
    for (const folderName of getDirectories(compressingRootFolder)) {
      if (!ignoringFolders.includes(folderName)) {
        console.log(`Elaborating "${folderName}"`);
        compress(
          compressingRootFolder,
          folderName,
          removeOriginalFolder,
          destinationPath
        );
      } else console.log(`Folder "${folderName}" ignored`);
    }
  }
}

const processArguments = process.argv.slice(2);
const compressingRootFolder = processArguments[0];
let removeOriginalFolder = false;
let destinationPath = null;
let ignoringFolders = [];

console.log(`Launching process on folder ${compressingRootFolder}`);
if (processArguments.length > 1) {
  removeOriginalFolder = processArguments[1] === "true";
  console.log(
    `Removes packages (${removeOriginalFolder ? "enabled" : "disabled"})`
  );
}
if (processArguments.length > 2) {
  destinationPath = processArguments[2];
  console.log(`Archives saved in folder ${destinationPath}`);
}
if (processArguments.length > 3) {
  ignoringFolders = processArguments.slice(3);
  console.log(`Ignoring folders ${ignoringFolders.join(", ")}`);
}

main(
  compressingRootFolder,
  removeOriginalFolder,
  destinationPath,
  ignoringFolders
);

console.log(`Exit...`);
