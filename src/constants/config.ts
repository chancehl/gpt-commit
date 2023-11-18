import os from 'os'
import path from 'path'

export function getConfigPath(): string {
    return path.join(os.homedir(), '.gpt-commit', 'config.json')
}
