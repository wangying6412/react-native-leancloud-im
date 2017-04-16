/* global styles */

/*
    useage

    <ListRow
        ref="asdf"
        icon="xxxxx"
        onPress = {
            //function
        }
        rightText="xxxx"
        rightTextColor="#000"
        bottomText="xxxxxxxxx"
        badge = {10}
        leftImage = 'xxxxxxxxxxxxxx',
        rightIcon = "none" || ''
        legal

        checked
    >列表标题</ListRow>

    this.refs['asdf'].changeRightText('10')     //改变列表项右边的文字
*/

import React from 'react';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
// import styles from '../misc/css/ui';


class ListRow extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            rightText : this.props.rightText || false,
            bottomText : this.props.bottomText || false,
            badge : this.props.badge
        };
    }

    changeRightText(t){
        if(t){
            this.setState({
                rightText : t
            });
        }
    }

    changeBadge(n){
        this.setState({
            badge : n
        });
    }

    render() {
        var css = this.props.style || {};
        return (
            <TouchableHighlight
                onPress = {(this.props.onPress || function(){})}
            >
                <View style={[styles.listItem,css]}>
                    {
                        this.props.icon &&
                        <View style={[styles.listItem_icon_wrap]}>
                            <Icon name={this.props.icon} style={[styles.listItem_icon,styles.gray]} />
                        </View>
                    }
                    <View style={
                        [styles.listItem_cotent,this.props.last&&styles.noBorder,
                            this.props.legal && styles.listItem_cotent_legal
                        ]
                    }>

                        {
                            this.props.leftImage &&
                            <Image source={{
                                uri : this.props.leftImage
                            }} style={[
                                styles.leftItem_leftImage,
                                this.props.legal && styles.leftItem_leftImage_legal
                            ]} />
                        }

                        <View style={[styles.flex1]}>
                            <View style={[styles.flex1,styles.row,
                                Boolean(this.props.bottomText) &&
                                styles.listItem_bottomText_before,
                            ]}>
                                <View style={[styles.listItem_title]}>
                                {
                                    typeof this.props.children === 'string' ?
                                    <Text style={[styles.gray]}
                                    numberOfLines={1}>
                                    {this.props.children}
                                    </Text>
                                    :
                                    this.props.children
                                }
                                </View>
                                {
                                    <Text
                                        style={[styles.listItem_intro,this.props.rightTextColor && {
                                            color : this.props.rightTextColor
                                        }]}
                                        numberOfLines={1}
                                    >
                                    {this.props.rightText}
                                    </Text>
                                }
                            </View>
                            {
                                Boolean(this.props.bottomText) &&
                                <View style={[styles.flex1,styles.listItem_bottomText]}>
                                {
                                    typeof this.props.bottomText === 'string' ?
                                    <Text style={[styles.gray,{
                                        minHeight : 20,
                                    }]}
                                        numberOfLines={1}
                                    >{this.props.bottomText}</Text>
                                    :
                                    this.props.bottomText
                                }
                                </View>
                            }
                        </View>
                        {
                            Boolean(this.props.badge) &&
                            <View style={[styles.listItem_badge_wrap]}>
                                <View style={[styles.listItem_badge]}>
                                    <Text style={[styles.white]}>{this.props.badge}</Text>
                                </View>
                            </View>
                        }
                        {
                            (this.props.rightIcon !== 'none'
                            &&
                            typeof this.props.checked !== 'boolean')
                            &&
                            <View style={[styles.listItem_icon_wrap]}>
                                <Icon name={ this.props.rightIcon || 'ios-arrow-forward' } style={[styles.listItem_icon,styles.gray,
                                ]} />
                            </View>
                        }
                        {
                            (()=>{
                                if(this.props.checked === false){
                                    return (
                                        <View style={[styles.listItem_icon_wrap]}>
                                            <Icon name="ios-checkmark-outline"
                                                style={[styles.listItem_icon_right,styles.gray,
                                            ]} />
                                        </View>
                                    );
                                }else if(this.props.checked === true){
                                    return (
                                        <View style={[styles.listItem_icon_wrap]}>
                                            <Icon name="ios-checkmark-circle"
                                            style={[styles.listItem_icon_right,styles.red,
                                            ]} />
                                        </View>
                                    );
                                }

                            })()
                        }
                    </View>
                </View>
            </TouchableHighlight>
        );
    }
}

module.exports = ListRow;
