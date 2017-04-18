/**
 * 单个列表项
 *
 * @module ListItem
 * @author lihaitang
 * @version v0.0.1
 * @example
 * ```
    <ListItem
        title="列表标题"
        leftIcon="xxxxx"
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
    />
 * ```
 */

import React, {
    PropTypes
} from 'react';
import {
    Text,
    View,
    Image,
    TouchableHighlight,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import styles from '../css';

class ListItem extends React.Component{

    static get propTypes(){

        const stringOrElement = PropTypes.oneOfType([PropTypes.string,PropTypes.element]);

        return {
            /**
             * ListItem的标题
             */
            title          : stringOrElement,
            /**
             * ListItem 左侧的图标
             */
            leftIcon       : PropTypes.string,
            /**
             * ListItem 左侧的图片，头像之类的
             */
            leftImage      : PropTypes.string,
            /**
             * ListItem 右侧的文字，“查看更多”之类的
             */
            rightText      : stringOrElement,
            /**
             * ListItem 右侧的文字的颜色
             */
            rightTextColor : PropTypes.string,
            /**
             * ListItem 右侧的图标，默认为向右的箭头,如果设为“none”则不显示图标
             */
            rightIcon      : PropTypes.string,
            /**
             * ListItem 底部的文字
             */
            bottomText     : stringOrElement,
            /**
             * ListItem badge就是气泡数字
             */
            badge          : PropTypes.number,
            /**
             * ListItem 大尺寸的列表项
             */
            legal          : PropTypes.bool,
            /**
             * ListItem 点击事件
             */
            onPress        : PropTypes.func,
            /**
             * ListItem 如果设置了该项，右侧图标会变成复选框
             */
            checked        : PropTypes.bool,
        };
    }

    constructor(props){
        super(props);
    }

    render(){

        const title =  this.props.title || this.props.children ;

        return (
            <TouchableHighlight
                onPress = {this.props.onPress && this.props.onPress()}
            >
                <View style={[styles.listItem,this.props.style]}>
                    {
                        this.props.leftIcon &&
                        <View style={[styles.listItem_icon_wrap]}>
                            <Icon name={this.props.leftIcon} style={[styles.listItem_icon,styles['font_gray']]} />
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
                                styles.listItem_leftImage,
                                this.props.legal && styles.listItem_leftImage_legal
                            ]} />
                        }

                        <View style={[styles.flex1]}>
                            <View style={[styles.flex1,styles.row,
                                Boolean(this.props.bottomText) &&
                                styles.listItem_bottomText_before,
                            ]}>
                                <View style={[styles.listItem_title]}>
                                {
                                    typeof title === 'string' ?
                                    <Text style={[styles['font_gray']]}
                                    numberOfLines={1}>
                                    {title}
                                    </Text>
                                    :
                                    title
                                }
                                </View>
                                <Text
                                    style={[styles.listItem_intro,this.props.rightTextColor && {
                                        color : this.props.rightTextColor
                                    }]}
                                    numberOfLines={1}
                                >
                                    {this.props.rightText}
                                </Text>
                            </View>
                            {
                                Boolean(this.props.bottomText) &&
                                <View style={[styles.flex1,styles.listItem_bottomText]}>
                                {
                                    typeof this.props.bottomText === 'string' ?
                                    <Text style={[styles.font_gray,{
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
                                    <Text style={[styles.font_white]}>{this.props.badge}</Text>
                                </View>
                            </View>
                        }
                        {
                            (this.props.rightIcon !== 'none'
                            &&
                            typeof this.props.checked !== 'boolean')
                            &&
                            <View style={[styles.listItem_icon_wrap]}>
                                <Icon name={ this.props.rightIcon || 'ios-arrow-forward' } style={[styles.listItem_icon,styles.font_gray,
                                ]} />
                            </View>
                        }
                        {
                            (()=>{
                                if(this.props.checked === false){
                                    return (
                                        <View style={[styles.listItem_icon_wrap]}>
                                            <Icon name="ios-checkmark-outline"
                                                style={[styles.listItem_icon_right,styles.font_gray,
                                            ]} />
                                        </View>
                                    );
                                }else if(this.props.checked === true){
                                    return (
                                        <View style={[styles.listItem_icon_wrap]}>
                                            <Icon name="ios-checkmark-circle"
                                            style={[styles.listItem_icon_right,styles.font_red,
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

export default ListItem;




