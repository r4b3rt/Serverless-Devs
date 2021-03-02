import axios from 'axios';
import logger from '../utils/logger';
import { PlatformDeleteError } from '@serverless-devs-cli/error';
import { configSet } from "@serverless-devs-cli/util";
export const SERVERLESS_DELETE_PACKAGE_URL = 'https://tool.serverlessfans.com/api/package/object';

const { handlerProfileFile } = configSet;
export class PlatformDeleteManager {
  constructor(context?:string) {
    if(context) {
      logger.setContent(context);
    }
  }
  
  async delete(name: string, version: string, type: string, provider: string, user: string) {
    let result;
    try {
      logger.info('Deleting......');
      const lang = (await handlerProfileFile({ read: true, filePath: 'set-config.yml' })).locale || 'en';
      result = await axios.request({
        url: SERVERLESS_DELETE_PACKAGE_URL,
        method: 'delete',
        timeout: 5000,
        headers: {},
        params: {
          name,
          version,
          type,
          provider,
          user,
          lang: lang
        },
      });
    } catch (err) {
      throw new PlatformDeleteError('Failed to delete package, error: {{error}}', {
        error: err.message,
      });
    }

    if (result.status !== 200) {
      throw new PlatformDeleteError('Failed to delete package, http status code: {{code}}', {
        code: result.status,
      });
    }
    if (result.data.Error) {
      throw new PlatformDeleteError('Failed to delete package, code: {{code}}, message: {{msg}}', {
        code: result.data.Error.Code,
        msg: result.data.Error.Message,
      });
    }
    logger.success('Delete successfully');
  }
}
