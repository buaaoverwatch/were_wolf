/**
 * Created by shi on 2016/10/31.
 */
import React, { Component } from 'react';
import { Alert,View } from 'react-native';
import dva, { connect } from 'dva/mobile';
import Button from 'antd-mobile/lib/button';
import {Actions} from 'react-native-router-flux';
import state from '../consts/roomstate';


const Socket = (props) => {
    const { dispatch,room} = props;
    function handlesocket()
    {
        connected=false;
        console.log("roomid: " + room.room_id);
        ws = new WebSocket('ws://10.138.73.83:8000/' + room.room_id);
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
                    if(msg.room_request_id!=room.room_request_id)
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

                        }
                        else if(msg.type==='3')
                        {
                            if(msg.result=="true")
                            {
                                dispatch({
                                    type:'room/setplayerindex',
                                    payload:{
                                        u_id:msg.user_id,
                                        seat:msg.seat,
                                    },
                                });

                            }
                            else
                            {
                                if(msg.user_id===room.client_id)
                                {
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
                                type:'room/setrolelist',
                                payload:msg.list,
                            });
                            if(room.client_id==room.owner_id)
                            {

                            }
                            else
                            {
                                Actions.seeMySelf();
                            }


                        }
                        else if(msg.type==='5')//房间状态改变
                        {
                            dispatch({
                                type: 'room/setroomstate',
                                payload: msg.room_state
                            });
                            dispatch({
                                type: 'room/setrolealive',
                                payload: msg.role_alive
                            });
                            var list = msg.request_content;
                            for(let i = 0; i < list.length; i++) {
                                if(list[i].type == 1 || list[i].type == 2
                                    || list[i].type == 3 || list[i].type == 6
                                    || list[i].type == 12 || list[i].type == 14) {
                                    console.log("invalid type: " + list[i].type);
                                    continue;
                                }
                                switch (list[i].type) {
                                    case 4: //TODO:角色配置后发送分配后的角色信息是否要处理
                                        break;
                                    case 5: //这里应该不会出现上一个下一步吧
                                        break;
                                    case 7: //角色存活状态变化
                                        break;
                                    case 8: //竞选警长名单
                                        break;
                                    case 9: //投票结果
                                        break;
                                    case 10: //警徽归属
                                        break;
                                    case 11: //获取房间信息
                                        break;
                                    case 13: //离开房间
                                        break;
                                    default: //错误情况
                                        console.log("error type: " + list[i].type);
                                        break;
                                }
                            }
                            //TODO：根据角色是否存活来决定下一步操作
                            if(msg.role_alive == false) {

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
            msg=JSON.stringify({
                type:100,
                request_id:room.user_request_id,
                room_id:room.room_id,
                user_id:room.client_id,
                seat:100,
            });
            ws.send(msg);
            dispatch({
                type: 'room/WebSocketsend',
                payload: {msg},
            });
            console.log('Ol'+room.user_request_id);
        }
    }
    function sendcomfirm(data) {
        if (data.type!='0')
        {
            console.log("room_id: " + props.room.room_id);
            msg=JSON.stringify({
                type: '0',
                room_id:props.room.room_id,
                user_id:props.room.client_id,
                room_request_id:data.room_request_id,
            });
            ws.send(msg);

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
