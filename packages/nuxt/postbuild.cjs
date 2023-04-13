const fs = require("fs");
const path = require("path");

const distPackageJsonPath = path.join(__dirname, "dist", "package.json");
const content = fs.readFileSync(distPackageJsonPath, "utf-8");
const updatedContent = content.replace(/\.\/dist\//g, "./");
fs.writeFileSync(distPackageJsonPath, updatedContent);
