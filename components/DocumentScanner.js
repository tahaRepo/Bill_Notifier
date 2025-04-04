import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { setBillScanned } from "../Slice/BillSlice";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const OPENAI_API_KEY =
  "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";

const DocumentScanner = () => {
  const [hasPermission, requestPermission] = useCameraPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [billAmount, setBillAmount] = useState("");
  const [dueDate, setDueDate] = useState("");

  const dispatch = useDispatch();
  const navigation = useNavigation();

  const cameraRef = useRef(null);

  React.useEffect(() => {
    if (!hasPermission?.granted) {
      requestPermission();
    }
  }, [hasPermission]);

  const takePicture = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      setImageUri(photo.uri);
      extractTextFromImage(photo.base64);
    }
  };

  const extractTextFromImage = async (base64Image) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4-turbo",
          messages: [
            {
              role: "system",
              content:
                'Extract the bill amount and due date from this image and return them in JSON format as {"bill_amount": "XX.XX", "due_date": "YYYY-MM-DD"}.',
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Here is a bill. Extract the bill amount and due date.",
                },
                {
                  type: "image_url",
                  image_url: { url: `data:image/jpeg;base64,${base64Image}` },
                }, // ✅ Correct format
              ],
            },
          ],
          max_tokens: 300,
        },
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const textResponse = response.data.choices[0].message.content;
      console.log("Response: ", textResponse);
      setExtractedData(textResponse);

      const amountMatch = textResponse.match(
        /(\$|€|£)?\s?(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?/
      );
      const extractedAmount = amountMatch ? amountMatch[0] : "Not Found";

      const dateMatch = textResponse.match(
        /\b(\d{1,2}[-/]\d{1,2}[-/]\d{2,4}|\d{4}-\d{2}-\d{2})\b/
      );
      const extractedDate = dateMatch ? dateMatch[0] : "Not Found";

      setBillAmount(extractedData?.bill_amount);
      setDueDate(extractedData?.due_date);

      console.log(extractedAmount, extractedDate);
      dispatch(
        setBillScanned({ amount: extractedAmount, dueDate: extractedDate })
      );
      navigation.goBack();
    } catch (error) {
      console.error("Text extraction failed", error);
      Alert.alert("Error", "Failed to extract text from image.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0a295c",
      }}
    >
      {!imageUri ? (
        <>
          {hasPermission ? (
            <CameraView
              ref={cameraRef}
              style={{ width: "100%", height: 500 }}
            />
          ) : (
            <TouchableOpacity onPress={requestPermission}>
              <Text>Grant Camera Permission</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={takePicture}
            style={{ padding: 10, backgroundColor: "blue", marginTop: 20 }}
          >
            <Text style={{ color: "white" }}>Capture Document</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Image
            source={{ uri: imageUri }}
            style={{ width: 300, height: 300, marginBottom: 20 }}
          />
          {loading ? <ActivityIndicator size="large" color="blue" /> : null}
          <TouchableOpacity
            onPress={() => setImageUri(null)}
            style={{ padding: 10, backgroundColor: "red", marginTop: 20 }}
          >
            <Text style={{ color: "white" }}>Retake Photo</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default DocumentScanner;
