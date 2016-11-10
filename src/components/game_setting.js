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
    function onChange(val){
        this.setState({val});
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
                <List.Item extra={<Stepper showNumber max={10} min={1} value={room.game_setting.Werewolf} onChange={this.onChange} />}>
                    狼人
                </List.Item>
                <List.Item extra={<Stepper showNumber max={10} min={1} value={room.game_setting.Villager} onChange={this.onChange} />}>
                村民
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={room.game_setting.Cupido} onChange={this.onChange} />}>
                丘比特
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={room.game_setting.Seer} onChange={this.onChange} />}>
                预言家
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={room.game_setting.Witch} onChange={this.onChange} />}>
                女巫
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={room.game_setting.Hunter} onChange={this.onChange} />}>
                猎人
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={room.game_setting.Guard} onChange={this.onChange} />}>
                    守卫
                </List.Item>
            </List>
            <List renderHeader={() => '请选择狼人胜利判定'}>
                <List.Item extra = {<RadioItem checked={room.game_setting.WolfWinCondition === 1} onChange={this.handleChange}/> }>
                    全部人死亡
                </List.Item>
                <List.Item extra = {<RadioItem checked={room.game_setting.WolfWinCondition === 2} onChange={this.handleChange2}/>}>

                    全部特殊角色死亡
                </List.Item>
                
            </List>

            <List renderHeader={() => '继续'}>
            <Button type="default" onClick = {Actions.pop} inline>上一步</Button>
            <Button type="primary" onClick = {Actions.ChooseSeat} inline>下一步</Button>
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