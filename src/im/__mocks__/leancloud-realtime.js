
export const mockRealtime = jest.fn(()=>Promise.resolve());

export const init = jest.fn();
export const Realtime = function(){
    return { createIMClient : mockRealtime };
};

export class TypedMessage {}
export const messageType = jest.fn(()=>jest.fn());
export const messageField = jest.fn(()=>jest.fn());
export const MessageStatus = {};
export const TextMessage = { type : -1 };








