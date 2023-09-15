import { GLOBAL_CONFIG_PATH } from './constants/config'

export type Options = {
    config?: string
}

export class Arguments {
    private options: Options

    constructor(args: Options) {
        this.options = args
    }

    async validate(): Promise<boolean> {
        let configFilePath = this.options.config ?? GLOBAL_CONFIG_PATH

        // check if config file exists
        const file = Bun.file(configFilePath)

        const exists = await file.exists()

        if (!exists) {
            console.error(`[ERROR] Config file does not exist at ${configFilePath}\n`)

            return false
        }

        return true
    }
}
