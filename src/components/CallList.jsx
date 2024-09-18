import React, { useState } from "react";
import {
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Avatar} from "react-native-paper";
import { styles } from "../styles/Stylesheet";
import { useNavigation } from "@react-navigation/native";

const CallList = ({ item }) => {

  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const navigation = useNavigation();

    const renderCallTypeIcon = () => {
      if (item.type === "INCOMING") {
        return <Avatar.Icon icon="phone-incoming" size={27} color="#007bff" style={{ backgroundColor: 'white' }} />;
      } else if (item.type === "OUTGOING") {
        return <Avatar.Icon  icon="phone-outgoing" size={27} color="green" style={{ backgroundColor: 'white' }} />;
      } else if (item.type === "MISSED") {
        return <Avatar.Icon  icon="phone-missed" size={27} color="red" style={{ backgroundColor: 'white' }} />;
      }
      return null;
    };
    const handlePhoneNumberPress = (phoneNumber) => {
        setSelectedNumbers((prevSelectedNumbers) =>
          prevSelectedNumbers.includes(phoneNumber)
            ? prevSelectedNumbers.filter((num) => num !== phoneNumber)
            : [...prevSelectedNumbers, phoneNumber]
        );
        navigation.navigate("CallDetails", { phoneNumber });
      };
    return (
      <View style={styles.callLogItem}>
        <TouchableOpacity
          style={{ flexDirection:'row',}}
          onPress={() => handlePhoneNumberPress(item.phoneNumber)}
        >
        <View style={{marginTop:6, marginRight:5}}>
          {renderCallTypeIcon()}
          </View>
          <View>
              <View>
              <Text style={styles.callLogText}>
                {item.name ? ` ${item.name}` : "NA"}
                </Text>
                <Text  style={{color:'grey'}}>
                {item.phoneNumber ? `${item.phoneNumber}` : "Phone Number: NA"}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
export default CallList