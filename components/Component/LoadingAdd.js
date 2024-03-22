import React, {useState, useEffect} from 'react';
import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';

export default function LoadingAdd() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      if (progress < 1) {
        setProgress(prevProgress => prevProgress + 0.02);
      }
    };

    const progressInterval = setInterval(updateProgress, 1000);

    const timeoutId = setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(1);
    }, 60000);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
    };
  }, [progress]);

  return (
    <View style={styles.container}>
      <Text style={{fontSize: 20, color: '#B5D8FE', fontWeight: '600'}}>
        {Math.round(progress * 100)}%
      </Text>
      <View style={styles.line}>
        <View
          style={{
            backgroundColor: '#B5D8FE',
            borderRadius: 15,
            height: '100%',
            width: progress === 1 ? '100%' : `${progress * 100}%`,
          }}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',

    zIndex: 99999999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loading: {
    marginTop: 10,
    width: 70,
    height: 70,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  line: {
    width: 200,
    height: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    backgroundColor: 'white',
  },
});
