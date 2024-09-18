import { PermissionsAndroid } from "react-native";

export const requestPermission = async (permission, data) => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS[permission], // Use square brackets for dynamic property access
        data
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission granted
        console.log(`Permission ${permission} granted`);
      } else {
        // Permission denied
        console.log(`Permission ${permission} denied`);
      }
    } catch (err) {
      console.warn(err);
    }
  };
  