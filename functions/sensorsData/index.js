import AsyncStorage from "@react-native-async-storage/async-storage";
import { gyroscope, accelerometer, magnetometer, setUpdateIntervalForType, SensorTypes } from "react-native-sensors";
import { formatDate } from "../../utils/raptorx-utils";

let gyroscopeSubscription;
let accelerometerSubscription;
let magnetometerSubscription;

const makeSensorsDataApiCall = async (
  api,
  session_id,
  customer_id,
  otherData
) => {
  const url = "api/analytics/sensor/capture";
  try {
    const { timestamp, x, y, z, sensor_type } = otherData;
    const formattedTimestamp = formatDate(timestamp);
    const formData = {
      session_id,
      customer_id,
      timestamp: formattedTimestamp,
      x,
      y,
      z,
      sensor_type,
    };
    const sensorsDataResult = await api.post(url, formData);
    return sensorsDataResult;
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
};

const getSensorsData = async (api, customerId) => {
  try {
    // Set update intervals for sensor types
    setUpdateIntervalForType(SensorTypes.gyroscope, 3000);
    setUpdateIntervalForType(SensorTypes.accelerometer, 3000);
    setUpdateIntervalForType(SensorTypes.magnetometer, 3000);

    // Get session ID from AsyncStorage
    const sessionId = await AsyncStorage.getItem("sessionId");
    
    // Subscribe to gyroscope data
    gyroscopeSubscription = gyroscope.subscribe(({ x, y, z, timestamp }) => {
      const otherData = { x, y, z, timestamp, sensor_type: 'gyroscope' };
      if (sessionId) {
        makeSensorsDataApiCall(api, sessionId, customerId, otherData);
      }
    });

    accelerometerSubscription = accelerometer.subscribe(({ x, y, z, timestamp }) => {
      const otherData = { x, y, z, timestamp, sensor_type: 'accelerometer' };
      if (sessionId) {
        makeSensorsDataApiCall(api, sessionId, customerId, otherData);
      }
    });

    magnetometerSubscription = magnetometer.subscribe(({ x, y, z, timestamp }) => {
      const otherData = { x, y, z, timestamp, sensor_type: 'magnetometer' };
      if (sessionId) {
        makeSensorsDataApiCall(api, sessionId, customerId, otherData);
      }
    });

    return () => {
      gyroscopeSubscription.unsubscribe();
      accelerometerSubscription.unsubscribe();
      magnetometerSubscription.unsubscribe();
    };

  } catch (error) {
    console.error("Error retrieving device information:", error);
    throw error;
  }
};

export default getSensorsData;
