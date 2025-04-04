import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NativeBaseProvider, Modal } from "native-base";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "./components/Home";
import RequestDelay from "./components/RequestDelay";
import DocumentScanner from "./components/DocumentScanner";
import { Provider } from "react-redux";
import { MyStore } from "./MyStore";

export default function App() {
  const Stack = createStackNavigator();
  return (
    <Provider store={MyStore}>
      <NativeBaseProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen
              name="RequestDelay"
              component={RequestDelay}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: "#71a3f5",
                },
                headerTitleStyle: {
                  color: "black",
                },
                headerBackTitleVisible: false,
                headerTintColor: "black",
              }}
            />
            <Stack.Screen
              name="DocumentScanner"
              component={DocumentScanner}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: "#71a3f5",
                },
                headerTitleStyle: {
                  color: "black",
                },
                headerBackTitleVisible: false,
                headerTintColor: "black",
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </NativeBaseProvider>
    </Provider>
  );
}
