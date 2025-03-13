import { copyFile, rm } from 'fs/promises';

const packageJsonPath = './package.json';
const backUpPackageJsonPath = './package-backup.json';


const restorePackageJson = async (packageJsonPath, backUpPackageJsonPath) => {
    try {
        await copyFile(backUpPackageJsonPath, packageJsonPath);
        await rm(backUpPackageJsonPath);
    } catch (error) {
        console.error(`Could not restore package.json ${error.message}`);
    }
}

(async () => {
    await restorePackageJson(packageJsonPath, backUpPackageJsonPath);
})();