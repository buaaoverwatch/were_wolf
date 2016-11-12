/**
 * Created by Qingchang Han on 2016/11/1.
 */
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    PixelRatio,
    Dimensions,
    Image
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';

const Setting = (props) => {
    const { dispatch, information } = props;
    return (
        <View style={{flex: 1}}>
            <View style={styles.header}>
                <TouchableOpacity onPress={Actions.pop}>
                    <View style={styles.backContainer}>
                        <Image style={styles.backIcon}
                               source={require('../images/back.png')} />
                        <Text style={styles.backText}>
                            返回
                        </Text>
                    </View>
                </TouchableOpacity>
                <Text style={styles.headerText}>
                    设置
                </Text>
                <TouchableOpacity onPress={Actions.pop}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>
                            完成
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    //标题
    header: {
        flexDirection: 'row',
        height: PixelRatio.get() * 16,
        width: Dimensions.get('window').width,
        alignItems: 'center',
        backgroundColor: '#393a3f',//#0033ff
        justifyContent: 'space-between'
    },
    //标题文本
    headerText: {
        color: '#ffffff',
        fontSize: 18,
    },
    //返回区
    backContainer: {
        width: PixelRatio.get() * 23,
        flexDirection: 'row',
        alignItems: 'center'
    },
    //返回图标
    backIcon: {
        height: PixelRatio.get() * 5,
        width: PixelRatio.get() * 5,
        marginLeft: PixelRatio.get() * 2
    },
    //返回文本
    backText: {
        fontSize: 18,
        color: '#ffffff',
        marginLeft: PixelRatio.get() * 2
    },
    //完成区
    completeContainer: {
        width: PixelRatio.get() * 18,
        alignItems: 'center'
    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    }
});

export default connect(information => information)(Setting);