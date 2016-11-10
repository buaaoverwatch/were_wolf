/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, { Component } from 'react';
import {
    Text,
    View
} from 'react-native';
import Button from 'antd-mobile/lib/button';
import WhiteSpace from 'antd-mobile/lib/white-space';
import List from 'antd-mobile/lib/list';
import InputItem from 'antd-mobile/lib/input-item';
import WingBlank from 'antd-mobile/lib/wing-blank';
import Toast from 'antd-mobile/lib/toast';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import { createForm } from 'rc-form';

import {
    Actions
} from 'react-native-router-flux';

var username, password;
class Login extends Component {
    onClick(){
        var Regx = /(^[A-Za-z0-9]+$)/;
        if(!(username && password)) {
            Toast.fail("信息填写不完整！", 1);
            return;
        }
        //用户名是否符合规则
        if(username.length < 6 || username.length > 12) {
            Toast.fail("用户名长度错误！", 1);
            return;
        }
        if(Regx.test(username) == false) {
            Toast.fail("用户名格式错误!", 1);
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
        //http
        //clickhttp();
        Actions.tabbar();
    }
    clickhttp() {
        dispatch({
            type: './information/loadingTrue'
        });
        fetch('http://10.138.73.83:8000/login/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_name: username,
                password: password
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
                if(responseText.type == 1) {
                    Toast.fail("用户名不存在！", 1);
                    return responseText;
                } else if (responseText.type == 2) {
                    Toast.fail("密码错误！", 1);
                    return responseText;
                }
                Toast.success("登录成功！" + responseText.type,1);
                //TODO:这里服务器应该返回昵称和简介
                dispatch({
                    type: './information/loginSuccess',
                    payload: {
                        username: username,
                        nickname: 'nickname',
                        password: password,
                        introduce: 'introduce'
                    }
                });
                //这里应该有一个界面跳转
                Actions.tabbar();
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
    render() {
        const {getFieldProps} = this.props.form;
        return (
            <View style={{flex: 1}}>
                <List>
                    <InputItem
                        {...getFieldProps('loginusername', {
                            initialValue: '',
                            onChange(value){
                                username=value;
                            }
                        })}
                        clear
                        placeholder="输入你注册时的用户名"
                    >用户名</InputItem>
                    <InputItem
                        {...getFieldProps('loginpassword', {
                            initialValue: '',
                            onChange(value){
                                password=value;
                            }
                        })}
                        type="password"
                        clear
                        placeholder="输入你注册时的密码"
                    >密码</InputItem>
                </List>
                <WhiteSpace size="lg"/>
                <WingBlank>
                    <Button type="default" onClick={this.onClick.bind(this)}>登录</Button>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <WingBlank>
                    <Button type="default" >忘记密码</Button>
                </WingBlank>
                <WhiteSpace size="lg"/>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.props.loading}
                />
            </View>
        );
    }
}

Login = createForm()(Login);
module.exports = Login;