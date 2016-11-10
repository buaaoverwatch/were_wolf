import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Modal from 'antd-mobile/lib/modal';
import StateConst from '../../consts/roomstate';

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
        if(this.props.curstate != StateConst.witch && this.props.nextstep === false) {
            this.showModal();
            return;
        }
        //给服务器发请求，进入下一阶段
        dispatch({
            type: 'room/changeNextStep'
        });
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
                        style={{height:200,width:300,}}
                    >
                        <Text style={{marginTop:30,
                                justifyContent: 'center',
                                alignItems: 'center',}}>
                            技能未使用!{this.props.nextstep}</Text>
                        <Text></Text>
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