/**
 * Created by shi on 2016/10/31.
 */
import React, { Component } from 'react';
import { View } from 'react-native';
import dva, { connect } from 'dva/mobile';
import Button from 'antd-mobile/lib/button';
import {Actions} from 'react-native-router-flux';


const Socket = (props) => {
    const { dispatch,count} = props;
    function handlesocket()
    {
        connected=false;
        ws = new WebSocket('ws://115.29.193.48:8088');
        ws.onopen = () => {
            // connection opened
            dispatch({
                type: 'count/settext' ,
                payload:'opened',
            });
            console.log('OK');
            connected=true;
            //ws.send('something'); // send a message
        };

        ws.onmessage = (e) => {
            // a message was received
            console.log(e.data);
            dispatch({
                type: 'count/settext' ,
                payload:e.data,
            });
            dispatch({
                type: 'count/newmessage' ,
                payload:e.data,
            });

        };

        ws.onerror = (e) => {
            // an error occurred
            console.log(e.message);
            dispatch({
                type: 'count/settext' ,
                payload:'err',
            });
        };

        ws.onclose = (e) => {
            // connection closed
            console.log(e.code, e.reason);
            dispatch({
                type: 'count/settext' ,
                payload:'close',
            });
            connected=false;
        };
        dispatch({
            type: 'count/setsocket' ,
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
        props.dispatch({
            type: 'count/settext' ,
            payload:'clicked',
        });
    };
    return (
        <View>
            <Button onClick={handleclick}>Start</Button>
            <Button onClick={handlesocket}>Socket</Button>
        </View>
    );
};

export default connect(count=>count)(Socket)
