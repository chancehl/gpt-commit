import OpenAI from 'openai'

export const OPENAI_PROMPT = `TODO`

export const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export default openai
