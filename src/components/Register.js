/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    ScrollView,
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

class Register extends Component {
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props);
        // 设置初始状态
        this.state = {
            username:"",
            nickname:"",
            password:"",
            introduce:"",
            question:"",
            answer:"",
            en_register:false,
        };
        //this.getList = this.getList.bind(this);
    }
    clickhttp(_this) {
        _this.props.dispatch({
            type: 'information/loadingTrue'
        });
        fetch(IP.ip+':8000/register/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_name: this.state.username,
                nick_name: this.state.nickname,
                password: this.state.password,
                introduce: this.state.introduce,
                question: this.state.question,
                answer: this.state.answer,
            })
        })
            .then(function(data) {
                return data.json();
            })
            .then((responseText) => {
                console.log(responseText);
                _this.props.dispatch({
                    type: 'information/loadingFalse'
                });
                const type = responseText[0].type;
                if(type == 1) {
                    Toast.fail("用户名已存在！", 1);
                    return responseText;
                } else if (type == 2) {
                    Toast.fail("网络请求错误！", 1);
                    return responseText;
                }
                Toast.success("注册成功！请登录。", 1);
                _this.props.dispatch({
                    type: 'information/registerSuccess',
                    payload: {
                        username: this.state.username,
                        nickname: this.state.nickname,
                        password: this.state.password,
                        introduce: this.state.introduce,
                        userID: responseText[0].id
                    }
                });
                //这里应该有一个界面跳转
                Actions.tabbar();
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
    onClick(){
        var Regx = /(^[A-Za-z0-9]+$)/;
        if(!(this.state.username && this.state.nickname && this.state.password && this.state.introduce && this.state.question && this.state.answer)) {
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
        //
        //http
        this.clickhttp(this);
        //direct
        //Actions.tabbar();
    }

    focusNextField = (nextField) => {
        this.refs.input.refs[nextField].focus();
    };
    render() {
        return (
            <ScrollView >
                <View>
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        用户名
                    </FormLabel>
                    <FormInput
                        ref='test'
                        textInputRef='a'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(username) => {
                            this.setState({username});
                            if(username!='' && this.state.password!=''
                                && this.state.nickname!='' && this.state.introduce!=''
                                && this.state.question!='' && this.state.answer!=''
                            )
                            {
                                this.setState({en_register:true});
                            }
                            else
                            {
                                this.setState({en_register:false});
                            }
                        }}
                        value={this.state.username}
                        placeholder="6-12位字母或数字"
                        maxLength={12}
                        returnKeyType="next"
                        clearTextOnFocus={true}
                        keyboardType="email-address"
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.refs.test.refs.b.focus()}
                    />
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        昵称
                    </FormLabel>
                    <FormInput
                        ref='test'
                        textInputRef='b'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(nickname) => {
                            this.setState({nickname});
                            if(this.state.username!='' && this.state.password!=''
                                && nickname!='' && this.state.introduce!=''
                                && this.state.question!='' && this.state.answer!=''
                            )
                            {
                                this.setState({en_register:true});
                            }
                            else
                            {
                                this.setState({en_register:false});
                            }
                        }}
                        value={this.state.nickname}
                        placeholder="不超过十个字符,可以是中文"
                        maxLength={10}
                        returnKeyType="next"
                        clearTextOnFocus={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.refs.form.refs.c.focus()}
                    />
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        密码
                    </FormLabel>
                    <FormInput
                        ref='form'
                        textInputRef='c'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(password) => {
                            this.setState({password});
                            if(this.state.username!='' && password!=''
                                && this.state.nickname!='' && this.state.introduce!=''
                                && this.state.question!='' && this.state.answer!=''
                            )
                            {
                                this.setState({en_register:true});
                            }
                            else
                            {
                                this.setState({en_register:false});
                            }
                        }}
                        value={this.state.password}
                        placeholder="6-12位字母或数字"
                        maxLength={12}
                        returnKeyType="next"
                        clearTextOnFocus={true}
                        secureTextEntry={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.focusNextField('d')}
                    />
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        个人简介
                    </FormLabel>
                    <FormInput
                        ref='input'
                        textInputRef='d'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(introduce) => {
                            this.setState({introduce});
                            if(this.state.username!='' && this.state.password!=''
                                && this.state.nickname!='' && introduce!=''
                                && this.state.question!='' && this.state.answer!=''
                            )
                            {
                                this.setState({en_register:true});
                            }
                            else
                            {
                                this.setState({en_register:false});
                            }
                        }}
                        value={this.state.introduce}
                        placeholder="用一句话介绍自己吧~"
                        returnKeyType="next"
                        clearTextOnFocus={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.refs.foo.refs.e.focus()}
                    />
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        密保问题
                    </FormLabel>
                    <FormInput
                        ref='foo'
                        textInputRef='e'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(question) => {
                            this.setState({question});
                            if(this.state.username!='' && this.state.password!=''
                                && this.state.nickname!='' && this.state.introduce!=''
                                && question!='' && this.state.answer!=''
                            )
                            {
                                this.setState({en_register:true});
                            }
                            else
                            {
                                this.setState({en_register:false});
                            }
                        }}
                        value={this.state.question}
                        placeholder="用于密码找回"
                        returnKeyType="next"
                        clearTextOnFocus={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.refs.bar.refs.f.focus()}
                    />
                    <FormLabel
                        labelStyle={styles.Label}
                    >
                        问题答案
                    </FormLabel>
                    <FormInput
                        ref='bar'
                        textInputRef='f'
                        inputStyle={styles.Tex}
                        containerStyle={styles.conStyle}
                        onChangeText={(answer) => {
                            this.setState({answer});
                            if(this.state.username!='' && this.state.password!=''
                                && this.state.nickname!='' && this.state.introduce!=''
                                && this.state.question!='' && answer!=''
                            )
                            {
                                this.setState({en_register:true});
                            }
                            else
                            {
                                this.setState({en_register:false});
                            }
                        }}
                        value={this.state.answer}
                        placeholder="密保问题答案"
                        returnKeyType="done"
                        clearTextOnFocus={true}
                        autoCorrect={false}
                        autoCapitalize="none"
                        clearButtonMode="while-editing"
                        onSubmitEditing={() => this.onClick()}
                    />
                </View>
                <View style={styles.Container}>
                    <Button
                        buttonStyle={styles.But}
                        large
                        iconRight
                        icon={{name: 'plus-one'}}
                        title='注册'
                        onPress={()=>this.onClick()}
                        backgroundColor='#2db7f5'
                        raised={true}
                        disabled={!this.state.en_register}
                    />
                </View>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.props.loading}
                />
            </ScrollView>
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

export default Register;