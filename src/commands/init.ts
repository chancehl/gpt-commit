import fs from 'node:fs/promises'
import os from 'os'
import path from 'path'

type InitOptions = {
    key: string
}

export async function init(options: Partial<InitOptions>) {
    if (options.key == null) {
        console.error('Please provide your OpenAI key to this command like such: `gpt-commit init --key sk-00000000000000000000000000000000`')
    }

    console.log({ key: options.key })

    const dir = path.join(os.homedir(), '.gpt-commit')

    await fs.mkdir(dir, { recursive: true })

    await Bun.write(path.join(dir, 'config.json'), JSON.stringify({ key: options.key }))
}
