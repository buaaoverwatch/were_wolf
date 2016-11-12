/**
 * Created by CHANGE on 2016/11/13.
 */
import React, { Component } from 'react';
import {
    Alert,
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image,
    ScrollView,
    ActivityIndicator
} from 'react-native';



import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';

//此处应有一个fetch到的房间列表
import List from 'antd-mobile/lib/list';
import Button from 'antd-mobile/lib/button'
import Socket from '../services/websocket';


const seeMySelf = (props) => {
    const {dispatch, room} = props;

    return(
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    我的角色是：
                </Text>
                <TouchableOpacity onPress={Actions.Test1}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>确定
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Image style ={ styles.Character}
            source ={p}
            />
            <Text>{getCharacter()}</Text>
            <ActivityIndicator
                toast
                text="等待服务器"
                animating={room.loading}
            />
        </View>
    );
}
const styles = StyleSheet.create({
        //标题
        header: {
            flexDirection: 'row',
            height: PixelRatio.get() * 16,
            width: Dimensions.get('window').width,
            alignItems: 'center',
            backgroundColor: '#393a3f',//#0033ff
            justifyContent: 'space-between'
        },
        //标题文本
        headerText: {
            color: '#ffffff',
            fontSize: 18,
        },
        //角色
        Character:{
            alignItems :'center',
        },
        //返回区
        backContainer: {
            width: PixelRatio.get() * 23,
            flexDirection: 'row',
            alignItems: 'center'
        },
        //返回图标
        backIcon: {
            height: PixelRatio.get() * 5,
            width: PixelRatio.get() * 5,
            marginLeft: PixelRatio.get() * 2
        },
        //返回文本
        backText: {
            fontSize: 18,
            color: '#ffffff',
            marginLeft: PixelRatio.get() * 2
        },
        //完成区
        completeContainer: {
            width: PixelRatio.get() * 25,
            alignItems: 'center'
        },
        completeText: {
            fontSize: 18,
            color: '#ffffff'
        },

    });

export default connect(room => room)(seeMySelf);
