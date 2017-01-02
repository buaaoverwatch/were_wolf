import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    Animated,
    PixelRatio,
    Dimensions,
    AsyncStorage,
} from 'react-native';
import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Button from 'antd-mobile/lib/button';
import Toast from 'antd-mobile/lib/toast';
import Orientation from 'react-native-orientation';

import IP from '../consts/ip';

class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0), // init opacity 0
        };
        this.login = this.login.bind(this);
    }
    componentWillMount() {
        const fun=this.login;
        AsyncStorage.getItem('if_login', function (error, result) {
            if(error) {
                console.log(error);
                return;
            }
            if(result=='1')
            {
                AsyncStorage.multiGet(['username','password'], function (error, result) {
                    if(error) {
                        console.log(error);
                        return;
                    }
                    let u=result[0][1];
                    let p=result[1][1];
                    fun(u,p);
                });
            }
        });
    }
    componentDidMount() {
        Animated.timing(          // Uses easing functions
            this.state.fadeAnim, {
                toValue: 1,
                duration: 1000
            },           // Configuration
        ).start();                // Don't forget start!
        Orientation.lockToPortrait();
    }
    login(username,password) {
        console.log(IP.ip+':8000/login/');
        fetch(IP.ip+':8000/login/', {
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
                return data.json();
            })
            .then((responseText) => {
                if(responseText[0].type == 1) {
                    Toast.fail("用户名不存在！", 1);
                    return responseText;
                } else if (responseText[0].type == 2) {
                    Toast.fail("密码错误！", 1);
                    return responseText;
                } else if(responseText[0].type == 3) {
                    Toast.fail("用户已登录！", 1);//TODO：这里做登录处理
                    return responseText;
                }
                Toast.success("登录成功！",1);
                //TODO:这里服务器应该返回昵称和简介
                this.props.dispatch({
                    type: 'information/loginSuccess',
                    payload: {
                        username: username,
                        nickname: responseText[0].nick,
                        password: password,
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
    render() {
        return (
            <View style={styles.container}>
                <Animated.Image
                    source={require('../images/background.jpg')} style={[styles.img, {opacity: this.state.fadeAnim}]}>
                    <Button type="primary" onClick={Actions.Launch} style={styles.button}>注册/登录</Button>
                </Animated.Image>
            </View>
        );
    }
}

export default connect(information => information)(Start);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  img: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height+PixelRatio.get()*15,
    resizeMode: 'contain',
    paddingTop: PixelRatio.get() * 120,
      justifyContent: 'center',
      alignItems: 'center'
  },
  button: {
      backgroundColor: 'transparent',
      width: PixelRatio.get() * 80,
      borderColor: '#ffffff'
  }
});
