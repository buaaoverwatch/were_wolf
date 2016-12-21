/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    PixelRatio,
} from 'react-native';

import Toast from 'antd-mobile/lib/toast';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import { FormLabel, FormInput , Button} from 'react-native-elements'

import IP from '../consts/ip';

import {
    Actions
} from 'react-native-router-flux';

class Login extends Component {
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props);
        // 设置初始状态
        const {dispatch} = props;
        this.state = {
            username:"",
            password:"",
            en_login:false,
        };
        //this.getList = this.getList.bind(this);
    }

    onClick(){
        var Regx = /(^[A-Za-z0-9]+$)/;
        if(!(this.state.username && this.state.password)) {
            Toast.fail("信息填写不完整！", 1);
            return;
        }
        //用户名是否符合规则
        if(this.state.username.length < 6 || this.state.username.length > 12) {
            Toast.fail("用户名长度错误！", 1);
            return;
        }
        if(Regx.test(this.state.username) == false) {
            Toast.fail("用户名格式错误!", 1);
            return;
        }
        //密码是否符合规则
        if(this.state.password.length < 6 || this.state.password.length > 12) {
            Toast.fail("密码长度错误！", 1);
            return;
        }
        if(Regx.test(this.state.password) == false) {
            Toast.fail("密码格式错误！", 1);
            return;
        }
        //http
        this.clickhttp(this);
        //Actions.tabbar();
    }
    clickhttp(_this) {
        _this.props.dispatch({
            type: 'information/loadingTrue'
        });
        console.log(IP.ip+':8000/login/');
        fetch(IP.ip+':8000/login/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_name: this.state.username,
                password: this.state.password
            })
        })
            .then(function(data){
                return data.json();
            })
            .then((responseText) => {
                _this.props.dispatch({
                    type: 'information/loadingFalse'
                });
                if(responseText[0].type == 1) {
                    Toast.fail("用户名不存在！", 1);
                    return responseText;
                } else if (responseText[0].type == 2) {
                    Toast.fail("密码错误！", 1);
                    return responseText;
                } else if(responseText[0].type == 3) {
                    Toast.fail("用户已登录！", 1);
                    return responseText;
                }
                Toast.success("登录成功！",1);
                //TODO:这里服务器应该返回昵称和简介
                _this.props.dispatch({
                    type: 'information/loginSuccess',
                    payload: {
                        username: this.state.username,
                        nickname: responseText[0].nick,
                        password: this.state.password,
                        introduce: responseText[0].intro,
                        userID: responseText[0].id
                    }
                });
                //这里应该有一个界面跳转
                Actions.tabbar();
                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                _this.props.dispatch({
                    type: 'information/loadingFalse'
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }
    focusNextField = (nextField) => {
        this.refs.input.refs[nextField].focus();
    };
    render() {
        return (
            <View>
                <View>
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        用户名
                    </FormLabel>
                    <FormInput
                        ref='input'
                        textInputRef='user'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(username) => this.setState({username})}
                        value={this.state.username}
                        placeholder="输入你注册时的用户名"
                        returnKeyType="next"
                        clearTextOnFocus={true}
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.focusNextField('pass')}
                    />
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        密码
                    </FormLabel>
                    <FormInput
                        ref='input'
                        textInputRef='pass'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(password) => {
                            this.setState({password});
                            if(this.state.username!='' && password!='')
                            {
                                this.setState({en_login:true});
                            }
                            else
                            {
                                this.setState({en_login:false});
                            }
                        }}
                        value={this.state.password}
                        placeholder="输入你注册时的密码"
                        returnKeyType="done"
                        clearTextOnFocus={true}
                        secureTextEntry={true}
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.onClick()}
                    />
                </View>
                <View style={styles.Container}>
                    <Button
                        buttonStyle={styles.But}
                        large
                        iconRight
                        icon={{name: 'check'}}
                        title='登录'
                        onPress={()=>this.onClick()}
                        backgroundColor='#2db7f5'
                        disabled={!this.state.en_login}
                        raised={true}
                    />
                    <Button
                        buttonStyle={styles.But}
                        large
                        iconRight
                        icon={{name: 'edit'}}
                        title='忘记密码'
                        onPress={()=>this.onClick()}
                        backgroundColor='#fd661b'
                        raised={true}
                    />
                </View>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.props.loading}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    Container: {
        alignItems: 'center',
        height:300,
    },
    Label: {
        fontSize: PixelRatio.getPixelSizeForLayoutSize(15) ,
        color: '#272727',
    },
    Tex: {
        fontSize: PixelRatio.getPixelSizeForLayoutSize(10),
    },
    conStyle: {
        height: PixelRatio.getPixelSizeForLayoutSize(18),
    },
    But: {
        width: Dimensions.get('window').width*0.9,
        marginTop: 20,
    },
});

export default Login;