/*
 *      IM - Messages - Reducer
 */

/*
            数据结构:

            {
                'guid' : {
                    //消息对象
                },
                'guid' : {
                    //消息对象
                },
            }
 */

module.exports = (oldState = {},action={})=>{

    let state = oldState;

    switch(action.type){

        case 'IM_MESSAGE_SAVE':{

            let message = action.state;
            if(message){
                let guid = message.guid;
                state[guid] = message;
            }else{
                console.log('IM-Reducer,未发现message对象。');
            }

            return state;
        }

    }

    return oldState;
};
