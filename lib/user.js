import firestore from '@react-native-firebase/firestore';

export const userCollection = firestore().collection('users');

export function createUser({ username, userpass, usernickname }) {
    return userCollection.doc(username).set({
        username,
        userpass,
        usernickname,
    });
}

export async function getUser(username) {
    const doc = await userCollection.doc(username).get();
    return doc.data();
}
