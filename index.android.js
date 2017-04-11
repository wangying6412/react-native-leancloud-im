/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';

import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Button,
} from 'react-native';

import {
    createStore,
    applyMiddleware,
    compose,
} from 'redux';
import thunk from 'redux-thunk';
import {
    connect,
    Provider,
} from 'react-redux';

const initialState = {a:1,b:2,c:3};
const reducer = (state=initialState,action)=>{
    switch(action.type){
        case 'RESET':
            return initialState;
        case 'ADD':
            return Object.assign({},state,{a:state.a + 1});
        case 'CUT':
            return Object.assign({},state,{a:state.a - 1});
        default:
            return state;
    }
};

const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : compose;

const store = createStore(reducer,composeEnhancers(
    applyMiddleware(thunk)
));

class reactNativeLeancloudIm extends Component {

    componentDidMount(){
    }

    _add(){
        const action = { type : 'ADD' };
        this.props.dispatch(action);
        console.log('asdfasdfasdfasdfasdf');
    }

    _cut(){
        const action = { type : 'CUT' };
        this.props.dispatch(action);
    }

    _reset(){
        const action = { type : 'RESET' };
        this.props.dispatch(action);
    }

    render() {
        return (
            <View style={styles.container}>
            <Text style={styles.welcome}>
            {
                this.props.a
            }
            </Text>
            <View style={styles.row}>
                <Button style={styles.btn} title="add" onPress={this._add.bind(this)} />
                <Button style={styles.btn} title="cut" onPress={this._cut.bind(this)} />
                <Button style={styles.btn} title="reset" onPress={this._reset.bind(this)} />
            </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
    btn : {
        flex: 1,
        marginRight : 10,
    },
    row : {
        flexDirection : 'row',
        justifyContent : 'center',
    },
});

const ReactNativeLeancloudIm = connect((state)=>{return {a:state.a};})(reactNativeLeancloudIm);

class App extends React.Component{
    render(){
        return <Provider store={store}><ReactNativeLeancloudIm /></Provider>;
    }
}

AppRegistry.registerComponent('reactNativeLeancloudIm', ()=>App);






