/**
 * action types 集合
 *
 * @memberof module:actions
 */
const TYPES =  {

    /** IM初始化 */
    IM_INIT :
    'IM_INIT',

    /** 保存IM对象 */
    IM_SAVE_IM :
    'IM_SAVE_IM',

    /** 保存Realtime对象 */
    IM_SAVE_REALTIME :
    'IM_SAVE_REALTIME',

    /** 网络请求状态 */
    IM_FETCH_STATE :
    'IM_FETCH_STATE',

    /** 创建IM对象 */
    CREATE_IM_CLIENT :
    'CREATE_IM_CLIENT',

    /** IM客户端状态 */
    IM_STATUS :
    'IM_STATUS',

    /** IM客户端状态 - 是否在聊天 */
    IM_CHATING :
    'IM_CHATING',

    /** 保存conversation */
    IM_SAVE_CONVERSATION :
    'IM_SAVE_CONVERSATION',

    /** 保存消息 */
    IM_SAVE_MESSAGE :
    'IM_SAVE_MESSAGE',
    IM_SAVE_MESSAGES :
    'IM_SAVE_MESSAGES',

    /** 保存用户 */
    IM_SAVE_USER :
    'IM_SAVE_USER',
    IM_SAVE_USERS :
    'IM_SAVE_USERS',

    /** 保存conversation迭代器 */
    IM_SAVE_ITERATOR :
    'IM_SAVE_ITERATOR',

    /** 注册自定义对象 */
    IM_REGISTER_CUSTOM_MESSAGE :
    'IM_REGISTER_CUSTOM_MESSAGE',

};

export default TYPES;


