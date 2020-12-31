import React from 'react';
import { View, Text, StyleSheet, TextInput, TouchableHighlight, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-elements';
import { firebase } from '../../firebase/config';

export default function Login({
    navigation,
    loginCallback
}: {
    navigation: any,
    loginCallback: (user: firebase.default.firestore.DocumentData) => void
}) {

    const [loading, setLoading] = React.useState<boolean>(false);

    const [emailFieldSelected, setEmailFieldSelected] = React.useState<boolean>(false);
    const [passwordFieldSelected, setPasswordFieldSelected] = React.useState<boolean>(false);

    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const onLoginPress = () => {
        setLoading(true);
        firebase
            .default
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then((response) => {
                if (response.user === null) {
                    alert('An error occured! here');
                    return;
                }
                const uid = response.user.uid
                const usersRef = firebase.default.firestore().collection('users')
                usersRef
                    .doc(uid)
                    .get()
                    .then(firestoreDocument => {
                        setLoading(false);
                        if (!firestoreDocument.exists) {
                            alert("User does not exist anymore.")
                            return;
                        }
                        const user = firestoreDocument.data();
                        if (user === undefined) {
                            alert('Error loggin in');
                            return;
                        }
                        loginCallback(user);
                    })
                    .catch(error => {
                        setLoading(false);
                        alert(error)
                    });
            })
            .catch(error => {
                setLoading(false);
                alert(error)
            })
    }
    
    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Log In
            </Text>
            <View style={styles.inputContainer}>
                <Icon name="user" type='font-awesome' color="white" />
                <TextInput 
                    style={!emailFieldSelected ? {
                        ...styles.input, 
                        ...styles.borderBottom
                    } : {
                        ...styles.input,
                        ...styles.borderBottomHighlight
                    }} 
                    autoCompleteType="email" 
                    placeholder="Email Address" 
                    placeholderTextColor='grey'
                    onFocus={() => setEmailFieldSelected(true)}
                    onBlur={() => setEmailFieldSelected(false)}
                    onChangeText={text => setEmail(text)}
                    autoCorrect={false}
                    autoFocus
                />
            </View>
            <View style={styles.inputContainer}>
                <Icon name="lock" type='font-awesome' color="white" />
                <TextInput 
                    style={!passwordFieldSelected ? {
                        ...styles.input, 
                        ...styles.borderBottom
                    } : {
                        ...styles.input,
                        ...styles.borderBottomHighlight
                    }} 
                    secureTextEntry={true} 
                    autoCompleteType="password" 
                    placeholder="Password" 
                    placeholderTextColor='grey'
                    onFocus={() => setPasswordFieldSelected(true)}
                    onBlur={() => setPasswordFieldSelected(false)}
                    onChangeText={text => setPassword(text)}
                />
            </View>
            {loading ? <ActivityIndicator style={styles.loading}/> : 
                <TouchableHighlight style={styles.loginButton} onPress={() => onLoginPress()}>
                    <Text style={styles.loginButtonText}>Log In</Text>
                </TouchableHighlight>
            }
            <View style={styles.registerTextContainer}>
                <Text style={styles.registerText}>
                    First time here? 
                </Text>
                <TouchableHighlight onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.registerLink}>
                        Sign In
                    </Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1a1a2e',
        flex: 1,
        width: '100%',
        paddingTop: '40%',
        paddingLeft: '10%',
        paddingRight: '10%',
        paddingBottom: '10%',
        borderRadius: 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
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
        width: '85%',
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
    borderBottom: {
        borderBottomColor: 'white',
        borderBottomWidth: 1
    },
    borderBottomHighlight: {
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