'use-strict';
import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';



import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';

import Socket from '../services/websocket';
/*
 这个应该是：如果自己是房主，一号位置显示自己的头像，不能选择其他座位
 其他人选择了头像则在界面上显示
 如果自己不是房主，一号位置显示房主头像，自己选择座位，同时其他人选择了座位也在面板上更新
 */
const ChooseSeat = (props) => {
    const {dispatch,room} = props;
    var Views = [];
    //这个的数据源有点问题
    //首先playerid和nick和avatar都是创建游戏之后就有了的。
    //然后我要把房主的设置为1号，并打印在界面上，然后每当选择了之后就更新，也就是我需要一个默认值
    //model中初始化player_index中的键都为初始默认值，初始默认值对应一个nick，对应一个avatar
    function addRow(n){
        var row = [];

        for(let i = n;i<n+4&&i<room.player_num;i++){

            row.push(
                <TouchableOpacity key={i} onPress = {() => setMySeat(i)}>
                    <View  style={styles.single} >
                        <Image source={require(getPlayerAvatar(i))} style={styles.portrait} />
                        <Text style={styles.portraitText}>
                            {getPlayerNick(i)}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        }
        return (
            <View key = {n} style = {styles.row}>
                {row}
            </View>
        );


    }
    function getPlayerAvatar(i){
        if(i===0)
            return '../images/head_portrait.jpg';//一个存了房主照片的文件
        else
        {
            if(index_player[i]=="null")//如果这个index还没有人的话
                return '../images/person.png';//某张默认头像的地址
            else
                return '../images/wolf.png';

        }
    }
    function getPlayerNick(i){
        if(i===0)
            return player_nick[owner_id];
        else
        {
            if(index_player[i]=="null")
                return "这个座位没有人";
            else
                return player_nick[index_player[i]];
        }

    }
    //这个是用来存放所有用户头像的东西，这个倒是没有什么问题
    function Seats(){
        Views = [];
        for(let i = 0; i < room.player_num; i = i+4){
            Views.push(addRow(i));
        }
        return (
            <View style={styles.portraitContainer}>
                {Views}
            </View>
        );

    }
    function setMySeat(n)
    {
        if(n===0)
        {
            return ;
        }
        dispatch({
            type:'room/changemyseat',
            payload:n,
        });
        dispatch({
            type:'room/changechooseseatloading',
            payload:true,
        });//设置loading为true
        //以下进行与后台的通信

        if(socket!=null)
            room.socket.send({"type":"2",
                "request_id":"asdas",
                "room_id":room.room_id.toString(),
                "user_id":room.client_id.toString(),
                "seat":n.toString()});
        else
        {
            Socket.handlesocket();
            room.socket.send({"type":"2",
                "request_id":"asdas",
                "room_id":room.room_id.toString(),
                "user_id":room.client_id.toString(),
                "seat":n.toString()});
        }
    }
    function checkSeat(){
        if(player_index[client_id]!=null)
            Actions.GameSetting();
        else
            Alert.alert(
                '请选择座位！',
                alertMessage,
                [
                    {text: '好的', onPress: () => console.log('OK Pressed!')},
                ]
            )
    }


    //todo 修改opacity的action
    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <TouchableOpacity onPress={Actions.pop}>
                    <View style={styles.backContainer}>
                        <Image style={styles.backIcon}
                               source={require('../images/back.png')}/>
                        <Text style={styles.backText}>
                            返回
                        </Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    顺时针选择座位
                </Text>
                <TouchableOpacity onPress={checkSeat()}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>
                            下一步
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <ScrollView style={{flex: 1, backgroundColor: '#f5f5f9'}}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
            >
                {Seats()}

            </ScrollView>
            <ActivityIndicator
                toast
                text="等待服务器"
                animating={room.loading}
            />
        </View>

    );


}  ;



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
        width: PixelRatio.get() * 25,
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

export default connect(room => room)(ChooseSeat);













