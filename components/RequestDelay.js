import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import * as MailComposer from "expo-mail-composer";
import { FontAwesome } from "react-native-vector-icons";

const RequestDelay = ({ navigation }) => {
  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: "Request a Delay",
    });
  }, [navigation]);

  const [emailText, setEmailText] = React.useState(
    "I want to request a delay for my payment"
  );

  const sendEmail = async () => {
    const isAvailable = await MailComposer.isAvailableAsync();
    if (!isAvailable) {
      Alert.alert("Error", "Email service is not available on this device");
      return;
    }

    MailComposer.composeAsync({
      recipients: ["recipient@example.com"],
      subject: "Request a delay",
      body: emailText,
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0a295c" style="light" />
      <TextInput
        style={styles.textInput}
        multiline
        value={emailText}
        onChangeText={setEmailText}
      />
      <TouchableOpacity style={styles.captureBtn} onPress={sendEmail}>
        <Text style={styles.btnText}>Send Email</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a295c",
    alignItems: "center",
    paddingTop: "15%",
    width: "100%",
  },
  textInput: {
    width: "80%",
    height: "60%",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "white",
  },
  captureBtn: {
    backgroundColor: "#71a3f5",
    paddingVertical: 10,
    borderRadius: 10,
    paddingHorizontal: 20,
    marginVertical: "10%",
  },
  btnText: {
    fontWeight: "700",
    fontSize: 16,
  },
});

export default RequestDelay;
