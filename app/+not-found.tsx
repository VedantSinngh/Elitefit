import { View, Text } from "react-native";
import tw from "tailwind-react-native-classnames";

export default function NotFound() {
  return (
    <View style={tw`flex-1 justify-center items-center`}>
      <Text style={tw`text-xl`}>Page Not Found</Text>
    </View>
  );
}