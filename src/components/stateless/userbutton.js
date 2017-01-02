/**
 * Created by shi on 2016/11/2.
 */
/**
 * Created by shi on 2016/11/2.
 */
import LinearGradient from 'react-native-linear-gradient';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';
import Badge from 'antd-mobile/lib/badge';

const UserButton = (props) => {
    const { index,selected=false,vote,username,onPress,disabled,sheriff,userid,wolf} = props.data;
    const styleprop=props.style;
    const dispatch=props.dispatch;
    let content;

    content = (
        <View style={disabled === true ? styles.containerundis : (selected === true ? styles.containersel : styles.containerunsel)}>
            <LinearGradient
                colors={['powderblue', 'steelblue']}
                style={styles.top}
            >
                <Text style={styles.texttop}>
                    {index}
                </Text>
                {sheriff === true?<Image source={{uri:'https://ooo.0o0.ooo/2016/11/02/5819a922b13e2.png'}}
                                         style={styles.icon}/>:<View/>}
            </LinearGradient>
            <View
                style={styles.bottom}>
                <Text style={styles.textbottom}>
                    {username}
                </Text>
            </View>
            {wolf === true ? <Text style={styles.wolf}>狼</Text> : <View/>}
        </View>
    );
    if(disabled=== true)
    {
        return(
            <Badge text="死亡"
                   corner={true}
                   style={styleprop}
            >
                {content}
            </Badge>

        );
    }
    else if(vote&&vote>0)
    {
        return(
            <Badge text={vote}
                   style={[styles.container,styleprop]}>
                <TouchableOpacity
                    accessibilityTraits="button"
                    onPress={onPress}
                    activeOpacity={0.8}
                >
                    {content}
                </TouchableOpacity>
            </Badge>
        );
    }
    else {
        return(
            <TouchableOpacity
                accessibilityTraits="button"
                onPress={onPress}
                activeOpacity={0.8}
                style={[styles.container,styleprop]}>
                {content}
            </TouchableOpacity>
        );

    }
};

const HEIGHT = 70;
const WIDTH= 60;
const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        width: WIDTH,
    },
    containerundis: {
        height: HEIGHT,
        width: WIDTH,
        flexDirection: 'column',
        borderRadius: HEIGHT / 8,
        backgroundColor: '#666666',
        // borderWidth: 1 / PixelRatio.get(),
    },
    containerunsel: {
        height: HEIGHT,
        width: WIDTH,
        flexDirection: 'column',
        borderRadius: HEIGHT / 8,
        //backgroundColor: '#666666',
        backgroundColor: '#6ABF47',
        // borderWidth: 1 / PixelRatio.get(),
    },
    containersel: {
        height: HEIGHT,
        width: WIDTH,
        flexDirection: 'column',
        borderRadius: HEIGHT / 8,
        //backgroundColor: '#666666',
        backgroundColor: '#F2443E',
        // borderWidth: 1 / PixelRatio.get(),
    },
    icon: {
        height: 20,
        width: 20,
        position:'absolute',
        top:30,
        left:5,
        backgroundColor: 'transparent',
        // borderWidth: 1 / PixelRatio.get(),
    },
    wolf:{
        position:'absolute',
        padding: 2,
        top:0,
        left:0,
        fontSize:16,
        color: 'white',
        backgroundColor: 'transparent',
    },
    top: {
        flex: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: HEIGHT / 8,
    },
    texttop: {
        color: 'white',
        fontSize: 60,
        backgroundColor: 'transparent',
    },
    textbottom: {
        color: 'white',
        fontSize: 10,

        backgroundColor: 'transparent',
    },
    bottom: {

        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: HEIGHT / 3,
    }
});

export default UserButton
