/*

    @name           $name$
    @file           $name$.UI.js
    @author         $author$
    @createAt       $createAt$

 */

import React from 'react';
import {
    Text,
} from 'react-native';
import {
    Body,
} from '../Dui';
import styles from '../Styles';

export default class UI extends React.Component{
    render(){
        return (
            <Body style={styles.container}>
                <Text>hello world!!!</Text>
            </Body>
        );
    }
}
