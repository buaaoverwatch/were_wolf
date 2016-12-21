/**
 * Created by shi on 2016/10/31.
 */
import React, { Component } from 'react';
import { Alert,View } from 'react-native';
import dva, { connect } from 'dva/mobile';
import Button from 'antd-mobile/lib/button';
import {Actions} from 'react-native-router-flux';
import state from '../consts/roomstate';
import IP from '../consts/ip';
import Toast from 'antd-mobile/lib/toast';


const Socket = (props) => {
    const { dispatch,room} = props;
    let laststate;
    function handlesocket()
    {
        connected=false;
        console.log("roomid: " + room.room_id);
        ws = new WebSocket(IP.wsip+':8000/' + room.room_id);
        ws.onopen = () => {
            // connection opened
            console.log('OK');
            connected=true;
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

                    if(msg.user_request_id===room.user_request_id.toString())//收到了发送消息的确认消息
                    {
                        console.log('add request id');
                        console.log(msg);
                        dispatch({
                            type: 'room/addUserRequestID',
                        });

                        room.user_request_id=room.user_request_id+1;
                        dispatch({
                            type: 'room/hideLoading',
                        });

                        //TODO:loading置false
                    }
                }
                else
                {
                    console.log("start");
                    console.log('room.room_request_id: ' + room.room_request_id);
                    console.log('msg.room_request_id: ' + msg.room_request_id);
                    sendcomfirm(msg);
                    //if(msg.room_request_id>=room.room_request_id)
                    if(parseInt(msg.room_request_id)>parseInt(room.room_request_id))
                    {
                        //修改当前回调函数中的局部值
                        //room.room_request_id=(parseInt(msg.room_request_id)+1).toString();
                        room.room_request_id=msg.room_request_id;
                        //修改room model中的值
                        dispatch({
                            type: 'room/setRoomRequestID',
                            payload: room.room_request_id,
                        });
                        if(msg.type==='2')
                        {
                            dispatch({
                                type: 'room/joinroom',
                                payload: msg.id_nick
                            });
                            console.log("ws:");
                            console.log(msg.id_nick);
                        }
                        else if(msg.type==='3') {//这里要改的是index_player不是player_index
                            if(msg.result=="true") {
                                console.log('choose seat result:');
                                console.log(msg);
                                dispatch({
                                    type:'room/setplayerindex',
                                    payload:{
                                        u_id:msg.user_id,
                                        seat:msg.seat,
                                    },
                                });

                                dispatch({
                                    type:'room/playerindex2indexplayer',
                                    payload:{
                                        u_id:msg.user_id,
                                        seat:parseInt(msg.seat),
                                    },
                                });

                                if(msg.user_id===room.client_id) {
                                    dispatch({
                                        type: 'room/changeloading',
                                        payload: false,
                                    });
                                }
                            }
                            else {
                                if(msg.user_id===room.client_id) {
                                    dispatch({
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
                            dispatch({
                                type:'room/changeloading',
                                payload:false,
                            });
                            console.log("4564545644");
                            dispatch({
                                type:'room/setrolelist',
                                payload:msg.list,
                            });
                            console.log("4564545644sf");
                            dispatch({
                                type:'room/set_index_id',
                            });
                            console.log("456454564sdfdsf4");
                            Actions.seeMySelf();
                        }
                        else if(msg.type==='5')//房间状态改变
                        {
                            laststate = room.curstate;
                            dispatch({
                                type: 'room/setroomstate',
                                payload: msg.room_state
                            });
                            room.curstate = msg.room_state;
                            if(laststate == state.checkrole) {
                                dispatch({
                                    type:'room/changeloading',
                                    payload:false,
                                });
                                Toast.success("进入黑夜！", 1);
                                Actions.Test1();
                            }
                            if(msg.room_state == state.daytalk) {
                                //白天发言阶段 将之前的保存的存活状态更新
                                dispatch({
                                    type: 'room/updatealive'
                                });
                            }
                            //TODO：根据角色是否存活来决定下一步操作
                            if(msg.role_alive == 'false' && (msg.room_state == state.guard ||
                                msg.room_state == state.witch || msg.room_state == state.seer)){
                                dispatch({
                                    type: 'room/timerstate'
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
                                dispatch({
                                    type: 'room/setWolfVote' ,
                                    payload:m,
                                });
                            }
                            else if(masg.action=='1')//杀人
                            {
                                dispatch({
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
                                    dispatch({
                                        type: 'room/setlastwolf',
                                        payload: key
                                    });
                                    break;
                                }
                            } else if(msg.role == 'witch') {
                                for(let key in msg.change) {
                                    if(msg.change[key] == 'true') {
                                        console.log("女巫救了：" + key);
                                        dispatch({
                                            type: 'room/setlastwitchsave',
                                            payload: key
                                        });
                                    } else if(msg.change[key] == 'false') {
                                        console.log("女巫毒了：" + key);
                                        dispatch({
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
                            dispatch({
                                type: 'room/setjoinsheriff',
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='9')//警长投票结果
                        {
                            dispatch({
                                type: 'room/setlastvote',
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='10')//警徽归属
                        {
                            dispatch({
                                type: 'room/setsheriff' ,
                                payload:msg.list,
                            });
                        } else if(msg.type == '11') { //断线重连 获取房间信息

                        } else if(msg.type == '12') { //游戏结束

                        } else if(msg.type == '13') { //离开房间

                        }
                        else if(msg.type==='14') { //狼人聊天
                            let m={
                                user_id:msg.user_id,
                                content:msg.content,
                            };
                            dispatch({
                                type: 'room/setWolfMsg' ,
                                payload:m,
                            });
                        } else if(msg.type == '15') { //守卫
                            dispatch({
                                type: 'room/setlastguard',
                                payload: msg.user_id
                            });
                        } else if(msg.type == '16') { //情侣
                            dispatch({
                                type: 'room/setLoverID',
                                payload:{
                                    lover_id1: msg.user1_id,
                                    lover_id2: msg.user2_id
                                }
                            });
                        } else if(msg.type == '17') { //白天投票结果
                            if(msg.result == 'true') {
                                dispatch({
                                    type: 'room/setlastvote',
                                    payload: msg.list
                                });
                            } else if(msg.result == 'false') {
                                //TODO: 平票的话，提示玩家重新投票
                            } else {
                                console.log("error");
                            }
                        } else if(msg.type === '18') {
                            dispatch({
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
        dispatch({
            type: 'room/setsocket' ,
            payload:ws,
        });
    }
    function handleclick()
    {
        if(connected)
        {
            msg1=JSON.stringify({
                type:100,
                request_id:room.user_request_id.toString(),
                room_id:room.room_id,
                user_id:room.client_id,
                seat:100,
            });
            ws.send(msg1);
            dispatch({
                type: 'room/WebSocketsend',
                payload: {msg1},
            });
            console.log('Ol'+room.user_request_id);
        }
    }
    function sendcomfirm(data) {
        if (data.type!='0')
        {
            console.log("room_id: " + props.room.room_id);
            msg1=JSON.stringify({
                type: '0',
                room_id:props.room.room_id.toString(),
                user_id:props.room.client_id,
                room_request_id:data.room_request_id.toString(),
            });
            console.log('send confirm msg:');
            console.log(msg1);
            ws.send(msg1) ;
        }
    }
    if(props.room.hassocket == false) {
        handlesocket();
        console.log('socket success', 1);
    }
    return (
        <View style={{flex: 1, height: 0}}>
        </View>
    );
};

export default connect(room=>room)(Socket)
