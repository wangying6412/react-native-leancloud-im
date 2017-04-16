/*

    @name           List
    @file           List.UI.js
    @author         lihaitang
    @createAt       2017-03-29 15:59:23

 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import {
    ScrollView
} from '../Dui';
import styles from '../Styles';

import Icon from 'react-native-vector-icons/Ionicons';
import empty from '../../misc/img/empty.png';

export default class UI extends React.Component{

    constructor(props){
        super(props);
        this.refresh = this.props._onRefresh;
    }

    renderRow(d){
        var renderFN = this.props.renderRow;
        return renderFN(d,Number(arguments[2]),this.props.$state.get('size'));
    }

    renderFooter(){
        let renderFN = this.props.renderFooter || this.renderFooterDefault;
        return <View
            onLayout={this.props._onLayout}
        >{renderFN(
            this.props.$state.get('listState'),
            this.props.$state.get('error'),
            this.props._loadData
        ) || <Text>' '</Text>}</View>;
    }

    renderFooterDefault(status,error,loadMore){
        // status = 'init' || 'loading' || 'done' || 'error' || 'no-more' || 'empty' || 'load-more'
        let footer = null;
        switch(status){
            case 'done':
            case 'init':{
                break;
            }
            case 'loading':{
                footer = <Text style={[styles.gray]}>正在加载...</Text>;
                break;
            }
            case 'no-more':{
                footer = (
                    <View style={[styles.row,styles.center]}>
                        <Icon name="ios-flag" style={[styles.gray,styles.listFootIcon]}/>
                        <Text style={[styles.gray]}>到底了</Text>
                    </View>
                );
                break;
            }
            case 'empty':{
                footer = (
                    <View style={[styles.center]}>
                        <Image source={empty} resizeMode="contain" style={[styles.listFootImage]}/>
                        <Text style={[styles.gray]}>神马都没有</Text>
                    </View>
                );
                break;
            }
            case 'error':{
                footer = (
                    <View style={[styles.row,styles.center]}>
                        <Icon name="ios-bug" style={[styles.gray,styles.listFootIcon]}/>
                        <Text style={[styles.gray]}>{error || '抱歉，发生了一个错误。'}</Text>
                    </View>
                );
                break;
            }
            case 'load-more':{
                footer = (
                    <TouchableOpacity style={[styles.row,styles.center]} onPress={loadMore ? loadMore : ()=>{}}>
                        <Text style={[styles.blue]}>加载更多</Text>
                        <Icon name="ios-more" style={[styles.blue,styles.listFootIcon]}/>
                    </TouchableOpacity>
                );
                break;
            }
            default:
                footer = null;
        }

        return <View style={[styles.listFoot,styles.center]}>{footer}</View>;
    }

    getShortList(){
        let $data = this.props.$state.get('data');

        if(this.props.size){
            $data = $data.slice(0,this.props.size);
        }

        return (
            <View>
                {
                    $data.map((obj)=>{
                        return this.renderRow(obj);
                    })
                }
                {
                    (()=>{
                        if($data.size === this.props.size && this.props.showMore){
                            return (
                                <TouchableOpacity style={[styles.button,{
                                    margin : 10
                                }]}
                                    onPress={this.props.showMore || function(){}}
                                >
                                    <Text>查看更多 ></Text>
                                </TouchableOpacity>
                            );
                        }
                    })()
                }
            </View>
        );
    }

    render(){
        if(this.props.short){
            return this.getShortList();
        }else{
            return(
                <ScrollView
                    {...this.props}
                    style={[styles.listHeight,this.props.style]}
                    dataSource={this.props.dataSource}
                    renderRow={this.renderRow.bind(this)}
                    renderScrollComponent={this.props.renderScrollComponent}
                    initialListSize={20}
                    onEndReached = { this.props._onEndReached.bind(this) }
                    onInitial={this.props._init.bind(this)}
                    refreshing={ this.props.$state.get('refreshing') }
                    onRefresh={ this.props._onRefresh.bind(this) }
                    renderFooter={this.renderFooter.bind(this)}
                />
            );
        }
    }
}
