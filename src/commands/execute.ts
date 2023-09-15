// import { openai } from '../openai'
import { isGitRepository } from '../utils/is-repo'

type ExecutionOptions = {
    gitmoji?: boolean
}

export async function execute(options: Partial<ExecutionOptions>) {
    options = { ...options, gitmoji: options?.gitmoji ?? false }

    const isRepo = await isGitRepository()

    if (!isRepo) {
        console.error('Missing .git directory. Please execute gpt-commit from the root of your git repository.')
        process.exit(1)
    }

    const statusProcess = Bun.spawn(['git', 'status', '--porcelain'])

    const files = (await new Response(statusProcess.stdout).text()).split('\n')

    for (const file of files) {
        const [_, name] = file.split(' ')

        console.log({ file, name })
    }

    // const completion = await openai.chat.completions.create({
    //     messages: [{ role: 'user', content: `Write a succinct commit message for this git diff: ${diff}` }],
    //     model: 'gpt-3.5-turbo',
    // })

    console.log({ options, isRepo })
}
