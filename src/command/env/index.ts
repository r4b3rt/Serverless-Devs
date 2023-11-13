import { Command } from 'commander';
import { emoji, suggestCommand } from '@/utils';
import chalk from 'chalk';
import subInit from './command/init';
import subDefault from './command/default';
import subUpdate from './command/update';
import subDescribe from './command/describe';
import subRemove from './command/remove';
import subList from './command/list';
import subSet from './command/set';

// TODO: @封崇
const description = `Configure environments that can be shared between services.

${emoji('📖')} Document: ${chalk.underline('https://github.com/Serverless-Devs/Serverless-Devs/tree/master/docs/zh/command/env.md')}`;
export default (program: Command) => {
  const envProgram = program.command('env');
  suggestCommand(envProgram);
  envProgram
    .description(description)
    .summary(`${emoji('🌱')} Environment operation`) // TODO: @封崇
    .usage('[commands] [options]')
    .addHelpCommand(false)
    .helpOption('-h, --help', 'Display help for command');

  subInit(envProgram);
  subDefault(envProgram);
  subUpdate(envProgram);
  subDescribe(envProgram);
  subRemove(envProgram);
  subList(envProgram);
  subSet(envProgram);
};
