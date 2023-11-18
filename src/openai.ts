import OpenAI from 'openai'

export const OPENAI_PROMPT = `Please write one or more commit messages to describe the changes in this diff using the conventional commits git spec. Be specific, but each commit message must be less than 120 characters in length. Please return the response in JSON format with the commit messages contained in a top-level property "messages". The output of the "git diff" command is: {DIFF}`

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export const PROMPT_TOKEN_COST = 0.0015

export const COMPLETION_TOKEN_COST = 0.002

export type CommitMessage = {
    message: string
}

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
 * Invokes the ChatGPT completions API and returns the commit message(s) as an array of strings
 *
 * @param diff
 * @returns
 */
export async function generateCommitMessages(diff: string): Promise<[string[], OpenAI.Completions.CompletionUsage | undefined]> {
    const completion = await openai.chat.completions.create({
        messages: [{ role: 'function', content: generatePrompt(diff), name: 'gpt-commit' }],
        model: 'gpt-3.5-turbo-1106',
        response_format: { type: 'json_object' },
    })

    const response = JSON.parse(completion.choices[0].message.content!)

    // TODO: validate commit messages

    return [response.messages, completion.usage]
}

/**
 * Calculates the usage cost based on the token count
 *
 * @param usage
 * @returns
 */
export function calculateUsageCost(usage: OpenAI.Completions.CompletionUsage | undefined): number {
    if (usage == null) {
        return 0
    }

    const promptCost = (usage.prompt_tokens / 1000) * PROMPT_TOKEN_COST
    const completionCost = (usage.completion_tokens / 1000) * COMPLETION_TOKEN_COST

    return promptCost + completionCost
}

export default openai
