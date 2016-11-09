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
import { createForm } from 'rc-form';

import {
    Actions
} from 'react-native-router-flux';

var username, password;
class Login extends Component {
    onClick(){
        if(username && password) {
            Toast.success("注册成功！", 1);
            this.props.dispatch({
                type: 'information/register',
                payload:{
                    username: username,
                    password: password
                }
            });
            Actions.tabbar();
        }
        else {
            Toast.fail("输入错误！", 1);
        }
    }
    responseTest() {
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
            </View>
        );
    }
}

Login = createForm()(Login);
module.exports = Login;