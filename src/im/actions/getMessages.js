
import { saveMessages } from './saveMessages';
import { fetchState } from './index.js';
import types from './types';
import { createAction } from 'redux-actions';

/**
 * 获取消息列表
 *
 * @function module:actions:getMessages
 * @param {Object} conversation - conversation对象
 * @returns {promise} promise
 */
export const getMessages = (conversation)=>(dispatch,$getState)=>{

    const { cid } = conversation.id;
    let iterator = $getState().getIn(['entities','conversation',cid,'iterator']);

    // 创建一个迭代器，每次获取 ${limit} 条历史消息
    if(!iterator){
        const limit = $getState().getIn(['config','messagesLimit']);
        iterator = conversation.createMessagesIterator({ limit: limit });
        dispatch(saveIterator({cid,iterator}));
    }

    dispatch(fetchState('fetching','getMessages'));
    // 调用 next 方法，获得 ${limit} 条消息，还有更多消息，done 为 false
    return iterator.next().then(function(result){

        dispatch(fetchState('done','getMessages'));

         /* 数据结构
          result: { value: [message1, ..., message10], done: false }
          */

        //保存该组消息
        dispatch(saveMessages({
            messages : result.value,
            cid,
            done : result.done
        }));

    }).catch((err)=>{
        dispatch(fetchState(new Error('获取聊天记录时发生错误'),'getMessages'));
        console.log('拉取聊天记录时发生错误：',err);
    });

};


/**
 * actions - saveIterator 保存conversation迭代器，用于分页
 *
 * @function module:actions:saveIterator
 * @param {Object} args - 参数
 * @param {string} args.cid - conversation的id
 * @param {object} args.iterator - conversation的迭代器
 */
export const saveIterator = createAction(types.IM_SAVE_ITERATOR,({cid,iterator})=>{
    if(!cid)throw new Error('保存iterator必须有参数：cid');
    if(!iterator)throw new Error('保存iterator必须有参数：iterator');

    return {cid,iterator};
});









