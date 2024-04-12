import React, { useState } from 'react';
import { Text, View, Button, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen: React.FC = ({ navigation }: any, { route }: any) => {
    const [Text, setText] = useState('');
    const handleInputChange = (inputText: string) => {
        setText(inputText);
    };

    return (
        <View style={styles.container}>
            <View style={styles.inputTextcontainer}>
                <TextInput
                    style={{ height: 60, borderColor: 'gray', borderWidth: 1, marginBottom: 20, paddingHorizontal: 10 }}
                    onChangeText={handleInputChange}
                    value={Text}
                    placeholder="텍스트를 입력하세요"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
    },
    inputTextcontainer: {
        height : 60,
        backgroundColor: 'green',
    }
}
)

export default LoginScreen;