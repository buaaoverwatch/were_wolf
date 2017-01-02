/**
 * Created by CHANGE on 2016/12/18.
 */
import React, { Component } from 'react';
import {
    Text,
    View,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Image,
    ScrollView,
    PixelRatio,
    Platform
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Toast from 'antd-mobile/lib/toast';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import { FormLabel, FormInput , Button} from 'react-native-elements'

import IP from '../consts/ip';




class Forget extends Component {
constructor(props) {
    super(props);
    this.state = {
        username:"",
        question:"",
        answer:"",
        newpassword:"",
        loading: false
    };
}

    clickhttp(_this)
    {
        _this.setState({
            loading: true
        });
            fetch(IP.ip+':8000/findPassword/', {
                method: 'POST',
                headers: {

                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                },
                body:JSON.stringify({
                    user_name: this.state.username,
                    question: this.state.question,
                    answer: this.state.answer,
                    new_password: this.state.newpassword,
                })

            })
                .then(function(data) {
                    return data.json();
                })
                .then((responseText) => {
                    console.log(responseText);
                    _this.setState({
                        loading: false
                    });
                    const type = responseText.result;
                    if(type == 1) {
                        Toast.fail("用户不存在！", 1);
                        return responseText;
                    } else if (type == 2) {
                        Toast.fail("密保或问题错误！", 1);
                        return responseText;
                    }
                    Toast.success("密码修改成功！请登录。", 1);

                    //这里应该有一个界面跳转
                    Actions.Launch();
                    return responseText;
                })
                .catch((error) => {
                    _this.setState({
                        loading: false
                    });
                    Toast.fail("网络错误！", 1);
                    console.log("find password error");
                    console.log(error);
                });
        }
    onClick()
    {
        this.clickhttp(this);
    }

    focusNextField = (nextField) => {
        this.refs.input.refs[nextField].focus();
    };

    render()
    {
        return (
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={Actions.pop}>
                        <View style={styles.backContainer}>
                            <Image style={styles.backIcon}
                                   source={require('../images/back.png')}/>
                            <Text style={styles.backText}>
                                返回
                            </Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.headerText}>
                        根据密保问题修改密码
                    </Text>
                    <TouchableOpacity onPress={Actions.pop}>
                        <View style={styles.backContainer}>
                            <Text style={styles.backContainer}>
                                还是返回
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
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
                            autoCorrect={false}
                            autoCapitalize="none"
                            clearButtonMode="while-editing"
                            onSubmitEditing={() => this.focusNextField('k')}
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
                            secureTextEntry={true}
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
                            onPress={() => this.onClick()}
                            backgroundColor='#2db7f5'
                            raised={true}
                        />
                    </View>
                </ScrollView>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.state.loading}
                />
            </View>
        );
    }
};

const styles = StyleSheet.create({
    //标题
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        height: Platform.OS === 'ios' ? PixelRatio.get() * 26 : PixelRatio.get() * 16,
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
        flexDirection: 'row',
        marginLeft: PixelRatio.get() * 5,
        width: PixelRatio.get() * 40,
        alignItems: 'center',
        justifyContent:'flex-start',
    },
    //返回图标
    backIcon: {
        height: PixelRatio.get() * 5,
        width: PixelRatio.get() * 5,
    },
    //返回文本
    backText: {
        fontSize: 18,
        color: '#ffffff',
        marginLeft: PixelRatio.get() * 2
    },
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
