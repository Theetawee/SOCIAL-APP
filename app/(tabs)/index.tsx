import { View, Text, Image, ScrollView, FlatList } from "react-native";
import tweets from "../../assets/data/tweets";
import Tweet from "@/components/Tweet";
import { useQuery } from "@tanstack/react-query";
import Endpoints from "@/hooks/Endpoints";


export default function TabOneScreen() {

  const { getPosts } = Endpoints();

  const { data, isPending, isError,error } = useQuery({
    queryKey: ['posts'],
    queryFn: getPosts
  })

  if (isPending) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    )
  } else if (isError) {

    return (
      <View>
        <Text>Error</Text>
      </View>
    )
  } else {

console.log(data)
    return (
      <FlatList data={data} renderItem={Tweet} />
    );
  }
}
