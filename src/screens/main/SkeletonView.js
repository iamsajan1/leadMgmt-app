import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

const SkeletonView = ({ width, height, render, direction }) => {
  const blinkAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animateSkeleton = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(blinkAnimation, {
            toValue: 1,
            duration: 300, // Decreased duration to make the animation faster
            useNativeDriver: false,
          }),
          Animated.timing(blinkAnimation, {
            toValue: 0,
            duration: 300, // Decreased duration to make the animation faster
            useNativeDriver: false,
          }),
        ]),
      ).start();
    };

    animateSkeleton();

    return () => {
      blinkAnimation.stopAnimation();
    };
  }, [blinkAnimation]);

  const renderSkeletonItems = () => {
    const skeletonItems = [];
    const itemsPerRow = 2; // Define the number of skeleton items per row
    const rows = Math.ceil(render / itemsPerRow); // Calculate the number of rows needed

    for (let i = 0; i < rows; i++) {
      const rowItems = [];
      for (let j = 0; j < itemsPerRow; j++) {
        const index = i * itemsPerRow + j;
        if (index < render) {
          rowItems.push(
            <Animated.View
              key={index}
              style={[
                styles.skeletonItem,
                { width, height },
                { opacity: blinkAnimation },
              ]}
            />
          );
        }
      }
      skeletonItems.push(
        <View key={i} style={styles.rowContainer}>
          {rowItems}
        </View>
      );
    }
    return skeletonItems;
  };

  return (
    <View style={direction === 'row' ? styles.rowContainer : styles.columnContainer}>
      {renderSkeletonItems()}
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  columnContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  skeletonItem: {
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    margin: 5,
  },
});

export default SkeletonView;
