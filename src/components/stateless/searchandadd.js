/**
 * Created by CHANGE on 2017/1/2.
 */
import { SearchBar } from 'react-native-elements'

import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
    Dimensions,
    Image,
    Platform,
    ActivityIndicator,
} from 'react-native';

import React, { Component, PropTypes, } from 'react'
// 导入组件使用到的Native依赖模块
import { ScrollView,View, StyleSheet, Text, Alert, TouchableOpacity,} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import Modal from 'antd-mobile/lib/modal'


import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';


class  SearchFriend extends Component{
    constructor(props){
        super(props);
        this.state = {
            loading:false,
            search_by:"",
            resultList:[

            ],

        }
    }

    getSearchResult()
    {
        return(
            <List>
                { this.renderRow() }
            </List>
        );
    }
    renderRow(){
        if (Array.isArray(resultList)) {
            // 推荐这种写法
            return resultList.map((item, i) => {
                return (
                    <ListItem
                        roundAvatar
                        key={i}
                        title={item.user_name}

                    />
                )
            });
        }
    }
    onclick()
    {
        this.setState({
            loading:true,
        });
        fetch(IP.ip+':8000/searchUser/', {
            method: 'GET',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_name: this.state.search_by,
            })
        })
            .then(function(data){
                return data.json();
            })
            .then((responseText) => {
                this.setState({
                    loading:false,
                });
                if(responseText.search_num == 0) {
                    Toast.fail("没有这个用户！", 1);
                    return responseText;
                }
                Toast.success("查找成功！",1);
                //TODO:这里服务器应该返回昵称和简介
                this.setState({
                    resultList:responseText.data,
                });
                this.setState({
                    loading:true,
                });

                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                this.setState({
                    loading:true,
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }

    render(){
        return(
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
                        查找好友
                    </Text>
                    <TouchableOpacity onPress={Actions.pop}>
                        <View style={styles.completeContainer}>
                            <Text style={styles.completeText}>
                                还是返回
                            </Text>
                            <Image style={styles.backIcon}
                                   source={require('../images/add.png')} />
                        </View>
                    </TouchableOpacity>
                    <SearchBar
                        value = {this.state.search_by}
                        onChangeText={(searchby) => {
                            this.setState({
                                search_by:searchby,
                            })
                        }}
                        placeholder='输入用户昵称...'
                        onSubmitEditing={() => this.onClick()}/>
                    {getSearchResult()}
                    <ActivityIndicator
                        toast
                        text="正在加载"
                        animating={this.state.loading}
                    />
                </View>
            </View>
        );
    }


}



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
    //完成区
    completeContainer: {
        flexDirection: 'row',
        marginRight: PixelRatio.get() * 5,
        width: PixelRatio.get() * 40,
        alignItems: 'center',
        justifyContent:'flex-end',

    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    }
});

export default connect(infoModle => infoModle)(SearchFriend);
