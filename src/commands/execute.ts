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

    const completion = await openai.chat.completions.create({
        messages: [{ role: 'assistant', content: OPENAI_PROMPT.replace('{DIFF}', diff) }],
        model: 'gpt-3.5-turbo',
    })

    const commitMessages = completion.choices[0].message.content?.split('\n')

    console.log({ options, isRepo, diff, completion, commitMessages })
}
