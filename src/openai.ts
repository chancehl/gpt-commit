import OpenAI from 'openai'

export const OPENAI_PROMPT = `Pretend you are an API endpoint whose purpose is writing git commit messages for the user. Please write a short, but descriptive, commit to describe the changes in this diff using the conventional commits git spec. The commit message must container fewer than 120 characters total. Please return the git commit message and nothing else when you reply to me. Please include one commit message per line of your response, separated by new lines. Diff: {DIFF}`

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function parseCommitMessages(message: OpenAI.Chat.Completions.ChatCompletionMessage): string[] {
    if (message.content) {
        const lines = message.content.split('\n')

        return lines.filter((line) => line.length > 0)
    }

    return []
}

export async function generateCommitMessages(diff: string): Promise<string[]> {
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'assistant', content: OPENAI_PROMPT.replace('{DIFF}', diff) }],
        model: 'gpt-3.5-turbo',
    })

    const commits = parseCommitMessages(completion.choices[0].message)

    return commits
}

export default openai
