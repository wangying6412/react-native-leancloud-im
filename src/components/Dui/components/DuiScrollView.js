/**
 * dui#scrollView.propTypes
 *
 * @memberof! ScrollView
 */

const propTypes = {

    dataSource : React.PropTypes.object,
    onEndReached : React.PropTypes.func,    //onEndReached(prePage,nextPage)
    key : React.PropTypes.string,
    id : React.PropTypes.oneOfType([
        React.PropTypes.number,
        React.PropTypes.string,
    ]),
    renderEmptyComponent : React.PropTypes.func,
    renderEndReachedComponent : React.PropTypes.func, //loadingPage
    renderEndErrorComponent : React.PropTypes.func,

    refreshing : React.PropTypes.bool,
    onRefresh : React.PropTypes.func,

    wrapStyle : React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array,
    ]),
    style : React.PropTypes.oneOfType([
        React.PropTypes.object,
        React.PropTypes.array,
    ]),

    delay : React.PropTypes.number,
    renderInitialComponent : React.PropTypes.func,
    onInitial : React.PropTypes.func,

};

import React from 'react';
import {
    ListView,
    ScrollView,
    RefreshControl,
    View,
    Animated,
} from 'react-native';
import DuiRefreshControl from './DuiRefreshControl';
import InitialComponent from './DuiInitialComponent';
import Immutable from 'immutable';
import {
    options
} from '../Dui.config';

/**
 * dui#scrollView
 *
 * @class DuiScrollView
 */
export default class DuiScrollView extends React.Component{

    constructor(props){
        super(props);

        this.scrollOffset = new Animated.ValueXY({x:0,y:0});
        this.scrollComponent = this.props.dataSource ? ListView : ScrollView;

        this.state = {
            // init || initialed || done || error
            status : !this.props.delay ? 'done' : 'init',
            page : 0,
        };

        this.timmer = null;

        const $style = Immutable.fromJS(this.props.style || {}).toMap().flatten();
        const marginTop = $style.get('marginTop');
        const paddingTop = $style.get('paddingTop');

        this.topOffset = {
            marginTop,
            paddingTop,
        };
    }

    static get propTypes(){
        return propTypes;
    }

    static get defaultProps(){
        return {
            delay : options.navAnimateDuration + 200
        };
    }

    componentDidMount(){
        if(this.props.delay > 0){
            const _onInitial = this.props.onInitial || this.onInitial.bind(this);
            this.timmer = setTimeout(()=>{
                _onInitial().then(()=>{
                    if(!this.props.renderInitialComponen){
                        this.setState({
                            status : 'initialed'
                        });
                    }else{
                        this.setState({
                            status : 'done'
                        });
                    }
                }).catch((err)=>{
                    this.setState({
                        status : 'error'
                    });
                    console.log(err);
                });
            },this.props.delay);
        }
    }

    componentWillUnmount(){
        this.props.delay > 0 && clearTimeout(this.timmer);
    }

    _onScroll(){
        return Animated.event([
            {nativeEvent: {contentOffset: {
                x: this.scrollOffset.x,
                y: this.scrollOffset.y
            }}}
        ]);
    }

    onInitial(){
        return new Promise((resolve)=>{
            resolve();
        });
    }

    renderInitialComponent(style){
        return <InitialComponent status={this.state.status} onHide={(()=>{
            this.setState({
                status : 'done'
            });
        }).bind(this)} style={style}/>;
    }

    render(){
        return (
            <View style={[{flex:1},this.props.wrapStyle]}>
                {
                    (this.state.status === 'init'||
                    this.state.status === 'initialed')&&
                        (
                            this.props.renderInitialComponent ?
                            this.props.renderInitialComponent(this.topOffset):
                            this.renderInitialComponent(this.topOffset)
                        )
                }
                {
                    (this.state.status === 'error' || this.state.status === 'done')
                    &&
                    <this.scrollComponent
                        style={[{flex:1},this.props.style]}
                        onScroll={this._onScroll()}
                        scrollEventThrottle={10}
                        {...this.props}
                        scrollEnabled={typeof this.props.scroll === 'boolean' ? this.props.scroll : true}
                        enableEmptySections
                        refreshControl={
                            typeof this.props.refreshing === 'boolean'?
                            <RefreshControl
                                refreshing={this.props.refreshing}
                                onRefresh={this.props.onRefresh}
                                enabled={false}
                                tintColor="rgba(0,0,0,0)"
                            />
                            :
                            null
                        }
                    >
                        {
                            this.state.status === 'done'?
                                !this.props.dataSource
                                ?
                                this.props.children
                                :
                            null
                                :
                                null
                        }
                    </this.scrollComponent>
                }
                {
                    typeof this.props.refreshing === 'boolean'&&
                    this.state.status === 'done'&&
                    <DuiRefreshControl
                        refreshing={this.props.refreshing}
                        offset={this.scrollOffset}
                        topOffset={this.topOffset}
                    />
                }
            </View>
        );
    }
}






