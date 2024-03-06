import auth from '@react-native-firebase/auth';

export function signIn({username, userpass}) {
    return auth().signInWithEmailAndPassword(username, userpass);
}

export function signUp({username, userpass}) {
    return auth().createUserWithEmailAndPassword(username, userpass);
}

export function subscribeAuth(callback) {
    return auth().onAuthStateChanged(callback);
}

export function signOut(){
    return auth().signOut();
}
