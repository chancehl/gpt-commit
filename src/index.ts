import { program } from "commander";

program.option("-c, --config <file>").parse();

const options = program.opts();

const file = options.config;

console.log({ file });
