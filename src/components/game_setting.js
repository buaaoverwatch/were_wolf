import React, { Component } from 'react';
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
} from 'react-native';



import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';

//此处应有一个fetch到的房间列表
import List from 'antd-mobile/lib/list';
import Stepper from 'antd-mobile/lib/stepper';
import RadioItem from 'antd-mobile/lib/radio';
import Button from 'antd-mobile/lib/button'


const GameSetting = (props) => {
    const {dispatch,room} = props;
    function test(){

    }
    function SetWolf(val) {
        dispatch({
            type:'room/setwolf',
            payload:val,
        });
    }
    function SetVill(val) {
        dispatch({
            type:'room/setvill',
            payload:val,
        });
    }
    function SetCupido(val) {
        dispatch({
            type:'room/setcupido',
            payload:val,
        });
    }
    function SetSeer(val) {
        dispatch({
            type:'room/setseer',
            payload:val,
        });
    }
    function SetWitch(val) {
        dispatch({
            type:'room/setwicth',
            payload:val,
        });
    }
    function SetHunter(val) {
        dispatch({
            type:'room/sethunter',
            payload:val,
        });
    }
    function SetGuard(val) {
        dispatch({
            type:'room/setguard',
            payload:val,
        });
    }


    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    设置面板
                </Text>
            </View>
            <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f9' }}
                        automaticallyAdjustContentInsets={false}
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator={false}
            >
            <List renderHeader = {() => '角色及人数'}>
                <List.Item extra={<Stepper max={10} min={1} value={room.Werewolf} onChange={()=>this.SetWolf(this.value)} />}>
                    狼人
                </List.Item>
                <List.Item extra={<Stepper max={10} min={1} value={room.Villager} onChange={()=>this.SetVill(value)} />}>
                村民
                </List.Item>
                <List.Item extra={<Stepper max={1} min={0} value={room.Cupido} onChange={()=>this.SetCupido(value)} />}>
                丘比特
                </List.Item>
                <List.Item extra={<Stepper max={1} min={0} value={room.Seer} onChange={()=>this.SetSeer(value)} />}>
                预言家
                </List.Item>
                <List.Item extra={<Stepper max={1} min={0} value={room.Witch} onChange={()=>this.SetWitch(value)} />}>
                女巫
                </List.Item>
                <List.Item extra={<Stepper max={1} min={0} value={room.Hunter} onChange={()=>this.SetHunter(value)} />}>
                猎人
                </List.Item>
                <List.Item extra={<Stepper max={1} min={0} value={room.Guard} onChange={()=>this.SetGuard(value)} />}>
                    守卫
                </List.Item>
            </List>
            <List renderHeader={() => '请选择狼人胜利判定'}>
                <List.Item extra = {<RadioItem checked={room.WolfWinCondition === 1} onChange={this.handleChange}/> }>
                    全部人死亡
                </List.Item>
                <List.Item extra = {<RadioItem checked={room.WolfWinCondition === 2} onChange={this.handleChange2}/>}>

                    全部特殊角色死亡
                </List.Item>
                
            </List>

            <List renderHeader={() => '继续'}>
            <Button type="default" onClick = {Actions.pop} inline>上一步</Button>
            <Button type="primary" onClick = {Actions.Test1} inline>下一步</Button>
            </List>
            </ScrollView>
            </View>
    );
};

const styles = StyleSheet.create({
    //标题
    header: {
        flexDirection: 'row',
        height: PixelRatio.get() * 16,
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
});

export default connect(room => room)(GameSetting);