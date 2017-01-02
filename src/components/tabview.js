
import React, { Component } from 'react';
import {
    Text,
    Dimensions,
    StyleSheet,
    View,
    Alert,
    ScrollView,
    Picker,
    PixelRatio,
} from 'react-native';

import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
import { Card, Button ,List, ListItem} from 'react-native-elements'
import {Actions} from 'react-native-router-flux';
import Modal from 'antd-mobile/lib/modal';
import Toast from 'antd-mobile/lib/toast';
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
            visible1:false,
            seercontent:'',
            seertitle:'',
            extrafun:()=>{},
        };
        this.onClose = this.onClose.bind(this);
        this.onConfirm = this.onConfirm.bind(this);
        this.checkandshowModal = this.checkandshowModal.bind(this);
        this._rendervotebutton = this._rendervotebutton.bind(this);
        //this._renderList = this._renderList.bind(this);
        //this._renderModal = this._renderModal.bind(this);
    };
    onConfirm(){
        this.state.extrafun();
        this.setState({extrafun:()=>{}});
        this.setState({visible:false});
        this.setState({visible1:false});
    };
    onClose(){
        this.setState({visible:false});
        this.setState({visible1:false});
        this.props.dispatch({
            type: 'room/setsheriffmodal',
            payload: {false},
        });
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
            else if(this.props.room.wolf_lastkill!=""&&this.props.room.player_selectedid!=this.props.room.wolf_kill_id)
            {
                this.setState({modaltitle:"出错啦"});
                this.setState({modalcontent:`您的队友这轮已经确认选择杀${this.props.room.player_index[this.props.room.wolf_lastkill]}号玩家，您只能选择杀这名玩家。确认修改您的选择杀${this.props.room.player_index[this.props.room.wolf_lastkill]}号玩家么？`});
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.hassocket)
                    {
                        msg=JSON.stringify({
                            type:'5',
                            request_id:this.props.room.user_request_id.toString(),
                            room_id:this.props.room.room_id,
                            user_id:this.props.room.client_id,
                            object_id:this.props.room.wolf_lastkill,
                            action:'7',
                            content:'',
                        });
                        this.props.room.socket.send(msg);
                        this.props.dispatch({
                            type: 'room/WebSocketsend',
                            payload: {msg},
                        });
                    }
                };
                //TODO:为什么这里不能显示loading
                this.setState({extrafun:press});
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
                    this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家，您确定要杀他么？注意，在您确认之后，您的队友将不能选择杀其他玩家，同时您也不能修改您的选择`});
                    press=()=>{
                        this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                        if(this.props.room.hassocket)
                        {
                            msg=JSON.stringify({
                                type:'5',
                                request_id:this.props.room.user_request_id.toString(),
                                room_id:this.props.room.room_id,
                                user_id:this.props.room.client_id,
                                object_id:this.props.room.player_selectedid,
                                action:'0',
                                content:'',
                            });
                            this.props.room.socket.send(msg);
                            this.props.dispatch({
                                type: 'room/WebSocketsend',
                                payload: {msg},
                            });
                        }
                    };
                    this.setState({extrafun:press});
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
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.hassocket)
                    {
                        msg=JSON.stringify({
                            type:'5',
                            request_id:this.props.room.user_request_id.toString(),
                            room_id:this.props.room.room_id,
                            user_id:this.props.room.client_id,
                            object_id:this.props.room.client_id,
                            action:'5',
                            content:'',
                        });
                        this.props.room.socket.send(msg);
                        this.props.dispatch({
                            type: 'room/WebSocketsend',
                            payload: {msg},
                        });
                    }
                };
                this.setState({extrafun:press});
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
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.hassocket)
                    {
                        msg=JSON.stringify({
                            type:'5',
                            request_id:this.props.room.user_request_id.toString(),
                            room_id:this.props.room.room_id,
                            user_id:this.props.room.client_id,
                            object_id:this.props.room.player_selectedid,
                            action:'0',
                            content:'',
                        });
                        this.props.room.socket.send(msg);
                        this.props.dispatch({
                            type: 'room/WebSocketsend',
                            payload: {msg},
                        });
                    }
                };
                this.setState({extrafun:press});
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
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.hassocket)
                    {
                        msg=JSON.stringify({
                            type:'5',
                            request_id:this.props.room.user_request_id.toString(),
                            room_id:this.props.room.room_id,
                            user_id:this.props.room.client_id,
                            object_id:this.props.room.player_selectedid,
                            action:'1',
                            content:'',
                        });
                        this.props.room.socket.send(msg);
                        this.props.dispatch({
                            type: 'room/WebSocketsend',
                            payload: {msg},
                        });
                    }
                };
                this.setState({extrafun:press});
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
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.hassocket)
                    {
                        msg=JSON.stringify({
                            type:'5',
                            request_id:this.props.room.user_request_id.toString(),
                            room_id:this.props.room.room_id,
                            user_id:this.props.room.client_id,
                            object_id:this.props.room.player_selectedid,
                            action:'0',
                            content:'',
                        });
                        this.props.room.socket.send(msg);
                        this.props.dispatch({
                            type: 'room/WebSocketsend',
                            payload: {msg},
                        });
                    }
                };
                this.setState({extrafun:press});
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
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.hassocket)
                    {
                        msg=JSON.stringify({
                            type:'9',
                            request_id:this.props.room.user_request_id.toString(),
                            room_id:this.props.room.room_id,
                            user_id:this.props.room.client_id,
                            object1_id:this.props.room.player_selectedid,
                            object2_id:this.props.room.player_selectedid2,
                        });
                        this.props.room.socket.send(msg);
                        this.props.dispatch({
                            type: 'room/WebSocketsend',
                            payload: {msg},
                        });
                    }
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
                this.setState({modalcontent:"您这轮已经看过玩家的身份了，要再次查看么，如果不需要，请点击下一步"});
                press=()=>{
                    if(this.state.seertitle=='wolf')
                    {
                        Toast.fail(this.state.seercontent, 2);
                    }
                    else if(this.state.seertitle=='good')
                    {
                        Toast.success(this.state.seercontent, 2);
                    }
                };
                this.setState({extrafun:press});
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
                press=()=>{
                    this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                    if(this.props.room.player_role[this.props.room.player_selectedid]=='wolf')
                    {
                        this.setState({seercontent:`${this.props.room.player_index[this.props.room.player_selectedid]}号是狼人`});
                        this.setState({seertitle:'wolf'});
                        Toast.fail(`${this.props.room.player_index[this.props.room.player_selectedid]}号是狼人`, 2);
                    }
                    else
                    {
                        this.setState({seercontent:`${this.props.room.player_index[this.props.room.player_selectedid]}号是好人`});
                        this.setState({seertitle:'good'});
                        Toast.success(`${this.props.room.player_index[this.props.room.player_selectedid]}号是好人`, 2);
                    }
                };
                this.setState({extrafun:press});
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
                    //TODO:守卫接口尚未定义
                };
                this.setState({visible:true});
            }
        }

    }
    _renderPicker(list){
        let res = [];
        res = list.map((item, i) => {
            return (
                <Picker.Item key={i} label={`${i+1}号玩家`} value={`${i+1}号玩家`}/>
            )
        });
        return res;
    };
    _renderMsg(list){
        let res = [];
        res = list.map((item, i) => {
            return (
                <ListItem
                    key={item.key}
                    roundAvatar
                    avatar={{uri:this.props.room.player_avatar[item.user_id]}}
                    title={`${this.props.room.player_index[item.user_id]}号:${item.content}`}
                />
            )
        });
        return res;
    };
    sendWolfMsg(data)
    {
        if(this.props.room.hassocket)
        {
            msg=JSON.stringify({
                type:'5',
                request_id:this.props.room.user_request_id.toString(),
                room_id:this.props.room.room_id,
                user_id:this.props.room.client_id,
                object_id:this.props.room.client_id,
                action:'6',
                content:data,
            });
            this.props.room.socket.send(msg);
            this.props.dispatch({
                type: 'room/WebSocketsend',
                payload: {msg},
            });
        }
    }
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
                                { this._renderMsg(this.props.room.wolf_msg) }
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
                            onPress={()=>this.sendWolfMsg(this.state.msg1_1+this.state.msg1_2+this.state.msg1_3)}
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
                            onPress={()=>this.sendWolfMsg(this.state.msg2_1+this.state.msg2_2)}
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
                image={require('../images/skill/save.png')}
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
                image={require('../images/skill/kill.png')}
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
                image={require('../images/skill/seer.png')}
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
                image={require('../images/skill/cupid.png')}
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
                image={require('../images/skill/hunter.png')}
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
                image={require('../images/skill/guard.png')}
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
                image={require('../images/skill/wolfkill.png')}
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
                image={require('../images/skill/suicide1.png')}
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
    _rendervotebutton()
    {
        if(this.props.room.curstate==StateConst.sheriffvote)
        {
            return(
                <View style={{marginTop:20,alignItems: 'center', justifyContent: 'center',height:60,width:Dimensions.get('window').width}}>
                    <Button
                        raised
                        icon={{name: 'done'}}
                        title='投票'
                        backgroundColor='#fd661b'
                        buttonStyle={{height:40,width:Dimensions.get('window').width*0.4}}
                        onPress={()=>this.VoteOnConfirm('sheriff')}
                    />
                </View>
            );
        }
        else if(this.props.room.curstate==StateConst.dayvote)
        {
            return(
                <View style={{marginTop:20,alignItems: 'center', justifyContent: 'center',height:60,width:Dimensions.get('window').width}}>
                    <Button
                        raised
                        icon={{name: 'done'}}
                        title='投票'
                        backgroundColor='#fd661b'
                        buttonStyle={{height:40,width:Dimensions.get('window').width*0.4}}
                        onPress={()=>this.VoteOnConfirm('day')}
                    />
                </View>
            );
        }
        else
        {
            return(<View/>);
        }
    }
    VoteOnConfirm(type){
        if(this.props.room.player_selectedid=="")
        {
            this.setState({modaltitle:"出错啦"});
            this.setState({modalcontent:"您没有选择任何玩家，请在上方点选要投票的玩家后再投票"});
            this.setState({visible1:true});
            return;
        }
        if(type=='sheriff')
        {
            this.setState({modaltitle:"请确认"});
            this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家,您确认要选他当警长么?`});
            press=()=>{
                this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                if(this.props.room.hassocket)
                {
                    msg=JSON.stringify({
                        type:'7',
                        request_id:this.props.room.user_request_id.toString(),
                        room_id:this.props.room.room_id,
                        user_id:this.props.room.client_id,
                        object_id:this.props.room.player_selectedid,
                    });
                    this.props.room.socket.send(msg);
                    this.props.dispatch({
                        type: 'room/WebSocketsend',
                        payload: {msg},
                    });
                }
            };
            this.setState({extrafun:press});
            this.setState({visible1:true});
        }
        else if(type=='day')
        {
            this.setState({modaltitle:"请确认"});
            this.setState({modalcontent:`您选择的是${this.props.room.player_index[this.props.room.player_selectedid]}号玩家,您确认要投票给他么?`});
            press=()=>{
                this.props.dispatch({ type: 'room/changeNextStep',payload:true});
                if(this.props.room.hassocket)
                {
                    msg=JSON.stringify({
                        type:'10',
                        request_id:this.props.room.user_request_id.toString(),
                        room_id:this.props.room.room_id,
                        user_id:this.props.room.client_id,
                        object_id:this.props.room.player_selectedid,
                    });
                    this.props.room.socket.send(msg);
                    this.props.dispatch({
                        type: 'room/WebSocketsend',
                        payload: {msg},
                    });
                }
            };
            this.setState({extrafun:press});
            this.setState({visible1:true});
        }
    }
    prepend(arr, item) {
        return [item].concat(arr);
    };
    genVoteResult()
    {
        let list=[];
        for (let key of Object.keys(this.props.room.lastvote)) {
            let idx=list.findIndex(x => x.userid==this.props.room.lastvote[key]);
            if(idx!=-1)
            {
                list[idx].votelist.push(this.props.room.player_index[key]);
                list[idx].votecount++;
            }
            else
            {
                let newitem={
                        userindex:this.props.room.player_index[this.props.room.lastvote[key]],
                        userid:this.props.room.lastvote[key],
                        username:this.props.room.player_nick[this.props.room.lastvote[key]],
                        votecount:1,
                        avatar_url:this.props.room.player_avatar[this.props.room.lastvote[key]],
                        votelist:[this.props.room.player_index[key]],
                    };
                    list.push(newitem);
            }
        }
        list.sort(function (a, b) {
            return b.votecount-a.votecount;
        });
        return list;
    }
    sheriffconfirm(type){
        this.props.dispatch({ type: 'room/changeNextStep',payload:true});
        if(this.props.room.hassocket)
        {
            msg=JSON.stringify({
                type:'6',
                request_id:this.props.room.user_request_id.toString(),
                room_id:this.props.room.room_id,
                user_id:this.props.room.client_id,
                sheriff:type,
            });
            this.props.room.socket.send(msg);
            this.props.dispatch({
                type: 'room/WebSocketsend',
                payload: {msg},
            });
        }
        this.setState({visible:false});
        this.props.dispatch({
            type: 'room/setsheriffmodal',
            payload: false,
        });
    }
    initPage(){
        if((this.props.room.curstate==StateConst.cupid&&this.props.room.player_role[this.props.room.client_id]=='cupid')||
            (this.props.room.curstate==StateConst.guard&&this.props.room.player_role[this.props.room.client_id]=='guard')||
            (this.props.room.curstate==StateConst.seer&&this.props.room.player_role[this.props.room.client_id]=='seer')||
            (this.props.room.curstate==StateConst.witch&&this.props.room.player_role[this.props.room.client_id]=='witch')||
            (this.props.room.curstate==StateConst.wolf&&this.props.room.player_role[this.props.room.client_id]=='wolf'))
        {
            return 0;
        }
        else
            return 1;

    }
    render() {
        const window = Dimensions.get('window');
        return (

            <ScrollableTabView
                style={{marginTop: 0, height:1000,}}
                initialPage={this.initPage()}
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
                            <Text style={{marginTop:20,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                                {this.state.modalcontent}
                            </Text>
                            <View style={{flexDirection:'row',alignItems: 'center'}}>
                                <Button
                                    raised
                                    icon={{name: 'clear'}}
                                    title='取消'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={this.onClose}
                                />
                                <Button
                                    raised
                                    icon={{name: 'done'}}
                                    title='确认'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={this.onConfirm}
                                />
                            </View>
                        </View>
                    </Modal>
                    <Modal
                        title={"提示"}
                        closable
                        maskClosable
                        transparent
                        onClose={()=>this.sheriffconfirm('false')}
                        visible={this.props.room.sheriff_modal}
                        style={{height:200,width:300,alignItems: 'center'}}
                    >
                        <View style={{alignItems: 'center'}}>
                            <Text style={{marginTop:20,
                                justifyContent: 'center',
                                alignItems: 'center',fontSize: PixelRatio.getPixelSizeForLayoutSize(10) ,}}>
                                请确认是否要竞选警长
                            </Text>
                            <View style={{flexDirection:'row',alignItems: 'center'}}>
                                <Button
                                    raised
                                    icon={{name: 'clear'}}
                                    title='否'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={()=>this.sheriffconfirm('false')}
                                />
                                <Button
                                    raised
                                    icon={{name: 'done'}}
                                    title='是'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={()=>this.sheriffconfirm('true')}
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
                    {this._rendervotebutton()}
                    <VoteResult
                        containerStyle={{width:window.width}}
                        datasource={this.genVoteResult()}
                    />
                    <Modal
                        title={this.state.modaltitle}
                        closable
                        maskClosable
                        transparent
                        onClose={this.onClose}
                        visible={this.state.visible1}
                        style={{height:200,width:300,alignItems: 'center'}}
                    >
                        <View style={{alignItems: 'center'}}>
                            <Text style={{marginTop:20,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                                {this.state.modalcontent}
                            </Text>
                            <View style={{flexDirection:'row',alignItems: 'center'}}>
                                <Button
                                    raised
                                    icon={{name: 'clear'}}
                                    title='取消'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={this.onClose}
                                />
                                <Button
                                    raised
                                    icon={{name: 'done'}}
                                    title='确认'
                                    backgroundColor='#fd661b'
                                    buttonStyle={{margin:40,height:40,width:100}}
                                    onPress={this.onConfirm}
                                />
                            </View>
                        </View>
                    </Modal>
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
    image: {
        width: 88,
        height: 88
    }
});
