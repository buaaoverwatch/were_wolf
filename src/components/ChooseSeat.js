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


const ChooseSeat = (props) => {
    const {dispatch,room} = props;
    var Views = [];
    function addRow(n){
        var row = [];
        //此处设置onpress事件用于修改state中的值
        for(let i = n;i<n+4&&i<room.player_num;i++){
            row.push(
                <TouchableOpacity key={i} onPress = {() => setMySeat(i)}>
                    <View  style={styles.single} >
                        <Image source={require('../images/wolf.png')} style={styles.portrait} />
                        <Text style={styles.portraitText}>
                            此座位无人
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
    function setMySeat(n)//用于修改state中的myseat变量，将myseat设置为选定的值
    {
        dispatch({
           type:'room/changemyseat',
           payload:n,
        });
        dispatch({
            type:'room/changechooseseatloding',
            payload:true,
        });
        if(socket!=null)
            room.socket.send({"type":"2",
                                "request_id":"asdas",
                                "room_id":room.room_id,
                                "user_id":room.client_id,
                                "seat":n});
        else
        {
            Socket.handlesocket();
            room.socket.send({"type":"2",
                "request_id":"asdas",
                "room_id":room.room_id,
                "user_id":room.client_id,
                "seat":n});
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
                    <TouchableOpacity onPress={Actions.GameSetting}>
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
                    <ActivityIndicator
                        toast
                        text="等待服务器"
                        animating={room.loading}
                    />
                </ScrollView>

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













