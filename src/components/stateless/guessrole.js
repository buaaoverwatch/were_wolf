/**
 * Created by shi on 2016/11/4.
 */
// 导入React核心模块
import React, { Component, PropTypes, } from 'react'
// 导入组件使用到的Native依赖模块
import { ScrollView,View, StyleSheet, Text, Alert, TouchableOpacity,} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import Modal from 'antd-mobile/lib/modal'

// 定义并默认导出自己的component
export default class GuessRole extends Component {

    // 入参类型验证
    static propTypes = {
        // 如果类型是style
        containerStyle: View.propTypes.style,
        // 如果类型是bool
        selected: PropTypes.bool,
        // 如果类型是string
        text: PropTypes.string,
        // 如果类型是function
        onPress: PropTypes.func,
        // 如果类型是object
        options: PropTypes.object,
        // 如果类型是array
        source: PropTypes.array,
        // 如果类型是number
        num: PropTypes.number,
    }

    // 入参默认值（不设置则为undefined）
    static defaultProps = {
        player_id:['j1','a2','b3'],
        player_nick:{
            j1:'lad',
            a2:'dddd',
            b3:'kkkk',
        },
        guess_role:{
            j1:'村民',
            a2:'村民',
            b3:'村民',
        },
        player_avatar:{
            j1:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
            a2:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
            b3:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
        },
        player_index:{
            j1:1,
            a2:2,
            b3:3,
        },
    }

    // 构造函数
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props);
        // 设置初始状态
        this.state = {
            player_id:props.data.player_id,
            player_nick:props.data.player_nick,
            guess_role:props.data.guess_role,
            player_avatar:props.data.player_avatar,
            player_index:props.data.player_index,
            choose_id:null,
            modalvisible:false,
        };
        this._renderList = this._renderList.bind(this);
        this.showModal = this.showModal.bind(this);
        this.onClose = this.onClose.bind(this);
    }
    showModal(){
        this.setState({
            modalvisible: true,
        });
    }
    onClose(){
        this.setState({
            modalvisible: false,
        });
    }

    _renderGuessRole(data)
    {
        let text='村民';
        if(data)
            return data;
        else
            return text;
    }
    // 遍历的部分可以写成子渲染函数
    _renderList(data) {

        if (Array.isArray(data)) {
            // 推荐这种写法
            return data.map((item, i) => {
                return (
                    <ListItem
                        roundAvatar
                        key={i}
                        title={`${this.state.player_index[item]}号玩家 ${this.state.player_nick[item]}`}
                        subtitle={this._renderGuessRole(this.state.guess_role[item])}
                        avatar={{uri:this.state.player_avatar[item]}}
                        onPress={() => this.setState({modalvisible:true,choose_id:item})}
                    />

                )
            })
        }
    }


    // 事件处理句柄（触发处用匿名函数包裹以匹配当前的上下文对象）
    handlePress() {
        // 组件外部传入的回调函数先验证再触发
        this.props.onPress && this.props.onPress()
    }

    // 主渲染函数
    render() {
        let { player_id ,modalvisible,choose_id} = this.state;
        let i=this.state.player_index[this.state.choose_id];
        let { source, containerStyle } = this.props;
        return (
            <View style={[styles.container, containerStyle]}>
                <List>
                    { this._renderList(player_id) }
                </List>
                <Modal
                    title={`我猜${i}号玩家的身份是`}
                    closable
                    maskClosable
                    transparent
                    onClose={this.onClose}
                    visible={modalvisible}
                    style={{height:400,width:300,}}
                >
                    <ScrollView style={{marginBottom:20,}}>
                        <ListItem
                            key={1}
                            title="村民"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'村民'})})}/>
                        <ListItem
                            key={2}
                            title="狼人"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'狼人'})})}/>
                        <ListItem
                            key={3}
                            title="预言家"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'预言家'})})}/>
                        <ListItem
                            key={4}
                            title="女巫"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'女巫'})})}/>
                        <ListItem
                            key={5}
                            title="猎人"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'猎人'})})}/>
                        <ListItem
                            key={6}
                            title="守卫"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'守卫'})})}/>
                        <ListItem
                            key={7}
                            title="丘比特"
                            onPress={() => this.setState({modalvisible:false,guess_role:Object.assign(this.state.guess_role,{[choose_id]:'丘比特'})})}/>
                    </ScrollView>
                </Modal>
            </View>
        )
    }
}

// style写在最下面
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'#f7f7f7',
    },
});

