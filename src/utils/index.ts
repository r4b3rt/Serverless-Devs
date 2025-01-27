/** @format */

import path from 'path';
import core from './core';
const { fse: fs } = core;
export { default as common } from './common';
export { default as configSet } from './handler-set-config';
export { default as storage } from './storage';
export { default as urlParser } from './url-parser';
export { default as registerAction } from './command-util';
export { default as logger } from './logger';
export { default as i18n } from './i18n';

export const getYamlPath = (prePath: string, name: string) => {
  const S_PATH1 = path.join(prePath, `${name}.yaml`);
  const S_PATH2 = path.join(prePath, `${name}.yml`);

  const S_PATH = fs.existsSync(S_PATH1) ? S_PATH1 : fs.existsSync(S_PATH2) ? S_PATH2 : undefined;
  return S_PATH;
};
