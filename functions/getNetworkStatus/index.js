import React, { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [networkType, setNetworkType] = useState('');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setNetworkType(state.type);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return { isConnected, networkType };
};
