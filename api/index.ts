import Environment from '../env';
import { firebase } from '../firebase/config';


export const addMovieAPI = async (imdbID: string, userID: string) => {
    const requestOptions = {
        method: "GET",
        headers: {
            id: userID
        }
    }
    const requestURL = Environment.addMovieAPIURL + imdbID;
    const res = await fetch(requestURL, requestOptions);
    return res;
}

export const fetchMoviesAPI = async (search: string, type: string, userID: string): Promise<({ status: string; data: any; })> => {
    const requestOptions = {
        method: "GET",
        headers: {
            id: userID
        }
    }
    const requestURL = Environment.fetchMoviesAPIURL + encodeURIComponent(search) + '&type=' + type;

    const res = await fetch(requestURL, requestOptions);
    const data = await res.json();
    let responseData: any[] = [];
    await data.forEach((element: string) => {
        responseData = [...responseData, JSON.parse(JSON.stringify(element))];
    });
    return await {
        data: responseData,
        status: 'OK'
    }
}

export const fetchHomeMoviesAPI = async (userID: string) => {
    /*const requestOptions = {
        method: "GET",
        headers: {
            id: userID
        }
    }
    const requestURL = Environment.fetchHomeMoviesAPIURL;
    const res = await fetch(requestURL, requestOptions);
    const data = await res.json();
    let responseData: any[] = [];
    await data.forEach((element: string) => {
        responseData = [...responseData, JSON.parse(JSON.stringify(element))];
    });
    return await responseData;*/
    const snapshot = await firebase.default.firestore().collection('movies').get();
    const data = snapshot.docs.map(doc => doc.data());
    return data.filter(item => (!item.DislikedBy.includes(userID) && !item.LikedBy.includes(userID)));
}

export const fetchMatchedMoviesAPI = async (userID: string) => {
    /*const requestOptions = {
        method: "GET",
        headers: {
            id: userID
        }
    }
    const requestURL = Environment.fetchMatchedMoviesAPIURL;
    const res = await fetch(requestURL, requestOptions);
    const data = await res.json();
    let responseData: any[] = [];
    await data.forEach((element: string) => {
        responseData = [...responseData, JSON.parse(JSON.stringify(element))];
    });
    return await responseData;*/
    const snapshot = await firebase.default.firestore().collection('matches').get();
    return snapshot.docs.map(doc => doc.data());
}

export const likeMovieAPI = async (imdbID: string, userID: string) => {
    /*
        const requestOptions = {
            method: "GET",
            headers: {
                id: userID
            }
        }
        const requestURL = Environment.likeMovieAPIURL + imdbID;
        const res = await fetch(requestURL, requestOptions);
        const data = await res.json();
        return data;
    */
    firebase.default.firestore().collection('movies').doc(imdbID).update({
        Likes: firebase.default.firestore.FieldValue.increment(1),
        LikedBy: firebase.default.firestore.FieldValue.arrayUnion(userID)
    })
    .then(res => console.log(res))
    .catch(err => alert(err));
}

export const dislikeMovieAPI = async (imdbID: string, userID: string) => {
    /*const requestOptions = {
        method: "GET",
        headers: {
            id: userID
        }
    }
    const requestURL = Environment.dislikeMovieAPIURL + imdbID;
    const res = await fetch(requestURL, requestOptions);
    const data = await res.json();
    return data;*/

    firebase.default.firestore().collection('movies').doc(imdbID).update({
        Dislikes: firebase.default.firestore.FieldValue.increment(1),
        DislikedBy: firebase.default.firestore.FieldValue.arrayUnion(userID)
    })
    .then(res => console.log(res))
    .catch(err => alert(err));
}