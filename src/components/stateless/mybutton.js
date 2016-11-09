/**
 * Created by shi on 2016/11/2.
 */
import LinearGradient from 'react-native-linear-gradient';
import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
} from 'react-native';

const MyButton = (props) => {
    const { type='primary',uri,caption,onPress,style} = props;

    let icon;
    if (uri) {
        icon = <Image source={{uri}} style={styles.icon} />;
    }
    let content;
    if (type === 'primary') {
        content = (
            <LinearGradient
                start={[0.3, 0]} end={[1, 1]}
                colors={['#6ABF47', '#6F86D9']}
                style={[styles.button, styles.primaryButton]}>
                {icon}
                <Text style={[styles.caption, styles.primaryCaption]}>
                    {caption}
                </Text>
            </LinearGradient>
        );
    } else {
        var border = type === 'bordered' && styles.border;
        content = (
            <View style={[styles.button, border]}>
                {icon}
                <Text style={[styles.caption, styles.secondaryCaption]}>
                    {caption}
                </Text>
            </View>
        );
    }
    return (
        <TouchableOpacity
            accessibilityTraits="button"
            onPress={onPress}
            activeOpacity={0.8}
            style={[styles.container, style]}>
            {content}
        </TouchableOpacity>
    );
};

const HEIGHT = 50;

const styles = StyleSheet.create({
    container: {
        height: HEIGHT,
        // borderRadius: HEIGHT / 2,
        // borderWidth: 1 / PixelRatio.get(),
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    border: {
        borderWidth: 1,
        borderColor: '#6A6AD5',
        borderRadius: HEIGHT / 3,
    },
    primaryButton: {
        borderRadius: HEIGHT / 3,
        backgroundColor: 'transparent',
    },
    icon: {
        marginRight: 12,
        width: 30,
        height: 30,
    },
    caption: {
        letterSpacing: 1,
        fontSize: 12,
    },
    primaryCaption: {
        color: 'white',
    },
    secondaryCaption: {
        color: '#6A6AD5',
    }
});

export default MyButton
