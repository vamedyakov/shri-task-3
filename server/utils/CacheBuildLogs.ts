import { join, resolve } from 'path';
import { promises as fs, existsSync, mkdirSync } from 'fs';

const CACHE_DIR = './cache'

class CacheBuildLogs {
    static instance: CacheBuildLogs;
    public clearCacheInterval?: NodeJS.Timeout;

    constructor() {
        if (!CacheBuildLogs.instance) {
            CacheBuildLogs.instance = this;
        }

        if (!this.clearCacheInterval) {
            this.setClearCache();
        }

        return CacheBuildLogs.instance;
    }

    async set(buildId: string, value: string): Promise<void> {
        if (value.length === 0) {
            return;
        }

        this._createLogsDir();

        await fs.writeFile(this._getFilePath(buildId), value);
    }

    async get(buildId: string): Promise<string | null> {
        const filePath = this._getFilePath(buildId);

        if (!existsSync(filePath)) {
            return null;
        }

        return fs.readFile(filePath, { encoding: 'utf-8' });
    }

    async delete(buildId: string): Promise<void> {
        await fs.unlink(this._getFilePath(buildId));
    }

    setClearCache(): void {
        if(this.clearCacheInterval){
            clearInterval(this.clearCacheInterval);
        }

        this.clearCacheInterval = setInterval(async () => {
            if (!existsSync(CACHE_DIR)) {
                return;
            }

            const files = await fs.readdir(CACHE_DIR);

            if (!files || files.length === 0) {
                return;
            }

            for (let i = 0; i < files.length; i++) {
                const filePath = resolve(CACHE_DIR, files[i]);
                const fileStats = await fs.stat(filePath);

                if (Date.now() - +fileStats.birthtime > 30 * 60 * 1000) {
                    await fs.unlink(filePath);
                }
            }
        }, 60000);
    }

    _getFilePath(buildId: string): string {
        return join(CACHE_DIR, buildId);
    }

    _createLogsDir(): void {
        if (!existsSync(CACHE_DIR)) {
            mkdirSync(CACHE_DIR);
        }
    }
}

const instance = new CacheBuildLogs();
Object.freeze(instance);

export default instance;