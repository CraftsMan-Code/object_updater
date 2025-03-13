import { copyFile, readFile, writeFile } from 'fs/promises';

const packageJsonPath = './package.json';
const backUpPackageJsonPath = './package-backup.json';

const backUpPackageJson = async (packageJsonPath, destinationPath) => {
    try {
        await copyFile(packageJsonPath, destinationPath);
    } catch (error) {
        console.error(`Could not backup package.json ${error.message}`);
    }
}

const cleanUpPackageJson = async (packageJsonPath) => {
    try {
        const packageJson = await readFile(packageJsonPath, 'utf8');
        const packageJsonObj = JSON.parse(packageJson);
        delete packageJsonObj.scripts;
        delete packageJsonObj.devDependencies;
        await writeFile(packageJsonPath, JSON.stringify(packageJsonObj, null, 2));
    } catch (error) {
        console.error(`Could not cleanup package.json ${error.message}`);
    }
};

(async () => {
    await backUpPackageJson(packageJsonPath, backUpPackageJsonPath);
    await cleanUpPackageJson(packageJsonPath);
})();