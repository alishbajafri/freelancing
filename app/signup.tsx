// Signup.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/contexts/AuthContext";

const { width, height } = Dimensions.get("window");

export default function Signup() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<"freelancer" | "client">("freelancer");

  // Common fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  // Freelancer-specific
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [experience, setExperience] = useState<"Beginner" | "Intermediate" | "Expert">("Beginner");
  const [hourlyRate, setHourlyRate] = useState("");
  const [portfolio, setPortfolio] = useState<string[]>([]);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");

  // Client-specific
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // Image picker
  const pickImage = async (setImage: React.Dispatch<React.SetStateAction<string | null>>) => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) return;
    setImage(result.assets[0].uri);
  };

  const handleAddPortfolio = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access gallery is required!");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPortfolio([...portfolio, result.assets[0].uri]);
    }
  };

  const handleSignup = async () => {
    setErrorMessage("");
    if (!fullName || !email || !password) {
      setErrorMessage("Please fill all required fields");
      return;
    }

    const newUser = {
      id: Date.now().toString(),
      name: fullName,
      email,
      role,
      ...(role === "freelancer" && {
        title,
        bio,
        skills: skills.split(",").map(s => s.trim()),
        languages: languages.split(",").map(l => l.trim()),
        experience,
        hourlyRate,
        portfolio,
        avatar,
        github,
        linkedin,
        phone,
        location,
      }),
      ...(role === "client" && {
        companyName: companyName || null,
        jobTitle: jobTitle || null,
        companyDesc,
        phone,
        location,
      }),
    };

    console.log("Signed up user:", newUser);

    try {
      await login(email, password);
      router.replace(role === "freelancer" ? "/" : "/client");
    } catch (err: any) {
      setErrorMessage(err.message || "Signup failed");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/signupbg.png")}
      style={styles.background}
      resizeMode="cover"
      blurRadius={1} // Slight blur for modern effect
    >
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>Sign Up</Text>

          {/* Role Toggle */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              style={[styles.roleButton, role === "freelancer" && styles.roleSelected]}
              onPress={() => setRole("freelancer")}
            >
              <Text style={role === "freelancer" ? styles.roleTextSelected : styles.roleText}>
                Freelancer
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.roleButton, role === "client" && styles.roleSelected]}
              onPress={() => setRole("client")}
            >
              <Text style={role === "client" ? styles.roleTextSelected : styles.roleText}>Client</Text>
            </TouchableOpacity>
          </View>

          {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

          {/* Common Fields */}
          <TextInput style={styles.input} placeholder="Full Name" value={fullName} onChangeText={setFullName} />
          <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} />
          <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
          <TextInput style={styles.input} placeholder="Phone" value={phone} onChangeText={setPhone} />
          <TextInput style={styles.input} placeholder="Location" value={location} onChangeText={setLocation} />

          {/* Freelancer Fields */}
          {role === "freelancer" && (
            <>
              <TextInput style={styles.input} placeholder="Professional Title" value={title} onChangeText={setTitle} />
              <TextInput style={[styles.input, { height: 80 }]} placeholder="Bio / About Me" multiline value={bio} onChangeText={setBio} />
              <TextInput style={styles.input} placeholder="Skills (comma separated)" value={skills} onChangeText={setSkills} />
              <TextInput style={styles.input} placeholder="Languages (comma separated)" value={languages} onChangeText={setLanguages} />

              <View style={styles.row}>
                <Text style={{ marginRight: 10 }}>Experience Level:</Text>
                {["Beginner", "Intermediate", "Expert"].map(level => (
                  <TouchableOpacity
                    key={level}
                    style={[styles.experienceButton, experience === level && styles.experienceSelected]}
                    onPress={() => setExperience(level as any)}
                  >
                    <Text style={experience === level ? styles.experienceTextSelected : styles.experienceText}>{level}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput style={styles.input} placeholder="Hourly Rate" value={hourlyRate} onChangeText={setHourlyRate} />
              <TextInput style={styles.input} placeholder="GitHub URL" value={github} onChangeText={setGithub} />
              <TextInput style={styles.input} placeholder="LinkedIn URL" value={linkedin} onChangeText={setLinkedin} />

              <TouchableOpacity style={styles.uploadButton} onPress={() => pickImage(setAvatar)}>
                <Text style={styles.uploadText}>{avatar ? "Change Profile Picture" : "Upload Profile Picture"}</Text>
              </TouchableOpacity>
              {avatar && <Image source={{ uri: avatar }} style={styles.avatar} />}

              <TouchableOpacity style={styles.uploadButton} onPress={handleAddPortfolio}>
                <Text style={styles.uploadText}>Add Portfolio Item</Text>
              </TouchableOpacity>
              <ScrollView horizontal style={{ marginVertical: 10 }}>
                {portfolio.map((uri, idx) => (
                  <Image key={idx} source={{ uri }} style={styles.portfolioImage} />
                ))}
              </ScrollView>
            </>
          )}

          {/* Client Fields */}
          {role === "client" && (
            <>
              <TextInput style={styles.input} placeholder="Company Name (optional)" value={companyName} onChangeText={setCompanyName} />
              <TextInput style={styles.input} placeholder="Job Title / Role (optional)" value={jobTitle} onChangeText={setJobTitle} />
              <TextInput style={[styles.input, { height: 80 }]} placeholder="Company Description" multiline value={companyDesc} onChangeText={setCompanyDesc} />
            </>
          )}

          <TouchableOpacity style={styles.button} onPress={handleSignup}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/login")}>
            <Text style={styles.link}>Already have an account? Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width: "100%", height: "100%" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", alignItems: "center", paddingVertical: 40 },
  card: {
    width: width * 0.85,
    maxWidth: 450,
    backgroundColor: "rgba(255,255,255,0.95)",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 10,
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center", color: "#1F2937" },
  roleToggle: { flexDirection: "row", marginBottom: 20, justifyContent: "center" },
  roleButton: { padding: 10, borderWidth: 1, borderColor: "#3B82F6", borderRadius: 8, marginHorizontal: 5 },
  roleSelected: { backgroundColor: "#3B82F6" },
  roleText: { color: "#3B82F6", fontWeight: "bold" },
  roleTextSelected: { color: "#fff", fontWeight: "bold" },
  input: { backgroundColor: "#fff", padding: 12, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: "#D1D5DB" },
  button: { backgroundColor: "#3B82F6", padding: 15, borderRadius: 12, alignItems: "center", marginVertical: 10 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  link: { color: "#3B82F6", textAlign: "center", marginTop: 10 },
  errorText: { color: "#EF4444", textAlign: "center", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 15, flexWrap: "wrap" },
  experienceButton: { padding: 8, borderWidth: 1, borderColor: "#3B82F6", borderRadius: 6, marginRight: 8, marginBottom: 5 },
  experienceSelected: { backgroundColor: "#3B82F6" },
  experienceText: { color: "#3B82F6" },
  experienceTextSelected: { color: "#fff" },
  uploadButton: { backgroundColor: "#E0E7FF", padding: 12, borderRadius: 8, alignItems: "center", marginVertical: 5 },
  uploadText: { color: "#3B82F6", fontWeight: "bold" },
  avatar: { width: 80, height: 80, borderRadius: 40, marginTop: 10, alignSelf: "center" },
  portfolioImage: { width: 80, height: 80, borderRadius: 8, marginRight: 10 },
});
