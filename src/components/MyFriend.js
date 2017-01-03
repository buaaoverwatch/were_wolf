/**
 * Created by Qingchang Han on 2016/11/1.
 */
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
import IP from '../consts/ip';
import React, { Component, PropTypes, } from 'react'
// 导入组件使用到的Native依赖模块
import { ScrollView, Alert} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import Modal from 'antd-mobile/lib/modal'
import Toast from 'antd-mobile/lib/toast'



import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';





class MyFriend extends Component{
    constructor(props,information){
        super(props);
        this.state = {
            loading:false,
            FriendList:[

            ],
            info : information,

        }
    }
    componentWillMount() {
        this.initList();
    }

    initList()
    {
        this.setState({
            loading : true,
        });
        fetch(IP.ip+':8000/getFriendList/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id:this.state.info.userID,
            })
        })
            .then(function(data) {
                return data.json();
            })
            .then((responseText) => {

                console.log(responseText);
                this.setState({
                    loading:false,
                });

                this.setState({
                    FriendList:responseText.data,
                });
                return responseText;
            })
            .catch((error) => {
                this.setState({
                    loading:false,
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }
    getFriendList(){
        return(
            <List>
                { this.renderRow() }
            </List>
        );
    }
    getFriendState(i){
        if(i==0)
        {
            return ('不在线');

        }
        else
        {
            return ('在线');
        }
    }
    renderRow(){
        if (Array.isArray(this.state.FriendList)) {
            // 推荐这种写法
            return this.state.FriendList.map((item, i) => {
                return (
                    <ListItem
                        roundAvatar
                        key={i}
                        title={item.name}
                        subtitle={this.getFriendState(item.state)}

                    />
                )
            });
        }
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
                        我的好友
                    </Text>
                    <TouchableOpacity onPress={Actions.SearchFriend}>
                        <View style={styles.completeContainer}>
                            <Text style={styles.completeText}>
                                添加
                            </Text>
                            <Image style={styles.backIcon}
                                   source={require('../images/add.png')} />
                        </View>
                    </TouchableOpacity>
                </View>
                {this.getFriendList()}
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.state.loading}
                />
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

export default connect(information => information)(MyFriend);