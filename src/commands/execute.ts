import ora from 'ora'

import { openai, OPENAI_PROMPT } from '../openai'
import { isGitRepository } from '../utils/is-repo'

type ExecutionOptions = {
    gitmoji?: boolean
}

export async function execute(options: Partial<ExecutionOptions>) {
    options = { ...options, gitmoji: options?.gitmoji ?? true }

    const isRepo = await isGitRepository()

    if (!isRepo) {
        console.error('Missing .git directory. Please execute gpt-commit from the root of your git repository.')
        process.exit(1)
    }

    const diffProcess = Bun.spawn(['git', 'diff'])

    const diff = await new Response(diffProcess.stdout).text()

    if (diff.length === 0) {
        console.error('Could not determine `git diff`. Aborting.')
        process.exit(1)
    }

    const gptSpinner = ora('Asking ChatGPT to create a commit message for this diff').start()

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'assistant', content: OPENAI_PROMPT.replace('{DIFF}', diff) }],
        model: 'gpt-3.5-turbo',
    })

    const commitMessages = completion.choices[0].message.content?.split('\n').filter((str) => str.length > 0) ?? []

    gptSpinner.stop()

    console.log('Generated the following commit message(s):\n')

    for (const message of commitMessages) {
        console.log(`${message}`)
    }

    console.log('\nThis diff has been copied to your clipboard.')

    const reply = prompt('\nWould you like to run `git commit -a` with this commit message?')

    if (reply && reply.length && reply.toLowerCase() === 'y') {
        const commitSpinner = ora('Committing your changes')

        commitSpinner.start()

        Bun.spawn(['git', 'commit', '-a', '-m', commitMessages.join('\n')], {
            onExit(subprocess, exitCode, signalCode, error) {
                commitSpinner.stop()

                if (exitCode === 0) {
                    console.log('Successfully committed changes')
                } else {
                    console.error('Failed to commit changes. Please run `git commit` manually to debug.')
                    process.exit(1)
                }
            },
        })
    } else {
        console.log('Aborting execution. Your changes have not been committed.')
        process.exit(1)
    }
}
