import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform
} from "react-native";
import { FontAwesome } from "react-native-vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useSelector, useDispatch } from "react-redux";
import { setBillScanned, removeBillScanned } from "../Slice/BillSlice";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const HomeScreen = ({ navigation }) => {
  const [show, setShow] = React.useState(false);
  const [image, setImage] = React.useState(null);
  const [expoPushToken, setExpoPushToken] = React.useState("");

  const billScanned = useSelector((state) => state.BillSlice.billScanned);
  const dispatch = useDispatch();

  // console.log(billScanned);

  React.useEffect(() => {
    registerForPushNotifications();
    checkAndScheduleNotifications();
  }, []);

  async function registerForPushNotifications() {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
    } else {
      alert("Must use physical device for Push Notifications");
    }

    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;
    setExpoPushToken(token);
    console.log("Expo Push Token:", token);
  }

  function checkAndScheduleNotifications() {
    const today = new Date();

    billScanned.forEach((bill) => {
      const dueDate = new Date(bill.dueDate);
      const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1 || diffDays === 2) {
        scheduleNotification(bill.amount, bill.dueDate, diffDays);
      }
    });
  }

  async function scheduleNotification(amount, dueDate, daysLeft) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Upcoming Bill Due!",
        body: `Your bill of $${amount} is due in ${daysLeft} day(s) (${dueDate}).`,
        sound: "default",
      },
      trigger: { seconds: 5 },
    });
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#0a295c" style="light" />
      {/* Add data in redux state  */}
      {/* <TouchableOpacity
        style={[
          styles.captureBtn,
          { flexDirection: "row", alignItems: "center" },
        ]}
        onPress={() =>
          dispatch(setBillScanned({ amount: 140, dueDate: "2025-03-14" }))
        }
      >
        <Text style={[styles.btnText, { marginLeft: 10 }]}>Add</Text>
      </TouchableOpacity> */}

      {/* Scan a new bill btn  */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "90%",
          justifyContent: "space-evenly",
          backgroundColor: "#dce8fc",
          borderRadius: 20,
          marginTop: 5,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>
          Scan a new Document
        </Text>
        <TouchableOpacity
          style={[
            styles.captureBtn,
            { flexDirection: "row", alignItems: "center" },
          ]}
          onPress={() => navigation.navigate("DocumentScanner")}
        >
          <FontAwesome name="camera" style={styles.btnText} />
          <Text style={[styles.btnText, { marginLeft: 10 }]}>Scan</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeading}>Payments Due:</Text>
      <ScrollView style={styles.list}>
        {/* Scanned bills list  */}
        {billScanned.map((bill, i) => (
          <TouchableOpacity style={styles.billRowStyle}>
            <View style={{ marginHorizontal: 15, marginVertical: 10 }}>
              <View style={[styles.titleRow]}>
                <Text style={{ fontStyle: "italic", fontSize: 14 }}>
                  Amount: {bill.amount}
                </Text>
                <Text
                  style={[
                    styles.dateTxt,
                    {
                      color: "red",
                      marginVertical: 0,
                      fontWeight: "bold",
                    },
                  ]}
                >
                  Due date: {bill.dueDate}
                </Text>
              </View>

              <View style={[styles.titleRow, { marginTop: 5 }]}>
                <TouchableOpacity
                  style={[
                    styles.captureBtn,
                    { marginVertical: 0, backgroundColor: "red" },
                  ]}
                  onPress={() => dispatch(removeBillScanned(i))}
                >
                  <Text style={styles.btnText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.captureBtn, { marginVertical: 0 }]}
                  onPress={() => navigation.navigate("RequestDelay")}
                >
                  <Text style={styles.btnText}>Request a delay</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a295c",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: "15%",
    width: "100%",
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
  list: {
    marginBottom: "5%",
    width: "95%",
  },
  subHeading: {
    alignSelf: "flex-start",
    marginLeft: 20,
    fontSize: 18,
    fontStyle: "italic",
    color: "white",
    marginVertical: 10,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
  },
  dateTxt: {
    color: "gray",
    marginLeft: 10,
    marginBottom: 10,
    fontSize: 14,
  },
  billRowStyle: {
    paddingVertical: 20,
    marginBottom: 5,
    backgroundColor: "#dce8fc",
    borderRadius: 10,
  },
});

export default HomeScreen;
