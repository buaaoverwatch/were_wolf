/**
 * Created by Qingchang Han on 2016/11/4.
 */
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
    Dimensions,
    Image,
    ScrollView,
    BackAndroid
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Toast from 'antd-mobile/lib/toast';
import List from 'antd-mobile/lib/list';
import Socket from '../services/websocket';

const GameRoom = (props) => {
    const { dispatch, room } = props;
    var Views = [];
    var list;
    function addRow(n) {
        var row = [];
        for(let i = n; i < n + 4 && i < list.length; i++) {
            row.push(
                <View key={i} style={styles.single} >
                    <Image source={require('../images/wolf.png')} style={styles.portrait} />
                    <Text style={styles.portraitText}>
                        {list[i]}
                    </Text>
                </View>
            )
        }
        return (
            <View key={n} style={styles.row}>
                {row}
            </View>
        );
    }
    function members() {
        Views = [];
        list = [];
        for(let key in room.player_nick) {
            list.push(room.player_nick[key]);
        }
        for(let i = 0; i < list.length; i = i + 4) {
            Views.push(addRow(i));
        }
        return (
            <View style={styles.portraitContainer}>
                {Views}
            </View>
        );
    }
    function lockroom() {
        console.log('client_id: ' + props.room.client_id);
        console.log('owner_id: ' + props.room.owner_id);
        if(props.room.client_id != props.room.owner_id) {
            Toast.fail("没有权限！请等待房主锁定房间后，页面会自动跳转。", 1);
        } else {
            if(props.room.hassocket) {
                let msg = JSON.stringify({
                    type: "1",
             //       request_id: props.room.room_request_id.toString(),
                    request_id: props.room.user_request_id.toString(),
                    room_id: props.room.room_id.toString(),
                    user_id: props.room.client_id
                });
                console.log('lock room send msg: ');
                console.log(msg);
                props.room.socket.send(msg);
            }
        }
    }
    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <TouchableOpacity onPress={Actions.pop}>
                    <View style={styles.backContainer}>
                        <Image style={styles.backIcon}
                               source={require('../images/back.png')} />
                        <Text style={styles.backText}>
                            返回
                        </Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    房间
                </Text>
                <TouchableOpacity onPress={lockroom}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>
                            锁定房间
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
             <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f9' }}
                         automaticallyAdjustContentInsets={false}
                         showsHorizontalScrollIndicator={false}
                         showsVerticalScrollIndicator={false}
             >
                <View style={styles.toastContainer}>
                    <List>
                        <List.Item
                            extra={room.room_id}
                        >
                            房间号
                        </List.Item>
                        <List.Item
                            extra={room.room_name}
                        >
                            房间名
                        </List.Item>
                    </List>
                </View>
                {members()}
            </ScrollView>
            <Socket/>
        </View>
    );
};

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
        width: PixelRatio.get() * 30,
        alignItems: 'center'
    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    },
    //提示信息
    toastContainer: {
      marginTop: PixelRatio.get() * 2
    },
    //每个头像区
    single: {
        flexDirection: 'column',
        width: PixelRatio.get() * 35,
        height: PixelRatio.get() * 40,
        alignItems: 'center',
        marginTop: PixelRatio.get() * 2,
        marginLeft: PixelRatio.get() * 1
    },
    portrait: {
        width: PixelRatio.get() * 25,
        height: PixelRatio.get() * 25
    },
    portraitText: {
        fontSize: 16,
        color: '#000000',
        marginTop: PixelRatio.get() * 3,
    },
    //每一行
    row: {
        flexDirection: 'row',
        height: PixelRatio.get() * 40,
    },
    //所有头像区
    portraitContainer: {
        flexDirection: 'column'
    }
});

//export default connect(information => information)(GameRoom);
export default connect(room => room)(GameRoom);