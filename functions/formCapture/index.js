import AsyncStorage from "@react-native-async-storage/async-storage";
const makegetElementInfoApiCall = async (
  api,
  formData
) => {
  const url = "api/analytics/forms/capture";
  try {
    const sensorsDataResult = await api.post(url, formData);
    return sensorsDataResult;
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
};

export const getElementInfo = async (api,elementId, value, customer_id, timeInSeconds = 60) => {
  const calculateWPM = (text, timeInSeconds) => {
      // Calculate the number of words in the text
      const words = text.trim().split(/\s+/);
      const wordCount = words.length;

      // Calculate WPM (Words Per Minute)
      const minutes = timeInSeconds / 60;
      const wpm = wordCount / minutes;

      // Round the result to the nearest integer
      return Math.round(wpm);
  };

  if (!value) {
      console.warn('Value is empty');
      return null;
  }

  try {
      const session_id = await AsyncStorage.getItem("sessionId");
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];
      const elementInfo = {
          session_id,
          customer_id,
          element_id: elementId,
          element_value: value,
          form_id:"form",
          timestamp,
          is_pasted: false, // Placeholder value, update as needed
          wpm: calculateWPM(value, timeInSeconds),
      };

      // Make API call to send element info
      const apiResponse = await makegetElementInfoApiCall(api, elementInfo);
      return apiResponse;
  } catch (error) {
      console.error("Error in getElementInfo:", error);
      throw error;
  }
};
