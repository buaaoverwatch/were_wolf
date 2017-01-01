/**
 * Created by Qingchang Han on 2017/1/1.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';

import Button from 'antd-mobile/lib/button';
import { Actions } from 'react-native-router-flux';
import { connect } from 'dva/mobile';

const Gameover = (props) => {
    const { dispatch, room } = props;

    let result;
    if(room.result == "0") {
        result = "狼人胜利！";
    } else if(room.result == "1") {
        result = "好人胜利！";
    } else if(room.result == "2") {
        result = "丘比特胜利！";
    } else {
        result = "房主离开房间！";
    }
    return (
        <View style={{flex: 1}}>
                <Text style={styles.text}>
                    游戏结束！{result}
                </Text>
                <Button type="primary" style={styles.button} onClick={Actions.CARoom}>
                    重新开始游戏
                </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        marginTop: 50,
    },
    button: {
        marginTop: 50,
    }
});

export default connect(room => room)(Gameover);