import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Animated, Easing, Dimensions } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const bounceValue = new Animated.Value(0); 
  const loaderOpacity = new Animated.Value(0);
  const dotOpacity = [
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0)
  ];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(bounceValue, {
        toValue: 1,
        duration: 1500,
        easing: Easing.bounce, 
        useNativeDriver: true,
      }),
      Animated.timing(loaderOpacity, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(dotOpacity[0], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity[0], {
            toValue: 0.3, 
            duration: 500, 
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity[1], {
            toValue: 1,
            duration: 500, 
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity[1], {
            toValue: 0.3, 
            duration: 500, 
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity[2], {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(dotOpacity[2], {
            toValue: 0.3, 
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const bounceInterpolate = bounceValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 1.2, 1],
  });

  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../assets/images/apsLogo.png')}
        style={[
          styles.logo,
          { opacity: fadeAnim, transform: [{ scale: bounceInterpolate }] },
        ]}
        resizeMode="contain"
      />
      <View style={styles.loader}>
        {dotOpacity.map((opacity, index) => (
          <Animated.View
            key={index}
            style={[styles.loaderCircle, { opacity }]}
          />
        ))}
      </View>
      <Text style={styles.text}>Aps Lead management</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0', 
  },
  logo: {
    width: 0.8 * Dimensions.get('window').width, 
    height: 0.8 * Dimensions.get('window').width,
    marginLeft:'12%',

    marginBottom:-50
     },
  loader: {
    flexDirection: 'row',
    marginBottom: 10, 
  },
  loaderCircle: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginHorizontal: 5,
    backgroundColor: 'rgb(40,71,150)',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgb(40,71,150)', 
  },
});

export default SplashScreen;



