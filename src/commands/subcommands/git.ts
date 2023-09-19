import { Errorlike, Subprocess } from 'bun'

type GetDiffOptions = {
    stageFiles?: boolean
}

type CallbackArgs = {
    subprocess: Subprocess
    exitCode: number | null
    signalCode: number | null
    error?: Errorlike
}

/**
 * Gets the `git diff` and returns it as a string
 *
 * @param options
 * @returns
 */
export async function getDiff(options?: GetDiffOptions): Promise<string> {
    if (options?.stageFiles) {
        await stageAllFiles()
    }

    const diffProcess = Bun.spawn(['git', 'diff', '--staged'])

    const diff = await new Response(diffProcess.stdout).text()

    return diff
}

/**
 * Commits the changes on behalf of the user
 *
 * @param messages
 * @param options
 */
export async function commitChanges(messages: string[]): Promise<void> {
    Bun.spawnSync(['git', 'commit', '-a', '-m', messages.join('\n')], {
        onExit(subprocess, exitCode, signalCode, error) {
            if (exitCode === 0) {
                console.log('Successfully committed changes')
            } else {
                console.error('Failed to commit changes. Please run `git commit` manually to debug.', { error })
                process.exit(1)
            }
        },
    })
}

export async function stageAllFiles(): Promise<void> {
    Bun.spawnSync(['git', 'add', '.'])
}
