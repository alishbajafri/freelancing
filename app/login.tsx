import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { storageSet } from "@/utils/storage";

/* =======================
   STATIC USERS
======================= */
const STATIC_USERS = [
  {
    id: "1",
    name: "John Freelancer",
    email: "freelancer@test.com",
    password: "123456",
    role: "freelancer",
    rating: 4.6,
    skills: ["react native", "node.js"],
  },
  {
    id: "2",
    name: "Client User",
    email: "client@test.com",
    password: "123456",
    role: "client",
  },
];

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill all fields.");
      return;
    }

    // 🔍 Find user in static data
    const user = STATIC_USERS.find(
      u =>
        u.email.toLowerCase() === email.toLowerCase() &&
        u.password === password
    );

    if (!user) {
      setErrorMessage("Invalid email or password.");
      return;
    }

    // 💾 Save user locally (acts like auth)
    await storageSet("user", JSON.stringify(user));

    // 🚀 Redirect based on role
    if (user.role === "freelancer") {
      router.replace("/");
    } else if (user.role === "client") {
      router.replace("/client");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <View style={styles.passwordWrapper}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.eyeButton}
        >
          {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>

      {/* Demo credentials */}
      <Text style={styles.demoText}>
        Freelancer → freelancer@test.com / 123456{"\n"}
        Client → client@test.com / 123456
      </Text>
    </View>
  );
}

/* =======================
   STYLES
======================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#FFFFFF",
  },
  passwordWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#FFFFFF",
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
  },
  eyeButton: {
    padding: 5,
  },
  button: {
    backgroundColor: "#3B82F6",
    padding: 15,
    width: "100%",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    color: "#3B82F6",
  },
  demoText: {
    marginTop: 25,
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
});
