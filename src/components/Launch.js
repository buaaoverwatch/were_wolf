/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';

import Login from './Login';
import Register from './Register';

const Launch = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    欢迎来到Werewolf
                </Text>
            </View>
            <ScrollableTabView>
                <Register tabLabel="注册" dispatch={props.dispatch}/>
                <Login tabLabel="登录" dispatch={props.dispatch}/>
            </ScrollableTabView>
        </View>
    );
};

const styles = StyleSheet.create({
    //页面框架
    container: {
        flex: 1
    },
    //标题
    header: {
        height: PixelRatio.get() * 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#393a3f',
    },
    //标题文本
    headerText: {
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: 18
    }
});

export default connect(information => information)(Launch);