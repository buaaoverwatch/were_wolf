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
    Image
} from 'react-native';

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
    const { dispatch, information } = props;
    const {getFieldProps} = props.form;

    function createRoom() {
        if(!roomName) {
            Toast.fail("房间名输入错误！", 1);
            return;
        }
        function timeout(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms, 'done');
            });
        }

        dispatch({
            type: 'information/loadingTrue'
        });

        timeout(1000).then((value) => {
            console.log(value);
            dispatch({
                type: 'information/loadingFalse'
            });
            Actions.GameRoom();
        });

        // dispatch({
        //     type: 'information/createRoom'
        // });
        // Actions.GameRoom();
    }
    function createclickhttp() {
        dispatch({
            type: './information/loadingTrue'
        });
        fetch('http://10.138.73.83:8000/create/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id: information.userID,
                room_name: information.roomName,
            })
        })
            .then(function(data){
                console.log(data.text());
                return data;
            })
            .then((responseText) => {
                dispatch({
                    type: './information/loadingFalse'
                });
                if(responseText.result == 1) {
                    Toast.fail("创建房间失败！", 1);
                    return responseText;
                }
                Toast.success("创建房间成功！" + responseText.result,1);
                dispatch({
                    type: './information/createRoomSuccess',
                    payload: {
                        roomID: responseText.number,
                        roomName: roomName
                    }
                });
                //这里应该有一个界面跳转
                Actions.GameRoom();
                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                dispatch({
                    type: './information/loadingFalse'
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }
    function addRoom() {
        if(!roomID || roomID.length != 4) {
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
        dispatch({
            type: 'information/changeRoomID',
            payload: roomID
        });
        Actions.GameRoom();
    }
    function addclickhttp() {
        dispatch({
            type: './information/loadingTrue'
        });
        fetch('http://10.138.73.83:8000/join/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id: information.userID,
                room_id: information.roomID,
            })
        })
            .then(function(data){
                console.log(data.text());
                return data;
            })
            .then((responseText) => {
                dispatch({
                    type: './information/loadingFalse'
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
                Toast.success("加入房间成功！" + responseText.result,1);
                dispatch({
                    type: './information/addRoomSuccess',
                    payload: {
                        roomID: roomID,
                        roomName: responseText.roomName
                    }
                });
                //这里应该有一个界面跳转
                Actions.GameRoom();
                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                dispatch({
                    type: './information/loadingFalse'
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
                >房间号</InputItem>
                <Button type="primary" onClick={createRoom.bind(this)}>
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
                    placeholder="请输入四位房间号码"
                >房间号</InputItem>
                <Button type="primary" onClick={addRoom}>
                    加入房间
                </Button>
            </View>
            <ActivityIndicator
                toast
                text="正在加载"
                animating={information.loading}
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
export default connect(information => information)(CARoom);