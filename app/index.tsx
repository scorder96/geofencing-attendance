import { useThemeColor } from "@/hooks/useThemeColor";
import pb from "@/pocketbase";
import { FontAwesome } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const vit = require("../assets/images/vit.png");

export default function Index() {
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [Loading, setLoading] = useState(false);
  const [Error, setError] = useState("");
  const theme = useColorScheme();

  async function signIn() {
    setError("");
    setLoading(true);
    await pb
      .collection("users")
      .authWithPassword(Email, Password)
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
    pb.authStore.isValid && router.replace("/inside");
  }
  return (
    <SafeAreaView style={styles.container}>
      <Image source={vit} style={styles.logo}></Image>
      <View style={styles.innercontainer}>
        <Text style={{ fontSize: 24 }}>Sign in to VIT</Text>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={Email}
          placeholder="Email"
          autoComplete="email"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={Password}
          placeholder="Password"
          autoComplete="password"
          secureTextEntry
        />
        <Pressable
          style={{
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 12,
            paddingHorizontal: 32,
            borderRadius: 4,
            elevation: 3,
            backgroundColor: "black",
            width: 350,
            marginTop: 8,
          }}
          onPress={signIn}
        >
          {Loading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text
              style={{
                fontSize: 16,
                lineHeight: 21,
                fontWeight: "bold",
                letterSpacing: 0.25,
                color: "white",
              }}
            >
              Continue
            </Text>
          )}
        </Pressable>
        <Text style={styles.errormessage}>{Error}</Text>
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  logo: {
    height: 150,
    width: 400,
    position: "absolute",
    top: 50,
  },
  innercontainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    width: 350,
    height: 50,
    margin: 8,
    padding: 8,
    borderRadius: 4,
    backgroundColor: "white",
  },
  errormessage: {
    marginTop: 16,
    fontSize: 18,
  },
});
