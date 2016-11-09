/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    Image
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

class Register extends Component {
    responseTest() {
        const data1 = {
            user_name: "lalala",
            nick_name: "啦啦啦",
            password: "abc123456",
            introduce: "我是狼王"
        };
        fetch('http://10.138.73.83:8000/register/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify(data1)
        })
            .then(function(data){
                console.log(data.text());
                return data;
            })
            .then((responseText) => {
                Toast.success("注册成功！" + responseText.type,1);
                Actions.tabbar();
                console.log(responseText);
            })
            .catch((error) => {
                console.warn(error);
            });
    }
    onClick(){
        var data = this.responseTest();
    }
    render() {
        const {getFieldProps} = this.props.form;
        return (
            <View style={{flex: 1}}>
                <List>
                    <InputItem
                        {...getFieldProps('registerusername', {
                            initialValue: ''
                        })}
                        clear
                        placeholder="6-12位字母或数字"
                    >用户名</InputItem>
                    <InputItem
                        {...getFieldProps('registernickname', {
                            initialValue: ''
                        })}
                        maxLength="10"
                        clear
                        placeholder="不超过10个字符"
                    >昵称</InputItem>
                    <InputItem
                        {...getFieldProps('registerpassword', {
                            initialValue: ''
                        })}
                        type="password"
                        clear
                        placeholder="******"
                    >密码</InputItem>
                    <InputItem
                        {...getFieldProps('registerintroduce', {
                            initialValue: ''
                        })}
                        maxLength="10"
                        clear
                        placeholder="不超过10个字符"
                    >昵称</InputItem>
                </List>
                <WhiteSpace size="lg"/>
                <WingBlank>
                    <Button type="default" color="'#000000" onClick={this.onClick.bind(this)}>注册</Button>
                </WingBlank>
                <WhiteSpace size="lg"/>
            </View>
        );
    }
}

Register = createForm()(Register);
module.exports = Register;