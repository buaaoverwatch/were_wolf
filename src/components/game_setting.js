import React, { Component } from 'react';
import {
    AppRegistry,
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image
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
    const {dispatch,game_options} = props;
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
            <List renderHeader = {() => '角色及人数'}>
                <List.Item extra={<Stepper showNumber max={10} min={1} value={setting_page.game_setting.Werewolf} onChange={setting_page.game_setting.Werewolf = value} />}>
                狼人
                </List.Item>
                <List.Item extra={<Stepper showNumber max={10} min={1} value={setting_page.game_setting.Villager} onChange={this.onChange} />}>
                村民
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={setting_page.game_setting.Cupido} onChange={this.onChange} />}>
                丘比特
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={setting_page.game_setting.Seer} onChange={this.onChange} />}>
                预言家
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={setting_page.game_setting.Witch} onChange={this.onChange} />}>
                女巫
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={setting_page.game_setting.Hunter} onChange={this.onChange} />}>
                猎人
                </List.Item>
                <List.Item extra={<Stepper showNumber max={1} min={0} value={setting_page.game_setting.Guard} onChange={this.onChange} />}>
                守卫
                </List.Item>
            </List>
            <List renderHeader={() => '请选择狼人胜利判定'}>
                <RadioItem checked={this.state.value === 1} onChange={this.handleChange} disabled={this.state.disabled}data-seed="logId">
                    全部人死亡
                </RadioItem>
                <RadioItem checked={this.state.value === 2} onChange={this.handleChange2} disabled={this.state.disabled}>
                    全部特殊角色死亡
                </RadioItem>
                
            </List>
            <TouchableOpacity onPress={Actions.RoomList}>
                <Button type="default" size="small" inline>上一步</Button>}
            </TouchableOpacity>
            <TouchableOpacity onPress={Actions.ChooseSeat}>
                <Button type="primary" size="small" inline>下一步</Button>}
            </TouchableOpacity>
            </View>
    );
};

export default connect(change => change)(GameSetting);