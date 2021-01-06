import React, { useEffect } from 'react';
import { StyleSheet, ActivityIndicator, View, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './components/Login';
import Register from './components/Register';
import Home from './components/Home';
import Search from './components/Search';
import Matches from './components/Matches';
import Settings from './components/Settings';

import { firebase } from './firebase/config';
import { MovieCardProps } from './components/MovieCard';

type RouteParams = {
  Login: {},
  Register: {},
  Home: {
    matchedMovies: MovieCardProps[]
  },
  Matches: {
    user: firebase.default.firestore.DocumentData
  },
  Search: {
    userID: string
  },
  Settings: {
    user: firebase.default.firestore.DocumentData
  }
}

const Stack = createStackNavigator<RouteParams>();

export default function App() {

  const [loading, setLoading] = React.useState<boolean>(true);
  const [user, setUser] = React.useState<firebase.default.firestore.DocumentData | undefined>(undefined);

  const loginCallback = (user: firebase.default.firestore.DocumentData) => {
    setUser(user);
  }

  const logout = () => {
    firebase.default.auth().signOut()
    .then(() => {
      setUser(undefined);
    })
    .catch(err => alert(err));
  }

  useEffect(() => {
    const usersRef = firebase.default.firestore().collection('users');
    firebase.default.auth().onAuthStateChanged(user => {
      if (user) {
        usersRef
          .doc(user.uid)
          .get()
          .then((document) => {
            const userData = document.data()
            setLoading(false)
            setUser(userData)
          })
          .catch((error) => {
            setLoading(false)
          });
      } else {
        setLoading(false)
      }
    });
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }

  if (user === undefined) {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName={'Login'}>
            <Stack.Screen name='Login' options={{ headerShown: false}}>
              {props => <Login {...props} loginCallback={loginCallback}/>}
            </Stack.Screen>
            <Stack.Screen name='Register' options={{ headerShown: false }}>
              {props => <Register {...props} loginCallback={loginCallback}/>}
            </Stack.Screen>
          </Stack.Navigator>
      </NavigationContainer>
    )
  }

  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName={'Home'}>
          <Stack.Screen name='Home' options={{ headerShown: false }} initialParams={{ matchedMovies: [] }}>
            {props => <Home {...props} user={user}/>}
          </Stack.Screen>
          <Stack.Screen name='Search' component={Search} options={{ headerShown: false }}/>
          <Stack.Screen name='Matches' component={Matches} options={{ headerShown: false }}/>
          <Stack.Screen name='Settings' options={{ headerShown: false }}>
            {props => <Settings {...props} logout={logout}/>}
          </Stack.Screen>
        </Stack.Navigator>
        <StatusBar/>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
});
