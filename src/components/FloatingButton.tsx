import React, { useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  PanResponder,
  StyleSheet,
  View,
  type ViewStyle,
} from 'react-native';

import { useInspectorStore } from '../hooks';

const lokalLogo = require('../assets/lokal_logo.png');

const BUTTON_SIZE = 48;
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface FloatingButtonProps {
  style?: ViewStyle;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({ style }) => {
  const { config, setVisible } = useInspectorStore();
  const [position, setPosition] = useState({
    top: config?.floatingButtonPosition?.top ?? 100,
    right: config?.floatingButtonPosition?.right ?? 20,
  });

  const isDraggingRef = useRef(false);
  const panStartRef = useRef({ x: 0, y: 0, top: 0, right: 0 });
  const currentPositionRef = useRef(position);

  useEffect(() => {
    currentPositionRef.current = position;
  }, [position]);

  useEffect(() => {
    if (config?.floatingButtonPosition) {
      setPosition({
        top: config.floatingButtonPosition.top ?? 100,
        right: config.floatingButtonPosition.right ?? 20,
      });
    }
  }, [config?.floatingButtonPosition?.top, config?.floatingButtonPosition?.right]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        panStartRef.current = {
          x: evt.nativeEvent.pageX,
          y: evt.nativeEvent.pageY,
          top: currentPositionRef.current.top,
          right: currentPositionRef.current.right,
        };
        isDraggingRef.current = false;
      },
      onPanResponderMove: (evt) => {
        const { pageX, pageY } = evt.nativeEvent;
        const deltaX = Math.abs(pageX - panStartRef.current.x);
        const deltaY = Math.abs(pageY - panStartRef.current.y);

        if (deltaX > 5 || deltaY > 5) {
          isDraggingRef.current = true;
        }

        if (isDraggingRef.current) {
          const offsetX = pageX - panStartRef.current.x;
          const offsetY = pageY - panStartRef.current.y;
          const newTop = panStartRef.current.top + offsetY;
          const newRight = panStartRef.current.right - offsetX;

          const constrainedTop = Math.max(
            0,
            Math.min(newTop, SCREEN_HEIGHT - BUTTON_SIZE)
          );
          const constrainedRight = Math.max(
            0,
            Math.min(newRight, SCREEN_WIDTH - BUTTON_SIZE)
          );

          setPosition({
            top: constrainedTop,
            right: constrainedRight,
          });
        }
      },
      onPanResponderRelease: () => {
        if (!isDraggingRef.current) {
          setVisible(true);
        }
        isDraggingRef.current = false;
      },
    })
  ).current;

  // Hide button if tracking is disabled
  if (config.trackingOptions?.enabled === false) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          top: position.top,
          right: position.right,
        },
        style,
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.button}>
        <Image source={lokalLogo} style={styles.icon} resizeMode="contain" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 9999,
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    borderWidth: 1,
    borderColor: '#c6c4c4',
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 16,
    overflow: 'hidden',
  },
});
