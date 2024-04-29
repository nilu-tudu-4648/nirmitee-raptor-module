import AsyncStorage from "@react-native-async-storage/async-storage";
import { SHA256 } from "crypto-js";
const generateSessionId = async (apiKey) => {
  try {
    const existingSessionId = await AsyncStorage.getItem("sessionId");
    if (existingSessionId) {
      return existingSessionId;
    }

    if (!apiKey) {
      throw new Error("API key not provided. Make sure to set the API_KEY.");
    }

    const startTime = new Date().toISOString();
    const dataToHash = `${apiKey}_${startTime}`;
    const sessionId = SHA256(dataToHash).toString().slice(0, 30);

    await AsyncStorage.setItem("sessionId", sessionId);
    await AsyncStorage.setItem("start_time", startTime);
    return sessionId;
  } catch (error) {
    throw error;
  }
};

const createSessionData = async (api, sessionId, customerId) => {
  try {
    const startTime = await AsyncStorage.getItem("start_time");
    const data = await makeApiCall(api, sessionId, customerId, startTime);
    return data;
  } catch (error) {
    console.error("Error creating session data:", error);
  }
};

export const makeApiCall = async (
  apiInstance,
  sessionId,
  customerId,
  startTime,
  endTime
) => {
  const params = { url: "api/analytics/session/capture" };
  try {
    const postData = {
      session_id: sessionId,
      customer_id: customerId,
      start_time: startTime,
      end_time: endTime,
    };
    const postResponse = await apiInstance.post(params.url, postData);
    console.log({sessionId,postResponse})
    return postResponse;
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
};

export { generateSessionId, createSessionData };
