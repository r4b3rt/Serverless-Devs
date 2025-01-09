import { Command } from 'commander';
import chalk from 'chalk';
import { emoji, checkTemplateVersion } from '@/utils';
import Action from './action';

const description = `Describe specified env.

Supported vendors: Alibaba Cloud

    Example:
        $ s env describe --name test-env

${emoji('📖')} Document: ${chalk.underline('https://docs.serverless-devs.com/user-guide/builtin/env/')}`;

export default (program: Command) => {
  const command = program.command('describe');
  command
    .usage('[options]')
    .description(description)
    .summary(`Describe environmental information`)
    .requiredOption('-n, --name <name>', 'Env name')
    .helpOption('-h, --help', 'Display help for command')
    .action(async options => {
      await checkTemplateVersion(program) ? 
        await new Action({ ...options, ...program.optsWithGlobals() }).start() : 
        null;
    });
};
