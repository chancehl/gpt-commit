import { program } from 'commander'

import { Arguments, Options } from './arguments'

program.option('-c, --config <file>', 'The location of your gpt-commit config.json file').parse()

const args = new Arguments(program.opts<Options>())

const valid = await args.validate()

if (!valid) {
    program.help()
}
