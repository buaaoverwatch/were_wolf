/**
 * Created by shi on 2016/11/3.
 */
import React, { Component, PropTypes } from 'react';
import {
    Dimensions,
    View,
    StyleSheet,
} from 'react-native';
import UserButton from './userbutton';


function UserGrid(props) {
    return (
        <View style={styles.container}>
            {
                props.data.map(user => <UserButton
                    key={user.key}
                    data={user}
                    dispatch={props.dispatch}
                    style={styles.button}
                />)
            }
        </View>
    );
}

UserGrid.propTypes = {};

const window = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: window.width*0.9,
        flexDirection: 'row',
        flexWrap:'wrap',
        alignItems:'center',
        alignSelf:'center',
        justifyContent: 'space-around',
        flex:1,
    },
    button: {
        margin: 10,
    },
});

export default UserGrid;