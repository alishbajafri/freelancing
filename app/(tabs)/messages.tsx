import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";
import { conversationAPI } from "../../services/apiService";
import { useRouter } from "expo-router"; // ✅ use Expo Router

interface Conversation {
  _id: string;
  client?: { id: string; name: string; avatar: string };
  lastMessage: string;
  updatedAt: string;
}

const MessagesScreen = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const userId = "userId1";
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await conversationAPI.getConversations(userId);
        setConversations(data);
      } catch (err) {
        console.log("Failed to fetch conversations");
      }
    };
    fetchConversations();
  }, []);

  const handlePress = (conv: Conversation) => {
    router.push({
      pathname: "/ChatScreen",
      params: {
        conversationId: conv._id,
        userId,
        receiverId: conv.client?.id,
        client: JSON.stringify(conv.client), // stringify object
      },
    });
  };

  const renderItem = ({ item }: { item: Conversation }) => {
    const other = item.client || { name: "Unknown", avatar: "" };
    return (
      <TouchableOpacity style={styles.item} onPress={() => handlePress(item)}>
        {other.avatar ? (
          <Image source={{ uri: other.avatar }} style={styles.avatar} />
        ) : (
          <View style={styles.placeholderAvatar}>
            <Text style={styles.placeholderText}>{other.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{other.name}</Text>
          <Text style={styles.message} numberOfLines={1}>{item.lastMessage}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={conversations}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f7", padding: 12 },
  item: { flexDirection: "row", padding: 14, marginVertical: 6, backgroundColor: "#fff", borderRadius: 12, alignItems: "center" },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  placeholderAvatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: "#ccc", justifyContent: "center", alignItems: "center" },
  placeholderText: { color: "#fff", fontWeight: "bold", fontSize: 18 },
  textContainer: { flex: 1 },
  name: { fontWeight: "600", fontSize: 16 },
  message: { color: "#555", marginTop: 2, fontSize: 14 },
});

export default MessagesScreen;
