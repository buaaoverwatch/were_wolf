/**
 * Created by Qingchang Han on 2016/11/1.
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
import List from 'antd-mobile/lib/list';
import InputItem from 'antd-mobile/lib/input-item';
import { createForm } from 'rc-form';

var nickname, introduce;
var EditInfo = (props) => {
    const { dispatch, information } = props;
    const {getFieldProps} = props.form;
    function click() {
        if(nickname) {
            dispatch({
                type: 'information/changeNickname',
                payload: nickname
            });
        }
        if(introduce) {
            dispatch({
                type: 'information/changeIntroduce',
                payload: introduce
            });
        }
        //TODO:发送http请求
        Actions.pop();
    }
    function responseTest() {
        fetch('https://mywebsite.com/endpoint/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userID: information.userID,
                nickname: information.nickname,
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
                    编辑个人资料
                </Text>
                <TouchableOpacity onPress={click}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>
                            保存
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            <List>
                <InputItem
                    value={information.username}
                    editable={false}
                >用户名</InputItem>
                <InputItem
                    {...getFieldProps('nickname', {
                        initialValue: '',
                        onChange(value){
                            nickname=value;
                        }
                    })}
                    clear={true}
                    placeholder={information.nickname}
                >昵称</InputItem>
                <InputItem
                    {...getFieldProps('introduce', {
                        initialValue: '',
                        onChange(value){
                            introduce=value;
                        }
                    })}
                    clear={true}
                    placeholder={information.introduce}
                >简介</InputItem>
            </List>
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
        width: PixelRatio.get() * 18,
        alignItems: 'center'
    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    }
});

EditInfo = createForm()(EditInfo);
export default connect(information => information)(EditInfo);