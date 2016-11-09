/**
 * Created by Qingchang Han on 2016/11/3.
 */
import React, {
    PropTypes,
} from 'react';
import {
    Text,
    Image,
    View
} from 'react-native';

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
};

const imageList = [
    require('../images/tab_room_n.png'),
    require('../images/tab_room_p.png'),
    require('../images/tab_game_n.png'),
    require('../images/tab_game_p.png'),
    require('../images/tab_mine_n.png'),
    require('../images/tab_mine_p.png'),
];


const TabIcon = (props) => {
    var icon;
    if (props.title === '房间' && !props.selected) {
        icon = imageList[0];
    } else if (props.title === '房间' && props.selected) {
        icon = imageList[1];
    } else if (props.title === '游戏' && !props.selected) {
        icon = imageList[2];
    } else if (props.title === '游戏' && props.selected) {
        icon = imageList[3];
    } else if (props.title === '我的' && !props.selected) {
        icon = imageList[4];
    } else {
        icon = imageList[5];
    }
    return (
        <View style={{ flex:1, alignItems: 'center' }}>
            <Image source={icon} style={{ width: 25, height: 25 }}/>
            <Text style={{ color: 'black' }}>
                {props.title}
            </Text>
        </View>
    );
};

TabIcon.propTypes = propTypes;

export default TabIcon;