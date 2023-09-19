import OpenAI from 'openai'

export const OPENAI_PROMPT = `Pretend you are an API endpoint whose purpose is writing git commit messages for the user. Please write a short, but descriptive, commit to describe the changes in this diff using the conventional commits git spec. The commit message must be less than 120 characters total. Please return the git commit message and nothing else when you reply to me. Please include one commit message per line of your response, separated by new lines. Diff: {DIFF}`

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default openai
