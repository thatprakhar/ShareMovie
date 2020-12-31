import React, { FunctionComponent, useEffect } from 'react';
import { View, StyleSheet, Text, ActivityIndicator, FlatList } from 'react-native';
import { Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MovieCard, { MovieCardProps } from '../MovieCard';

import { fetchMatchedMoviesAPI } from '../../api';
import { Route } from '@react-navigation/native';

type MatchesProps = {
    navigation: any
    route: Route<'Matches', {
        user: firebase.default.firestore.DocumentData
        initialMovies: MovieCardProps[]  
    }>
}

const Matches: FunctionComponent<MatchesProps> = ({ navigation, route }) => {

    const [matchedMovies, setMatchedMovies] = React.useState<Array<MovieCardProps>>([]);
    const [loading, setLoading] = React.useState<boolean>(false);

    const closeMatches = () => {
        navigation.navigate('Home', {
            matchedMovies: matchedMovies
        });
    }

    useEffect(() => {
        setMatchedMovies(route.params.initialMovies);
        setLoading(true);
        const userID = route.params.user.id;
        fetchMatchedMoviesAPI(userID)
        .then(res => {
            setMatchedMovies(res);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            alert(err);
        })
    }, []);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'flex-start'}}>
                <TouchableOpacity onPress={() => closeMatches()}>
                    <Icon name='chevron-left' type='font-awesome' color='#e94560'/>
                </TouchableOpacity>
                <View style={{marginLeft: '10%', marginTop: '-2%' }}>
                    <Text style={styles.title}>Matches</Text>
                </View>
            </View>
            <View
                style={styles.content}
            >
                {loading && <ActivityIndicator />}
                <FlatList
                    initialNumToRender={2}
                    data={matchedMovies}
                    renderItem={item => <MovieCard {...item.item} />}
                    keyExtractor={item => item.imdbID}
                />
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
    content: {
        marginTop: '5%',
        width: '100%'
    }
});

export default Matches;