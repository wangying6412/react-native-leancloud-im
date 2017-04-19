
/*
 *      IM - Reducer
 */

/*
            数据结构:

            IM : {
                status : 'init',
                expires : 10000,
                items : {
                    '582311a2fab00f41dd8594f2' : {
                        status : 'init',
                        creator : 'xxx',
                        creatorInfo : {},
                        userInfo : {},
                        id : '582311a2fab00f41dd8594f2',
                        order : '582311a2fab00f41dd8594f2',
                        members : ['8','9'],
                        lastMessage : 'id',
                        lastMessageAt : new Data(),
                        messages : ['id','id','id','id'],
                        unreadMessagesCount : 0,
                    }
                },
            }
 */


let defaultItem = {
    status : 'init',
    members : [],
    messages : [],
};

let defaultState = {
    status : 'init',
    expires : null,
    items : {},
};

module.exports = (oldState=Object.assign({},defaultState),action={})=>{

    switch(action.type){

        case 'IM_RESET':{

            console.log('IM state 已重置');

            return Object.assign({},defaultState,{items:{}});
        }

        case 'IM_SET_STATUS':{

            let state = Object.assign({},oldState);

            let status = action.state.status || 'done';
            //console.log('设置 IM status : ',status,action);
            return Object.assign(state,{status});

        }

        case 'IM_SAVE':{

            //console.log('接收到IM_SAVE',`status : ${action.state.status}`,'action:',action);

            let newState = Object.assign({},oldState);

            if(!oldState.items[action.state.id]){
                newState.items[action.state.id] = Object.assign({},defaultItem,action.state);
            }else{
                newState.items[action.state.id] = Object.assign({},oldState.items[action.state.id], action.state);
                action.state.messages && (newState.items[action.state.id].messages = [...action.state.messages]);
            }

            return newState;
        }

    }

    return oldState;
};







