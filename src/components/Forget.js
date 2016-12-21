/**
 * Created by CHANGE on 2016/12/18.
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


const Forget = (props) => {
    const {dispatch, information} = props;
    state = {
        username:"",
        question:"",
        answer:"",
        newpassword:"",
            };
    loading = false;
        clickhttp()
        {
            loading = true;
            fetch(IP.ip+':8000/findPassword/', {
                method: 'POST',
                headers: {
                    //'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body:JSON.stringify({
                    user_name: state.username,
                    question: state.question,
                    answer: state.answer,
                    newpassword: state.newpassword,

                })
            })
                .then(function(data) {
                    return data.json();
                })
                .then((responseText) => {
                    console.log(responseText);
                    loading = false;
                    const type = responseText[0].type;
                    if(type == 1) {
                        Toast.fail("用户不存在！", 1);
                        return responseText;
                    } else if (type == 2) {
                        Toast.fail("密保或问题错误！", 1);
                        return responseText;
                    }
                    Toast.success("密码修改成功！请登录。", 1);

                    //这里应该有一个界面跳转
                    Actions.Start();
                    return responseText;
                })
                .catch((error) => {
                    loading = false;
                    Toast.fail("网络错误！", 1);
                    console.warn(error);
                });
        }
        onClick()
        {
            clickhttp();
        }

        focusNextField = (nextField) => {
            this.refs.input.refs[nextField].focus();
        };
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
                            onChangeText={(username) => this.setState({username})}
                            value={this.state.username}
                            placeholder="请输入您的用户名"
                            returnKeyType="next"
                            clearTextOnFocus={true}
                            keyboardType="email-address"
                            autoCorrect={false}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            onSubmitEditing={() => this.refs.e.refs.f.focus()}
                        />
                        <FormLabel
                            labelStyle={styles.Label}
                        >
                            密保问题
                        </FormLabel>
                        <FormInput
                            ref='e'
                            textInputRef='f'
                            inputStyle={styles.Tex}
                            onChangeText={(question) => this.setState({question})}
                            value={this.state.question}
                            placeholder="请输入您之前设置的密保问题"
                            returnKeyType="next"
                            clearTextOnFocus={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            onSubmitEditing={() => this.refs.g.refs.h.focus()}
                        />
                        <FormLabel
                            labelStyle={styles.Label}
                        >
                            密保答案
                        </FormLabel>
                        <FormInput
                            ref='g'
                            textInputRef='h'
                            inputStyle={styles.Tex}
                            onChangeText={(answer) => this.setState({answer})}
                            value={this.state.answer}
                            placeholder="请输入您之前设置的密保答案"
                            returnKeyType="next"
                            clearTextOnFocus={true}
                            secureTextEntry={true}
                            autoCorrect={false}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            onSubmitEditing={() => this.refs.i.refs.k.focus()}
                        />
                        <FormLabel
                            labelStyle={styles.Label}
                        >
                            新的密码
                        </FormLabel>
                        <FormInput
                            ref='i'
                            textInputRef='k'
                            inputStyle={styles.Tex}
                            onChangeText={(newpassword) => this.setState({newpassword})}
                            value={this.state.newpassword}
                            placeholder="请输入新的密码"
                            returnKeyType="next"
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
                            icon={{name: 'check'}}
                            title='确认修改'
                            onPress={()=>this.onClick()}
                            backgroundColor='#2db7f5'
                            raised={true}
                        />
                        <ActivityIndicator
                            toast
                            text="正在加载"
                            animating={this.loading}
                        />
                    </View>
                </ScrollView>
            );

    }

    const styles = StyleSheet.create({
        Container: {
            alignItems: 'center',
            height:300,
        },
        Label: {
            fontSize: 30,
            color: '#272727',
        },
        Tex: {
            fontSize: 20,
        },
        But: {
            width: Dimensions.get('window').width*0.9,
            marginTop: 20,
        },
    });


export default connect(information => information)(Forget);
