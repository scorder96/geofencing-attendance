import pb from "@/pocketbase";
import { router } from "expo-router";
import { View, Text, StyleSheet, Image, Button, Pressable } from "react-native";

export default function Tab() {
  async function logOut() {
    pb.authStore.clear();
    router.replace("../../");
  }
  const pfp =
    "https://nature-explore.pockethost.io/api/files/users/" +
    pb.authStore.model!.id +
    "/" +
    pb.authStore.model!.avatar;
  console.log(pfp);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={{ uri: pfp }} style={styles.pfp}></Image>
        <View style={{ height: 100, marginLeft: 12 }}>
          <Text style={{ fontSize: 24 }}>{pb.authStore.model?.name}</Text>
          <Text style={{ fontSize: 24 }}>{pb.authStore.model?.username}</Text>
        </View>
      </View>
      <Pressable
        style={{
          backgroundColor: "dodgerblue",
          display: "flex",
          justifyContent: "center",
          height: 50,
        }}
        onPress={logOut}
      >
        <Text style={{ textAlign: "center", color: "white", fontWeight: "bold" }}>
          LOG OUT
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pfp: {
    height: 100,
    width: 100,
  },
});
