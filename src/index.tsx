import { DeviceEventEmitter, NativeModules, Platform } from 'react-native';

import DeviceInfo from "react-native-device-info";
const LINKING_ERROR =
  `The package 'react-native-awesome-module' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

const AwesomeModule = NativeModules.AwesomeModule
  ? NativeModules.AwesomeModule
  : new Proxy(
      {},
      {
        get() {
          throw new Error(LINKING_ERROR);
        },
      },
    );

export function getColorDepth(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const colorDepth =
        Platform.OS === 'android' ? AwesomeModule.getColorDepth() : ''; // Adjust based on the platform
      resolve(colorDepth);
    } catch (error) {
      reject(error);
    }
  });
}

export function getViewPort(): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getViewPort()
          .then((viewportSize: { width: number; height: number }) => {
            resolve(viewportSize);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        // For iOS or other platforms, you can handle accordingly
        resolve({ width: 0, height: 0 });
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getDeviceCores(): Promise<number> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getDeviceCores()
          .then((cores: number) => {
            resolve(cores);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error('getDeviceCores is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getKernelInformation(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        AwesomeModule.getKernelInformation()
          .then((kernelInfo: string) => {
            resolve(kernelInfo);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error('getKernelInformation is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function getWifiSSID(): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        NativeModules.AwesomeModule.getWifiSSID()
          .then((ssid: string) => {
            resolve(ssid);
          })
          .catch((error: Error) => {
            reject(error);
          });
      } else {
        reject(new Error('getWifiSSID is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}
export function onSensorChanged(callback: (data: any) => void) {
  if (Platform.OS === 'android') {
    DeviceEventEmitter.addListener('ProximityData', callback);
    DeviceEventEmitter.addListener('OrientationData', callback);
  }
}
export function getProximityData(): Promise<{ isNear: boolean }> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      AwesomeModule.getProximityData()
        .then((proximityData: { isNear: boolean }) => {
          resolve(proximityData);
        })
        .catch((error: Error) => {
          reject(error);
        });
    } else {
      reject(new Error('getProximityData is not available on this platform'));
    }
  });
}
export function getOrientationData(): Promise<{ azimuth: number; pitch: number; roll: number }> {
  return new Promise((resolve, reject) => {
    if (Platform.OS === 'android') {
      NativeModules.AwesomeModule.getOrientationData()
        .then((orientationData: { azimuth: number; pitch: number; roll: number }) => {
          resolve(orientationData);
        })
        .catch((error: Error) => {
          reject(error);
        });
    } else {
      reject(new Error('getOrientationData is not available on this platform'));
    }
  });
}
export function getGPUDetails(): Promise<{ vendor: string; version: string; renderer: string }> {
  return new Promise((resolve, reject) => {
    try {
      if (Platform.OS === 'android') {
        NativeModules.GPUModule.getGPUDetails((error: Error | null, gpuDetails: { vendor: string; version: string; renderer: string }) => {
          if (error) {
            reject(error);
          } else {
            resolve(gpuDetails);
          }
        });
      } else {
        reject(new Error('getGPUDetails is not available on this platform'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

export async function getDeviceData(): Promise<{ is_emulator: boolean; device_id: string; ip_address: string }> {
  try {
    const is_emulator = await DeviceInfo.isEmulator();
    const device_id = DeviceInfo.getDeviceId();
    const ip_address = await DeviceInfo.getIpAddress();
    return {
      is_emulator,
      device_id,
      ip_address
    };
  } catch (error) {
    throw error;
  }
}


// async function checkWifiStatePermission() {
//   const Permissions = require('react-native-permissions');
//   const granted = await Permissions.check(Permissions.PERMISSIONS.ACCESS_WIFI_STATE);
//   return granted === Permissions.RESULTS.GRANTED;
// }
// export async function getMacAddress(): Promise<string> {
//   try {
//     if (Platform.OS === 'android') {
//       const macAddress = await AwesomeModule.getMacAddress();
//       return macAddress;
//     } else {
//       throw new Error('getMacAddress is not available on this platform');
//     }
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }

// export function getBoottime(): Promise<string> {
//   return new Promise((resolve, reject) => {
//     try {
//       if (Platform.OS === 'android') {
//         AwesomeModule.getBootTime()
//           .then((boottime: string) => {
//             resolve(boottime);
//           })
//           .catch((error: Error) => {
//             reject(error);
//           });
//       } else {
//         reject(new Error('getBoottime is not available on this platform'));
//       }
//     } catch (error) {
//       reject(error);
//     }
//   });
// }
// export function getGPUDetails(): Promise<{[key: string]: string}> {
//   return new Promise((resolve, reject) => {
//     if (AwesomeModule.getGPUDetails) {
//       AwesomeModule.getGPUDetails()
//         .then((gpuDetails: any) => {
//           // Check if gpuDetails is an object
//           if (typeof gpuDetails === 'object' && gpuDetails !== null) {
//             resolve(gpuDetails);
//           } else {
//             reject(new Error('Invalid GPU details received'));
//           }
//         })
//         .catch((error: Error) => {
//           reject(error);
//         });
//     } else {
//       reject(new Error('GPU details not available'));
//     }
//   });
// }
// export async function getUptime(): Promise<number> {
//   try {
//     if (Platform.OS === 'android') {
//       const uptime = await AwesomeModule.getUptime();
//       return uptime;
//     } else {
//       throw new Error('getUptime is not available on this platform');
//     }
//   } catch (error) {
//     return Promise.reject(error);
//   }
// }
