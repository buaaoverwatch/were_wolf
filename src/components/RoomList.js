/**
 * Created by shi on 2016/12/15.
 */
// 导入React核心模块
import React, { Component, PropTypes, } from 'react'
// 导入组件使用到的Native依赖模块
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
    AsyncStorage,
} from 'react-native';

import { PricingCard } from 'react-native-elements'

import Icon from 'react-native-vector-icons/Ionicons';

import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import ListView from 'antd-mobile/lib/list-view';
import RefreshControl from 'antd-mobile/lib/refresh-control';
import Toast from 'antd-mobile/lib/toast';

import state from '../consts/roomstate';

import {
    Actions
} from 'react-native-router-flux';

import { connect } from 'dva/mobile';

import IP from '../consts/ip';

// 定义并默认导出自己的component
class RoomList extends Component {
    // 构造函数
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props);
        // 设置初始状态
        const {dispatch} = props;
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            refreshing:false,
            dataSource: ds,
            dataList:[],
            dispatch:dispatch,
        };
        this.getList = this.getList.bind(this);
        this.onPress = this.onPress.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.httpRequest=this.httpRequest.bind(this);
    }

    //在加载之初调用获取列表的函数
    componentWillMount() {
        this.getList();
    }


    getList(){
        this.setState({
            refreshing: true,
        });
        fetch(IP.ip+':8000/getRoomList/',{
            method:'POST',
            header:{
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({})
        })

            .then(function(data){
                return data.json();
            })
            .then((responseText)=>{
                this.setState({
                    refreshing: false,
                });
                Toast.success("获取了当前所有房间！",1);
                console.log(responseText);
                this.setState({
                    dataList: responseText,
                });
                return responseText;
            })
            .catch((error)=>{
                this.setState({
                    refreshing: false,
                });
                console.warn(error);
                Toast.fail("网络错误",1);
            });
    }

    // 遍历的部分可以写成子渲染函数
    renderRow(rowData,sectionID,rowID) {
        console.log(rowData);
        let state_num=parseInt(rowData.state);
        let icons=<Text><Icon name="ios-people" size={50}/>  {rowData.player_num}</Text>;
        let head=<Text><Icon name="ios-home" size={40}/>  {rowData.name}</Text>;
        var str;
        if(state_num==state.gameend)
            str='游戏结束';
        else if(state_num==state.waitngplayer)
            str='等待玩家';
        else
            str='游戏中';
        return(
            <PricingCard
                color='#4f9deb'
                title={head}
                price={icons}
                info={[`${str}`,`房间号:${rowData.id}`,`${rowData.owner_name}的房间`]}
                button={{ title: 'GET STARTED', icon: 'flight-takeoff' }}
                onButtonPress={()=>this.onPress(rowData.id)}
            />
        );
    }

    onPress(roomID){
        var userID="";
        var username="";
        var nickname="";
        const fun=this.httpRequest;
        if(!roomID) {
            Toast.fail("输入房间号码错误！", 1);
            return;
        }
        AsyncStorage.getItem('userID', function (error, result) {
            if(error) {
                console.log(error);
                return;
            }
            userID=result;
        });
        AsyncStorage.getItem('nickname', function (error, result) {
            if(error) {
                console.log(error);
                return;
            }
            nickname=result;
        });
        AsyncStorage.getItem('username', function (error, result) {
            if(error) {
                console.log(error);
                return;
            }
            username=result;
            fun(userID,username,nickname,roomID);//异步，所以要最后统一处理
        });
    }

    httpRequest(userID,username,nickname,roomID){
        this.state.dispatch({
            type: 'room/setuserinfo',
            payload: {
                userID: userID,
                username: username,
                nickname: nickname
            }
        });
        this.setState({
            refreshing: true,
        });
        fetch(IP.ip+':8000/join/', {
            method: 'POST',
            headers: {
                //'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
            },
            body:JSON.stringify({
                user_id: userID.toString(),
                room_id: roomID.toString(),
            })
        })
            .then(function(data){
                return data.json();
            })
            .then((responseText) => {
                this.setState({
                    refreshing: false,
                });
                if(responseText.result == 1) {
                    Toast.fail("房间不存在！", 1);
                    return responseText;
                } else if (responseText.result == 2) {
                    Toast.fail("房间人数已满！", 1);
                    return responseText;
                } else if(responseText.result == 3) {
                    Toast.fail("未知错误！", 1);
                    return responseText;
                }
                Toast.success("加入房间成功！", 1);
                this.state.dispatch({
                    type: 'room/addRoomSuccess',
                    payload: {
                        roomID: roomID,
                        roomName: responseText.room_name,
                        ownerID: responseText.owner_id
                    }
                });
                this.state.dispatch({
                    type: 'room/joinroom',
                    payload: responseText.id_nick
                });
                //这里应该有一个界面跳转
                Actions.GameRoom();
                console.log(responseText);
                return responseText;
            })
            .catch((error) => {
                this.setState({
                    refreshing: false,
                });
                Toast.fail("网络错误！", 1);
                console.warn(error);
            });
    }


    // 主渲染函数
    render() {
        return (
            <View style={{flex:1,backgroundColor: '#ebebeb'}}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>
                        当前正在游戏的房间
                    </Text>
                </View>
                <ListView style={styles.RoomList}
                          dataSource={this.state.dataSource.cloneWithRows(this.state.dataList)}
                          renderRow={this.renderRow}
                          enableEmptySections = {true}
                          refreshControl={<RefreshControl
                              refreshing={this.state.refreshing}
                              onRefresh={this.getList}
                          />}/>
                <ActivityIndicator
                    toast
                    text="正在加载"
                    animating={this.state.refreshing}
                />
            </View>
        );
    }
}

// style写在最下面
const styles = StyleSheet.create({
    //标题
    header: {
        flexDirection: 'row',
        paddingTop: Platform.OS === 'ios' ? 10 : 0,
        height: Platform.OS === 'ios' ? PixelRatio.get() * 26 : PixelRatio.get() * 16,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#393a3f',//#0033ff
        justifyContent: 'center'
    },
    //标题文本
    headerText: {
        color: '#ffffff',
        fontSize: 18,
    },
    RoomList:{
        marginBottom: PixelRatio.get() * 26,
    },
});

export default connect(room => room)(RoomList);