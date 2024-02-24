import Tweet from "@/components/Tweet";
import Endpoints from "@/hooks/Endpoints";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { ActivityIndicator, Button, FlatList, Text, View } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { PostType } from "@/hooks/types";



const index = () => {
    const {GetAllPosts } = Endpoints();

    const { data, fetchNextPage, hasNextPage, isPending, isError } =
        useInfiniteQuery({
            queryKey: ["posts"],
            networkMode: "offlineFirst",
            queryFn: (pageNum) => GetAllPosts(pageNum.pageParam || 1),
            initialPageParam: 1,
            getNextPageParam: (lastPage) => lastPage.next,
        });

        const posts = data?.pages.flatMap((page) => page.results);


    if (isPending) {
        return (
            <View className="flex items-center">
                <ActivityIndicator />
            </View>
        )
    } else if (isError) {
        return (
            <View><Text>Something went wrong</Text></View>
        )
    } else {

console.log(data)
        return (
            <FlashList
                data={posts}
                renderItem={({
                    item,
                    index,
                }: {
                    item: PostType;
                    index: number;
                }) => <Tweet index={index} item={item} key={item.id} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={1}
                estimatedItemSize={190 * 15}
                refreshing={isPending}
                onRefresh={GetAllPosts}
                onEndReached={GetAllPosts}
                onEndReachedThreshold={0.1}
                contentContainerStyle={{paddingVertical: 20}}
            />
        );
    }
};

export default index;
