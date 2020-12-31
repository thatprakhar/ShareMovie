import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import { ButtonGroup, Divider, Icon } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';

export interface MovieCardProps {
    imdbID: string,
    Title: string,
    Poster: string,
    Type: string,
    Year: string,
    showAddIcon?: boolean | undefined,
    showLikeButtons?: boolean,
    Plot: string,
    Genre: string,
    addMovie?: (imdbID: string, title: string) => void,
    imdbRating?: string,
    likeCard: (imdbId: string) => void,
    dislikeCard: (imdbID: string) => void
}

export interface MovieCardState {
    selectedIndex: number
}

export default class MovieCard extends React.Component<MovieCardProps, MovieCardState> {
    constructor(props: MovieCardProps) {
        super(props);
        this.state = {
            selectedIndex: -1
        }
    }

    handleClick = (idx: number) => {
        this.setState({
            selectedIndex: idx,
        })
        const { likeCard, dislikeCard, imdbID } = this.props;
        if (idx === 0) {
            likeCard(imdbID);
        } else if (idx === 1) {
            dislikeCard(imdbID);
        }
    }

    render() {
        const {Title, Poster, Year, Type, Plot, Genre, showAddIcon, addMovie, imdbID, imdbRating, showLikeButtons} = this.props

        return (
            <View 
                style={styles.container}
            >
                <Divider style={styles.divider}/>
                <Text style={styles.movieTitle}>
                    {Title} {imdbRating && <Text>({imdbRating} <Icon name='star' color='#f5c414' style={{ marginTop: '-1%'}}/>)</Text>}
                </Text>
                <Text style={styles.caption}>
                    {Type.charAt(0).toUpperCase() + Type.slice(1)} - {Year}
                </Text>
                <View style={styles.imageContainer}>
                    <Image source={{uri: Poster}} style={styles.image} resizeMode='contain'/>
                    {showAddIcon && addMovie ? 
                        <TouchableOpacity style={{flex: 1, justifyContent: 'center'}} onPress={() => addMovie(imdbID, Title)}>
                            <Icon name='plus-circle' type='font-awesome' color='#e94560' size={40}></Icon>
                        </TouchableOpacity>
                        :
                        <ScrollView style={styles.info}>
                            <Text style={styles.plot}>{Plot}</Text>
                            <Text style={styles.genre}>Genre: {Genre}</Text>
                        </ScrollView>
                    }
                </View>
                {showLikeButtons && 
                    <View style={styles.buttons}>
                        <ButtonGroup
                            selectedIndex={this.state.selectedIndex}
                            buttons={['Like', 'Dislike']}
                            onPress={idx => this.handleClick(idx)}
                            buttonStyle={{ backgroundColor: 'white' }}
                            selectedButtonStyle={{ backgroundColor: '#e94560' }}
                            textStyle={{ color: 'black' }}
                            disabled={this.state.selectedIndex !== -1}
                        ></ButtonGroup>
                    </View>
                }
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
        paddingTop: '5%',
        paddingLeft: '5%',
        paddingBottom: '0%',
        paddingRight: '5%'
    },
    movieTitle: {
        fontSize: 21,
        fontWeight: '600',
        color: 'white'
    },
    imageContainer: {
        marginTop: '5%',
        height: 200,
        width: '100%',
        flexDirection: 'row'
    },
    image: {   
        flex: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0.4, height: 1 },
        shadowOpacity: 0.9,
        shadowRadius: 7
    },
    location: {
        marginLeft: '2%',
        marginTop: '-15%',
        width: '20%',
    },
    locationImage: {
        width: '100%',
        height: 100,
    },
    caption: {
        marginTop: '2%',
        color: "grey"
    },
    divider: {
        marginTop: '2%',
        marginBottom: '2%'
    },
    info: {
        width: '0%',
        paddingLeft: '5%'
    },
    plot: {
        fontSize: 12,
        color: 'white',
    },
    genre: {
        fontSize: 10,
        marginTop: '15%',
        color: 'white',
    },
    buttons: {
        marginTop: '2%'
    }
});