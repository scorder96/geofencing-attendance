import { View, Text, StyleSheet, Button, Alert, ActivityIndicator } from "react-native";
import * as Location from "expo-location";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Haptics from "expo-haptics";
// import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import pb from "@/pocketbase";
import { WebView } from "react-native-webview";
import MapView, { Marker, Polygon } from "react-native-maps";

export default function Tab() {
  useEffect(() => {
    getAttendance();
  }, []);
  const [Denied, setDenied] = useState(false);
  const [location, setLocation] = useState(Object);
  const [permission, requestPermission] = useCameraPermissions();
  const [Marked, setMarked] = useState(false);
  const [TimeHour, setTimeHour] = useState(Number);
  const [TimeMinute, setTimeMinute] = useState(Number);
  const [TimeDate, setTimeDate] = useState(Number);
  const [TimeMonth, setTimeMonth] = useState(Number);
  const [CameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [Loading, setLoading] = useState(false);
  const [Photo, setPhoto] = useState(String);

  async function getAttendance() {
    var today = new Date();
    today.setHours(today.getHours() - 5);
    today.setMinutes(today.getMinutes() - 30);
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var formatteddate = yyyy + "-" + mm + "-" + dd;

    const record = await pb
      .collection("attendance")
      .getFirstListItem("user='" + pb.authStore.model!.id + "'", {
        filter: "created >= '" + formatteddate + " 00:00:00'",
      })
      .catch((err) => {});

    if (record) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setLoading(false);
      let getdate = new Date(record.created);
      setTimeHour(getdate.getHours());
      setTimeMinute(getdate.getMinutes());
      setTimeDate(getdate.getDate());
      setTimeMonth(getdate.getMonth());
      setMarked(true);
    } else {
      setMarked(false);
      requestLocation();
    }
  }

  async function requestLocation() {
    const locpermission = await Location.requestForegroundPermissionsAsync(); //Request location permission
    //Location permission granted? False
    if (locpermission.granted == false) {
      //Can ask again? Request again.
      if (locpermission.canAskAgain) {
        requestLocation();
      } else {
        Alert.alert(
          "Permission Denied",
          "Location permission denied. Go to settings and allow precise location access to continue.",
          [
            {
              text: "Done",
              onPress: () => {
                requestLocation();
              },
            },
          ]
        );
      }
      //Location permission granted? True
    } else if (locpermission.android?.accuracy == "coarse") {
      //Location accuracy? Coarse. Request again.
      requestLocation();
    } else if (locpermission.android?.accuracy == "fine") {
      //Location accuracy? Fine. Get Location
      setDenied(false);
      let location = await Location.getCurrentPositionAsync({}); //Get Location
      setLocation(location);
      console.log(location);

      await requestPermission(); //Request Camera Permission

      //Camera permission granted? False
      if (permission?.granted == false) {
        //Can ask again? Request again.
        if (permission.canAskAgain == true) {
          await requestPermission();
        } else {
          Alert.alert(
            "Permission Denied",
            "Camera permission denied. Go to settings and allow camera access to continue.",
            [
              {
                text: "Done",
                onPress: () => {
                  requestPermission();
                },
              },
            ]
          );
        }
      }
    }
  }
  async function markAttendance() {
    setLoading(true);
    const photodata = await CameraRef?.takePictureAsync();

    const formData = new FormData();
    // formData.append("image", photodata?.uri);
    formData.append("user", pb.authStore.model!.id);

    const newAttendance = await pb
      .collection("attendance")
      .create(formData)
      .catch((err) => console.log(err));
    console.log(newAttendance);

    getAttendance();
  }
  const monthnames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return (
    <View style={styles.container}>
      {Marked ? (
        <View style={{ flex: 1, alignItems: "center" }}>
          <MapView
            style={{ height: "75%", width: "100%" }}
            region={{
              latitude: 12.8434121,
              longitude: 80.1535109,
              latitudeDelta: 0.002,
              longitudeDelta: 0.002,
            }}
            showsUserLocation={true}
            followsUserLocation={true}
            onPress={(e) => console.log(e.nativeEvent.coordinate)}
          >
            <Polygon
              coordinates={[
                { latitude: 12.843430690220163, longitude: 80.15276346355677 },
                { latitude: 12.840746272450106, longitude: 80.15274669975042 }, //ENTRY LEFT
                { latitude: 12.838865332347398, longitude: 80.15467721968889 }, //ENTRY RIGHT
                { latitude: 12.843244037160016, longitude: 80.15700571238995 }, // AB-2 TOP RIGHT
                { latitude: 12.844385201075076, longitude: 80.1533917710185 },
                // { latitude: 12.844385201075076, longitude: 80.1533917710185 },
              ]}
              fillColor="#0000ff20"
              strokeColor="#0000ff"
              strokeWidth={2}
            />
            {/* <Marker
              coordinate={{ latitude: 12.840746272450106, longitude: 80.15274669975042 }}
              title="You"
            /> */}
          </MapView>
          <View style={{ alignItems: "center" }}>
            <FontAwesome size={100} name="check" color={"green"} />
            <Text style={{ fontSize: 24 }}>Marked</Text>
            <Text style={{ fontSize: 18, marginTop: 12 }}>
              At {TimeHour}:{TimeMinute}, {TimeDate} {monthnames[TimeMonth]}
            </Text>
          </View>
        </View>
      ) : (
        <CameraView
          style={{ flex: 1, justifyContent: "flex-end" }}
          facing="front"
          ref={(ref) => setCameraRef(ref)}
        >
          <Button title="DONE" onPress={markAttendance} />
        </CameraView>
      )}
      {/* {Loading} */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  badge_check: { height: 100, width: 100 },
});
