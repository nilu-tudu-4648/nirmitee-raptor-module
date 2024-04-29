
import AsyncStorage from "@react-native-async-storage/async-storage";
export const makeApiCall = async (
  apiInstance,
  timestamp,
  page_url,
) => {
  const params = { url: "api/analytics/events/capture" };
  try {
    const session_id = await AsyncStorage.getItem("sessionId");
    const customer_id = await AsyncStorage.getItem("customerId");
if(session_id){
    const postData = {
      session_id,
      customer_id,
      timestamp,
      "event_type": "page_capture",
      page_url
    };
    
    const getNavigationDataResponse = await apiInstance.post(params.url, postData);
    console.log({getNavigationDataResponse})
    return getNavigationDataResponse;
  }else{
    console.log('session id not found')
  }
  } catch (error) {
    console.error("Error making API call:", error);
    throw error;
  }
};

export function getNavigationData(api, navigation) {
  try {
    const handleStateChange = async () => {
      const { routes, index } = navigation.getState();
      const currentRoute = routes[index];
      const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0]; // Format timestamp as "YYYY-MM-DD HH:mm:ss"
      await makeApiCall(api, timestamp, currentRoute.name);
    };

    const unsubscribe = navigation.addListener('state', handleStateChange);

    return unsubscribe;
  } catch (error) {
    console.error('Error capturing navigation data:', error);
  }
}
