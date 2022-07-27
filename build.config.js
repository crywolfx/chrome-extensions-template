const { execSync } = require('child_process');

const time2String = (timeStamp, type = 'YYYY-mm-dd HH:MM:SS') => {
  timeStamp = +timeStamp;
  if (timeStamp <= 0) {
    return '';
  }
  if (isNaN(timeStamp)) {
    return '';
  }
  const date = new Date(timeStamp);
  let ret;
  const opt = {
    'Y+': date.getFullYear().toString(),
    'm+': (date.getMonth() + 1).toString(),
    'd+': date.getDate().toString(),
    'H+': date.getHours().toString(),
    'M+': date.getMinutes().toString(),
    'S+': date.getSeconds().toString(),
  };
  Object.keys(opt).forEach((k) => {
    const useKey = k;
    ret = new RegExp('(' + useKey + ')').exec(type);
    if (ret) {
      type = type.replace(
        ret[1],
        ret[1].length == 1 ? opt[useKey] : opt[useKey].padStart(ret[1].length, '0'),
      );
    }
  });
  return type;
};
const getLastCommitId = () => execSync('git rev-parse --short HEAD').toString().replace(/\n/, '');

const getBuildVersion = (env) =>
  `${time2String(new Date(), 'YYYY-mm-dd')}-${env ? env + '-' : ''}${getLastCommitId()}`;

module.exports = { getLastCommitId, getBuildVersion };
