/*
        Popup 模块

        import Popup from '../Popup';

        let xxx = Popup.create(<Text>hello</Text>);

        xxx.destroy();

        xxx.update(<Text>world!!!</Text>);

        Popup.closeAll();
        Popup.pop();
 */

import React from 'react';
import {
    View
} from 'react-native';

import RootSiblings from 'react-native-root-siblings';

let wrapStyle = {
    left : 0,
    top : 0,
    right : 0,
    bottom : 0,
    backgroundColor : 'rgba(0,0,0,0.5)',
    alignItems : 'center',
    justifyContent : 'center',
};

let elements = [];
let _add = (ele)=>{
    let popEle = null;
    if(typeof ele === 'object'){
        popEle = new RootSiblings(<View style={[wrapStyle]}>{ele}</View>);
        elements.push(popEle);
    }
    return _pack(popEle);
};

let _closeAll = ()=>{
    elements.forEach((popEle)=>{
        popEle && popEle.destroy();
    });
    elements = [];
};

let _pack = (popEle)=>{
    if(popEle){
        let u = popEle.update;
        popEle.u = u;
        popEle.update = (ele)=>{
            popEle.u(<View style={[wrapStyle]}>{ele}</View>);
        };
    }
    return popEle;
};

let _pop = ()=>{
    let popEle = elements.pop();
    popEle && popEle.destroy();
};

let Popup = {
    create : _add,
    closeAll : _closeAll,
    pop : _pop,
};

export default Popup;








