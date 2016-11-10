import React, { Component } from 'react';
import {
    Image,
    StyleSheet,
    View,
    Animated,
} from 'react-native';


const Start = (props) => {
    return (
        <View style={styles.container}>
        <Animated.Image
        onLoadEnd={() => {
          Animated.timing(this._animatedValue, {
            toValue: 100,
            duration: 1000
          }).start()
        }}
        source={require('../images/background.jpg')} style={[styles.img, {opacity: interpolatedColorAnimation}]}>
            <Button type="default" onClick={Actions.Launch} style={styles.button}>注册/登录</Button>
        </Animated.Image>
      </View>
    );
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
    width: 400,
    height: 200,
    resizeMode: 'contain',
    paddingTop: 100
  },
  button: {
      backgroundColor: 'transparent'
  }
})

export default connect(information => information)(Start);