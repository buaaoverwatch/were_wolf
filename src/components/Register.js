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
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import { createForm } from 'rc-form';
import {
    Actions
} from 'react-native-router-flux';


var username, nickname, password, introduce;
class Register extends Component {
    clickhttp() {
        dispatch({
            type: './information/loadingTrue'
        });
        // const data1 = {
        //     user_name: "lalala",
        //     nick_name: "啦啦啦",
        //     password: "abc123456",
        //     introduce: "我是狼王"
        // };
        fetch('http://10.138.73.83:8000/register/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_name: username,
                nick_name: nickname,
                password: password,
                introduce: introduce
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
                    Toast.fail("用户名已存在！", 1);
                    return responseText;
                } else if (responseText.type == 2) {
                    Toast.fail("网络请求错误！", 1);
                    return responseText;
                }
                Toast.success("注册成功！请登录。" + responseText.type,1);
                dispatch({
                    type: './information/registerSuccess',
                    payload: {
                        username: username,
                        nickname: nickname,
                        password: password,
                        introduce: introduce
                    }
                });
                //这里应该有一个界面跳转
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
    onClick(){
        var Regx = /(^[A-Za-z0-9]+$)/;
        if(!(username && nickname && password && introduce)) {
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
        //
        //http
        //clickhttp();
        //direct
        Actions.tabbar();
    }
    render() {
        const {getFieldProps} = this.props.form;
        return (
            <View style={{flex: 1}}>
                <List>
                    <InputItem
                        {...getFieldProps('registerusername', {
                            initialValue: '',
                            onChange(value) {
                                username = value;
                            }
                        })}
                        clear
                        maxLength="12"
                        placeholder="6-12位字母或数字"
                    >用户名</InputItem>
                    <InputItem
                        {...getFieldProps('registernickname', {
                            initialValue: '',
                            onChange(value) {
                                nickname = value;
                            }
                        })}
                        maxLength="10"
                        clear
                        placeholder="不超过10个字符"
                    >昵称</InputItem>
                    <InputItem
                        {...getFieldProps('registerpassword', {
                            initialValue: '',
                            onChange(value) {
                                password = value;
                            }
                        })}
                        type="password"
                        clear
                        placeholder="6-12位字母或数字"
                    >密码</InputItem>
                    <InputItem
                        {...getFieldProps('registerintroduce', {
                            initialValue: '',
                            onChange(value) {
                                introduce = value;
                            }
                        })}
                        maxLength="20"
                        clear
                        placeholder="不超过20个字符"
                    >简介</InputItem>
                </List>
                <WhiteSpace size="lg"/>
                <WingBlank>
                    <Button type="default" color="'#000000" onClick={this.onClick.bind(this)}>注册</Button>
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

Register = createForm()(Register);
module.exports = Register;