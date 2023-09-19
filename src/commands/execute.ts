import ora from 'ora'
import colors from 'colors'

import { calculateUsageCost, generateCommitMessages } from '../openai'
import { isGitRepository } from '../utils/is-repo'
import { getDiff, commitChanges } from './subcommands/git'

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
        console.error('Could not determine `git diff`.')
        process.exit(1)
    }

    const gptSpinner = ora('Asking ChatGPT to create a commit message for this diff')

    gptSpinner.start()

    const [messages, _usage] = await generateCommitMessages(diff)

    // TODO: log cost
    // const { cost } = calculateUsageCost(usage)

    gptSpinner.stop()

    console.log(`ChatGPT generated the following commit message(s):\n`)

    for (const message of messages) {
        console.log(`${message}`)
    }

    const reply = prompt('\nWould you like to run `git commit -a` with this commit message?')

    if (reply && reply.length && reply.toLowerCase() === 'y') {
        const commitSpinner = ora('Committing your changes')

        commitSpinner.start()

        await commitChanges(messages)

        commitSpinner.stop()

        console.log(`\n${colors.green('Success!')} Your changes have been comitted.`)
    } else {
        console.log('\nYour changes have not been committed.')
        process.exit(1)
    }
}
