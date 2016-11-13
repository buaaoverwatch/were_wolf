
import React, { Component } from 'react';
import {
    Text,
    Dimensions,
    StyleSheet,
    View,
    Alert,
    ScrollView,
    Picker,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { Card, Button ,List, ListItem} from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import Modal from 'antd-mobile/lib/modal';
import StateConst from '../consts/roomstate';

import VoteResult from './stateless/voteresult';
import GuessRole from './stateless/guessrole';
import Socket from '../services/websocket'


export default class Tabview extends Component {

    static defaultProps = {

    };
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props);
        // 设置初始状态
        this.state = {
            msg:[],
            msg1_1:'1号玩家',
            msg1_2:'是',
            msg1_3:'村民',
            msg2_1:'1号玩家',
            msg2_2:'抗推',
            modaltitle:'',
            modalcontent:'',
            visible:false,
            extrafun:()=>{},
        };
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.checkandshowModal = this.checkandshowModal.bind(this);
        //this._renderList = this._renderList.bind(this);
        //this._renderModal = this._renderModal.bind(this);
    };
    onConfirm(){
        this.state.extrafun();
        this.setState({extrafun:()=>{}});
        this.setState({visible:false});
    };
    onClose(){
        this.setState({visible:false});
    };
    checkandshowModal(role){
        if(role=='wolf_kill')
        {
            if(this.props.room.curstate!=StateConst.wolf)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"不能在非狼人行动阶段杀人"});
                this.setState({visible:true});
            }
            else if(this.props.room.player_selectedid=="")
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"请选择行使技能的对象"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您这轮已经杀过人了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else
            {
                j=0;
                this.props.room.player_id.map((item, i) => {
                    if(this.props.room.player_wolfvote[item]>0)
                    {
                        j=j+1;
                    }
                });
                if(j>1)
                {
                    this.setState({modaltitle:"出错啦"});
                    this.setState({modalcontent:"请您和队友统一意见"});
                    this.setState({visible:true});
                }
                else
                {
                    this.setState({modaltitle:"请确认"});
                    this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家，您确定要杀他么`});
                    press=()=>{
                        this.props.dispatch({ type: 'room/changeNextStep'});
                    };
                    this.setState({visible:true});
                }
            }
        }
        if(role=='wolf_suicide')
        {
            if(this.props.room.curstate==StateConst.cupid|
                this.props.room.curstate==StateConst.lover||
                this.props.room.curstate==StateConst.guard||
                this.props.room.curstate==StateConst.wolf||
                this.props.room.curstate==StateConst.seer||
                this.props.room.curstate==StateConst.witch)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"不能在黑夜自爆"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:"您确定要自爆么，自爆后将会结束这轮白天的所有行动跳到下一个黑夜"});
                function press() {
                    //TODO:加入回调函数
                };
                this.setState({visible:true});
            }
        }
        else if(role=='hunter')
        {
            if(this.props.room.curstate!=StateConst.hunter)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您还没有死亡，不能开枪"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您已经开过枪了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.player_selectedid=="")
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"请选择行使技能的对象"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家，您确定要向Ta开枪么`});
                function press() {
                    //TODO:加入回调函数
                };
                this.setState({visible:true});
            }
        }
        else if(role=='witch_heal')
        {
            if(this.props.room.curstate!=StateConst.witch)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您还没有还没有到自己的回合，不能使用技能"});
                this.setState({visible:true});
            }
            else if(this.props.room.witch_save)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您已经救过人了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"一局只能使用一瓶解药或一瓶毒药,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.wolf_lastkill==this.props.room.client_id&&this.props.room.round!=1)
            {
                this.setState({modaltitle:"遗憾的是"});
                this.setState({modalcontent:"您这局被狼人杀死了，可惜今夜不是第一夜，您不能自救"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:`这轮死亡的是${this.props.room.player_index[this.props.room.wolf_lastkill]}号玩家，您确定要救他么`});
                function press() {
                    //TODO:加入回调函数
                    //TODO:加入取消键
                };
                this.setState({visible:true});
            }
        }
        else if(role=='witch_kill')
        {
            if(this.props.room.curstate!=StateConst.witch)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您还没有还没有到自己的回合，不能使用技能"});
                this.setState({visible:true});
            }
            else if(this.props.room.witch_kill)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您已经毒过人了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"一局只能使用一瓶解药或一瓶毒药,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.player_selectedid=="")
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"请选择行使技能的对象"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家，您确定要对他使用毒药么`});
                function press() {
                    //TODO:加入回调函数
                };
                this.setState({visible:true});
            }
        }
        else if(role=='cupid')
        {
            if(this.props.room.curstate!=StateConst.cupid)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您还没有还没有到自己的回合，不能使用技能"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您已经连接过两位情侣了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.player_selectedid==""||this.props.room.player_selectedid2=="")
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"请选择要链接的两位情侣"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家和${this.props.room.player_index[this.props.room.player_selectedid2]}号玩家，您确定要链接两位玩家成为情侣么`});
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep'});
                };
                this.setState({extrafun:press});
                this.setState({visible:true});
            }
        }
        else if(role=='seer')
        {
            if(this.props.room.curstate!=StateConst.seer)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您还没有还没有到自己的回合，不能使用技能"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您这轮已经看过玩家的身份了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.player_selectedid=="")
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"请选择要查看身份的玩家"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家，您确定要查看Ta的身份么`});
                function press() {
                    //TODO:加入回调函数
                };
                this.setState({visible:true});
            }
        }
        else if(role=='guard')
        {
            if(this.props.room.curstate!=StateConst.seer)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您还没有还没有到自己的回合，不能使用技能"});
                this.setState({visible:true});
            }
            else if(this.props.room.nextstep)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"您这轮已经守护过一名玩家了,请点击下一步按钮"});
                this.setState({visible:true});
            }
            else if(this.props.room.player_selectedid=="")
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:"请选择要守护的玩家"});
                this.setState({visible:true});
            }
            else
            {
                this.setState({modaltitle:"请确认"});
                this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家，您确定要守护Ta么`});
                function press() {
                    //TODO:加入回调函数
                };
                this.setState({visible:true});
            }
        }

    }
    _renderPicker(list){
        return list.map((item, i) => {
            return (
                <Picker.Item key={i} label={`${i+1}号玩家`} value={`${i+1}号玩家`}/>
            )
        });
    };
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
    };
    _renderWolf(){
        if(this.props.room.player_role[this.props.room.client_id]=='wolf'&&this.props.room.curstate==StateConst.wolf)
        {
            return(
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
                                {this._renderPicker(this.props.room.player_id)}
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
                                {this._renderPicker(this.props.room.player_id)}
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
            )
        }
    };
    _renderCard(){
        const witch_heal=(
            <Card
                key={1}
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
                    onPress={()=>this.checkandshowModal('witch_heal')}/>
            </Card>
        );
        const witch_kill=(
            <Card
                key={2}
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
                    onPress={()=>this.checkandshowModal('witch_kill')}/>
            </Card>
        );
        const seer=(
            <Card
                key={3}
                title='查看身份'
                image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                containerStyle={{backgroundColor:'white',height:300}}>
                <Text style={{marginBottom: 10}}>
                    您的身份是预言家，您每天夜里可以查看一名玩家的身份。
                </Text>
                <Button
                    small
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{}}
                    title='使用技能'
                    onPress={()=>this.checkandshowModal('seer')}/>
            </Card>
        );
        const cupid=(
            <Card
                key={4}
                title='丘比特'
                image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                containerStyle={{backgroundColor:'white',height:300}}>
                <Text style={{marginBottom: 10}}>
                    您的身份是丘比特，您可以链接两位玩家成为情侣，成为情侣之后，只要双方有一人死去，另一人也会死亡。
                </Text>
                <Button
                    small
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{}}
                    title='使用技能'
                    onPress={()=>this.checkandshowModal('cupid')}/>
            </Card>
        );
        const hunter=(
            <Card
                key={5}
                title='开枪'
                image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                containerStyle={{backgroundColor:'white',height:300}}>
                <Text style={{marginBottom: 10}}>
                    您的身份是猎人，在您死亡时，您可以选择开枪杀死一名玩家。
                </Text>
                <Button
                    small
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{}}
                    title='使用技能'
                    onPress={()=>this.checkandshowModal('hunter')}/>
            </Card>
        );
        const guard=(
            <Card
                key={6}
                title='守护'
                image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                containerStyle={{backgroundColor:'white',height:300}}>
                <Text style={{marginBottom: 10}}>
                    您的身份是守卫，您每晚可以选择守护一名玩家，这名玩家如果晚上被狼人杀死可以逃过一劫，不能连续两天守护同一位玩家。
                </Text>
                <Button
                    small
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{}}
                    title='使用技能'
                    onPress={()=>this.checkandshowModal('guard')}/>
            </Card>
        );
        const wolf_kill=(
            <Card
                key={7}
                title='杀人'
                image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                containerStyle={{backgroundColor:'white',height:300}}>
                <Text style={{marginBottom: 10}}>
                    您的身份是狼人，每天晚上您和您队友可以共同杀死一名玩家。
                </Text>
                <Button
                    small
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{}}
                    title='使用技能'
                    onPress={()=>this.checkandshowModal('wolf_kill')}/>
            </Card>
        );
        const wolf_suicide=(
            <Card
                key={8}
                title='自爆'
                image={{uri:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg'}}
                containerStyle={{backgroundColor:'white',height:300}}>
                <Text style={{marginBottom: 10}}>
                    您的身份是狼人，您可以选择自杀来随时结束这一轮的发言。
                </Text>
                <Button
                    small
                    icon={{name: 'code'}}
                    backgroundColor='#03A9F4'
                    buttonStyle={{}}
                    title='使用技能'
                    onPress={()=>this.checkandshowModal('wolf_suicide')}/>
            </Card>
        );
        let list=[
            {
                key:1,
                role:'witch',
                data:witch_heal,
            },
            {
                key:2,
                role:'witch',
                data:witch_kill,
            },
            {
                key:3,
                role:'seer',
                data:seer,
            },
            {
                key:4,
                role:'cupid',
                data:cupid,
            },
            {
                key:5,
                role:'hunter',
                data:hunter,
            },
            {
                key:6,
                role:'guard',
                data:guard,
            },
            {
                key:7,
                role:'wolf',
                data:wolf_kill,
            },
            {
                key:8,
                role:'wolf',
                data:wolf_suicide,
            },
        ];
        var array=[];
        list.map((item, i) => {
            if(item.role==this.props.room.player_role[this.props.room.client_id])
                array.push(item.data);
        });
        return array;
    };
    prepend(arr, item) {
        return [item].concat(arr);
    };
    render() {
        const window = Dimensions.get('window');
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
                    <Socket/>
                    {this._renderCard()}
                    <Modal
                        title={this.state.modaltitle}
                        closable
                        maskClosable
                        transparent
                        onClose={this.onClose}
                        visible={this.state.visible}
                        style={{height:200,width:300,alignItems: 'center'}}
                    >
                        <View style={{alignItems: 'center'}}>
                            <Text style={{marginTop:30,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                                {this.state.modalcontent}
                            </Text>
                            <View style={{flexDirection:'row',alignItems: 'center'}}>
                                <Button
                                    raised
                                    icon={{name: 'done'}}
                                    title='确认'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={this.onConfirm}
                                />
                                <Button
                                    raised
                                    icon={{name: 'clear'}}
                                    title='取消'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={this.onClose}
                                />
                            </View>
                        </View>
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
                        containerStyle={{width:window.width}}
                    />
                </View>
                {this._renderWolf()}
                <View tabLabel='身份'
                      style={{
                          flex: 1,
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                      }}
                >
                    <GuessRole
                        containerStyle={{width:window.width}}
                        data={this.props.room}
                    />
                </View>
            </ScrollableTabView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
});
