
import React from 'react';
import {
    Text,
} from 'react-native';

class $Name$ extends React.Component{

    static get propTypes(){

    }

    static get defaultProps(){

    }

    static get navigationOptions(){
        return {
            title : '$name$'
        };
    }

    constructor(props){
        super(props);
    }

    render(){
        return(
            <Text> $name$ - $desc$ </Text>
        );
    }
}

export default $Name$;




