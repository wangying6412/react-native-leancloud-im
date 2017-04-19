/*

        Leancloud 组件

 */

import AV from 'leancloud-storage';
const appId = 'bUJVbcw1H6PyNWaeET3bUCA9-gzGzoHsz';
const appKey = 'b9BrMou6uWogrCWsicYLUrhr';

AV.init({
    appId,
    appKey,
});

export default AV;
export {
    appId,
    appKey
};

