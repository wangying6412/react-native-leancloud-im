
export const mockRealtime = jest.fn(()=>Promise.resolve());

const mockLeancloudRealtime = jest
    .genMockFromModule('leancloud-realtime');
export const init = jest.fn();
export const Realtime = function(){
    return { createIMClient : mockRealtime };
};

export default mockLeancloudRealtime;








