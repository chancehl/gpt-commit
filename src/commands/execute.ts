import ora from 'ora'
import clipboard from 'clipboardy'

import { generateCommitMessages } from '../openai'
import { isGitRepository } from '../utils/is-repo'
import { getDiff, commitChanges, stageAllFiles } from './subcommands/git'

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

    const diff = await getDiff({ stageFiles: true })

    if (diff.length === 0) {
        console.error('Could not determine `git diff`. Aborting.')
        process.exit(1)
    }

    const gptSpinner = ora('Asking ChatGPT to create a commit message for this diff')

    gptSpinner.start()

    const messages = await generateCommitMessages(diff)

    gptSpinner.stop()

    console.log('Generated the following commit message(s):\n')

    for (const message of messages) {
        console.log(`${message}`)
    }

    clipboard.writeSync(messages.join('\n'))

    console.log('\nThis diff has been copied to your clipboard.')

    const reply = prompt('\nWould you like to run `git commit -a` with this commit message?')

    if (reply && reply.length && reply.toLowerCase() === 'y') {
        const commitSpinner = ora('Committing your changes')

        commitSpinner.start()

        await commitChanges(messages)

        commitSpinner.stop()
    } else {
        console.log('Your changes have not been committed.')
        process.exit(1)
    }
}
