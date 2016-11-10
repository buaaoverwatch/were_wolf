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
        ws = new WebSocket('ws://115.29.193.48:8088');
        ws.onopen = () => {
            // connection opened
            console.log('OK');
            connected=true;
            //ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
            // a message was received
            console.log(e.data);
            sendcomfirm(e.data);
            if(e.data)
            {
                if(e.data.type===3)
                {
                    if(e.data.result)//返回true时修改自己的座位
                    {
                        dispatch({
                        type: 'room/changeplayerindex',
                        payload: e.data.result,
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
                        type: 'room/changechooseseatloading',
                        payload:false,
                    })
                }
                else if(e.data.type===5)
                {
                    dispatch({
                        type: 'room/setroomstate' ,
                        payload:e.data.room_state,
                    });
                }
                else if(e.data.type===6)
                {
                    dispatch({
                        type: 'room/setroomstate' ,
                        payload:e.data.room_state,
                    });
                }
                else if(e.data.type===7)
                {
                    let alivelist={...room.player_alive,...e.data.change};
                    dispatch({
                        type: 'room/setalive' ,
                        payload:alivelist,
                    });
                }
                else if(e.data.type===8)
                {
                    dispatch({
                        type: 'room/setsherifflist' ,
                        payload:e.data.list,
                    });
                }
                else if(e.data.type===9)
                {
                    dispatch({
                        type: 'room/setlastvote' ,
                        payload:e.data.list,
                    });
                }
                else if(e.data.type===10)
                {
                    dispatch({
                        type: 'room/setsheriff' ,
                        payload:e.data.sheriff_id,
                    });
                }
            }


        };

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
        };

        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
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
            ws.send('something');
            console.log('Ol');
        }
    };
    function sendcomfirm(data) {
        if (data.type!=0)
        {
            let msg={
                type: 0,
                room_id:room.room_id,
                user_id:room.client_id,
                room_request_id:room.request_id,
            };
            ws.send(msg);
        }
    }
    return (
        <View>
            <Button onClick={handleclick}>Start</Button>
            <Button onClick={handlesocket}>Socket</Button>
        </View>
    );
};

export default connect(room=>room)(Socket)
