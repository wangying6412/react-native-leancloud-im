/*

    @name           List
    @file           List.js
    @author         lihaitang
    @createAt       2017-03-29 15:59:23

 */

/*
    usage:
    <List
        style={styles.container}
        url={global.URL.getFollowList}
        data={{
            userid : this.props.userid
        }}
        storage={{
            key:'followList',
            id : this.props.userid
        }}
        renderRow={this.renderRow.bind(this)}

        short={this.props.short}
        size={this.props.size}
        showMore={(()=>{
            Actions.FollowList({userid:this.props.userid});
        }).bind(this)}
    />
*/

//=======================
//      继承 dui-scroll-view props
const propTypes = {
    url : PropTypes.string.isRequired,
    data : PropTypes.object,
    storage : PropTypes.shape({
        key : PropTypes.string.isRequired,
        id : PropTypes.oneOfType([
            PropTypes.number,
            PropTypes.string,
        ]),
        expires : PropTypes.number,
    }).isRequired,
    renderRow : PropTypes.func.isRequired,

    renderEmptyComponent : PropTypes.func,
    renderEndReachedComponent : PropTypes.func, //loadingPage
    renderEndErrorComponent : PropTypes.func,
};
//========================

import React from 'react';
import {
    ListView,
    Dimensions,
} from 'react-native';
import PropTypes from 'prop-types';
import {
    connect
} from 'react-redux';

import UI from './List.UI.js';
import reducer from './List.reducer.js';
import Storage from '../Storage';
import Immutable from 'immutable';

import {
    createAction
} from 'redux-actions';
import {
    Store
} from '../Redux';

let dispatch;
let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

const _init = (ownProps)=>{
    const $state = Store.getState().getIn(['List','items',ownProps.storage.key]);
    return new Promise((resolve,reject)=>{
        if(!$state){
            let storage = ownProps.storage;
            Storage.load(storage).then((d)=>{
                let item = {
                    refreshing : false,
                    size : d.length,
                    listState : 'done',
                };
                _save(item,ownProps);
                _saveData({
                    dataSource : ds.cloneWithRows(d),
                    data : d,
                });

                resolve();
            }).catch(()=>{
                _loadData(null,{resolve,reject},ownProps);
            });
        }else{
            resolve();
            _save({
                listState : 'done',
            },ownProps);
        }
    });
};

const _reset = (ownProps)=>{
    _save({
        listState : 'init',
        current_page : 0,
    },ownProps);
    _saveData({
        data : [],
    },ownProps);

    return Storage.remove(ownProps.storage);
};

const _save = (obj,ownProps)=>{
    let action = createAction('LIST_SAVE');
    obj.key = ownProps.storage.key;

    dispatch(action(obj));
};

const _saveData = (obj,ownProps)=>{
    let action = createAction('LIST_SAVE_DATA');
    obj.key = ownProps.storage.key;
    dispatch(action(obj));
};

const _onRefresh = (ownProps)=>{
    _save({
        refreshing : true,
    },ownProps);
    _reset(ownProps).then(()=>{
        _loadData((()=>{
            _save({
                refreshing : false
            },ownProps);
        }).bind(this),null,ownProps);
    });
};

const _loadData = (fn,promise,ownProps)=>{

    const $state = Store.getState().getIn(['List','items',ownProps.storage.key]);
    let status = $state ? $state.get('listState') : 'none';
    if(status === 'no-more' || status === 'loading' || status === 'empty'){
        if(typeof(fn)==='function')fn();
        promise && promise.resolve();
        return false;
    }

    let url = ownProps.url;
    let page = $state ? $state.get('current_page') : 0;
    let oldData = $state ? $state.get('data') : Immutable.fromJS([]);

    var methodBody = ownProps.data || {};

    let moreData = '';
    for(var i in methodBody){
        moreData = '&' + i + '=' + methodBody[i];
    }

    url = url + '?page=' + (Number(page) + 1) + moreData;

    _save({
        listState : 'loading',
    },ownProps);

    $.ajax({
        url : url,
        type : 'GET',
        data : methodBody,
    }).then((d)=>{

        if(typeof(fn)==='function')fn();
        if(d.state === 1){
            let newData = [];
            if(d.data.length === 0){
                //无更多数据的处理
                let state = !oldData.size ? !page ? 'empty' : 'no-more' : 'no-more';
                _save({
                    listState : state,
                },ownProps);
            }else{
                //保存页数
                let current_page = page + 1;
                let total_pages = 0;
                if(d.paginator){
                    total_pages = d.paginator.total_pages;
                    current_page = d.paginator.current_page;
                }
                newData = oldData.toJS().concat(d.data);

                let storage = ownProps.storage;

                Storage.save({
                    ...storage,
                    rawData : newData,
                });

                _save({
                    listState : 'done',
                    current_page,
                    total_pages,
                },ownProps);
                setTimeout(()=>{
                    _saveData({
                        dataSource : ds.cloneWithRows(newData),
                        data : newData,
                    },ownProps);
                },300);
            }

            promise && promise.resolve();
        }else{
            console.log('读取列表数据失败。');
            promise && promise.reject();
            _save({
                listState : 'error',
                error : '读取列表数据失败。',
            },ownProps);
        }
    }).catch((err)=>{
        global.toast('抱歉，无法连接服务器。');
        console.log(err);
        promise && promise.reject();
        _save({
            refreshing : false,
            listState : 'error',
            error : '无法连接服务器。',
        },ownProps);
    });
};

const _onEndReached = (ownProps)=>{
    const $state = Store.getState().getIn(['List','items',ownProps.storage.key]);
    let footerY = $state ? $state.get('footerY') : 0;
    let screenHeight = Dimensions.get('window').height;
    let status = $state ? $state.get('listState') : 'init';

    if(footerY >= screenHeight){
        _loadData(null,null,ownProps);
    }else if(status !=='loading' && status !=='no-more' && status !=='empty'){
        _save({
            listState : 'load-more'
        },ownProps);
    }
};

const _onLayout = (event,ownProps)=>{
    let y = event.nativeEvent.layout.y;

    _save({
        footerY : y
    },ownProps);
};

let mapStateToProps = ($s,_ownProps)=>{
    const $state = $s.getIn(['List','items',_ownProps.storage.key]);
    const dataSource = $s.getIn(['List','items',_ownProps.storage.key,'dataSource']) || ds.cloneWithRows([]);
    return {
        $state : $state || Immutable.fromJS({}),
        dataSource,
    };
};

let mapDispatchToProps = (_dispatch,ownProps)=>{
    dispatch = _dispatch;
    return {
        _init : ()=>_init(ownProps),
        _save : (obj)=>_save(obj,ownProps),
        _reset : ()=>_reset(ownProps),
        _onRefresh : ()=>_onRefresh(ownProps),
        _loadData : (fn,promise)=>_loadData(fn,promise,ownProps),
        _onEndReached : ()=>_onEndReached(ownProps),
        _onLayout : (event)=>_onLayout(event,ownProps),
    };
};

let List = connect(mapStateToProps,mapDispatchToProps)(UI);

List.propTypes = propTypes;
List.reducer = reducer;
List.refresh = _onRefresh;

export default List;




