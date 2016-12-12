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
            console.log(e.data);
            if(e.data)
            {
                msg=JSON.parse(e.data);
                if(msg.type==='0')
                {
                    console.log(room.user_request_id);
                    if(msg.user_request_id==room.user_request_id.toString())//收到了发送消息的确认消息
                    {
                        dispatch({
                            type: 'room/addUserRequestID',
                        });
                        room.user_request_id=room.user_request_id+1;
                        dispatch({
                            type: 'room/hideLoading',
                        });
                        dispatch({
                            type: 'room/changeselid_wolf',
                        });

                        //TODO:loading置false
                    }
                }
                else
                {
                    console.log("1111");
                    sendcomfirm(msg);
                    if(msg.room_request_id>=room.room_request_id)
                    {
                        //修改当前回调函数中的局部值
                        room.room_request_id=msg.room_request_id;
                        //修改room model中的值
                        dispatch({
                            type: 'room/setRoomRequestID',
                            payload: msg.room_request_id,
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
                                        seat:paseInt(msg.seat),
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
                            dispatch({
                                type:'room/setrolelist',
                                payload:msg.list,
                            });
                            dispatch({
                                type:'room/set_index_id',
                                payload:room.index_player,
                            });
                            Actions.seeMySelf();

                        }
                        else if(msg.type==='5')//房间状态改变
                        {
                            laststate = room.curstate;
                            dispatch({
                                type: 'room/setroomstate',
                                payload: msg.room_state
                            });
                            dispatch({
                                type: 'room/setrolealive',
                                payload: msg.role_alive
                            });
                            let list = msg.request_content;
                            let temp;
                            for(let i = 0; i < list.length; i++) {
                                temp = list[i];
                                if(!(temp.type == 6 || temp.type == 7
                                    || temp.type == 8 || temp.type == 9)) {
                                    console.log("invalid type: " + temp.type);
                                    continue;
                                }
                                switch (temp.type) {
                                    case 6: //狼人选人、杀人
                                        if(temp.action == 0 || msg.room_state != state.witch || laststate != state.wolf) {
                                            break;//狼人选人信息不处理 若状态不是狼人到女巫也不处理
                                        }
                                        dispatch({
                                            type: 'room/setkillid_wolf',
                                            payload: temp.object_id
                                        });
                                        break;
                                    case 7: //角色存活状态变化
                                        if(laststate == state.guard && msg.room_state == state.wolf && temp.role == "guard") {
                                            for(let key in temp.change) {
                                                if(change[key] == true) {
                                                    dispatch({
                                                        type: 'room/setlastguard',
                                                        payload: key
                                                    });
                                                    console.log("守卫守人id：" + key);
                                                } else {
                                                    console.log("守卫把人守死了？");
                                                }
                                            }
                                        } else if(laststate == state.wolf && msg.room_state == state.witch && temp.role == "wolf") {
                                            for(let key in temp.change) {
                                                if(change[key] == false) {
                                                    dispatch({
                                                        type: 'room/setkillid_wolf',
                                                        payload: key
                                                    });
                                                    console.log("狼人杀人id：" + key);
                                                } else {
                                                    console.log("狼人把人救活了？");
                                                }
                                            }
                                        } else if(laststate == state.witch && msg.room_state == state.seer && temp.role == "witch") {
                                            for(let key in temp.change) {
                                                if(change[key] == true) {
                                                    dispatch({
                                                        type: 'room/setlastwitchsave',
                                                        payload: key
                                                    });
                                                    console.log("女巫救人id:" + key);
                                                } else if(change[key] == false) {
                                                    dispatch({
                                                        type: 'room/setlastwitchkill',
                                                        payload: key
                                                    });
                                                    console.log("女巫毒人id：" + key);
                                                } else {
                                                    console.log("格式不是bool型");
                                                }
                                            }
                                        } else {
                                            console.log("这个阶段不应该有角色存活转变");
                                        }
                                        break;
                                    case 8: //竞选警长名单
                                        if(laststate == state.sheriffchoose && msg.room_state == state.sherifftalk) {
                                            dispatch({
                                                type: 'room/setjoinsheriff',
                                                payload: temp.list
                                            });
                                        } else {
                                            console.log("此时不应该有竞选警长名单");
                                        }
                                        break;
                                    case 9: //投票结果
                                        if((msg.room_state == state.daytalk && laststate == state.sheriffvote)
                                            || (msg.room_state == state.hunter && (laststate == state.sheriffvote || laststate == state.dayvote))
                                            || (msg.room_state == state.lastword && (laststate == state.sheriffvote || laststate == state.dayvote))) {
                                            //TODO：这里应该根据temp.result是否为false做一些处理
                                            dispatch({
                                                type: 'room/setalastvote',
                                                payload: temp.list
                                            });
                                            alert("请在下方投票栏中查看投票结果");
                                        }
                                        break;
                                    default: //错误情况
                                        console.log("error type: " + temp.type);
                                        break;
                                }
                            }
                            if(msg.room_state == state.daytalk) {
                                //白天发言阶段 将之前的保存的存活状态更新
                                //TODO：加上情侣
                                dispatch({
                                    type: 'room/updatealive'
                                });
                            }
                            //TODO：根据角色是否存活来决定下一步操作
                            if(msg.role_alive == false && (msg.room_state == state.guard ||
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
                        else if(msg.type==='7')//不再实时接收
                        {
                            dispatch({
                                type: 'room/setalive' ,
                                payload:msg.change,
                            });
                        }
                        else if(msg.type==='8')//不再实时接收
                        {
                            dispatch({
                                type: 'room/setsherifflist' ,
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='9')//不再实时接收
                        {
                            dispatch({
                                type: 'room/setlastvote' ,
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='10')//不再实时接收
                        {
                            dispatch({
                                type: 'room/setsheriff' ,
                                payload:msg.list,
                            });
                        }
                        else if(msg.type==='14')
                        {
                            let m={
                                user_id:msg.user_id,
                                content:msg.content,
                            };
                            dispatch({
                                type: 'room/setWolfMsg' ,
                                payload:m,
                            });
                        }
                        else if(msg.type === '18')
                        {
                            if(msg.result == true) {
                                Toast.success("锁定房间成功！", 1);
                                Actions.Chooseseat();
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
                request_id:room.user_request_id,
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
                room_id:props.room.room_id,
                user_id:props.room.client_id,
                room_request_id:data.room_request_id,
            });
            ws.send(msg1);

        }
    }
    return (
        <View>
            <Button onClick={handleclick}>send</Button>
            <Button onClick={()=>{dispatch({
                type: 'room/addstate' ,
            });}}>add</Button>
            <Button onClick={handlesocket}>start</Button>
        </View>
    );
};

export default connect(room=>room)(Socket)
