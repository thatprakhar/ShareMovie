import React from 'react'
import { FlatList, Text, View, StyleSheet, ActivityIndicator } from 'react-native'
import { Icon, Badge, Overlay } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

import MovieCard, { MovieCardProps } from '../MovieCard';

import { firebase } from '../../firebase/config';
import { fetchHomeMoviesAPI, likeMovieAPI, dislikeMovieAPI } from '../../api';
import { Route } from '@react-navigation/native';

interface HomeProps {
    user: firebase.default.firestore.DocumentData | undefined,
    navigation: any
    route: Route<'Home', {
        matchedMovies: Array<MovieCardProps>
    }>
}

interface HomeState {
    movies: Array<MovieCardProps>
    loading: boolean
    matchedMovies: Array<MovieCardProps>
    loadingButton: boolean 
}

export default class Home extends React.Component<HomeProps, HomeState> {

    constructor(props: HomeProps) {
        super(props);
        this.state = {
            movies: [],
            loading: true,
            matchedMovies: [],
            loadingButton: false
        }
    }

    fetchHomeMovies = async () => {
        if (this.props.user === undefined) {
            this.setState({
                loading: false
            })
            return;
        }
        this.setState({
            loading: true
        })
        const userID = this.props.user.id;
        const result = await fetchHomeMoviesAPI(userID);
        this.setState({
            loading: false,
            movies: result as MovieCardProps[]
        });
    }

    componentDidMount() {
        this.fetchHomeMovies();
    }

    openSearch = () => {
        const { user, navigation } = this.props;
        if (user !== undefined) {
            navigation.navigate('Search', {
                userID: user.id
            });
        }
    }

    openSettings = () => {
        const { user, navigation } = this.props;
        if (user !== undefined) {
            navigation.navigate('Settings', {user});
        }
    }

    openMatches = () => {
        const { user, navigation, route } = this.props;
        navigation.navigate('Matches', {
            user,
            initialMovies: route.params.matchedMovies
        });
    }

    closeMatchesCallback = (movies: MovieCardProps[]) => {
        this.setState({
            matchedMovies: movies
        });
    }

    likeCard = async (imdbID: string) => {
        const user = this.props.user;
        if (user) {
            this.setState({
                loadingButton: true
            });
            likeMovieAPI(imdbID, user.id)
            .then(res => {
                this.setState({
                    loadingButton: false
                });
                this.removeCard(imdbID);
            })
            .catch(err => {
                this.setState({
                    loadingButton: false
                });
                alert(err);
            });
            
        }
    }

    dislikeCard = async (imdbID: string) => {
        const user = this.props.user;
        if (user) {
            this.setState({
                loadingButton: true
            });
            this.removeCard(imdbID);
            dislikeMovieAPI(imdbID, user.id)
            .then(res => {
                this.setState({
                    loadingButton: false
                });
                this.removeCard(imdbID);
            })
            .catch(err => {
                this.setState({
                    loadingButton: false
                });
                alert(err);
            });
            
        }
    }

    removeCard = (imdbID: string) => {
        const { movies } = this.state;
        const newMovies = movies.filter(item => item.imdbID !== imdbID);
        this.setState({
            movies: newMovies
        });
    }

    render() {
        const { user, route } = this.props;
        const { movies } = this.state;

        if (user === undefined) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center'}}>
                    <ActivityIndicator />
                </View>
            );
        }
     
        return (
            <View style={styles.container}>
                <Overlay
                    isVisible={this.state.loadingButton}
                >
                    <ActivityIndicator />
                </Overlay>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => this.openMatches()}>
                        <Icon name='tv' type='font-awesome' color='#e94560' size={30}></Icon>
                        <Badge
                            value={route.params.matchedMovies.length > 9 ? '9+' : route.params.matchedMovies.length}
                            status='warning'
                            containerStyle={{ position: 'absolute', top: -7, right: -6}}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openSearch()}>
                        <Icon name='search' type='font-awesome' color='#e94560' size={28}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.openSettings()}>
                        <Icon name='settings' type='ionicon' color='#e94560' size={30}></Icon>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.fetchHomeMovies()}>
                        <Icon name='refresh-outline' type='ionicon' color='#e94560' size={30}></Icon>
                    </TouchableOpacity>
                </View>
                <View style={styles.box}>
                    <Text style={styles.title}>Picks</Text>
                </View>
                {this.state.loading && <ActivityIndicator />}
                <FlatList
                    initialNumToRender={2}
                    data={movies}
                    renderItem={item => <MovieCard {...item.item} showLikeButtons={true} showAddIcon={false} likeCard={this.likeCard} dislikeCard={this.dislikeCard}/>}
                    keyExtractor={item => item.imdbID}
                >
                </FlatList>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        paddingTop: '20%',
        paddingLeft: '5%',
        paddingBottom: '20%',
        paddingRight: '10%',
        justifyContent: 'flex-start'
    },
    header: {
        paddingTop: '5%',
        paddingBottom: '5%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    box: {
        paddingTop: '5%',
        paddingBottom: '5%'
    },
    greeting: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#ffffff'
    },
    title: {
        fontSize: 30,
        fontWeight: '200',
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: '#e94560'
    }
});