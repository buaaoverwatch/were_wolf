'use-strict';
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

//此处应有一个fetch到的房间列表
import Grid from 'antd-mobile/lib/grid';




const data1 ={
  name1:'adsa',
  name2:'asdasd',
  name3:'asdsdasd',

};


const ChooseSeat = (props) => {
    const {dispatch,game_options} = props;
    function test(){

    }
    function onChange(val){
        this.setState({val});
    }
    return (
    <View>
      <Grid data={data} />
      <Text style={{ margin: 10, color: '#999' }}>请选择座位</Text>
      <Grid data={data1} columnNum={4} hasLine={false}
        renderItem={(dataItem, index) => (
          <View style={{ margin: '16px', background: '#f7f7f7', textAlign: 'center' }}>
            <View style={{ background: 'rgba(0, 0, 0, 0.1)', padding: '8px' }}>
              <Text>{index + 1}.{dataItem.text}</Text>
            </View>
            <img src={require('./741524682069127_v2.jpg')} style={{ width: '80%', margin: '12px' }} />
          </View>
        )}
      />
    </View>
        
    );
};

export default connect(Change => Change)(ChooseSeat);




