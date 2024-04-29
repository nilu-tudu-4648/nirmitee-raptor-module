// import { useRef, useState } from "react";
// import KeystrokeDynamicsSDK from "./components/KeystrokeDynamicsSDK";

// import ScrollSpeedCapture from "./components/ScrollSpeedCapture";
// import Geolocation from "@react-native-community/geolocation";

// export function captureKeyboardEvents(callback) {
//   const keyboardDidShowListener = Keyboard.addListener(
//     "keyboardDidShow",
//     (event) => {
//       callback("keyboardDidShow", event);
//     }
//   );

//   const keyboardDidHideListener = Keyboard.addListener(
//     "keyboardDidHide",
//     (event) => {
//       callback("keyboardDidHide", event);
//     }
//   );

//   // Return a cleanup function to remove the event listeners when no longer needed
//   return () => {
//     keyboardDidShowListener.remove();
//     keyboardDidHideListener.remove();
//   };
// }
// export function captureTouchEvents(callback) {
//   return (
//     <TouchableWithoutFeedback onPress={(event) => callback("onPress", event)}>
//       <View />
//     </TouchableWithoutFeedback>
//   );
// }
// export const KeyStrokeCapture = ({ style, ...props }) => {
//   const kdRef = useRef(new KeystrokeDynamicsSDK());

//   const handleKeyPress = (event) => {
//     kdRef.current.handleKeyPress(event);
//   };

//   return (
//     <TextInput
//       style={[styles.input, style]}
//       onKeyPress={handleKeyPress}
//       {...props}
//     />
//   );
// };
// const styles = StyleSheet.create({
//   input: {
//     height: 40,
//     borderColor: "gray",
//     borderWidth: 1,
//   },
// });
// export const ScrollEventCapture = (props) => {
//   return <ScrollSpeedCapture {...props} />;
// };
// export const getCurrentLocation = () => {
//   Geolocation.getCurrentPosition((info) => console.log(info));
// };

import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import {
  generateSessionId,
  createSessionData,
} from '../functions/generate_session/generateSession';
import {getNavigationData} from '../functions/navigation_Listner';
import getAllDeviceData from '../functions/deviceData';
import getSensorsData from '../functions/sensorsData';
import clearSessionData from '../functions/generate_session/clearSession';
import {getElementInfo} from '../functions/formCapture';
import NetInfo from '@react-native-community/netinfo';

class RaptorX {
  constructor(api_key, navigation) {
    this.api_key = api_key;
    this.apiBaseUrl = 'https://server.panoplia.io';
    this.api = new API({
      hostUrl: this.apiBaseUrl,
      api_key: this.api_key,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.navigation = navigation; // Set the navigation object during initialization
  }


  async createSession(customerId) {
    try {
      const sessionId = await generateSessionId(this.api_key);
      await this.storeCustomerID(customerId);
      if (sessionId) {
        await createSessionData(this.api, sessionId, customerId);
      }
    } catch (error) {
      console.error('Error creating session:', error);
      throw error;
    }
  }
  navigationCapture() {
    getNavigationData(this.api, this.navigation);
  }
  async clearSession() {
    try {
      // Retrieve the session ID from AsyncStorage or any other storage mechanism
      const sessionId = await AsyncStorage.getItem('sessionId');
      const customerId = await AsyncStorage.getItem('customerId');
      if (!sessionId) {
        console.log('No session ID found. Skipping session clearing.');
        return;
      }
      await clearSessionData(this.api, sessionId, customerId);
      console.log('Session cleared successfully.');
    } catch (error) {
      console.error('Error clearing session:', error);
      throw error;
    }
  }
  async storeCustomerID(customerId) {
    try {
      await AsyncStorage.setItem('customerId', customerId);
    } catch (error) {
      console.error('Error storing customerId:', error);
      throw error;
    }
  }
  async initDeviceData() {
    try {
      const sessionId = await AsyncStorage.getItem('sessionId');
      const customerId = await AsyncStorage.getItem('customerId');
      const deviceData = await getAllDeviceData(
        this.api,
        sessionId,
        customerId,
      );
      return deviceData;
    } catch (error) {
      console.error('Error initializing device data:', error);
    }
  }
  async initSensorsData() {
    try {
      const customerId = await AsyncStorage.getItem('customerId');
      await getSensorsData(this.api, customerId);
    } catch (error) {
      console.error('Error initializing sensor data:', error);
      throw error;
    }
  }
  async getNetwork() {
    try {
      const state = await NetInfo.fetch();
      return state;
    } catch (error) {
      console.error('Error getting network details:', error);
      throw error;
    }
  }
  async formCapture(e, i) {
    try {
      const customerId = await AsyncStorage.getItem('customerId');
      const res = getElementInfo(this.api, e, i, customerId);
      return res;
    } catch (error) {
      console.log(error);
    }
  }
}

export default RaptorX;
