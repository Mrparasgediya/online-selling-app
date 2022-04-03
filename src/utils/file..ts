import fs from 'fs/promises'
export async function isFileExists(path: string) {
    try {
        await fs.stat(path);
        return true;
    } catch (error) {
        return false;
    }
}