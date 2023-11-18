import { Command } from 'commander'

import { init } from './commands/init'
import { execute } from './commands/execute'

const program = new Command()

// enable positional options
program.enablePositionalOptions()

// this is the default command (gpt-commit)
// prettier-ignore
program
    .action(execute)
    .option('-p, --push', 'Executes the `git push` command for the user')
    .description('Asks ChatGPT to write a commit message for you based on your current git diff')

// init command (gpt-commit init)
// prettier-ignore
program
    .command('init')
    .description(`Creates the global config file`)
    .option('-k, --key <key>', 'The user OpenAI API key')
    .action(init)

// parse command line args
program.parseAsync(process.argv)
