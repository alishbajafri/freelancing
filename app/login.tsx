// Login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff } from "lucide-react-native";
import { useAuth } from "@/contexts/AuthContext";

import LoginBG from "../assets/images/loginbg.png";
import GoogleIcon from "../assets/images/google.png";
import AppleIcon from "../assets/images/apple.png";
import FacebookIcon from "../assets/images/facebook.png";

const screenWidth = Dimensions.get("window").width;

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    if (!email || !password) {
      setErrorMessage("Please fill all fields.");
      return;
    }
    try {
      await login(email, password);
    } catch (err: any) {
      setErrorMessage(err.message || "Login failed");
    }
  };

  const handleSocialLogin = (provider: string) => {
    alert(`Login with ${provider} is not implemented yet`);
  };

  return (
    <ImageBackground
      source={LoginBG}
      style={styles.background}
      resizeMode="cover"
      blurRadius={1} // subtle blur for text readability
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Login to your account</Text>

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
              {showPassword ? <EyeOff size={22} color="#374151"/> : <Eye size={22} color="#374151"/>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/forgot-password")}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.orText}>OR</Text>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Google")}
            >
              <Image source={GoogleIcon} style={styles.socialIcon} />
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Apple")}
            >
              <Image source={AppleIcon} style={styles.socialIcon} />
              <Text style={styles.socialText}>Apple</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.socialButton}
              onPress={() => handleSocialLogin("Facebook")}
            >
              <Image source={FacebookIcon} style={styles.socialIcon} />
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={styles.signUpLink}>
              Don't have an account?{" "}
              <Text style={{ fontWeight: "bold" }}>Sign up</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.demoText}>
            Freelancer → freelancer@test.com / 123456{"\n"}
            Client → client@test.com / 123456
          </Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  card: {
    width: "90%",
    maxWidth: 450,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 16,
    padding: 25,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    elevation: 10,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#1F2937", textAlign: "center" },
  subtitle: { fontSize: 16, color: "#6B7280", marginBottom: 20, textAlign: "center" },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    backgroundColor: "#F9FAFB",
  },
  passwordWrapper: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#F9FAFB",
  },
  passwordInput: { flex: 1, paddingVertical: 12 },
  eyeButton: { padding: 5 },
  forgotButton: { alignSelf: "flex-end", marginBottom: 15 },
  forgotText: { color: "#3B82F6" },
  loginButton: {
    backgroundColor: "#3B82F6",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },
  loginText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  orText: { textAlign: "center", marginVertical: 10, color: "#6B7280" },
  socialRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15 },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 10,
    marginHorizontal: 3,
    justifyContent: "center",
    backgroundColor: "#F9FAFB",
  },
  socialIcon: { width: 20, height: 20, marginRight: 6, resizeMode: "contain" },
  socialText: { fontSize: 14, fontWeight: "bold", color: "#374151" },
  signUpLink: { textAlign: "center", color: "#6B7280", marginBottom: 10 },
  demoText: { marginTop: 10, fontSize: 12, color: "#9CA3AF", textAlign: "center" },
  errorText: { color: "#EF4444", fontSize: 14, marginBottom: 15, textAlign: "center" },
});
