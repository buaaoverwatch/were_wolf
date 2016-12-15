/**
 * Created by shi on 2016/11/2.
 */
import React, { Component } from 'react';
import {
    Dimensions,
    Image,
    ListView,
    PixelRatio,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import UserGrid from './stateless/usergrid';
import Next from './stateless/next';
import state from '../consts/roomstate';
import statename from '../consts/roomstatename';
import TabView from './tabview';
import { connect } from 'dva/mobile';
import ActivityIndicator from 'antd-mobile/lib/activity-indicator';
import { Icon } from 'react-native-elements'

import StateConst from '../consts/roomstate';

const Test1 = (props) => {
    const { dispatch, room } = props;
    function genusergriddata()
    {

        return room.index_id.map(
            function (item,i) {
                let issheriff=false;
                if(item==room.sheriff_id)
                    issheriff=true;
                let issel=false;
                if(item==room.player_selectedid)
                    issel=true;
                if(item==room.player_selectedid2&&room.curstate==StateConst.cupid)
                    issel=true;
                function handlePress() {
                    if(room.curstate==StateConst.wolf)
                    {
                        if(room.hassocket)
                        {
                            msg=JSON.stringify({
                                type: '5',
                                request_id:room.user_request_id,
                                room_id:room.room_id,
                                user_id:room.client_id,
                                object_id:item,
                                action:'2',
                                content:'',
                            });
                            room.socket.send(msg);
                            dispatch({ type: 'room/setselid_wolf',payload:item });
                            dispatch({ type: 'room/WebSocketsend',payload:item });
                        }
                    }
                    else
                    {
                        dispatch({ type: 'room/changeselid',payload:item });
                    }
                }
                return {
                    key: i,
                    index: i+1,
                    userid:item,
                    username: room.player_nick[item],
                    vote: room.player_wolfvote[item],
                    sheriff: issheriff,
                    disabled: !room.player_alive[item],
                    selected: issel,
                    onPress:handlePress,
                }
            }
        )
    }
    function _renderSubTitle()
    {
        if((room.curstate==StateConst.cupid&&room.player_role[room.client_id]!='cupid')||
            (room.curstate==StateConst.lover&&room.client_id!=room.lover_id1&&room.client_id!=room.lover_id2)||
            (room.curstate==StateConst.guard&&room.player_role[room.client_id]!='guard')||
            (room.curstate==StateConst.wolf&&room.player_role[room.client_id]!='wolf')||
            (room.curstate==StateConst.witch&&room.player_role[room.client_id]!='witch')||
            (room.curstate==StateConst.seer&&room.player_role[room.client_id]!='seer'))
        {
            return '请不要睁眼呦'
        }
        else if((room.curstate==StateConst.cupid)||
            (room.curstate==StateConst.lover)||
            (room.curstate==StateConst.guard)||
            (room.curstate==StateConst.wolf)||
            (room.curstate==StateConst.witch)||
            (room.curstate==StateConst.seer))
        {
            if(room.nextstep==false)
                return '请行使技能';
            else
                return '请点击\"下一步\"';
        }
        else if(room.curstate==StateConst.sheriffchoose)
            return '请选择是否竞选警长';
        else if(room.curstate==StateConst.sherifftalk)
            return '请竞选警长的玩家依次发言';
        else if(room.curstate==StateConst.sheriffvote)
            return '请给竞选警长的玩家投票';
        else if(room.curstate==StateConst.daytalk)
            return '请存活的玩家依次发言';
        else if(room.curstate==StateConst.dayvote)
            return '请投票选出出局的玩家';
        else if(room.curstate==StateConst.lastword)
            return '请聆听遗言';
        else if(room.curstate==StateConst.hunter)
        {
            if(room.player_role[room.client_id]=='hunter')
            {
                return '请选择您要带走的玩家';
            }
            else
            {
                return '请等待猎人开枪';
            }
        }
    }
    function _renderUserGrid(style)
    {
        if((room.curstate==StateConst.cupid&&room.player_role[room.client_id]!='cupid')||
            (room.curstate==StateConst.lover&&room.client_id!=room.lover_id1&&room.client_id!=room.lover_id2)||
            (room.curstate==StateConst.guard&&room.player_role[room.client_id]!='guard')||
            (room.curstate==StateConst.wolf&&room.player_role[room.client_id]!='wolf')||
            (room.curstate==StateConst.witch&&room.player_role[room.client_id]!='witch')||
            (room.curstate==StateConst.seer&&room.player_role[room.client_id]!='seer'))
        {
            return(
                <View style={style}>
                    <Icon
                        raised
                        name='eye-slash'
                        type='font-awesome'
                        color='#f50'
                        size={80}
                        onPress={() => console.log('hello')} />
                </View>
            )
        }
        else
        {
            return(
                <UserGrid data={usergriddata} dispatch={dispatch}/>
            )
        }
    }
    const usergriddata=genusergriddata();
    return (
        <View style={{flex:1, paddingBottom: PixelRatio.get() * 26}}>
            <ParallaxScrollView
                headerBackgroundColor="#333"
                stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
                backgroundSpeed={10}

                renderBackground={() => (
                    <View key="background">
                        <Image source={{uri: 'https://i.ytimg.com/vi/P-NZei5ANaQ/maxresdefault.jpg',
                            width: window.width,
                            height: PARALLAX_HEADER_HEIGHT}}/>
                        <View style={{position: 'absolute',
                            top: 0,
                            width: window.width,
                            backgroundColor: 'rgba(0,0,0,.4)',
                            height: PARALLAX_HEADER_HEIGHT}}/>
                    </View>
                )}

                renderForeground={() => (
                    <View key="parallax-header" style={ styles.parallaxHeader }>
                        {_renderUserGrid(styles.NightNotification)}
                        <Text style={ styles.sectionSpeakerText }>
                            {statename[room.curstate]}
                        </Text>
                        <Text style={ styles.sectionTitleText }>
                            {_renderSubTitle()}
                        </Text>
                    </View>
                )}


                renderStickyHeader={() => (
                    <View key="sticky-header" style={styles.stickySection}>
                        <Text style={styles.stickySectionText}>{statename[room.curstate]}</Text>
                    </View>
                )}

                renderFixedHeader={() => (
                    <View key="fixed-header" style={styles.fixedSection}>
                        <Next dispatch={dispatch} room={room}/>
                    </View>
                )}
            >
                <TabView room={room} dispatch={dispatch}/>
            </ParallaxScrollView>
            <ActivityIndicator
                toast
                text="正在加载"
                animating={room.loading}
            />
        </View>


    );
};


const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const ROW_HEIGHT = 60;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    NightNotification: {
        height: PARALLAX_HEADER_HEIGHT-120,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ontainer: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        width: 300,
        justifyContent: 'flex-end'
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 10,
        right: 10
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 52,
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 18,
        paddingVertical: 5
    },
    row: {
        overflow: 'hidden',
        paddingHorizontal: 10,
        height: ROW_HEIGHT,
        backgroundColor: 'white',
        borderColor: '#ccc',
        borderBottomWidth: 1,
        justifyContent: 'center'
    },
    rowText: {
        fontSize: 20,
    },
    Grid: {
        backgroundColor: 'white',
        width:350,
        flex: 1,
        flexDirection: 'row',

    },
    button: {
        height: 300,
        flex: 1,
        alignItems: 'center',
        flexDirection: 'column',
        marginBottom: 8,
    },
});

export default connect(room=>room)(Test1);/**
 * Created by shi on 2016/11/3.
 */
