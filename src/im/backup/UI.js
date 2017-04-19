
/* global styles */

import React from 'react';
import {
    View,
    Text,
    ListView,
    TouchableOpacity,
    KeyboardAvoidingView,
    ActivityIndicator,
} from 'react-native';

import Inputer from './Inputer';
import ScrollView from 'react-native-invertible-scroll-view';
import { OrderInfo } from '../Orders';

class ContentWrap extends React.Component{

    render(){
        return(
            <ScrollView inverted
                style={{
                    flex : 1,
                }}
                {...this.props}
            >
                {this.props.children}
                <View>
                {
                    Boolean(this.props.statusText) &&
                    <View style={[styles.im_status]}>
                        <ActivityIndicator
                            animating={this.props.showLoadingIcon}
                            size="small"
                            color={'#000000'}
                            style={[styles.im_statusLoadingIcon]}
                        />
                        <Text style={[styles.im_statusText]}>{String(this.props.statusText)}</Text>
                    </View>
                }
                {
                    this.props.showLoadBtn &&
                    <TouchableOpacity style={[styles.button,styles.im_loadBtn]}
                        onPress={this.props._nextPage}
                    >
                        <Text>{this.props.loadBtnText}</Text>
                    </TouchableOpacity>
                }
                </View>
            </ScrollView>
        );
    }
}

export default class IM_UI extends React.Component{

    componentDidMount(){
        setTimeout(this.props._init,600);
    }

    componentWillUnmount(){
        this.props._quit && this.props._quit();
    }

    render(){
        return(
            <KeyboardAvoidingView
            behavior="padding"
            style={[{
                height : global.screenHeight - 64
            },styles.container]}>
                <OrderInfo order={this.props.order} />
                <ListView
                    dataSource={this.props.dataSource}
                    enableEmptySections={true}
                    initialListSize={1}
                    pageSize={10}
                    scrollRenderAheadDistance={50}

                    renderScrollComponent={props => <ContentWrap
                        statusText={this.props.statusText}
                        showLoadingIcon={this.props.showLoadingIcon}
                        showLoadBtn={this.props.showLoadBtn}
                        loadBtnText={this.props.loadBtnText}
                        _nextPage={this.props._nextPage}
                        {...props} />}

                    renderRow={
                        this.props._renderMessage
                    }

                    removeClippedSubviews={true}
                    style={{
                        flex : 1,
                        overflow : 'hidden',
                    }}
                />
                {
                    <Inputer ref="inputer" {...this.props} />
                }
            </KeyboardAvoidingView>
        );
    }
}
