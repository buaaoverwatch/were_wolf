/**
 * Created by shi on 2016/10/31.
 */
import React, { Component } from 'react';
import { Alert,View } from 'react-native';
import { connect } from 'dva/mobile';
import {Actions} from 'react-native-router-flux';
import state from '../consts/roomstate';
import IP from '../consts/ip';
import Toast from 'antd-mobile/lib/toast';
import Sound from 'react-native-sound';

class Socket extends Component {
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props);
        // 设置初始状态
        const { room,dispatch } = props;
        this.state = {
            laststate:state.waitngplayer,
            connected:false,
            dispatch:dispatch,
            room:room,
        };
        this.handlesocket = this.handlesocket.bind(this);
        this.sendcomfirm = this.sendcomfirm.bind(this);
    }

    componentWillMount() {
        if(!this.props.room.hassocket)
        {
            this.handlesocket();
            console.log("socket success");
        }
    }

    handlesocket() {
        this.setState({connected:false});
        console.log("setSocket! ");
        console.log("roomid: " + this.props.room.room_id);
        ws = new WebSocket(IP.wsip+':8000/' + this.props.room.room_id);
        ws.onopen = () => {
            // connection opened
            console.log('OK');
            this.setState({connected:true});
            //ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
            // a message was received
            console.log('onmessage data:');
            console.log(e.data);
            console.log('msg:');
            msg=JSON.parse(e.data);
            if(e.data)
            {
                if(msg.type==='0')
                {
                    if(msg.user_request_id===this.props.room.user_request_id.toString())//收到了发送消息的确认消息
                    {
                        console.log('add request id');
                        console.log(msg);
                        this.state.dispatch({
                            type: 'room/addUserRequestID',
                        });

                        //room.user_request_id=room.user_request_id+1;看一下
                        this.state.dispatch({
                            type: 'room/hideLoading',
                        });

                        //TODO:loading置false
                    }
                }
                else
                {
                    console.log("start");
                    console.log('room.room_request_id: ' + this.props.room.room_request_id);
                    console.log('msg.room_request_id: ' + msg.room_request_id);
                    this.sendcomfirm(msg);
                    //if(msg.room_request_id>=this.props.room.room_request_id)
                    if(parseInt(msg.room_request_id)>parseInt(this.props.room.room_request_id))
                    {
                        //修改当前回调函数中的局部值
                        //this.props.room.room_request_id=(parseInt(msg.room_request_id)+1).toString();
                        //room.room_request_id=msg.room_request_id;
                        //修改room model中的值
                        this.state.dispatch({
                            type: 'room/setRoomRequestID',
                            payload: msg.room_request_id,
                        });
                        if(msg.type==='2')
                        {
                            this.state.dispatch({
                                type: 'room/joinroom',
                                payload: msg.id_nick
                            });
                            console.log("ws:");
                            console.log(msg.id_nick);
                        }
                        else if(msg.type==='3')
                        {//这里要改的是index_player不是player_index
                            if(msg.result=="true") {
                                console.log('choose seat result:');
                                console.log(msg);
                                this.state.dispatch({
                                    type:'room/setplayerindex',
                                    payload:{
                                        u_id:msg.user_id,
                                        seat:msg.seat,
                                    },
                                });

                                this.state.dispatch({
                                    type:'room/playerindex2indexplayer',
                                    payload:{
                                        u_id:msg.user_id,
                                        seat:parseInt(msg.seat),
                                    },
                                });

                                if(msg.user_id===this.props.room.client_id) {
                                    this.state.dispatch({
                                        type: 'room/changeloading',
                                        payload: false,
                                    });
                                }
                            }
                            else {
                                if(msg.user_id===this.props.room.client_id) {
                                    this.state.dispatch({
                                        type:'room/changeloading',
                                        payload:false,
                                    });
                                    Alert.alert(
                                        '选位失败',
                                        '请重新选择你的座位',
                                        [
                                            {text: '好的', onPress: () => console.log('OK Pressed!')},
                                        ]
                                    )
                                }
                            }
                        }
                        else if(msg.type==='4')
                        {
                            this.state.dispatch({
                                type:'room/changeloading',
                                payload:false,
                            });
                            console.log("4564545644");
                            this.state.dispatch({
                                type:'room/setrolelist',
                                payload:msg.list,
                            });
                            console.log("4564545644sf");
                            this.state.dispatch({
                                type:'room/set_index_id',
                            });
                            console.log("456454564sdfdsf4");
                            Actions.seeMySelf();
                        }
                        else if(msg.type==='5')//房间状态改变
                        {
                            this.setState({laststate:this.props.room.curstate});
                            this.state.dispatch({
                                type: 'room/setroomstate',
                                payload: msg.room_state
                            });
                            //room.curstate = msg.room_state;
                            if(this.state.laststate == state.checkrole) {
                                this.state.dispatch({
                                    type:'room/changeloading',
                                    payload:false,
                                });
                                Toast.success("进入黑夜！", 1);
                                Actions.Test1();
                            }
                            if((msg.room_state == state.daytalk && this.state.laststate != state.lastword) ||
                                msg.room_state == state.lastword){
                                //白天发言阶段 将之前的保存的存活状态更新
                                this.state.dispatch({
                                    type: 'room/updatealive'
                                });
                            }
                            this.playSound(msg.room_state);
                            //TODO：根据角色是否存活来决定下一步操作
                            if(msg.role_alive == 'false' && (msg.room_state == state.guard ||
                                msg.room_state == state.witch || msg.room_state == state.seer)){
                                this.state.dispatch({
                                    type: 'room/timerstate'
                                });
                            }
                            if(msg.room_state == state.sheriffchoose) {
                                //选择竞选警长，弹框
                                this.state.dispatch({
                                    type: 'room/setsheriffmodal',
                                    payload: true,
                                });
                            }
                        }
                        else if(msg.type==='6')//狼人选人 Checked!
                        {
                            let m={
                                wolf_id:msg.wolf_id,
                                object_id:msg.object_id,
                            };
                            if(msg.action=='0')//选人
                            {
                                this.state.dispatch({
                                    type: 'room/setWolfVote' ,
                                    payload:m,
                                });
                            }
                            else if(masg.action=='1')//杀人
                            {
                                this.state.dispatch({
                                    type: 'room/setkillid_wolf' ,
                                    payload:msg.object_id,
                                });
                            }


                        }
                        else if(msg.type==='7')//角色存活状态变化
                        {
                            if(msg.role == "wolf") {
                                for(let key in msg.change) {
                                    if(msg.change[key] != 'false') {
                                        console.log("狼人把人救活了？？？");
                                        break;
                                    }
                                    this.state.dispatch({
                                        type: 'room/setlastwolf',
                                        payload: key
                                    });
                                    break;
                                }
                            } else if(msg.role == 'witch') {
                                for(let key in msg.change) {
                                    if(msg.change[key] == 'true') {
                                        console.log("女巫救了：" + key);
                                        this.state.dispatch({
                                            type: 'room/setlastwitchsave',
                                            payload: key
                                        });
                                    } else if(msg.change[key] == 'false') {
                                        console.log("女巫毒了：" + key);
                                        this.state.dispatch({
                                            type: 'room/setlastwitchkill',
                                            payload: key
                                        });
                                    } else {
                                        console.log("角色改变错误：" + msg.changg[key]);
                                    }
                                }
                            } else {
                                console.log("出现了未知角色：" + msg.role);
                            }
                        }
                        else if(msg.type==='8')//参与警长竞选人员表
                        {
                            this.state.dispatch({
                                type: 'room/setjoinsheriff',
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='9')//警长投票结果
                        {
                            this.state.dispatch({
                                type: 'room/setlastvote',
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='10')//警徽归属
                        {
                            this.state.dispatch({
                                type: 'room/setsheriff' ,
                                payload:msg.list,
                            });
                        } else if(msg.type == '11') { //断线重连 获取房间信息

                        } else if(msg.type == '12') { //游戏结束
                            this.state.dispatch({
                                type: 'room/setresult',
                                payload: msg.reason
                            });
                            Actions.Gameover();
                        } else if(msg.type == '13') { //离开房间

                        }
                        else if(msg.type==='14') { //狼人聊天
                            let m={
                                user_id:msg.user_id,
                                content:msg.content,
                            };
                            this.state.dispatch({
                                type: 'room/setWolfMsg' ,
                                payload:m,
                            });
                        } else if(msg.type == '15') { //守卫
                            this.state.dispatch({
                                type: 'room/setlastguard',
                                payload: msg.user_id
                            });
                        } else if(msg.type == '16') { //情侣
                            console.log("lover1_id: " + msg.user1_id);
                            console.log("lover2_id: " + msg.user2_id);
                            this.state.dispatch({
                                type: 'room/setLoverID',
                                payload:{
                                    lover_id1: msg.user1_id,
                                    lover_id2: msg.user2_id
                                }
                            });
                        } else if(msg.type == '17') { //白天投票结果
                            if(msg.result == 'true') {
                                this.state.dispatch({
                                    type: 'room/setlastvote',
                                    payload: msg.list
                                });
                            } else if(msg.result == 'false') {
                                //TODO: 平票的话，提示玩家重新投票
                            } else {
                                console.log("error");
                            }
                        } else if(msg.type === '18') {
                            this.state.dispatch({
                                type:'room/changeloading',
                                payload:false,
                            });
                            if(msg.result == 'true') {
                                Toast.success("锁定房间成功！", 1);
                                Actions.ChooseSeat();
                            } else {
                                Toast.fail("锁定房间失败，请重新锁定！", 1);
                            }
                        }
                    }
                }
            }
        };

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
            console.log('sss');
        };

        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
            console.log('ssss');
            connected=false;
        };
        this.state.dispatch({
            type: 'room/setsocket' ,
            payload:ws,
        });
    }

    playSound(curstate) {
        if(this.state.room.client_id != this.state.room.owner_id)
            return;
        switch (curstate) {
            case state.cupid: s = new Sound('nightbegin.mp3', Sound.MAIN_BUNDLE, (e) => {
                    if (e) {
                        console.log('error', e);
                    } else {
                        s.play((success) => {
                            if (success) {
                                console.log('successfully finished playing');
                                s1 = new Sound('cupid.mp3', Sound.MAIN_BUNDLE, (e) => {
                                    if (e) {
                                        console.log('error', e);
                                    } else {
                                        s1.play();
                                    }
                                });
                            } else {
                                console.log('playback failed due to audio decoding errors');
                            }
                        });
                    }
                });
                break;
            case state.lover:
                s = new Sound('lover.mp3', Sound.MAIN_BUNDLE, (e) => {
                    if(e) {
                        console.log('error', e);
                    } else {
                        s.play();
                    }
                });
                break;
            case state.wolf:
                if(this.state.laststate == state.checkrole) {
                    s = new Sound('nightbegin.mp3', Sound.MAIN_BUNDLE, (e) => {
                        if (e) {
                            console.log('error', e);
                        } else {
                            s.play((success) => {
                                if (success) {
                                    console.log('successfully finished playing');
                                    s1 = new Sound('wolf.mp3', Sound.MAIN_BUNDLE, (e) => {
                                        if (e) {
                                            console.log('error', e);
                                        } else {
                                            s1.play();
                                        }
                                    });
                                } else {
                                    console.log('playback failed due to audio decoding errors');
                                }
                            });
                        }
                    });
                } else {
                    s = new Sound('wolf.mp3', Sound.MAIN_BUNDLE, (e) => {
                        if (e) {
                            console.log('error', e);
                        } else {
                            s.play();
                        }
                    });
                }
                break;
            case state.guard:
                if(this.state.laststate == state.checkrole) {
                    s = new Sound('nightbegin.mp3', Sound.MAIN_BUNDLE, (e) => {
                        if (e) {
                            console.log('error', e);
                        } else {
                            s.play((success) => {
                                if (success) {
                                    console.log('successfully finished playing');
                                    s1 = new Sound('guard.mp3', Sound.MAIN_BUNDLE, (e) => {
                                        if (e) {
                                            console.log('error', e);
                                        } else {
                                            s1.play();
                                        }
                                    });
                                } else {
                                    console.log('playback failed due to audio decoding errors');
                                }
                            });
                        }
                    });
                } else {
                    s = new Sound('guard.mp3', Sound.MAIN_BUNDLE, (e) => {
                        if (e) {
                            console.log('error', e);
                        } else {
                            s.play();
                        }
                    });
                }
                break;
            case state.witch:
                s = new Sound('witch.mp3', Sound.MAIN_BUNDLE, (e) => {
                    if(e) {
                        console.log('error', e);
                    } else {
                        s.play();
                    }
                });
                break;
            case state.seer:
                s = new Sound('seer.mp3', Sound.MAIN_BUNDLE, (e) => {
                    if(e) {
                        console.log('error', e);
                    } else {
                        s.play();
                    }
                });
                break;
            default:
                break;
        }
    }

    sendcomfirm(data){
        if (data.type!='0')
        {
            console.log("room_id: " + this.props.room.room_id);
            msg1=JSON.stringify({
                type: '0',
                room_id:this.props.room.room_id.toString(),
                user_id:this.props.room.client_id,
                room_request_id:data.room_request_id.toString(),
            });
            console.log('send confirm msg:');
            console.log(msg1);
            ws.send(msg1) ;
        }
    }

    render(){
        return (
            <View style={{height: 0}}>
            </View>
        );
    }

}

export default connect(room => room)(Socket);
