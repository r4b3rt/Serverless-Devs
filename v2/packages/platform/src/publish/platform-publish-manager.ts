import path from 'path';
import os from 'os';
import fs from 'fs';
import axios from 'axios';
import Zip from 'adm-zip';
import fg from 'fast-glob';
import { PlatformPublishError } from '@serverless-devs-cli/error';
import logger from '../utils/logger';
const SERVERLESS_PUBLISH_PACKAGE_URL = 'https://tool.serverlessfans.com/api/package/put/object/url'
export class PlatformPublishManager {
  constructor(context?:string) {
    if(context) {
      logger.setContent(context);
    }
  }
  
  async publish(user: string, content: string, readme: any, publishSource: string) {
    try {
      logger.info('Publishing......');
      //zip
      const zipFile = path.join(os.tmpdir(), this.generateUUID() + '.zip');
      const zipper = new Zip();
      const ignoreList = []
      if (fs.existsSync(".signore")) {
        const tempRead = await fs.readFileSync(".signore", 'utf-8')
        const tempData = tempRead.split(/\s+|\n|\r|\r\n/)
        for (let i = 0; i < tempData.length; i++) {
          if (tempData[i].length > 0) {
            ignoreList.push(tempData[i])
          }
        }
      }
      const tsConfig = fg.sync('*tsconfig.json', { onlyFiles: true, cwd: './', ignore: ignoreList });
      const publishPath = publishSource ? `./${publishSource}` : tsConfig.length > 0 ? "./dist" : './src';
      const paths = fg.sync('**', { onlyFiles: true, cwd: publishPath, ignore: ignoreList });
      for (let i = 0; i < paths.length; i++) {
        zipper.addLocalFile(path.join(publishPath, paths[i]), path.join(publishPath, path.dirname(paths[i])));
      }
      zipper.writeZip(zipFile);

      const result = await axios.post(SERVERLESS_PUBLISH_PACKAGE_URL, {
        user,
        publish: content,
        readme,
      });
      // eslint-disable-next-line eqeqeq
      if (result.status != 200) {
        throw new Error(`Failed to publish package, http status code: ${result.status}`);
      }
      if (result.data.Error) {
        throw new Error(
          `Failed to publish package, code: ${result.data.Error.Code}, message: ${result.data.Error.Message}`,
        );
      }
      const url: string = result.data.Response.Url;

      const options = {
        url,
        method: 'put',
        timeout: 30 * 60 * 1000,
        headers: {},
        data: zipper.toBuffer(),
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        transformRequest: (data: any, headers: any) => {
          delete headers.put;
          return data;
        },
      };
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const uploadResult = await axios(options);
      // eslint-disable-next-line eqeqeq
      if (uploadResult.status != 200) {
        throw new Error(
          `Failed to upload package, status code is: ${uploadResult.status}, messge is : ${uploadResult}`
        );
      }
      logger.success('Publish successfully');
    } catch (err) {
      throw new PlatformPublishError(err.message);
    }
  }

  private generateUUID(): string {
    return (
      Math.random()
        .toString(36)
        .substring(2, 15) +
      Math.random()
        .toString(36)
        .substring(2, 15)
    );
  }
}
