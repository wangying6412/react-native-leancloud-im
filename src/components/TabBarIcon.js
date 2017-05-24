/**
 * TabBar的图标
 *
 * @author lihaitang
 * @version v0.0.1
 */

import React from 'react';

import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/Ionicons';

class TabBarIcon extends React.Component{

    static get propTypes(){
        return {
            icon : PropTypes.string.isRequired,
            focused : PropTypes.bool.isRequired,
            tintColor : PropTypes.string.isRequired,
        };
    }

    render(){
        let {
            icon,
            focused,
            tintColor,
        } = this.props;

        icon = focused ? icon : /\-outline/.test(icon) ? icon : icon+'-outline';
        let style = !focused ? {} : { color : tintColor };
        return(
            <Icon name={icon} size={26} style={style} />
        );
    }
}

export default TabBarIcon;




