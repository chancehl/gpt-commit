import ora from 'ora'
import colors from 'colors'

import { calculateUsageCost, generateCommitMessages } from '../openai'
import { isGitRepository } from '../utils/is-repo'
import { getDiff, commitChanges } from './processes/git'

type ExecutionOptions = {
    push?: boolean
}

export async function execute(options: Partial<ExecutionOptions>) {
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

    const [messages, usage] = await generateCommitMessages(diff)

    const cost = calculateUsageCost(usage)

    gptSpinner.stop()

    console.log(`ChatGPT generated the following commit message(s):\n`)

    for (let i = 0; i < messages.length; i++) {
        console.log(`${messages[i]}`)
    }

    console.log(colors.dim(`\nUsage: $${cost}`))

    const loggedCommand = options.push ? 'git commit -a && git push' : 'git commit -a'
    const promptMessage = `\nWould you like to run \`${loggedCommand}\` with this commit message?`

    const reply = prompt(promptMessage)

    if (reply && reply.length && reply.toLowerCase() === 'y') {
        const commitSpinner = ora('Committing your changes')

        commitSpinner.start()

        await commitChanges(messages, { push: options.push })

        commitSpinner.stop()

        console.log(`\n${colors.green('Success!')} Your changes have been comitted.`)
    } else {
        console.log(`\n${colors.yellow('Your changes have not been committed.')}`)
        process.exit(1)
    }
}
