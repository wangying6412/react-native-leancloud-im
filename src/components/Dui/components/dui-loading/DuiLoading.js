/*

    @name           DuiLoading
    @author         lihaitang
    @createAt       2017-03-28 15:50:11

 */

//=======================
const propTypes = {
    name : React.PropTypes.string,
    size : React.PropTypes.number,
};
//========================

import React from 'react';
import {
    View,
    Image,
} from 'react-native';

import cat from './gif/water2.gif';
const gifs = {
    default : './gif/cat.gif',
    cat : './gif/cat.gif',
    colck : './gif/colck.gif',
    facebook : './gif/facebook.gif',
    plane : './gif/plane.gif',
    water : './gif/water.gif',
    water2 : './gif/water2.gif',
};

export default class DuiLoading extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            gif : gifs[this.props.name] || gifs.default
        };

        this._style = {
            wrap : {
                width : this.props.size,
                height : this.props.size,
                borderRadius : this.props.size/2,
                overflow : 'hidden',
            },
            gif : {
                width : this.props.size,
                height : this.props.size,
                borderRadius : this.props.size/2,
            },
        };
    }

    static get propTypes(){
        return propTypes;
    }

    static get defaultProps(){
        return {
            name : 'default',
            size : 50,
        };
    }

    render(){
        return (
            <View style={[this._style.wrap,this.props.style]}>
                <Image source={cat} style={[this._style.gif]} />
            </View>
        );
    }
}

