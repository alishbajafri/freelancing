import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from "react-native";
import { ArrowLeft, Mail, Eye, EyeOff } from "lucide-react-native";
import { useRouter } from "expo-router";

type Step = "email" | "pin" | "password";

export default function ForgotPassword() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  // OTP
  const [pin, setPin] = useState(["", "", "", ""]);
  const inputs = useRef<Array<TextInput | null>>([]);
  const [timer, setTimer] = useState(60);

  // Password
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Animation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [step]);

  // OTP timer
  useEffect(() => {
    if (step !== "pin" || timer === 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [step, timer]);

  const handlePinChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
    if (value && index < 3) inputs.current[index + 1]?.focus();
  };

  const isPinComplete = pin.every((d) => d !== "");

  const handleBack = () => {
    if (step === "pin") setStep("email");
    else if (step === "password") setStep("pin");
    else router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* EMAIL STEP */}
        {step === "email" && (
          <>
            <Text style={styles.title}>Forgot Password?</Text>
            <Text style={styles.subtitle}>
              Enter your email to receive a verification code.
            </Text>

            <View style={styles.inputWrapper}>
              <Mail size={20} color="#6B7280" />
              <TextInput
                placeholder="Email address"
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, !email && styles.disabled]}
              disabled={!email}
              onPress={() => {
                setPin(["", "", "", ""]);
                setTimer(60);
                setStep("pin");
              }}
            >
              <Text style={styles.primaryText}>Send Reset Code</Text>
            </TouchableOpacity>
          </>
        )}

        {/* PIN STEP */}
        {step === "pin" && (
          <>
            <Text style={styles.title}>Enter Code</Text>
            <Text style={styles.subtitle}>
              We sent a 4-digit code to your email
            </Text>

            <View style={styles.pinRow}>
              {pin.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  style={[
                    styles.pinBox,
                    digit && styles.pinFilled,
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(v) => handlePinChange(v, index)}
                  autoFocus={index === 0}
                />
              ))}
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                !isPinComplete && styles.disabled,
              ]}
              disabled={!isPinComplete}
              onPress={() => setStep("password")}
            >
              <Text style={styles.primaryText}>Verify Code</Text>
            </TouchableOpacity>

            {timer > 0 ? (
              <Text style={styles.timerText}>Resend in {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(60)}>
                <Text style={styles.resendText}>Resend Code</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {/* PASSWORD STEP */}
        {step === "password" && (
          <>
            <Text style={styles.title}>Create New Password</Text>
            <Text style={styles.subtitle}>
              Your new password must be different from previous ones.
            </Text>

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="New password"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </TouchableOpacity>
            </View>

            <View style={styles.passwordWrapper}>
              <TextInput
                placeholder="Confirm password"
                secureTextEntry={!showPassword}
                style={styles.passwordInput}
                value={confirm}
                onChangeText={setConfirm}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!password || password !== confirm) && styles.disabled,
              ]}
              disabled={!password || password !== confirm}
              onPress={() => {
                alert("Password reset successfully (UI only)");
                router.replace("/login");
              }}
            >
              <Text style={styles.primaryText}>Reset Password</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.backToLogin}
          onPress={() => router.replace("/login")}
        >
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { paddingTop: 60, paddingHorizontal: 20 },
  content: { flex: 1, paddingHorizontal: 24, justifyContent: "center" },

  title: { fontSize: 28, fontWeight: "700", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#6B7280", marginBottom: 30 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 24,
    backgroundColor: "#F9FAFB",
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },

  pinRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 30 },
  pinBox: {
    width: 60,
    height: 60,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#D1D5DB",
    textAlign: "center",
    fontSize: 22,
    backgroundColor: "#F9FAFB",
  },
  pinFilled: { borderColor: "#2563EB", backgroundColor: "#EFF6FF" },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 54,
    marginBottom: 20,
    backgroundColor: "#F9FAFB",
  },
  passwordInput: { flex: 1, fontSize: 16 },

  primaryButton: {
    height: 54,
    borderRadius: 16,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#2563EB",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 12,
    elevation: 6,
  },
  primaryText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
  disabled: { opacity: 0.5 },

  timerText: { textAlign: "center", marginTop: 16, color: "#6B7280" },
  resendText: { textAlign: "center", marginTop: 16, color: "#2563EB" },

  backToLogin: { marginTop: 30, alignItems: "center" },
  backText: { color: "#2563EB", fontWeight: "500" },
});
