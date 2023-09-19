import OpenAI from 'openai'

export const OPENAI_PROMPT = `Pretend you are an API endpoint whose purpose is writing git commit messages for the user. Please write a short, but descriptive, commit to describe the changes in this diff using the conventional commits git spec. The commit message must container fewer than 120 characters total. Please return the git commit message and nothing else when you reply to me. Please include one commit message per line of your response, separated by new lines. Diff: {DIFF}`

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const PROMPT_TOKEN_COST = 0.0015

export const COMPLETION_TOKEN_COST = 0.002

/**
 * Generates the prompt to send to ChatGPT
 *
 * @param diff
 * @param options
 * @returns
 */
function generatePrompt(diff: string, options?: any): string {
    return OPENAI_PROMPT.replace('{DIFF}', diff)
}

/**
 * Parses the commit messages from an OpenAI completion object
 */
function parseCommitMessages(message: OpenAI.Chat.Completions.ChatCompletionMessage): string[] {
    if (message.content) {
        const lines = message.content.split('\n')

        return lines.filter((line) => line.length > 0)
    }

    return []
}

/**
 * Invokes the ChatGPT completions API and returns the commit message(s) as an array of strings
 *
 * @param diff
 * @returns
 */
export async function generateCommitMessages(diff: string): Promise<[string[], OpenAI.Completions.CompletionUsage | undefined]> {
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'assistant', content: generatePrompt(diff) }],
        model: 'gpt-3.5-turbo',
    })

    const commits = parseCommitMessages(completion.choices[0].message)

    // TODO: validate commit messages

    return [commits, completion.usage]
}

/**
 * Calculates the usage cost based on the token count
 *
 * @param usage
 * @returns
 */
export function calculateUsageCost(usage: OpenAI.Completions.CompletionUsage | undefined): { tokens: number; cost: number } {
    if (usage == null) {
        return { tokens: 0, cost: 0 }
    }

    const promptCost = (usage.prompt_tokens / 1000) * PROMPT_TOKEN_COST
    const completionCost = (usage.completion_tokens / 1000) * COMPLETION_TOKEN_COST

    return { tokens: usage.total_tokens, cost: promptCost + completionCost }
}

export default openai
