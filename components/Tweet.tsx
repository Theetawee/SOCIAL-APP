import { PostType } from "@/hooks/types";
import { View,Image,Text } from "react-native"
import DefaultAvater from "../assets/images/checkmark.png";

const Tweet = ({ item }: { item: PostType }) => {
  return (
      <View className="border-b border-gray-300 ">
          <View className="p-4">
              <View className="flex flex-row mb-3 items-center gap-x-1">
                  <View>
                      <Image
                          src={
                              "https://i.ibb.co/3B51hrg/twitter-avi-gender-balanced-figure.png"
                          }
                          className="w-10 h-10 rounded-full"
                      />
                  </View>
                  <View className="flex">
                      <Text className="text-lg font-bold">
                          {item.account.name}
                      </Text>
                      <Text className="text-sm">@{item.account.username}</Text>
                  </View>
              </View>
              <View className="grid grid-cols-1 gap-y-3 ml-14">
                  <Text>{item.content}</Text>

                  <View />
              </View>
          </View>
      </View>
  );
}

export default Tweet
