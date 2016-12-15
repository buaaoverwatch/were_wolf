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
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';


const seeMySelf = (props) => {
    const {dispatch, room} = props;

    function  _renderChaPic() {
        if(room.player_role[room.client_id]==="wolf"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/were_wolf.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }
        else if(room.player_role[room.client_id]==="village"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/villager.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }
        else if(room.player_role[room.client_id]==="witch"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/witch.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }
        else if(room.player_role[room.client_id]==="cupid"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/cupid.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }
        else if(room.player_role[room.client_id]==="hunter"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/hunter.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }
        else if(room.player_role[room.client_id]==="guard"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/guard.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }
        else if(room.player_role[room.client_id]==="seer"){
            return (
                <View style={styles.PicView}>
                    <Image source ={require('../images/seer.jpg')}
                           style={styles.PicSize}
                    />
                </View>
            );
        }

    }

    function  getCharacter() {
        if(room.player_role[room.client_id]==="wolf"){
            return "狼人";
        }
        else if(room.player_role[room.client_id]==="village"){
            return "村民";
        }
        else if(room.player_role[room.client_id]==="witch"){
            return "女巫";
        }
        else if(room.player_role[room.client_id]==="cupid"){
            return "丘比特";
        }
        else if(room.player_role[room.client_id]==="hunter"){
            return "猎人";
        }
        else if(room.player_role[room.client_id]==="guard"){
            return "守卫";
        }
        else if(room.player_role[room.client_id]==="seer"){
            return "预言家";
        }
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
        <View style={styles.wholeView}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    查看角色
                </Text>
            </View>
            {_renderChaPic()}
            <Text style={styles.RoleText}>
                {getCharacter()}
            </Text>
            <Button type="primary" onClick={nextstep} style={styles.confirmButton}>
                确认
            </Button>
            <ActivityIndicator
                toast
                text="等待服务器"
                animating={room.loading}
            />
        </View>
    );
}
const styles = StyleSheet.create({
    wholeView:{
        flex: 1,
        alignItems: 'center',
    },
    //标题
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        height: Platform.OS === 'ios' ? PixelRatio.get() * 26 : PixelRatio.get() * 16,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#393a3f',//#0033ff
        justifyContent: 'center'
    },
    //标题文本
    headerText: {
        color: '#ffffff',
        fontSize: 18,
    },
    PicView:{
        alignItems: 'center',
    },
    PicSize:{
        marginTop:Dimensions.get('window').height*0.15,
        height: Dimensions.get('window').width*0.6,
        width: Dimensions.get('window').width*0.6,
    },
    RoleText: {
        marginTop:PixelRatio.get() * 10,
        color: '#393a3f',
        fontSize: 36,
    },
    confirmButton:{
        marginTop:PixelRatio.get() * 20,
        width: Dimensions.get('window').width*0.8,
    },
    });

export default connect(room => room)(seeMySelf);
