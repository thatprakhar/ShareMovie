import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { firebase } from '../../firebase/config'

export default function Register({
    navigation,
    loginCallback
}: {
    navigation: any
    loginCallback: (user: firebase.default.firestore.DocumentData) => void

}) {

    const [loading, setLoading] = React.useState<boolean>(false);

    const [nameFieldSelected, setNameFieldSelected] = React.useState<boolean>(false);
    const [emailFieldSelected, setEmailFieldSelected] = React.useState<boolean>(false);
    const [passwordFieldSelected, setPasswordFieldSelected] = React.useState<boolean>(false);

    const [username, setUsername] = React.useState<string>('');
    const [userEmail, setUserEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const onRegisterPress = () => {
        setLoading(true);
        firebase
            .default
            .auth()
            .createUserWithEmailAndPassword(userEmail, password)
            .then((response) => {
                setLoading(false);
                if (response.user === null) {
                    alert('Error occured');
                    return;
                }
                const uid = response.user.uid
                const data = {
                    id: uid,
                    userEmail,
                    username,
                };
                const usersRef = firebase.default.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .set(data)
                    .then(() => {
                        setLoading(false);
                        loginCallback(data);
                    })
                    .catch((error) => {
                        setLoading(false);
                        alert(error);
                    });
            })
            .catch((error) => {
                setLoading(false);
                alert(error);
        });
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={{ justifyContent: 'flex-start', paddingTop: '10%' }} onPress={() => navigation.navigate('Login')}>
                    <Icon name='chevron-left' type='font-awesome' color='#e94560'/>
                </TouchableOpacity>
                <Text style={styles.title}>
                    Register a New Account
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <Icon name="user" type='font-awesome' color="white" />
                <TextInput 
                    style={!nameFieldSelected ? {
                        ...styles.input, 
                        ...styles.borderBottomGrey
                    } : {
                        ...styles.input,
                        ...styles.borderBottomYellow
                    }} 
                    autoCompleteType="name"
                    placeholder="Full Name" 
                    placeholderTextColor='grey'
                    onFocus={() => setNameFieldSelected(true)}
                    onBlur={() => setNameFieldSelected(false)}
                    value={username}
                    onChangeText={e => setUsername(e)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="envelope" type='font-awesome' color="white" />
                <TextInput 
                    style={!emailFieldSelected ? {
                        ...styles.input, 
                        ...styles.borderBottomGrey
                    } : {
                        ...styles.input,
                        ...styles.borderBottomYellow
                    }} 
                    autoCompleteType="email" 
                    placeholder="Email Address" 
                    placeholderTextColor='grey'
                    onFocus={() => setEmailFieldSelected(true)}
                    onBlur={() => setEmailFieldSelected(false)}
                    value={userEmail}
                    onChangeText={e => setUserEmail(e)}
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="lock" type='font-awesome' color="white" />
                <TextInput 
                    style={!passwordFieldSelected ? {
                        ...styles.input, 
                        ...styles.borderBottomGrey
                    } : {
                        ...styles.input,
                        ...styles.borderBottomYellow
                    }} 
                    secureTextEntry={true} 
                    autoCompleteType="password" 
                    placeholder="Password" 
                    placeholderTextColor='grey'
                    onFocus={() => setPasswordFieldSelected(true)}
                    onBlur={() => setPasswordFieldSelected(false)}
                    value={password}
                    onChangeText={e => setPassword(e)}
                />
            </View>
            {loading ? <ActivityIndicator style={styles.loading}/> : 
                <TouchableHighlight style={styles.loginButton} onPress={() => onRegisterPress()}>
                    <Text style={styles.loginButtonText}>Register</Text>
                </TouchableHighlight>
            }
            <View style={styles.registerTextContainer}>
                <Text style={styles.registerText}>
                    Already have an account?
                </Text>
                <TouchableHighlight onPress={() => navigation.navigate('Login')} disabled={loading}>
                    <Text style={styles.registerLink}>
                        Log In
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        paddingTop: '20%',
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: '10%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        backgroundColor: '#1a1a2e'
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 40,
        alignSelf: 'flex-start',
        marginBottom: 50,
        fontWeight: "bold",
        color: '#e94560'
    },

    input: {
        fontSize: 20,
        marginBottom: 50,
        marginLeft: 10,
        color: 'white',
        width: '100%',
        paddingTop: 2,
        paddingBottom: 2,
    },
    inputContainer: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row'
    },
    loginButton: {
        backgroundColor: 'white',
        alignSelf: 'center',
        marginTop: 30,
        width: '100%',
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 2 },
        shadowOpacity: 0.7,
        shadowRadius: 7,  
        elevation: 4
    },
    loginButtonText: {
        fontWeight: 'bold',
        color: 'black',
        fontSize: 30,
        textAlign: 'center',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 10,
        paddingRight: 10,
    },
    borderBottomGrey: {
        borderBottomColor: 'white',
        borderBottomWidth: 1
    },
    borderBottomYellow: {
        borderBottomColor: '#e94560',
        borderBottomWidth: 1
    },
    registerTextContainer: {
        marginTop: 25,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    registerText: {
        color: 'white',
        fontSize: 15,
        marginRight: 5
    },
    registerLink: {
        fontWeight: '900',
        color: '#e94560',
        fontSize: 15,
    },
    loading: {
        width: '100%'
    }
});