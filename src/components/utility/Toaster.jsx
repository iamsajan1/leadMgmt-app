import { ToastAndroid } from "react-native";

export const SucceededToaster = (text) => {
    ToastAndroid.show(
      `${text}`,
      ToastAndroid.SHORT
    );
  };