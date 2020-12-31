import { Route } from '@react-navigation/native';
import React, { FunctionComponent } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';

import { firebase } from '../../firebase/config';

type SettingsProps = {
    navigation: any,
    route: Route<'Settings', {
        user: firebase.default.firestore.DocumentData
    }>,
    logout: () => void
}


const Settings: FunctionComponent<SettingsProps> = ({ navigation, route, logout }) => {


    const user = route.params.user;

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start'}}>
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    <Icon name='chevron-left' type='font-awesome' color='#e94560'/>
                </TouchableOpacity>
                <View style={{marginLeft: '10%', marginTop: '-2%' }}>
                    <Text style={styles.title}>Settings</Text>
                </View>
            </View>
            <View style={styles.settings}>
                <Text style={styles.heading}>
                    {user.username}
                </Text>
                <View
                    style={styles.buttons}
                >
                    <Button
                        title='Change Password'
                        onPress={() => {}}
                        color='#e94560'
                    />
                    <Button
                        title='Log Out'
                        onPress={() => logout()}
                        color='#e94560'
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        paddingTop: '25%',
        paddingLeft: '5%',
        paddingBottom: '20%',
        paddingRight: '10%',
        justifyContent: 'flex-start'
    },
    title: {
        fontSize: 30,
        fontWeight: '200',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#e94560'
    },
    heading: {
        fontSize: 30,
        fontWeight: '600',
        color: 'white'
    },
    settings: {
        marginTop: '10%'
    },
    buttons: {
        marginTop: '20%',
        alignItems: 'flex-start'
    }
});

export default Settings;