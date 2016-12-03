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
    AsyncStorage
} from 'react-native';

import IP from '../consts/ip';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Button from 'antd-mobile/lib/button';
import InputItem from 'antd-mobile/lib/input-item';
import Toast from 'antd-mobile/lib/toast';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import { createForm } from 'rc-form';

var roomID;
var roomName;

var CARoom = (props) => {
    const { dispatch, room } = props;
    const {getFieldProps} = props.form;
    var userID = "", username = "";

    function createRoom() {
        if(userID == "" || username == "") {
            AsyncStorage.getItem('userID', function (error, result) {
                if(error) {
                    console.log(error);
                    return;
                }
                console.log("result: " + result);
                userID = result;
            });
            AsyncStorage.getItem('username', function (error, result) {
                if(error) {
                    console.log(error);
                    return;
                }
                console.log("result: " + result);
                username = result;
                dispatch({
                    type: 'room/setuserinfo',
                    payload: {
                        userID: userID,
                        username: username
                    }
                });
                console.log("id1: " + room.client_id);
                console.log("name1: " + room.username);
                if(!roomName) {
                    Toast.fail("房间名输入错误！", 1);
                    return;
                }
                createclickhttp();
            });
            return;
        }
        if(!roomName) {
            Toast.fail("房间名输入错误！", 1);
            return;
        }
        // function timeout(ms) {
        //     return new Promise((resolve, reject) => {
        //         setTimeout(resolve, ms, 'done');
        //     });
        // }
        //
        // dispatch({
        //     type: 'information/loadingTrue'
        // });
        //
        // timeout(1000).then((value) => {
        //     console.log(value);
        //     dispatch({
        //         type: 'information/loadingFalse'
        //     });
             //Actions.GameRoom();
        // });
        createclickhttp();
    }
    function createclickhttp() {
        dispatch({
            type: 'room/showLoading'
        });
        fetch(IP.ip+':8000/create/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id: userID.toString(),
                room_name: roomName,
            })
        })
            .then(function(data){
                return data.json();
            })
            .then((responseText) => {
                dispatch({
                    type: 'room/hideLoading'
                });
                if(responseText.result == 1) {
                    Toast.fail("创建房间失败！", 1);
                    return responseText;
                }
                Toast.success("创建房间成功！", 1);
                dispatch({
                    type: 'room/createRoomSuccess',
                    payload: {
                        roomID: responseText.number,
                        roomName: roomName,
                        ownerID: props.room.client_id
                    }
                });
                //这里应该有一个界面跳转
                Actions.GameRoom();
                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                dispatch({
                    type: 'room/hideLoading'
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }
    function addRoom() {
        if(userID == "" || username == "") {
            AsyncStorage.getItem('userID', function (error, result) {
                if(error) {
                    console.log(error);
                    return;
                }
                userID = result;
            });
            AsyncStorage.getItem('username', function (error, result) {
                if(error) {
                    console.log(error);
                    return;
                }
                username = result;
                dispatch({
                    type: 'room/setuserinfo',
                    payload: {
                        userID: userID,
                        username: username
                    }
                });
                if(!roomID) {
                    Toast.fail("输入房间号码错误！", 1);
                    return;
                }
                addclickhttp();
            });
            return;
        }
        if(!roomID) {
            Toast.fail("输入房间号码错误！", 1);
            return;
        }
        // dispatch({
        //     type: 'information/changeLoading'
        // });
        // dispatch({
        //     type: 'information/addRoom',
        //     payload: roomID,
        // });
        // dispatch({
        //     type: 'information/changeRoomID',
        //     payload: roomID
        // });
         //Actions.GameRoom();
        addclickhttp();
    }
    function addclickhttp() {
        dispatch({
            type: 'room/showLoading'
        });
        fetch(IP.ip+':8000/join/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id: userID.toString(),
                room_id: roomID.toString(),
            })
        })
            .then(function(data){
                return data.json();
            })
            .then((responseText) => {
                dispatch({
                    type: 'room/hideLoading'
                });
                if(responseText.result == 1) {
                    Toast.fail("房间不存在！", 1);
                    return responseText;
                } else if (responseText.result == 2) {
                    Toast.fail("房间人数已满！", 1);
                    return responseText;
                } else if(responseText.result == 3) {
                    Toast.fail("未知错误！", 1);
                    return responseText;
                }
                Toast.success("加入房间成功！", 1);
                dispatch({
                    type: 'room/addRoomSuccess',
                    payload: {
                        roomID: roomID,
                        roomName: responseText.room_name,
                        ownerID: responseText.owner_id
                    }
                });
                dispatch({
                    type: 'room/joinroom',
                    payload: responseText.id_nick
                });
                //这里应该有一个界面跳转
                Actions.GameRoom();
                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                dispatch({
                    type: 'room/hideLoading'
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }

    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    创建/加入房间
                </Text>
            </View>
            <View style={styles.createButton}>
                <InputItem
                    {...getFieldProps('roomName', {
                        initialValue: '',
                        onChange(value){
                            roomName=value;
                        }
                    })}
                    maxLength="20"
                    clear
                    placeholder="起个名字吧"
                >房间名</InputItem>
                <Button type="primary" onClick={createRoom}>
                    创建房间
                </Button>
            </View>
            <View style={styles.addButton}>
                <InputItem
                    {...getFieldProps('roomID', {
                        initialValue: '',
                        onChange(value){
                            roomID=value;
                        }
                    })}
                    type="number"
                    maxLength="4"
                    clear
                    placeholder="请输入一至四位房间号码"
                >房间号</InputItem>
                <Button type="primary" onClick={addRoom}>
                    加入房间
                </Button>
            </View>
            <ActivityIndicator
                toast
                text="正在加载"
                animating={room.loading}
            />
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
    createButton: {
        marginTop: PixelRatio.get() * 30,
    },
    addButton: {
        marginTop: PixelRatio.get() * 30,
    }
});

CARoom = createForm()(CARoom);
export default connect(room => room)(CARoom);