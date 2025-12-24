import React, { useEffect, useState, useRef } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import io from "socket.io-client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_BASE_URL } from "../config";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const socket = io(API_BASE_URL);

const ChatScreen = () => {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const params = useLocalSearchParams();
  if (!params) return <Text>No conversation selected</Text>;

  const conversationId = params.conversationId as string;
  const userId = params.userId as string;
  const receiverId = params.receiverId as string;
  const client = params.client ? JSON.parse(params.client as string) : null;

  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("addUser", userId);

    const handleGetMessage = (msg) => {
      if (msg.conversationId === conversationId) {
        setMessages((prev = []) => {
          if (!prev.some((m) => m._id === msg._id)) return [...prev, msg];
          return prev;
        });
      }
    };

    socket.on("getMessage", handleGetMessage);

    fetch(`${API_BASE_URL}/messages/${conversationId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.data)) setMessages(data.data);
        else setMessages([]);
      })
      .catch((err) => {
        console.log("Failed to fetch previous messages", err);
        setMessages([]);
      });

    return () => {
      socket.off("getMessage", handleGetMessage);
    };
  }, [conversationId, userId]);

  const sendMessage = () => {
    if (!text) return;

    const msgData = {
      conversationId,
      senderId: userId,
      receiverId,
      message: text,
      createdAt: new Date(),
    };

    fetch(`${API_BASE_URL}/messages/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    })
      .then((res) => res.json())
      .then((savedMsg) => {
        const newMsg = savedMsg.data;
        setMessages((prev = []) => [...prev, newMsg]);
        socket.emit("sendMessage", newMsg);
        setText("");
        flatListRef.current?.scrollToEnd({ animated: true });
      })
      .catch((err) => console.log("Failed to send message", err));
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.msgContainer,
        item.senderId === userId ? styles.myMsg : styles.theirMsg,
      ]}
    >
      <Text style={styles.msgText}>{item.message}</Text>
      <Text style={styles.time}>
        {new Date(item.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </Text>
    </View>
  );

  return (
    <LinearGradient
      colors={["#f0f4f7", "#d9e2ec"]}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Feather name="arrow-left" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{client?.name || "Chat"}</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ paddingVertical: 8 }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Type a message"
            style={styles.input}
          />
          <Button title="Send" onPress={sendMessage} />
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
    color: "#333",
  },
  msgContainer: {
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
    maxWidth: "75%",
  },
  myMsg: { backgroundColor: "#DCF8C6", alignSelf: "flex-end" },
  theirMsg: { backgroundColor: "#fff", alignSelf: "flex-start" },
  msgText: { fontSize: 15, color: "#111" },
  time: { fontSize: 10, color: "#555", marginTop: 2, textAlign: "right" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    padding: 8,
    borderRadius: 20,
    marginRight: 8,
    borderColor: "#ccc",
  },
});

export default ChatScreen;
