import AsyncStorage from "@react-native-async-storage/async-storage";
import { makeApiCall } from "./generateSession";
import getSensorsData from "../sensorsData";

const clearSessionData = async (api, sessionId, customerId) => {
  try {
    const endTime = new Date().toISOString();
    const startTime = await AsyncStorage.getItem("start_time");

    // Make API call to capture session end time
    await makeApiCall(api, sessionId, customerId, startTime, endTime);

    // Clear AsyncStorage
    await AsyncStorage.clear();

    // Stop sensor subscriptions
    const stopSensorSubscriptions = getSensorsData(api, customerId);
    if (typeof stopSensorSubscriptions === 'function') {
      stopSensorSubscriptions();
    } else {
      console.warn('getSensorsData did not return a function to stop sensor subscriptions.');
    }

  } catch (error) {
    console.error("Error clearing session data:", error);
    throw error;
  }
};

export default clearSessionData;
