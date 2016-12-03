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
    Image,
    BackAndroid
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Card from 'antd-mobile/lib/card';
import WingBlank from 'antd-mobile/lib/wing-blank';
import WhiteSpace from 'antd-mobile/lib/white-space';
import Toast from 'antd-mobile/lib/toast';

const MyRecord = (props) => {
    const { dispatch, information } = props;
    function getRecord(i) {
        let text = '角色： ' + i.type + '\n' + '结果：' + i.time;
        return (
            <WingBlank key={n} size="lg">
                <WhiteSpace size="lg" />
                <Card>
                    <Card.Header
                        title={i.id}
                        thumb="https://cloud.githubusercontent.com/assets/1698185/18039916/f025c090-6dd9-11e6-9d86-a4d48a1bf049.png"
                    />
                    <Card.Body>
                        <Text>{text}</Text>
                    </Card.Body>
                    <Card.Footer content={"时间："+i.time}/>
                </Card>
                <WhiteSpace size="lg" />
            </WingBlank>
        );
    }
    let records = [];
    let n = 0;
    for(let i = 0; i < information.recordList.length; i++) {
        records.push(getRecord(information.recordList[i]));
        n++;
    }
    BackAndroid.addEventListener('hardwareBackPress',function(){
        Toast.info("无法返回上一页！", 0.5);
        return true;
    });
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
                    我的战绩
                </Text>
                <TouchableOpacity onPress={Actions.pop}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>
                            完成
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
            {records}
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
        width: PixelRatio.get() * 25,
        alignItems: 'center'
    },
    completeText: {
        fontSize: 18,
        color: '#ffffff'
    }
});

export default connect(information => information)(MyRecord);