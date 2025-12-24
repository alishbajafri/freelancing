import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config";

const Signup = () => {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("freelancer");

  const [skills, setSkills] = useState(""); // comma separated
  const [bio, setBio] = useState("");
  const [pricing, setPricing] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [avatar, setAvatar] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleSignup = async () => {
    setErrorMessage("");

    if (!name || !email || !password) {
      setErrorMessage("Please fill name, email and password.");
      return;
    }

    try {
      const userData = {
        name,
        title: title || "Software Developer",
        email,
        password,
        role,

        // Convert skills "React, Node, MongoDB" → ["React", "Node", "MongoDB"]
        skills: skills
          ? skills.split(",").map((s) => s.trim())
          : ["React Native", "UI/UX", "Node.js"],

        bio:
          bio ||
          "Creative and detail-oriented developer with 3+ years of experience building scalable applications.",
        pricing: pricing || "$25/hr",

        avatar:
          avatar ||
          "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg",

        phone: phone || "+92 333 1234567",
        location: location || "Lahore, Pakistan",

        balance: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        userData
      );

      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error: any) {
      console.log("Signup error:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.message || "Server error");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Create Account</Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Title (Optional)"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={styles.label}>Skills (comma separated)</Text>
      <TextInput
        style={styles.input}
        placeholder="React, Node, UI/UX..."
        value={skills}
        onChangeText={setSkills}
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Bio"
        multiline
        value={bio}
        onChangeText={setBio}
      />

      <TextInput
        style={styles.input}
        placeholder="Pricing ($/hr)"
        value={pricing}
        onChangeText={setPricing}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        style={styles.input}
        placeholder="Location"
        value={location}
        onChangeText={setLocation}
      />

      <TextInput
        style={styles.input}
        placeholder="Avatar URL (optional)"
        value={avatar}
        onChangeText={setAvatar}
      />

      <Text style={styles.label}>Role</Text>
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleButton, role === "freelancer" && styles.roleSelected]}
          onPress={() => setRole("freelancer")}
        >
          <Text>Freelancer</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.roleButton, role === "client" && styles.roleSelected]}
          onPress={() => setRole("client")}
        >
          <Text>Client</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/login")}>
        <Text style={styles.link}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 15,
    fontSize: 14,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  label: {
    alignSelf: "flex-start",
    marginBottom: 5,
    fontWeight: "500",
  },
  roleContainer: {
    flexDirection: "row",
    marginBottom: 15,
  },
  roleButton: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    marginHorizontal: 5,
    borderRadius: 8,
  },
  roleSelected: {
    backgroundColor: "#d0ebff",
    borderColor: "#007bff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#007bff",
    textAlign: "center",
  },
});

export default Signup;
