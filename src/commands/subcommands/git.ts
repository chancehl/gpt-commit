export async function getDiff(options: any): Promise<string> {
    if (options.stageFiles) {
        await stageAllFiles()
    }

    const diffProcess = Bun.spawn(['git', 'diff', '--staged'])

    const diff = await new Response(diffProcess.stdout).text()

    return diff
}

export async function commitChanges(messages: string[], options?: any): Promise<void> {
    Bun.spawn(['git', 'commit', '-a', '-m', messages.join('\n')], {
        onExit(subprocess, exitCode, signalCode, error) {
            if (options.callback) {
                options.callback({ subprocess, exitCode, signalCode, error })
            }

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
