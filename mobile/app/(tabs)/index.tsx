import { Link } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 justify-center items-center border border-blue-500"
    >
      <Link href="/login">Login</Link>
      <Text className="text-blue-300 font-bold">yo</Text>

    </View>
  );
}
