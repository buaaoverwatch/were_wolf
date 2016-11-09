/**
 * Created by shi on 2016/11/4.
 */
// 导入React核心模块
import React, { Component, PropTypes, } from 'react'
// 导入组件使用到的Native依赖模块
import { ScrollView,View, StyleSheet, Text, Alert, TouchableOpacity,} from 'react-native'
import { List, ListItem } from 'react-native-elements'

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
        super(props)
        // 设置初始状态
        this.state = {
            player_id:props.player_id,
            player_nick:props.player_nick,
            guess_role:props.guess_role,
            player_avatar:props.player_avatar,
            player_index:props.player_index,
        }
        this._renderList = this._renderList.bind(this);
    }

    setNativeProps (nativeProps) {
        this._root.setNativeProps(nativeProps);
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
                        subtitle={`${this.state.guess_role[item]}`}
                        avatar={{uri:this.state.player_avatar[item]}}
                        onPress={() => Alert.alert(
                            `我猜${this.state.player_index[item]}号玩家的身份是...`,
                            '请选择',
                            [
                                {text: '村民',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'村民'})})},
                                {text: '狼人',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'狼人'})})},
                                {text: '预言家',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'预言家'})})},
                                {text: '女巫',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'女巫'})})},
                                {text: '猎人',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'猎人'})})},
                                {text: '守卫',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'守卫'})})},
                                {text: '丘比特',
                                    onPress: () => this.setState({guess_role:Object.assign(this.state.guess_role,{[item]:'丘比特'})})},
                            ]
                        )}
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
        let { player_id } = this.state;
        let { source, containerStyle } = this.props;
        return (
            <View style={[styles.container, containerStyle]}>
                <List>
                    { this._renderList(player_id) }
                </List>
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

