/**
 * Created by shi on 2016/10/31.
 */
import React, { Component } from 'react';
import { Alert,View } from 'react-native';
import dva, { connect } from 'dva/mobile';
import Button from 'antd-mobile/lib/button';
import {Actions} from 'react-native-router-flux';


const Socket = (props) => {
    const { dispatch,room} = props;
    function handlesocket()
    {
        connected=false;
        console.log("roomid: " + props.room_id);
        ws = new WebSocket('ws://10.138.73.83:8000/' + props.room_id);
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
                        if(msg.type===3)
                        {
                            if(msg.result)//返回true时修改自己的座位
                            {
                                dispatch({
                                    type: 'room/changeplayerindex',
                                    payload: msg.result,
                                });
                            }
                            else//否则返回错误消息，不修改座位
                            {
                                Alert.alert(
                                '此座位已被占用！',
                                alertMessage,
                                [
                                    {text: '好的', onPress: () => console.log('OK Pressed!')},
                                ]
                            )
                            }//最终修改loading的状态
                            dispatch({
                                type: 'room/changeloading',
                                payload:false,
                            })
                        }
                        else if(msg.type===4)
                        {

                        }
                        else if(msg.type===5)
                        {
                            dispatch({
                                type: 'room/setroomstate' ,
                                payload:msg.room_state,
                            });
                        }
                        else if(msg.type===6)
                        {
                            dispatch({
                                type: 'room/setroomstate' ,
                                payload:msg.room_state,
                            });
                        }
                        else if(msg.type===7)
                        {
                            dispatch({
                                type: 'room/setalive' ,
                                payload:msg.change,
                            });
                        }
                        else if(msg.type===8)
                        {
                            dispatch({
                                type: 'room/setsherifflist' ,
                                payload:msg.list,
                            });
                        }
                        else if(msg.type===9)
                        {
                            dispatch({
                                type: 'room/setlastvote' ,
                                payload:msg.list,
                            });
                        }
                        else if(msg.type===10)
                        {
                            dispatch({
                                type: 'room/setsheriff' ,
                                payload:msg.list,
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
        if (data.type!=0)
        {
            console.log("room_id: " + props.room.room_id);
            msg=JSON.stringify({
                type: 0,
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
            <Button onClick={handlesocket}>start</Button>
        </View>
    );
};

export default connect(room=>room)(Socket)
