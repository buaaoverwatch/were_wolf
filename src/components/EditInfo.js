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
import Toast from 'antd-mobile/lib/toast';
import { createForm } from 'rc-form';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';

var nickname;
var password;
var introduce;
var EditInfo = (props) => {
    const { dispatch, information } = props;
    const {getFieldProps} = props.form;
    function click() {
        var Regx = /(^[A-Za-z0-9]+$)/;
        if(!(nickname && password && introduce)) {
            Toast.fail("信息填写不完整！", 1);
            return;
        }
        //密码是否符合规则
        if(password.length < 6 || password > 12) {
            Toast.fail("密码长度错误！", 1);
            return;
        }
        if(Regx.test(password) == false) {
            Toast.fail("密码格式错误！", 1);
            return;
        }
        //TODO:发送http请求
        clickhttp();
        //Actions.pop();
    }
    function clickhttp() {
        dispatch({
            type: 'information/loadingTrue'
        });
        fetch('http://10.138.73.83:8000/updataInfo/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id: information.userID,
                nick_name: nickname,
                password: password,
                intro: introduce
            })
        })
            .then(function(data){
                return data.json();
            })
            .then((responseText) => {
                console.log(responseText);
                dispatch({
                    type: 'information/loadingFalse'
                });
                if(responseText.result == 1) {
                    Toast.fail("修改失败！", 1);
                    Actions.pop();
                    return responseText;
                }
                Toast.success("修改成功！",1);
                dispatch({
                    type: 'information/editSuccess',
                    payload: {
                        nickname: nickname,
                        password: password,
                        introduce: introduce
                    }
                });
                //这里应该有一个界面跳转
                Actions.pop();
                return responseText;
            })
            .catch((error) => {
                dispatch({
                    type: 'information/loadingFalse'
                });
                Toast.fail("网络错误！", 1);
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
                    maxLength="10"
                    clear={true}
                    placeholder={information.nickname}
                >昵称</InputItem>
                <InputItem
                    {...getFieldProps('password', {
                        initialValue: '',
                        onChange(value){
                            password=value;
                        }
                    })}
                    type="password"
                    maxLength="12"
                    clear={true}
                    placeholder="输入新密码,6-12位字母或数字"
                >密码</InputItem>
                <InputItem
                    {...getFieldProps('introduce', {
                        initialValue: '',
                        onChange(value){
                            introduce=value;
                        }
                    })}
                    maxLength="20"
                    clear={true}
                    placeholder={information.introduce}
                >简介</InputItem>
            </List>
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