// 导入React核心模块
import React, { Component, PropTypes, } from 'react'
// 导入组件使用到的Native依赖模块
import { ScrollView,View, StyleSheet, Text, Alert, TouchableOpacity,} from 'react-native'
import { List, ListItem } from 'react-native-elements'
import Modal from 'antd-mobile/lib/modal';

// 定义并默认导出自己的component
export default class VoteResult extends Component {

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
        datasource:[
            {
                userindex:1,
                username:'lalala',
                votecount:10,
                avatar_url:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
                votelist:[1,2,12,4,5,1,2,12,4,5,1,2,12,4,5],
            },
            {
                userindex:2,
                username:'llllfl',
                votecount:6,
                avatar_url:'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
                votelist:[1,2,3,4,5],
            },
        ]
    }

    // 构造函数
    constructor(props) {
        // 继承父类的this对象和传入的外部属性
        super(props)
        // 设置初始状态
        this.state = {
            datasource: props.datasource,
            modalvisible:false,
            modalcontent:'',
        }
        this.showModal = this.showModal.bind(this);
        this.onClose = this.onClose.bind(this);
        //this._renderList = this._renderList.bind(this);
        //this._renderModal = this._renderModal.bind(this);
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
                        title={`${item.userindex}号玩家 ${item.username}`}
                        subtitle={`${item.votecount}票`}
                        avatar={{uri:item.avatar_url}}
                        onPress={()=>this.showModal(item.votelist)}
                    />
                )
            })
        }
    }

    _renderModal(data) {
        if (Array.isArray(data)) {
            // 推荐这种写法
            return data.map((item, i) => {
                return (
                    <ListItem
                        key={i}
                        title={`${item}号玩家`}
                    />
                )
            });
        }
    }

    showModal(data){
        this.setState({
            modalvisible: true,
            modalcontent:data,
        });
    }
    onClose(){
        this.setState({
            modalvisible: false,
        });
    }

    // 事件处理句柄（触发处用匿名函数包裹以匹配当前的上下文对象）
    handlePress() {
        // 组件外部传入的回调函数先验证再触发
        this.props.onPress && this.props.onPress()
    }

    // 主渲染函数
    render() {
        let { datasource,modalcontent,modalvisible} = this.state;
        let { source, containerStyle } = this.props;
        return (
            <View style={[styles.container, containerStyle]}>
                <List>
                    { this._renderList(datasource) }
                </List>
                <Modal
                    title="投给Ta的玩家"
                    closable
                    maskClosable
                    transparent
                    onClose={this.onClose}
                    visible={modalvisible}
                    style={{height:300,width:300,}}
                >
                    <ScrollView style={{marginBottom:20,}}>
                        {this._renderModal(modalcontent)}
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
})