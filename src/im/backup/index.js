/*

       IM ...


 */

/*

        Action.IM({
            userInfo : {},              //或者userid : xxxx   二选一
            id : 'xxxx',    //可选
        });

        接口较多，见底部接口定义区域注释

 */

import React from 'react';
import {
    ListView,
    Vibration,
} from 'react-native';

import {
    Actions
} from 'react-native-router-flux';

import {
    connect,
} from 'react-redux';

import {
    appId
} from '../Leancloud';

import UI from './UI.js';
import Item from './IM_UI_ITEM.js';
import reducer from './Reducer.js';
import messagesReducer from './MessagesReducer.js';
import IMList from './IMList.js';
import Mock from 'mockjs';

import Owner from '../Owner';

import { Store } from '../Redux';

import {
    MessageStatus,
    Realtime,
    TextMessage,
    TypedMessage,
    messageType,
    messageField,
} from 'leancloud-realtime';
import {
    TypedMessagesPlugin,
    FileMessage,
    ImageMessage,
    AudioMessage,
    VideoMessage,
    LocationMessage,
} from 'leancloud-realtime-plugin-typed-messages';

import MapLinking from 'react-native-map-linking';

import Storage from '../Storage';

import EventClass from '../Event';
let Event = new EventClass();

import Notification from '../Notification';

//定义暂态消息
class OperationMessage extends TypedMessage {}
// 指定 type 类型，可以根据实际换成其他正整数
messageType(1)(OperationMessage);
// 申明需要发送 op 字段
messageField('op')(OperationMessage);


//====================================
//====================================
//          初始化
//====================================
//====================================

/*
 *      初始化IM对象
 */
let IM = null;
let realtime = null;
let _creatImObject = ()=>{

    if(!appId){
        console.log('没有appId，创建IM对象失败！');
        Store.dispatch({
            type : 'IM_SET_STATUS',
            state : {
                status : 'error'
            }
        });
        return false;
    }

    if(!global.userid){
        console.log('用户没有登录，创建IM对象失败！');
        Store.dispatch({
            type : 'IM_SET_STATUS',
            state : {
                status : 'error'
            }
        });
        return false;
    }

    // 初始化实时通讯 SDK
    realtime = new Realtime({
        appId : appId,
        plugins: [TypedMessagesPlugin], // 注册富媒体消息插件
    });
    //注册暂态消息
    realtime.register(OperationMessage);

    // 用自己的名字作为 clientId，获取 IMClient 对象实例
    realtime.createIMClient(String(Owner.userid)).then(function(im){

        IM = im;
        IM_component.IMObject = IM;

        im.on('unreadmessages',_onUnreadmessages);  //当接收到未读提醒
        im.on('receipt',_onReceipt);                //当接收到已读回执
        im.on('conflict',_onConflict);              //当在别处登录
        //绑定消息事件
        //当接收到消息
        IM.on('message',(message,conversation)=>{
            _onMessage(message,conversation);
        });

        console.log('创建IM对象成功！');
        Store.dispatch({
            type : 'IM_SET_STATUS',
            state : {
                status : 'initialized'
            }
        });
        Event.trigger('initialized',realtime);

        {
            let dispatch = Store.dispatch;
            //读取本地数据并保存到store
            Storage.getAllDataForKey('messages').then((msgs)=>{
                console.log(`读取到${msgs.length}条本地消息`);
                msgs.forEach((msg)=>{
                    dispatch({
                        type : 'IM_MESSAGE_SAVE',
                        state : msg,
                    });
                });
            }).catch(()=>{
                console.log('本地没有存储消息。');
            });
            Storage.getAllDataForKey('IM').then((IMs)=>{
                console.log(`读取到${IMs.length}个本地IM对象`);
                IMs.forEach((im)=>{
                    dispatch({
                        type : 'IM_SAVE',
                        state : im,
                    });
                });
            }).catch(()=>{
                console.log('本地没有存储IM对象');
            });
        }

    }).catch((err)=>{
        console.log('创建IM对象失败：',err);
        Store.dispatch({
            type : 'IM_SET_STATUS',
            state : {
                status : 'error'
            }
        });
    });

    //绑定客户端事件
    realtime.on('disconnect' , _onDisconnect); // 离线
    realtime.on('schedule'   , _onSchedule);   // 尝试重连
    realtime.on('retry'      , _onRetry);      // 正在重连
    realtime.on('reconnect'  , _onReconnect);  // 已连接

};

/*
 *  关闭IM连接
 */
let _closeIM = (dispatch = Store.dispatch)=>{
    IM.close().then(()=>{
        console.log('IM已成功关闭!');
    }).catch((err)=>{
        console.log('IM关闭失败',err);
    });

    dispatch({
        type : 'IM_RESET'
    });
    console.log(Store.getState().get('IM'));
};

/*
 *      模块初始化
 */
let _init = (ownProps,dispatch = Store.dispatch, conversationId)=>{

    let _checkConversationId = (userInfo)=>{

        if(!userInfo.userid){
            Actions.pop();
            console.log('userInfo格式不正确。');
        }
        let cid = conversationId;

        if(cid){
            _fn(userInfo,cid);
        }else{
            _findConversationInLocal(userInfo);
        }
    };

    function _findConversationInLocal(userInfo){
        let localIMs = Object.values(Store.getState().get('IM').items);
        let localConversation = localIMs.find((obj)=>{
            if(obj.members){
                let str = ',' + obj.members.join(',') + ',';
                return new RegExp(',' + userInfo.userid + ',').test(str);
            }else{
                return false;
            }
        });

        if(localConversation){
            console.log('从本地找到了conversation',localConversation);
            _fn(userInfo,localConversation.id);
        }else{
            _findConversationInRemote(userInfo);
        }
    }

    function _findConversationInRemote(userInfo){
        console.log('本地找不到相应conversation,开始从远程查找。');
        var query = IM.getQuery();
        query.find().then((items)=>{
            let remoteConversation = items.find((obj)=>{
                let str = ',' + obj.members.join(',') + ',';
                return new RegExp(',' + userInfo.userid + ',').test(str);
            });

            if(remoteConversation){
                console.log('从远程找到了conversation',remoteConversation);
                _fn(userInfo,remoteConversation);
            }else{
                console.log('没有找到conversation，开始新建');
                _fn(userInfo,null);
            }
        }).catch((err)=>{
            console.log('读取列表失败。',err);
        });
    }

    let _fn = (userInfo,conversationId)=>{
        Actions.refresh({
            title : userInfo.username || userInfo.tel || '聊天'
        });
        _createConversation(userInfo,dispatch,conversationId);
    };

    if(!ownProps.userInfo){
        if(ownProps.userid){

            if(ownProps.userid === global.userid){
                Actions.pop();
                global.toast('创建聊天失败，您不能和自己聊天。');
                return false;
            }

            console.log('未传递userInfo对象，主动读取... ...');
            Storage.load({
                key : 'userInfo',
                id : ownProps.userid,
            }).then((u)=>{
                console.log('读取userInfo对象成功。',u);
                ownProps.userInfo = u;

                _fn(u,dispatch);
            }).catch((err)=>{
                console.log('找不到userInfo，建立聊天对象失败！',err);
                Actions.pop();
                return false;
            });
        }else{
            console.log('找不到userInfo或者userid，无法建立聊天对象。');
            Actions.pop();
            return false;
        }
    }else{

        if(ownProps.userInfo.userid === global.userid){
            Actions.pop();
            global.toast('创建聊天失败，您不能和自己聊天。');
            return false;
        }

        _checkConversationId(ownProps.userInfo);
    }

};

/*
 *      初始化聊天对象
 */
let conversation = null;
let atIM = false;
let _createConversation = (userInfo,dispatch=Store.dispatch,_conversation_)=>{

    conversation = null;
    if(!IM){
        Actions.pop();
        global.toast('创建聊天失败，没有与聊天服务器建立连接。');
        return false;
    }

    let ops = {

        //对话的初始成员列表。在对话创建成功后，这些成员会收到和邀请加入对话一样的相应通知。
        members : [String(userInfo.userid)],

        //对话的名字，主要是用于标记对话，让用户更好地识别对话。
        name : `${global.username || global.tel} & ${userInfo.username || userInfo.tel}`,

        //是否创建唯一对话，当其为 true 时，如果当前已经有相同成员的对话存在则返回该对话，否则会创建新的对话。该值默认为 false。
        unique : true,

        //保存userInfo
        userInfo : userInfo,

        //自定义属性
        //location : '42.86335,140.6843287',

    };

    let _cb = (_conversation)=>{

        conversation = _conversation;
        console.log('创建对话成功!',_conversation.id);
        atIM = true;

        let creator = conversation.creator;

        let state = {
            id : conversation.id,
            members : conversation.members,
            userInfo : userInfo,
            creator,
        };

        //保存creatorInfo 到 leancloud
        let creatorInfo = conversation.get('creatorInfo');
        if(!creatorInfo){
            Storage.load({
                key : 'userInfo',
                id : creator
            }).then(d=>{
                conversation.set('creatorInfo',d);
                console.log('保存creatorInfo到leancloud : ',d);
                return conversation.save();
            }).then((new_conversation)=>{
                conversation = new_conversation;
                console.log('保存creatorInfo到leancloud成功！！！ : ',new_conversation.get('creatorInfo'));
            }).catch(err=>{
                console.log('保存userinfo到leancloud失败：',err);
            });
        }

        let lastMessage = conversation.lastMessage ? getMessageObject(conversation.lastMessage) : null;
        let lastMessageAt = conversation.lastMessageAt ? new Date(conversation.lastMessageAt).getTime() : 0;

        lastMessage && (state.lastMessage = lastMessage);
        lastMessageAt && (state.lastMessageAt = lastMessageAt);

        let order = conversation.get('order');
        console.log('读取conversation的order : ', order);
        order && (state.order = order);

        //保存userInfo到store
        dispatch({
            type : 'IM_SAVE',
            state : state,
        });

        //刷新聊天记录列表
        setTimeout(()=>{
            _refresh(dispatch);
        },1000);

        //设为已读
        conversation.markAsRead().then(IMList.save).catch(console.log);
    };

    // 创建与对方的对话
    if(!_conversation_){
        return IM.createConversation(ops).then(_cb).catch((err)=>{
            console.log('创建对话失败：',err);
        });
    }else if(typeof _conversation_ === 'string'){
        return IM.getConversation(_conversation_).then(_cb).catch((err)=>{
            console.log('从远程获取conversation失败。',err);
        });
    }else if(typeof _conversation_ === 'object'){
        return new Promise(()=>{
            _cb(_conversation_);
        });
    }
};

/*
 *      退出聊天
 */
let _quit = ()=>{
    if(conversation){
        conversation = null;
        atIM = false;
    }else{
        console.log('没有发现聊天对象，退出聊天失败！');
    }
};

/*
 *      保存订单到IM
 */
let SaveOrderToIM = (order,userInfo)=>{
    if(!order || !userInfo){
        console.log('未发现order或userInfo，保存订单信息到IM失败。');
    }

    conversation = null;
    _createConversation(userInfo).then(()=>{

        console.log('保存订单到IM : ',order.id);

        if(conversation){
            conversation.set('order',String(order.id));
            conversation.save().then((c)=>{
                console.log('保存order成功 : ', c.get('order'));
            }).catch((err)=>{
                console.log('保存order到IM失败：',err);
            });
        }

    });
};

//====================================
//====================================
//          消息操作
//====================================
//====================================

/*
 *      发送消息
 */
let _sendMessage = (message,pushData)=>{

    if(message){

        console.log(message.type);

        conversation.send(message,{
            transient : message.type === 1,
            reciept : Boolean(message.type < 1),
            pushData : {
                alert    : pushData || '您有一条新的消息',
                badge    : 'Increment',
                _profile : 'dev',
                channle  : 'IM',
                from     : String(global.userid),
            },
        }).then((d)=>{

            message.type !== 1 && console.log('成功发送IM消息：',d);

        }).catch((err)=>{
            console.log('发送IM消息失败：',err);
        });
    }else{
        console.log('发送消息失败，没有找到message对象。');
    }

};

/*
 *      保存消息
 */
let _saveMessage = (message,dispatch=Store.dispatch)=>{

    if(message.type === 1) return false;

    let m = getMessageObject(message,dispatch);
    let _save = (arr = [],status='loaded')=>{

        arr.push(m.guid);
        arr = [...new Set([...arr])];

        Storage.save({
            key : 'IM',
            id : conversation.id,
            rawData : {
                status,
                messages : arr,
            },
        });

        let mt = m.text ? m.text : m.thumb ? '[图片]' : m.location ? '[地点]' : null;
        let action = {
            type : 'IM_SAVE',
            state : {
                id : conversation.id,
                status,
                lastMessage : mt,
                lastMessageAt : new Date(m.createAt).getTime(),
                messages : arr,
            }
        };

        dispatch(action);
    };

    Storage.load({
        key : 'IM',
        id : conversation.id,
    }).then((dd)=>{
        let d = dd.messages.slice(0);
        let s = dd.status;
        _save(d,s);
    }).catch(()=>{
        _save([],'done');
        console.log('没有读取到本地消息');
    });
};


/*
 *      刷新聊天记录
 *
 *      策略：
 *      本地刚开始最多缓存50条记录，
 *      如果用户一直翻页，当翻到最后一页时，
 *      就存储全部记录，这样以后就不用翻页了，
 *      而且不会造成信息重复载入。
 */
let limit = 50;
let _refresh = (dispatch = Store.dispatch)=>{


    if(!conversation){
        return false;
    }

    let id = conversation.id;

    let defaultState = {
        status : 'loading',
        id : id,
        messages : [],
    };

    Storage.load({
        key : 'IM',
        id : id,
    }).then((d)=>{
        defaultState.messages = d.messages || [];
        console.log(`读取到本地聊天记录：${d.messages.length} 条`);

        _dispatch();
    }).catch(()=>{
        console.log('本地没有缓存聊天记录');
        _dispatch();
    });

    const _dispatch = ()=>{
        let action = {
            type : 'IM_SAVE',
            state : defaultState,
        };

        {
            if(messageIterator) messageIterator = false;
            if(page) page = 0;
        }

        dispatch(action);
        console.log('dispatch : loading');

        _fetching(dispatch);
    };
};

let messageIterator = false;
let page = 0;
let _fetching = (dispatch)=>{

    // 创建一个迭代器，每次获取 ${limit} 条历史消息
    if(!messageIterator){
        messageIterator = conversation.createMessagesIterator({ limit: limit });
    }

    // 调用 next 方法，获得 ${limit} 条消息，还有更多消息，done 为 false
    messageIterator.next().then(function(result){
         /*
          *result: {
          *  value: [message1, ..., message10],
          *  done: false,
          *}
          */

        console.log(`拉取到 ${result.value.length} 条消息记录。`);

        //转换为object对象 并 保存
        //拉平为guid序列
        let messages = result.value.map((obj)=>{
            let m = getMessageObject(obj,dispatch);
            return m.guid;
        });

        //读取store;
        let localStore = Store.getState().get('IM').items[conversation.id];

        let done = localStore.status === 'done' || result.done;
        page = page + 1;

        let oldMessages = [...localStore.messages] || [];

        //合并新旧数据，并去重(现在是纯字符串数组，好去重多了。)

        let newMessages = [...new Set([...messages,...oldMessages])];

        let __dispatch__ = (_newMessage,nowStatus)=>{

            let status = !done ? 'loaded' : _newMessage.length === 0 ? 'empty' : 'done';

            let action = {
                type : 'IM_SAVE',
                state : {
                    id : conversation.id,
                    status : nowStatus || status,
                    messages : _newMessage,
                }
            };

            dispatch(action);
        };

        if(page === 1){
            _refreshLocalStorage((m)=>{
                __dispatch__(m);
            });
        }else if(!done){
            __dispatch__(newMessages);
        }

        //======================
        //本地存储
        let _localSave = (m,s='loaded')=>{

            let obj = {
                status : s,
                messages : m,
            };

            Storage.save({
                key : 'IM',
                id : conversation.id,
                rawData : obj,
            });

            //console.log('已存储: ',m,s);
        };

        if(done && page > 1){
            console.log('发现终页，已存储。');
            _localSave(newMessages,'done');
            __dispatch__(newMessages,'done');
        }

        function _refreshLocalStorage(fn){

            Storage.load({
                key : 'IM',
                id : conversation.id,
            }).then((ddd)=>{

                let dd = ddd.messages;
                let m = [...new Set([...dd,...messages])];
                _localSave(m, ddd.status);

                done = ddd.status==='done';
                done && console.log('发现本地聊天记录列表已终结。',ddd.status);
                //回调
                fn(m,done?'done':false);
            }).catch((err)=>{
                console.log('本地没有聊天记录',conversation.id,err);
                _localSave(messages);
                fn(messages);
            });

        }

    }).catch((err)=>{
        let action = {
            type : 'IM_SAVE',
            state : {
                id : conversation.id,
                status : 'error',
            }
        };
        dispatch(action);
        console.log('拉取聊天记录时发生错误：',err);
    });
};

/*
 *      下一页
 */
let _nextPage = (dispatch)=>{

    Storage.load({
        key : 'IM',
        id : conversation.id,
    }).then((d)=>{

        let actionLoading = {
            type : 'IM_SAVE',
            state : {
                status : 'loading',
                id : conversation.id,
            },
        };

        let actionDone = {
            type : 'IM_SAVE',
            state : {
                status : 'done',
                id : conversation.id,
                messages : d.messages,
            },
        };

        dispatch(actionLoading);

        let done = d.status === 'done';

        if(done){
            dispatch(actionDone);
        }else{
            _fetching(dispatch);
        }
    }).catch(()=>{
        _fetching(dispatch);
    });

};



/*
 *      解析消息类为可存储object对象
 *      自动保存单条消息
 */
let getMessageObject = (message,dispatch=Store.dispatch)=>{

    let attr = message.getAttributes() || {};
    let m = {
        guid : attr.guid,
        avatar : attr.avatar,
        id : message.id,
        cid : message.cid,
        type : message.type,
        createAt : message.timestamp && message.timestamp.getTime(),
        deliveredAt : message.deliveredAt && message.deliveredAt.getTime(),
        from : message.from || String(global.userid),
        status : message.status,
    };

    switch(m.status){
        case MessageStatus.SENDING : {
            m.status = 'sending';
            break;
        }
        case MessageStatus.SENT : {
            m.status = 'send';
            break;
        }
        case MessageStatus.DELIVERED : {
            m.status = 'delivered';
            break;
        }
        case MessageStatus.FAILED : {
            m.status = 'failed';
            break;
        }
        case MessageStatus.NONE : {
            m.status = 'none';
            break;
        }
        default : {
            m.status = 'none';
        }
    }

    if(m.type === TextMessage.TYPE){
        m.text =  message.getText();
    }else if(m.type === ImageMessage.TYPE){
        m.thumb = attr.thumb;
        m.imgURL = attr.imgURL;
    }else if(m.type === LocationMessage.TYPE){
        m.location = {
            addr : attr.addr,
            name : attr.name,
            image : attr.image,
            point : attr.point,
        };
    }else if(m.type > 1){
        m.customData = message.customData;
    }

    //保存消息到store及storage
    {
        dispatch({
            type : 'IM_MESSAGE_SAVE',
            state : m
        });
        Storage.save({
            key : 'messages',
            id : m.guid,
            rawData : m
        });
    }

    return m;
};

//====================================
//====================================
//          消息渲染
//====================================
//====================================
import moment from 'moment';
let _renderMessage = (guid)=>{

    let message = Store.getState().get('messages')[guid];

    if(!message){
        console.log('没有从store中找到消息，渲染失败。');
        return null;
    }

    if(message.type > 1){
        return _renderCustomMessage(message);
    }

    let targetInfo = conversation && conversation.get('userInfo');
    let creatorInfo = conversation && conversation.get('creatorInfo');

    let userInfo = false;
    if(conversation){
        userInfo = String(conversation.creator) === String(global.userid) ? targetInfo : creatorInfo;
    }

    let targetAvatar = userInfo ? userInfo.avatar : message.avatar || { thumb : null };

    let item = {};
    let arrow = message.from === String(global.userid) ? 'right' : 'left';
    let avatar = message.from === String(global.userid) ? global.avatar.thumb : targetAvatar.thumb;

    let time = moment(new Date(message.createAt).getTime()).fromNow();

    switch(message.type){
        case TextMessage.TYPE:
        {
            item = <Item
                align={arrow}
                avatar={avatar}
                time={time}
                text={message.text || 'null'}
            />;
            return item;
        }
        case ImageMessage.TYPE:
        {
            let thumb = '';
            let imgURL = '';
            if(/http\:/.test(message.thumb)){
                thumb = {uri : message.thumb};
                imgURL = {uri : message.imgURL};
            }else{
                thumb = {uri : 'file://' + message.thumb};
                imgURL = {uri : 'file://' + message.imgURL};
            }

            item = <Item
                align={arrow}
                avatar={avatar}
                time={time}
                thumb={thumb}
                imgURL={imgURL}
            />;
            return item;
        }
        case LocationMessage.TYPE:
        {
            item = <Item
                align={arrow}
                avatar={avatar}
                time={time}
                location={message.location}
                onPress={(()=>{
                    _jumpToMap(message.location);
                }).bind(this)}
            />;
            return item;
        }
        case AudioMessage.TYPE:
        {
            item = <Item />;
            return item;
        }
        case VideoMessage.TYPE:
        {
            item = <Item />;
            return item;
        }
        default:
            return null;
    }
};

let _formatStatus = (status,messages)=>{

    let obj = {
        statusText : '',
        showLoadingIcon : false,
        showLoadBtn : false,
        loadBtnText : '查看更多',
    };

    if(messages){
        if(status === 'loaded' && messages.length < 50){
            status = 'done';
        }
    }

    switch(status){
        case 'init': {
            obj.statusText = '正在初始化...';
            obj.showLoadingIcon = true;
            obj.showLoadBtn = false;
            break;
        }
        case 'loading': {
            obj.statusText = '正在读取聊天记录...';
            obj.showLoadingIcon = true;
            obj.showLoadBtn = false;
            break;
        }
        case 'loaded': {
            obj.statusText = false;
            obj.showLoadingIcon = false;
            obj.showLoadBtn = true;
            obj.loadBtnText = '查看更多';
            break;
        }
        case 'empty': {
            obj.statusText = '没有聊天记录';
            obj.showLoadingIcon = false;
            obj.showLoadBtn = false;
            break;
        }
        case 'done': {
            obj.statusText = '没有更多聊天记录了';
            obj.showLoadingIcon = false;
            obj.showLoadBtn = false;
            break;
        }
        case 'error': {
            obj.statusText = '发生错误，读取聊天记录失败。';
            obj.showLoadingIcon = false;
            obj.showLoadBtn = true;
            obj.loadBtnText = '重新加载';
            break;
        }
    }

    return obj;
};



//====================================
//====================================
//          自定义消息
//====================================
//====================================

/*
        注册自定义消息
        参数 {
            type : 2,
            render : (item)=>{
                //... ...
                return(<xxx>...</xxx>);
            }
        }
 */

let customMessage = {};
let _registerCustomMessage = (params)=>{
    let {
        type,
        render,
    } = params;

    if(typeof type !== 'number'){
        console.warn('消息type不是数字，注册失败！');
        return false;
    }else if(type <= 1){
        console.warn('注册IM消息type值必须大于2，注册失败。');
        return false;
    }else if(!render){
        console.warn('没有找到渲染函数，注册自定义消息失败。');
        return false;
    }else if(customMessage[type]){
        console.warn('消息类型已存在，注册自定义消息失败。');
        return false;
    }else{
        //注册自定义消息
        class CustomMessage extends TypedMessage {}
        // 指定 type 类型
        messageType(type)(CustomMessage);
        // 申明需要发送 customData 字段
        messageField('customData')(CustomMessage);

        if(realtime){
            realtime.register(CustomMessage);
        }else{
            Event.on('initialized',()=>{
                realtime.register(CustomMessage);
            });
        }

        customMessage[type] = {
            render
        };

        console.log('注册自定义消息成功');
        return {
            send : (customData,sendToRemote=true)=>{
                _sendCustomMessage(customData,CustomMessage,sendToRemote);
            }
        };
    }
};

/*
 *      发送自定义消息
 */
let _sendCustomMessage = (customData,CustomMessage,sendToRemote)=>{

    if(!customData || !CustomMessage){
        console.warn('参数不完整，无法发送自定义消息。');
        return false;
    }
    if(typeof customData !== 'object'){
        console.warn('customData格式不正确，无法发送自定义消息。');
        return false;
    }

    let message = new CustomMessage();
    message.customData = customData;
    message.setAttributes({
        guid : Mock.Random.guid(),
    });

    _saveMessage(message);
    if(sendToRemote)_sendMessage(message);
};

/*
 *      渲染自定义消息
 */
let _renderCustomMessage = (message)=>{
    let type = message.type;
    let render = customMessage[type] ? customMessage[type].render : null;

    if(render){
        return render(message.customData);
    }else{
        console.log(`没有找到type为${type}的自定义消息，渲染失败。`);
        return null;
    }
};


//====================================
//====================================
//          消息事件
//====================================
//====================================

/*
 *      当接收到消息时
 */
let _onMessage = (message, current_conversation, dispatch=Store.dispatch)=>{

    let from = message.from;

    if(conversation){

        //如果当前正在聊天

        if(from === global.userid){
            console.log('收到自己发送的消息');
        }
        switch(message.type){

            //暂态消息
            case 1:
                _renderTypeMessage(message);
                break;
            case TextMessage.TYPE:
            case FileMessage.TYPE:
            case ImageMessage.TYPE:
            case AudioMessage.TYPE:
            case VideoMessage.TYPE:
            case LocationMessage.TYPE: {
                console.log('收到消息：',message);
                _saveMessage(message,dispatch);
                break;
            }
            default:
                console.log(message);
                console.log('收到未知类型消息，类型：',message.type);
        }

    }else{
        //如果没有聊天
        //存储未读到imlist
        if(message.type !== 1){
            console.log('接收到聊天外消息：',message);

            IM && IM.getConversation(current_conversation.id).then((d)=>{

                IMList.save(d);

                //垒加badge数量
                Notification.IMBadgeAdd();

            }).catch(console.log);
            Vibration.vibrate(1000);
        }
    }
};


/*
 *      暂态消息
 */
let typeMessageTimeout = '';
let _renderTypeMessage = (message)=>{
    let from = message.from;
    let target = String(conversation.creator) === String(global.userid) ?
        conversation.get('userInfo') : conversation.get('creatorInfo');
    if(String(from) === String(target.userid)){

        clearTimeout(typeMessageTimeout);

        Actions.refresh({
            title : '正在输入...'
        });

        typeMessageTimeout = setTimeout(()=>{
            Actions.refresh({
                title : target.username || '聊天'
            });
        },500);
    }
};

/*
 *      未读消息
 */
let _onUnreadmessages = (payload, conversation)=>{
    let count = payload.count;
    let id = conversation.id;

    console.log('收到未读IM消息数目：',count,id);
};

/*
 *      已读回执
 */
let _onReceipt = (payload)=>{
    // payload.message 为送达的消息，与先前发送的是同一实例
    // message.status 更新为 MessageStatus.DELIVERED
    // message.deliveredAt 为消息送达的时间
    console.log('接收到已读回执：',payload.message);
};


/*
 *      在其它设备登录
 */
let _onConflict = ()=>{
    // 弹出提示，告知当前用户的 Client Id 在其他设备上登陆了
    alert('您已在其它设备登录。');
};

/*
 *      跳转到地图
 */
let _jumpToMap= (location)=>{
    let point = location.point;
    let name = location.name;
    let addr = location.addr;
    MapLinking.markLocation({lat: point.y, lng: point.x}, name, addr);
};


//====================================
//====================================
//          客户端事件
//====================================
//====================================

/*
 *  离线
 */
let _onDisconnect = ()=>{
    global.toast('网络连接已断开');
    console.log('网络连接已断开');
};


/*
 *  尝试重连
 */
let _onSchedule = (attempt, delay)=>{
    global.toast(delay + 'ms 后进行第' + (attempt + 1) + '次重连');
    console.log(delay + 'ms 后进行第' + (attempt + 1) + '次重连');
};

/*
 *  正在重连
 */
let _onRetry = (attempt)=>{
    global.toast('正在进行第' + attempt + '次重连');
    console.log('正在进行第' + attempt + '次重连');
};

/*
 *  已重新连接
 */
let _onReconnect = ()=>{
    global.toast('网络连接已恢复');
    console.log('网络连接已恢复');
};

//====================================
//====================================
//          绑定UI
//====================================
//====================================
let dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2, });
let mapStateToProps = (state,ownProps)=>{
    ownProps;

    let m = [];
    let s = _formatStatus('init');
    let order = null;
    let id = ownProps.id || (conversation && conversation.id) || 0;

    if(id){
        m = state.get('IM').items[id] && state.get('IM').items[id].messages.slice(0);
        s = _formatStatus(state.get('IM').items[id] && state.get('IM').items[id].status,state.get('IM').items[id].messages);
        order = state.get('IM').items[id].order || null;
    }

    return {
        statusText : s.statusText,
        showLoadingIcon : s.showLoadingIcon,
        showLoadBtn : s.showLoadBtn,
        loadBtnText : s.loadBtnText || '查看更多',
        id : conversation ? conversation.id : 0,
        dataSource : dataSource.cloneWithRows(m.reverse()),
        order : order,
    };
};

let mapDispatchToProps = (dispatch,ownProps)=>{

    return {

        //初始化
        _init : ()=>{

            if(IM){
                _init(ownProps,dispatch,ownProps.id);
            }else{
                Event.on('initialized',()=>{
                    _init(ownProps,dispatch,ownProps.id);
                });
            }
        },

        //消息渲染
        _renderMessage : (arg)=>{
            return _renderMessage(arg);
        },

        //保存消息到本地
        _saveMessage : (message)=>{
            _saveMessage(message,dispatch);
        },

        //发送消息
        _sendMessage : (message,pushData)=>{
            _sendMessage(message,pushData);
        },

        //下一页
        _nextPage : ()=>{
            _nextPage(dispatch);
        },

        //退出聊天
        _quit : _quit,

        //other
    };
};

let IM_component = connect(
    mapStateToProps,
    mapDispatchToProps
)(UI);

//包装事件
Event.pack(IM_component);

//====================================
//====================================
//          初始化
//====================================
//====================================
Owner.on('login',_creatImObject);
Owner.on('init',_creatImObject);
Owner.on('logout',_closeIM);

//====================================
//====================================
//          设定出口
//====================================
//====================================
IM_component.reducer             = reducer;
IM_component.messagesReducer     = messagesReducer;

IM_component.close               = _closeIM;           // 关闭IM连接
IM_component.toJSON              = getMessageObject;   // 获取格式化后的message对象
IM_component.IMObject            = IM;                 // 获取IM对象
IM_component.IMList              = IMList;             // IM聊天列表component
IM_component.saveOrderToIM       = SaveOrderToIM;      // 保存order对象到IM
IM_component.atIM                = ()=>(atIM);         // 当前是否在聊天视图
IM_component.currentConversation = ()=>(conversation); // 获取当前conversation

/*

  注册自定义消息类型
  usage :
    let customMessage = IM.registerCustomMessage({
        type : 2,
        render : (customData)=>{}
    });
    customMessage.send({
        ...     //customData
    },
    true,       //是否发送到远程(对方可接收)，默认为true
    );
 */
IM_component.registerCustomMessage = _registerCustomMessage;

export default IM_component;
export { IMList,SaveOrderToIM };








