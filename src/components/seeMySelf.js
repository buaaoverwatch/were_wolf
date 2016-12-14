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
    ActivityIndicator,
    Platform,
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

    const wolf = require('../images/were_wolf.jpg');
    const vill = require('../images/villager.jpg');
    const cupid = require('../images/cupid.jpg');
    const hunter = require('../images/hunter.jpg');
    const guard = require('../images/guard.jpg');
    const witch = require('../images/witch.jpg');
    const seer = require('../images/seer.jpg');

    function  getChaPic() {
        if(room.player_role[room.client_id]==="wolf"){
            return wolf;
        }
        else if(room.player_role[room.client_id]==="vill"){
            return vill;
        }
        else if(room.player_role[room.client_id]==="witch"){
            return witch;
        }
        else if(room.player_role[room.client_id]==="cupid"){
            return cupid;
        }
        else if(room.player_role[room.client_id]==="hunter"){
            return hunter;
        }
        else if(room.player_role[room.client_id]==="guard"){
            return guard;
        }
        else if(room.player_role[room.client_id]==="seer"){
            return seer;
        }

    }

    function  getCharacter() {
        return room.player_role[room.client_id];
    }

    function nextstep() {
        console.log('in nextstep');
        if(props.room.hassocket) {
            dispatch({
                type:'room/changeloading',
                payload:true,
            });
            let msg = JSON.stringify({
                type: "4",
                request_id: props.room.user_request_id.toString(),
                room_id: props.room.room_id.toString(),
                user_id: props.room.client_id
            });
            console.log('next step send msg: ');
            console.log(msg);
            props.room.socket.send(msg);
        }
    }

    return(
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    我的角色是：
                </Text>
                <TouchableOpacity onPress={nextstep}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>确定
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <Image style ={ styles.Character}
            source ={getChaPic}
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
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        height: Platform.OS === 'ios' ? PixelRatio.get() * 26 : PixelRatio.get() * 16,
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
    //返回区
    backContainer: {
        flexDirection: 'row',
        marginLeft: PixelRatio.get() * 5,
        width: PixelRatio.get() * 40,
        alignItems: 'center',
        justifyContent:'flex-start',
    },
    //返回图标
    backIcon: {
        height: PixelRatio.get() * 5,
        width: PixelRatio.get() * 5,
    },
    //返回文本
    backText: {
        fontSize: 18,
        color: '#ffffff',
        marginLeft: PixelRatio.get() * 2
    },
    //完成区
    completeContainer: {
        flexDirection: 'row',
        marginRight: PixelRatio.get() * 5,
        width: PixelRatio.get() * 40,
        alignItems: 'center',
        justifyContent:'flex-end',

    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    },

    });

export default connect(room => room)(seeMySelf);
