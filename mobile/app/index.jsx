import { StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image"
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text>Hello Expo</Text>
      <Link href="/(auth)/signup">Sign Up</Link>
      <Link href="/(auth)">Login</Link> 
      <Image />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  }
})