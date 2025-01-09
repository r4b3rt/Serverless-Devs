import { Command } from 'commander';
import chalk from 'chalk';
import { emoji, checkTemplateVersion } from '@/utils';
import Action from './action';

const description = `Set or check default environment.

Supported vendors: Alibaba Cloud

    Example:
        $ s env default -n default

${emoji('📖')} Document: ${chalk.underline('https://docs.serverless-devs.com/user-guide/builtin/env/')}`;

export default (program: Command) => {
  const command = program.command('default');
  command
    .usage('[options]')
    .description(description)
    .summary(`Set default environment`)
    .option('-n, --name <name>', 'Env name')
    .helpOption('-h, --help', 'Display help for command')
    .action(async options => {
      await checkTemplateVersion(program) ? 
        await new Action({ ...options, ...program.optsWithGlobals() }).start() : 
        null;
    });
};
