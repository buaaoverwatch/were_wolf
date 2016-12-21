import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Modal from 'antd-mobile/lib/modal';
import StateConst from '../../consts/roomstate';
import Toast from 'antd-mobile/lib/toast';

export default class Next extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        };
        this.showModal = this.showModal.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    showModal() {
        this.setState({
            visible: true,
        });
    };
    onClose() {
        this.setState({
            visible: false,
        });
    };

    onPress() {
        console.log('next step');
        console.log('curstate: ' + this.props.curstate);
        console.log('nextstep: ' + this.props.nextstep);
        let curstate = this.props.room.curstate;
        let client_id = this.props.room.client_id;
        let role = this.props.room.player_role[client_id];
        let owner_id = this.props.room.owner_id;
        if((curstate == StateConst.cupid && role != 'cupid') ||
            (curstate == StateConst.lover && this.props.room.lover_id1 != client_id && this.props.room.lover_id2 != client_id) ||
            (curstate == StateConst.wolf && role != 'wolf') ||
            (curstate == StateConst.witch && role != 'witch') ||
            (curstate == StateConst.seer && role != 'seer') ||
            (curstate == StateConst.sherifftalk && client_id != owner_id) ||
            (curstate == StateConst.sheriffvote) ||
            (curstate == StateConst.daytalk && client_id == owner_id) ||
            (curstate == StateConst.dayvote) ||
            (curstate == StateConst.hunter && role != 'hunter')) {
            Toast.fail("没有下一步的权限！", 1);
            return;
        }
        if(curstate != StateConst.witch &&
            curstate != StateConst.lover &&
            this.props.room.nextstep === false) {
            this.showModal();
            return;
        }
        //给服务器发请求，进入下一阶段
        this.props.dispatch({
            type: 'room/changeNextStep',
            payload: false
        });
        if(this.props.room.hassocket) {
            let msg = JSON.stringify({
                type: "4",
                request_id: this.props.room.user_request_id.toString(),
                room_id: this.props.room.room_id.toString(),
                user_id: this.props.room.client_id
            });
            this.props.room.socket.send(msg);
        } else {
            console.log("websocket error!");
            alert("websocket error!");
        }
        //TODO:根据投票结果弹窗
    }

    render() {
        return (
            <View>
                    <Text style={styles.fixedSectionText}
                          onPress={this.onPress.bind(this)}>
                        下一步
                    </Text>
                    <Modal
                        title="警告"
                        closable
                        maskClosable
                        transparent
                        onClose={this.onClose}
                        visible={this.state.visible}
                        style={{height:200, width:300, alignItems: 'center'}}
                    >
                        <Text style={{marginTop:30,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                            技能未使用!{this.props.nextstep}</Text>
                    </Modal>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
});