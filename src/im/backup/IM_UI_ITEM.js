
/* global styles */

/*
    <IM_ITEM_UI
        align={'left'}
        avatar='',
        text='hello world',
        onPress={}
    />
    <IM_ITEM_UI
        align={'right'}
        avatar='',
        thumb='http://xxxx.jpg',
        width={100}
        height={100}
        onPress={}
    />
*/

import React from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
} from 'react-native';

import Photo from '../Photo';

export default class IM_ITEM_UI extends React.Component{

    _getCornerStyle(isWrap){

        let cornerStyle = this.props.align!=='right' ?
        Object.assign({},{
            transform : [{
                rotate : '45deg'
            }]
        },styles.im_itemCorner)
        :
        Object.assign({},{
            transform : [{
                rotateZ : '45deg',
            }]
        },styles.im_itemCorner_right);

        let cornerWrapStyle = this.props.align==='right' ? Object.assign({},{
            transform : [{
                rotateY : '180deg',
            }]
        },styles.im_itemCornerWrap_right) : styles.im_itemCornerWrap;

        if(isWrap){
            return cornerWrapStyle;
        }else{
            return cornerStyle;
        }
    }

    render(){
        return(
            <View style={this.props.align==='right' ? styles.im_itemWrap_right : styles.im_itemWrap}>
                <Image style={styles.im_itemAvatarImage}
                    source={this.props.avatar ? {uri : this.props.avatar} : global.setting.defaultAvatar}
                >
                    <TouchableOpacity style={styles.im_itemAvatar} />
                </Image>
                <TouchableOpacity style={this.props.align==='right' ? styles.im_itemContent_right : styles.im_itemContent}
                    onPress={this.props.onPress}
                >
                    <View style={this._getCornerStyle('wrap')}>
                        <View style={ this._getCornerStyle() } />
                    </View>
                    {
                        this.props.text &&
                        <View style={styles.im_itemTextBox}>
                        <Text style={[ styles.breakAll , {
                            minHeight : 20,
                            lineHeight : 20,
                        } ]}>{this.props.text}</Text>
                        </View>
                    }
                    {
                        this.props.thumb &&
                            <Photo
                                style={styles.im_itemImage}
                                source={this.props.imgURL}
                                thumb={this.props.thumb}
                                showBigPhoto={true}
                                width={this.props.width || 100}
                                height={this.props.height || 100}
                            />
                    }
                    {
                        this.props.location &&
                            <View>
                                <View style={[styles.im_itemLocation_text]}>
                                    <Text style={[styles.im_itemLocation_text_addr]}
                                        numberOfLines={1}
                                    >
                                        {this.props.location.addr}
                                    </Text>
                                    <Text
                                        numberOfLines={1}
                                    >
                                        {this.props.location.name}
                                    </Text>
                                </View>
                                <Image
                                    style={styles.im_itemLocation_image}
                                    source={{uri : this.props.location.image}}
                                />
                            </View>
                    }
                    {
                            /*<View style={[this.props.align!=='right' ? styles.im_item_time : styles.im_item_time_right]}>
                            <Text style={[styles.im_item_time_text]}>{this.props.time}</Text>
                            </View>*/
                    }
                </TouchableOpacity>
            </View>
        );
    }
}
