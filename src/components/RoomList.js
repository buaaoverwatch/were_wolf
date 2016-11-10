import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image
} from 'react-native';

import { List, ListItem } from 'react-native-elements'

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';

//此处应有一个fetch到的房间列表
import Card from 'antd-mobile/lib/card';
import WingBlank from 'antd-mobile/lib/wing-blank';
import WhiteSpace from 'antd-mobile/lib/white-space';



const RoomList = (props) => {
    const { dispatch, ALLROOM } = props;
    var n = 0;
    function getRoomList(i) {
        var roomname = '房间名:'+i.room_name;
        var roomid = '房间号:'+i.room_id;
        var roomholder = '房主名:'+i.room_holder;
        var gamestate = '进行到第'+i.nights+'夜';
        return (
            <TouchableOpacity key={n++} onPress={Actions.GameSetting}>
                <WingBlank size="lg">
                    <WhiteSpace size="lg" />
                    <Card>
                        <Card.Header
                            title={roomname}
                            extra={roomid}
                        />
                        <Card.Body>
                            <Text>{roomholder}</Text>
                        </Card.Body>
                        <Card.Footer content="当前游戏状态" extra={gamestate} />
                    </Card>
                    <WhiteSpace size="lg" />
                </WingBlank>
            </TouchableOpacity>
        ) ;
    }
    var room_list = [];
    for(let i = 0; i < ALLROOM.roomlist.length; i++) {
        room_list.push(getRoomList(ALLROOM.roomlist[i]));
    }
    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    当前正在游戏的房间：
                </Text>
            </View>
            {room_list}
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
        justifyContent: 'center'
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
        width: PixelRatio.get() * 18,
        alignItems: 'center'
    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    }
});


export default connect(ALLROOM => ALLROOM)(RoomList);