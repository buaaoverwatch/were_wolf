/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, { Component } from 'react';
import {
    AppRegistry,
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

const Room = (props) => {
    return (
        <View style={{ flex:1 }}>
            <Text>房间</Text>
        </View>
    );
}

export default connect(information => information)(Room);