import { exists } from 'node:fs/promises'

// TODO: replace this with Bun call when it exists
export async function isGitRepository(): Promise<boolean> {
    const dir = `${process.cwd()}/.git`

    return await exists(dir)
}
