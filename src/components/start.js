import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    Animated,
    PixelRatio,
    Dimensions
} from 'react-native';
import { connect } from 'dva/mobile';
import {
    Actions
} from 'react-native-router-flux';
import Button from 'antd-mobile/lib/button';

export default class Start extends Component {
    constructor(props) {
        super(props);
        this.state = {
            fadeAnim: new Animated.Value(0), // init opacity 0
        };
    }
    componentDidMount() {
        Animated.timing(          // Uses easing functions
            this.state.fadeAnim, {
                toValue: 1,
                duration: 1000
            },           // Configuration
        ).start();                // Don't forget start!
    }
    render() {
        return (
            <View style={styles.container}>
                <Animated.Image
                    source={require('../images/background.jpg')} style={[styles.img, {opacity: this.state.fadeAnim}]}>
                    <Button type="primary" onClick={Actions.Launch} style={styles.button}>注册/登录</Button>
                </Animated.Image>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  img: {
    flex: 1,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height+PixelRatio.get()*15,
    resizeMode: 'contain',
    paddingTop: PixelRatio.get() * 120,
      justifyContent: 'center',
      alignItems: 'center'
  },
  button: {
      backgroundColor: 'transparent',
      width: PixelRatio.get() * 80,
      borderColor: '#ffffff'
  }
});
