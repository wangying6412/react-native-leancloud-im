
export const mockRealtime = jest.fn(()=>Promise.resolve());

export const init = jest.fn();
export const Realtime = function(){
    return { createIMClient : mockRealtime };
};









