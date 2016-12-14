'use-strict';
import React, { Component } from 'react';
import {
    Alert,
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
} from 'react-native';



import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';

import Socket from  '../services/websocket';
/*
 这个应该是：如果自己是房主，一号位置显示自己的头像，不能选择其他座位
 其他人选择了头像则在界面上显示
 如果自己不是房主，一号位置显示房主头像，自己选择座位，同时其他人选择了座位也在面板上更新
 */

var alertMessage = '请选择您的座位！';
var alertMessage1 = '服务器连接失败';
var alertMessage2 = '请提醒他们选择自己的座位！';
var alertMessage3 = '请不要选择其他座位';
const ChooseSeat = (props) => {
    const {dispatch,room} = props;
    const p1 = require('../images/head_portrait.jpg');
    const p2 = require('../images/person.png');
    const p3 = require('../images/wolf.png');
    var Views = [];
    //这个的数据源有点问题
    //首先playerid和nick和avatar都是创建游戏之后就有了的。
    //然后我要把房主的设置为1号，并打印在界面上，然后每当选择了之后就更新，也就是我需要一个默认值
    //model中初始化player_index中的键都为初始默认值，初始默认值对应一个nick，对应一个avatar
    //key = i , setmyseat i+1,getnick he ava 都是i
    //
    function addRow(n){
        var row = [];
        console.log("addrow be called:"+n);
        for(let i = n;i<n+4&&i<room.player_num;i++){

            row.push(
                <TouchableOpacity key={i} onPress = {() => setMySeat(i+1)}>
                    <View  style={styles.single} >
                        <Image source={require('../images/person.png')} style={styles.portrait} />
                        <Text style={styles.portraitText}>
                            {getPlayerNick(i+1)}
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
    //youdianwenti
    function getPlayerAvatar(i){

        if(i===0)
            return p1;//一个存了房主照片的文件
        else
        {
            if(room.index_player[i]==="")//如果这个index还没有人的话
                return p2;//某张默认头像的地址
            else
                return p3;

        }
    }
    function getPlayerNick(i){
        console.log('p_in');
        console.log(room.player_index);

        console.log('in_p');
        console.log(room.index_player);
        if(i===1)
            return room.player_nick[room.owner_id];
        else
        {
            if(room.index_player[i]==="")
                return "这个座位没有人";
            else
                return room.player_nick[room.index_player[i]];
        }

    }
    //这个是用来存放所有用户头像的东西，这个倒是没有什么问题
    function Seats(){
        Views = [];
        console.log('room.player_num:'+room.player_num);
        console.log('room.index_player:'+room.index_player);
        console.log(room.index_player);
        console.log('room.player_nick:'+room.player_nick);
        console.log(room.player_nick);
        for(let i = 0; i < room.player_num; i = i+4){
            console.log('addrow:'+i);
            Views.push(addRow(i));

        }
        return (
            <View style={styles.portraitContainer}>
                {Views}
            </View>
        );

    }
    function setMySeat(n) {
        if(n===1)
        {
            //alert
            return ;
        }
        if(room.client_id===room.owner_id)
        {
            Alert.alert('房主默认一号位置',
                alertMessage3,
                [
                    {text: '好的', onPress: () => console.log('OK Pressed!')},

                ]);
            return ;
        }
        dispatch({
            type:'room/changeloading',
            payload:true,
        });
        if(room.hassocket) {
            let msg = JSON.stringify({
                type:"2",
                request_id:room.user_request_id.toString(),
                room_id:room.room_id,
                user_id:room.client_id,
                seat:n.toString(),

            });
            room.socket.send(msg);
        }
        else {
            Alert.alert('没有socket',
                alertMessage1,
                [
                    {text: '好的', onPress: () => console.log('OK Pressed!')},

                ]);
            dispatch({
                type:'room/changeloading',
                payload:false,
            });
        }
    }
    function checkSeat(){

            dispatch({
                type:'room/setplayerindex',
                payload:{
                    u_id:room.owner_id,
                    seat:'1',
                },
            });

            dispatch({
                type:'room/playerindex2indexplayer',
                payload:{
                    u_id:room.owner_id,
                    seat:1,
                },
            });

        if(room.player_index[room.client_id]!=null)//如果已经选座
        {
            if(room.client_id===room.owner_id)//如果是房主
            {
                //todo 判断是否所有人都选了座位
                let i = 1;
                console.log('leght:');
                console.log(room.player_index.length);
                for(;i<=room.player_num;i++)
                {
                    console.log('i:::::'+i);
                    console.log(room.player_index[room.player_id[i-1]]);
                    if(room.index_player[i]==="")
                    {
                        break;
                    }

                }
                console.log(i);

                if(i === room.player_num+1)
                    Actions.GameSetting();
                else
                {
                    Alert.alert('还有人未选座！',
                        alertMessage2,
                        [
                            {text: '好的', onPress: () => console.log('下一步123456OK Pressed!')},

                        ]);
                }//todo :  alert
            }
            else//不是房主
            {
                dispatch({
                    type:'room/changeloading',
                    payload:true,
                });
                //等待服务器返回消息，等待房主设置游戏，直到返回角色分配

            }
        }

        else {
            Alert.alert(
                '请选择座位！',
                alertMessage,
                [
                    {text: '好的', onPress: () => console.log('OK Pressed!')},
                ]
            )
        }
    }



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
                <TouchableOpacity onPress={checkSeat}>
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













