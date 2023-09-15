import { exists } from 'node:fs/promises'

export async function isGitRepository(): Promise<boolean> {
    const dir = `${process.cwd()}/.git`

    return await exists(dir)
}
