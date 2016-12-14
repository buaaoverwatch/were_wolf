import React, { Component } from 'react';
import {
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

import { List, ListItem } from 'react-native-elements';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';

//此处应有一个fetch到的房间列表
import Card from 'antd-mobile/lib/card';
import WingBlank from 'antd-mobile/lib/wing-blank';
import WhiteSpace from 'antd-mobile/lib/white-space';
import Toast from 'antd-mobile/lib/toast';
import Button from 'antd-mobile/lib/button';

import IP from '../consts/ip';

const RoomList = (props) => {
    const { dispatch, ALLROOM } = props;
    var n = 0;
    function createhttp(){
        dispatch({
            type:'ALLROOM/showloading'
        });
        fetch(IP.ip+':8000/getRoomList/',{
            method:'POST',
            header:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({})

        })

            .then(function(data){
                return data.json();
            })
            .then((responseText)=>{
                dispatch({
                    type:'ALLROOM/hideloading'
                });
                Toast.success("获取了当前所有房间！",1);
                console.log(responseText);
                dispatch({
                    type:'ALLROOM/setRoomList',
                    payload:responseText
                });
                return responseText;
            })
            .catch((error)=>{
                dispatch({
                    type:'ALLROOM/hideloading'
                });
                console.warn(error);
                Toast.fail("网络错误",1);
            });
    }

    function refreshlist() {
        createhttp();
    }
    function createlist(){
        var room_list = [];
        for(let i = 0; i < props.ALLROOM.roomlist.length; i++) {
            room_list.push(getRoom(props.ALLROOM.roomlist[i]));
        }
        return room_list;
    }

    function getRoom(i) {//todo 把card修改为list
        var roomname = i.name;
        var roomid = "NO."+i.id;
        var roomownernick = i.owner_name+"的房间";

        return (
            <TouchableOpacity key={n++} onPress={Actions.GameSetting}>
                <WingBlank size="lg">
                    <WhiteSpace size="lg" />
                    <Card>
                        <Card.Header
                            title={roomid}
                        />
                        <Card.Body>
                            <Text>{roomname}</Text>
                        </Card.Body>
                        <Card.Footer content={roomownernick} />
                    </Card>
                    <WhiteSpace size="lg" />
                </WingBlank>
            </TouchableOpacity>
        ) ;
    }


    return (
        <View style={{flex:1,backgroundColor: '#ebebeb'}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    当前正在游戏的房间
                </Text>
            </View>
            <Button onClick={refreshlist}>刷新房间列表</Button>
            <ScrollView style={styles.RoomList}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}>
            {createlist()}
            </ScrollView>
            <ActivityIndicator
                toast
                text="正在加载"
                animating={ALLROOM.loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
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
    },
    RoomList:{
        marginBottom: PixelRatio.get() * 26,
    },
});


export default connect(ALLROOM => ALLROOM)(RoomList);