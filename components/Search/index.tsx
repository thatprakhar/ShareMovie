import React, { FunctionComponent } from 'react';
import { View, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { ButtonGroup, Icon, SearchBar, Overlay } from 'react-native-elements';
import MovieCard, { MovieCardProps } from '../MovieCard';

import { fetchMoviesAPI, addMovieAPI } from '../../api';
import { Route } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';

type SearchProps = {
    route: Route<'Search', {userID: string}>,
    navigation: any
}

const Search: FunctionComponent<SearchProps> = ({ route, navigation }) => {
    
    const [searchItem, setSearchItem] = React.useState<string>('');
    const [loading, setLoading] = React.useState<boolean>(false);
    const [loadingAdd, setLoadingAdd] = React.useState<boolean>(false);
    const [movies, setMovies] = React.useState<Array<MovieCardProps>>([]);

    const addMovie = async (imdbID: string, title: string) => {
        const userID = route.params.userID;
        setLoadingAdd(true);


        if (userID === undefined) {
            alert('Error');
            setLoadingAdd(false);
            return;
        }


        addMovieAPI(imdbID, userID)
        .then(res => {
            setLoadingAdd(false);
            alert('Added ' + title + ' to the list')
        })
        .catch(err => {
            setLoadingAdd(false);
            alert(err)
        });
    }

    const fetchMovies = async (dataType: number) => {

        const userID = route.params.userID;
        if (userID === undefined) {
            alert('Error');
            return;
        }

        setLoading(true);
        const mediaType = dataType === 0 ? 'movie' : 'series'

        const result = await fetchMoviesAPI(searchItem, mediaType, userID);
        if (result.status === 'OK') {
            setLoading(false);
            setMovies(result.data);
        } else {
            setLoading(false);
            alert('Error');
        }
    }

    return (
        <View style={styles.container}>
            <Overlay
                isVisible={loadingAdd}
            >
                <ActivityIndicator />
            </Overlay>
            <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{ justifyContent: 'center', flex: 1 }} onPress={() => navigation.navigate('Home')}>
                    <Icon name='chevron-left' type='font-awesome' color='#e94560'/>
                </TouchableOpacity>
                <SearchBar
                    inputStyle={{ color: 'black' }}
                    containerStyle={{ backgroundColor: '#1a1a2e', borderWidth: 0, width: '90%'}}
                    inputContainerStyle={{ backgroundColor: 'white' }}
                    value={searchItem}
                    onChangeText={text => setSearchItem(text)}
                    onCancel={() => setLoading(false)}
                />
            </View>
            <ButtonGroup
                buttons={['Movie', 'Series']}
                onPress={value => fetchMovies(value)}
            >

            </ButtonGroup>
            <View style={styles.result}>
                {loading ? 
                    <ActivityIndicator />
                :
                    <FlatList
                        data={movies}
                        keyExtractor={item => item.imdbID}
                        renderItem={item => <MovieCard {...item.item} showAddIcon={true} addMovie={addMovie}/>}
                    ></FlatList>
                }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a2e',
        paddingTop: '15%',
        paddingLeft: '2%',
        paddingRight: '2%'
    },
    result: {
        height: '85%',
        justifyContent: 'center'
    }
});

export default Search;
