/*

    @name           $name$
    @file           $name$.js
    @author         $author$
    @createAt       $createAt$

 */

//=======================
const propTypes = {};
//========================

import React from 'react';
import {
    connect
} from 'react-redux';

import UI from './$name$.UI.js';
import reducer from './$name$.reducer.js';

import {
    createAction
} from 'redux-actions';

let dispatch;

const _init = ()=>{
    let action = createAction(`${'$name$'.toUpperCase()}_INIT`);
    dispatch(action());
};

const _save = (obj)=>{
    let action = createAction(`${'$name$'.toUpperCase()}_SAVE`);
    dispatch(action(obj));
};

const mapStateToProps = ($s)=>{
    return {
        $state : $s.get('$name$'),
    };
};

const mapDispatchToProps = (_dispatch,_ownProps)=>{
    dispatch = _dispatch;
    return {
        _init,
        _save,
    };
};

const $name$ = connect(mapStateToProps,mapDispatchToProps)(UI);

$name$.propTypes = propTypes;
$name$.reducer = reducer;

export default $name$;




