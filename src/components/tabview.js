
import React, { Component } from 'react';
import {
    Text,
    StyleSheet,
    View,
    Alert,
    ScrollView,
    Picker,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { Card, Button ,List, ListItem} from 'react-native-elements'
import FlipCard from 'react-native-flip-card'
import {Actions} from 'react-native-router-flux';
import Modal from 'antd-mobile/lib/modal';

import VoteResult from './stateless/voteresult';
import GuessRole from './stateless/guessrole';

var TabView = React.createClass({

    getInitialState() {
        return {
            visible: false ,
            users:[
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
                {
                    name: 'brynn',
                    avatar: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'
                },
            ],
            player_id:[
                1,2,3,4,5,6,7,8,
            ],
            msg:[],
            msg1_1:'1号玩家',
            msg1_2:'是',
            msg1_3:'村民',
            msg2_1:'1号玩家',
            msg2_2:'抗推',

        };
    },
    showModal() {
        this.setState({
            visible: true,
        });
    },
    onClose() {
        this.setState({
            visible: false,
        });
    },
    _renderPicker(list){
        return list.map((item, i) => {
            return (
                <Picker.Item key={i} label={`${i+1}号玩家`} value={`${i+1}号玩家`}/>
            )
        });
    },
    _renderMsg(list){
        return list.map((item, i) => {
            return (
                <ListItem
                    key={i}
                    roundAvatar
                    avatar={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                    title={item}
                />
            )
        });
    },
    prepend(arr, item) {
        return [item].concat(arr);
    },
    render() {
        return (
            <ScrollableTabView
                style={{marginTop: 0, height:1000,}}
                initialPage={0}
                renderTabBar={() => <ScrollableTabBar />}
            >
                <View tabLabel='技能'
                      style={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          backgroundColor:'#f7f7f7',
                      }}
                >
                    <Card
                        title='救人'
                        image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                        containerStyle={{backgroundColor:'white',height:300}}>
                        <Text style={{marginBottom: 10}}>
                            您的身份是女巫，您拥有一瓶解药，可以救治一名被狼人杀死的玩家。
                        </Text>
                        <Button
                            small
                            icon={{name: 'code'}}
                            backgroundColor='#03A9F4'
                            buttonStyle={{}}
                            title='使用技能'
                            onPress={this.showModal}/>
                    </Card>
                    <Card
                        title='毒药'
                        image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                        containerStyle={{backgroundColor:'white',height:300}}>
                        <Text style={{marginBottom: 10}}>
                            您的身份是女巫，您拥有一瓶毒药，可以毒死一名存活的玩家。
                        </Text>
                        <Button
                            small
                            icon={{name: 'code'}}
                            backgroundColor='#03A9F4'
                            buttonStyle={{}}
                            title='使用技能'
                            onPress={this.showModal}/>
                    </Card>
                    <Modal
                        title="确认"
                        closable
                        maskClosable
                        transparent
                        onClose={this.onClose}
                        visible={this.state.visible}
                        style={{height:200,width:300,}}
                    >
                        <Text style={{marginTop:30,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                            请选择您技能使用的对象</Text>
                    </Modal>
                </View>
                <View tabLabel='投票'
                      style={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          backgroundColor:'#f7f7f7',
                      }}
                >
                    <VoteResult
                        containerStyle={{width:380,}}
                    />
                </View>
                <View tabLabel='狼人'
                      style={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                          backgroundColor:'#f7f7f7'
                      }}
                >

                    <View style={{flex:1,flexDirection:'row',height: 200,alignItems:'center',marginTop:20,
                        backgroundColor:'white'}}>
                        <ScrollView style={{flex:1,marginBottom:20}}>
                            <List>
                                { this._renderMsg(this.state.msg) }
                            </List>
                        </ScrollView>
                    </View>
                    <View style={{flexDirection:'column',height: 300,alignItems:'center',marginTop:20,
                        backgroundColor:'white'}}>
                        <View style={{flexDirection:'row',height: 200,alignItems:'center',marginTop:5,
                        }}>
                            <Picker
                                selectedValue={this.state.msg1_1}
                                onValueChange={(lang) => this.setState({msg1_1: lang})}
                                style={{flex:2}}>
                                {this._renderPicker(this.state.player_id)}
                            </Picker>
                            <Picker
                                selectedValue={this.state.msg1_2}
                                onValueChange={(lang) => this.setState({msg1_2: lang})}
                                style={{flex:1}}>
                                <Picker.Item label="是" value="是" />
                            </Picker>
                            <Picker
                                selectedValue={this.state.msg1_3}
                                onValueChange={(lang) => this.setState({msg1_3: lang})}
                                style={{flex:2}}>
                                <Picker.Item label="村民" value="村民" />
                                <Picker.Item label="预言家" value="预言家" />
                                <Picker.Item label="女巫" value="女巫" />
                                <Picker.Item label="猎人" value="猎人" />
                                <Picker.Item label="丘比特" value="丘比特" />
                                <Picker.Item label="守卫" value="守卫" />
                            </Picker>
                        </View>
                        <Button
                            raised
                            icon={{name: 'send'}}
                            title='发送'
                            backgroundColor='#2db7f5'
                            buttonStyle={{marginTop:15,width:150}}
                            onPress={()=>this.setState({msg:this.prepend(this.state.msg,this.state.msg1_1+this.state.msg1_2+this.state.msg1_3)})}
                        />
                    </View>
                    <View style={{flexDirection:'column',height: 300,alignItems:'center',marginTop:20,
                        backgroundColor:'white'}}>
                        <View style={{flexDirection:'row',height: 200,alignItems:'center',marginTop:5,
                        }}>
                            <Picker
                                selectedValue={this.state.msg2_1}
                                onValueChange={(lang) => this.setState({msg2_1: lang})}
                                style={{flex:1}}>
                                {this._renderPicker(this.state.player_id)}
                            </Picker>
                            <Picker
                                selectedValue={this.state.msg2_2}
                                onValueChange={(lang) => this.setState({msg2_2: lang})}
                                style={{flex:1}}>
                                <Picker.Item label="抗推" value="抗推" />
                                <Picker.Item label="自爆" value="自爆" />
                                <Picker.Item label="竞选警长" value="竞选警长" />
                                <Picker.Item label="藏身份" value="藏身份" />
                                <Picker.Item label="跳预言家" value="跳预言家" />
                                <Picker.Item label="跳女巫" value="跳女巫" />
                                <Picker.Item label="跳猎人" value="跳猎人" />
                                <Picker.Item label="跳丘比特" value="跳丘比特" />
                                <Picker.Item label="跳守卫" value="跳守卫" />
                            </Picker>
                        </View>
                        <Button
                            raised
                            icon={{name: 'send'}}
                            title='发送'
                            backgroundColor='#fd661b'
                            buttonStyle={{marginTop:15,width:150}}
                            onPress={()=>this.setState({msg:this.prepend(this.state.msg,this.state.msg2_1+this.state.msg2_2)})}
                        />
                    </View>

                </View>
                <View tabLabel='身份'
                      style={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                      }}
                >
                    <GuessRole
                        containerStyle={{width:380,}}
                    />
                </View>
            </ScrollableTabView>
        );
    }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});
export default TabView