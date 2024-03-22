import react from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

export default function Loading(){
    return (
        <View style={styles.container}>
            {/* <View style={styles.loading}> */}
                <ActivityIndicator size="large" color="#94D8F4" />
            {/* </View> */}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'absolute',
        height: '100%',
        width: '100%',
        // backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backgroundColor: 'rgba(255, 255, 255, 0.6)',

        zIndex: 99999999,
        justifyContent: 'center',
        alignItems: 'center'
    },
    loading: {
        width: 70,
        height: 70,
        borderRadius: 15,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center'
    }
})