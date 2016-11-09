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


var CARoom = (props) => {
    const { dispatch, information } = props;
    const {getFieldProps} = props.form;

    function createRoom() {
        function timeout(ms) {
            return new Promise((resolve, reject) => {
                setTimeout(resolve, ms, 'done');
            });
        }

        dispatch({
            type: 'information/changeLoading'
        });

        timeout(1000).then((value) => {
            console.log(value);
            dispatch({
                type: 'information/changeLoading'
            });
            Actions.GameRoom();
        });

        // dispatch({
        //     type: 'information/createRoom'
        // });
        // Actions.GameRoom();
    }
    function responseTest() {
        fetch('https://mywebsite.com/endpoint/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                firstParam: 'yourValue',
                secondParam: 'yourOtherValue',
            })
        })
        .then(function(data){
            return data.text();
        })
        .then((responseText) => {
            console.log(responseText);
        })
        .catch((error) => {
            console.warn(error);
        });
    }
    function addRoom() {
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
        dispatch({
            type: 'information/changeRoomID',
            payload: roomID
        });
        Actions.GameRoom();
    }
    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    创建/加入房间
                </Text>
            </View>
            <Button type="primary" onClick={createRoom.bind(this)} style={styles.createButton} >
                创建房间
            </Button>
            <View style={styles.addButton}>
                <InputItem
                    {...getFieldProps('roomID', {
                        initialValue: '',
                        onChange(text){
                            roomID=text;
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