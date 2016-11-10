/**
 * Created by Qingchang Han on 2016/11/4.
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
    ScrollView,
} from 'react-native';

import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Toast from 'antd-mobile/lib/toast';
import List from 'antd-mobile/lib/list';

const GameRoom = (props) => {
    const { dispatch, information } = props;
    var Views = [];
    var list;
    function addRow(n) {
        var row = [];
        for(let i = n; i < n + 4 && i < list.length; i++) {
            row.push(
                <View key={i} style={styles.single} >
                    <Image source={require('../images/wolf.png')} style={styles.portrait} />
                    <Text style={styles.portraitText}>
                        {list[i]}
                    </Text>
                </View>
            )
        }
        return (
            <View key={n} style={styles.row}>
                {row}
            </View>
        );
    }
    function members() {
        Views = [];
        list = information.roomMembers;
        for(let i = 0; i < list.length; i = i + 4) {
            Views.push(addRow(i));
        }
        return (
            <View style={styles.portraitContainer}>
                {Views}
            </View>
        );
    }
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
                    房间
                </Text>
                <TouchableOpacity onPress={Actions.ChooseSeat}>
                    <View style={styles.completeContainer}>
                        <Text style={styles.completeText}>
                            下一步
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
             <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f9' }}
                         automaticallyAdjustContentInsets={false}
                         showsHorizontalScrollIndicator={false}
                         showsVerticalScrollIndicator={false}
             >
                <View style={styles.toastContainer}>
                    <List>
                        <List.Item
                            extra={information.roomID}
                        >
                            房间号
                        </List.Item>
                        <List.Item
                            extra={information.roomOwnerName}
                        >
                            房主
                        </List.Item>
                    </List>
                </View>
                {members()}
            </ScrollView>
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
    },
    //提示信息
    toastContainer: {
      marginTop: PixelRatio.get() * 2
    },
    //每个头像区
    single: {
        flexDirection: 'column',
        width: PixelRatio.get() * 35,
        height: PixelRatio.get() * 40,
        alignItems: 'center',
        marginTop: PixelRatio.get() * 2,
        marginLeft: PixelRatio.get() * 1
    },
    portrait: {
        width: PixelRatio.get() * 25,
        height: PixelRatio.get() * 25
    },
    portraitText: {
        fontSize: 16,
        color: '#000000',
        marginTop: PixelRatio.get() * 3,
    },
    //每一行
    row: {
        flexDirection: 'row',
        height: PixelRatio.get() * 40,
    },
    //所有头像区
    portraitContainer: {
        flexDirection: 'column'
    }
});

//export default connect(information => information)(GameRoom);
export default connect(information => information)(GameRoom);