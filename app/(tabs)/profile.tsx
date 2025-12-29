import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Settings,
  Edit,
  Star,
  Briefcase,
  DollarSign,
  CheckCircle2,
  MessageSquare,
} from "lucide-react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/contexts/AuthContext"; // 🔹 Use AuthContext

// Static user data
const userStatic = {
  name: "John Doe",
  title: "UI/UX Designer",
  email: "john.doe@example.com",
  role: "Freelancer",
  balance: 1200,
  rating: 4.8,
  completedProjects: 35,
  reviews: 28,
  bio: "Passionate designer with 5 years of experience creating beautiful user experiences.",
  avatar: "https://i.pravatar.cc/150?img=12",
  skills: ["UI Design", "UX Research", "Figma", "Prototyping"],
};

export default function ProfileScreen() {
  const router = useRouter();
  const { logout } = useAuth(); // 🔹 Use logout from AuthContext

  const stats = [
    { icon: <Star size={20} color="#F59E0B" />, label: "Rating", value: `${userStatic.rating}` },
    { icon: <CheckCircle2 size={20} color="#10B981" />, label: "Projects", value: userStatic.completedProjects },
    { icon: <MessageSquare size={20} color="#2563EB" />, label: "Reviews", value: userStatic.reviews },
  ];

  const profileInfo = [
    { icon: <Star size={20} color="#F59E0B" />, label: "Email", value: userStatic.email },
    { icon: <Briefcase size={20} color="#3B82F6" />, label: "Role", value: userStatic.role },
    { icon: <DollarSign size={20} color="#10B981" />, label: "Balance", value: `$${userStatic.balance}` },
  ];

  const handleLogout = async () => {
    await logout(); // 🔹 Clears user data in context/storage
    router.replace("/login"); // 🔹 Navigate to login screen
  };

  const handleSettings = () => {
    router.push("/settings"); // 🔹 Placeholder, navigate to settings
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton} onPress={handleSettings}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: userStatic.avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit size={16} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{userStatic.name}</Text>
          <Text style={styles.userTitle}>{userStatic.title}</Text>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsCardsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Profile Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Info</Text>
          {profileInfo.map((info, index) => (
            <View key={index} style={styles.infoRow}>
              {info.icon}
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.infoLabel}>{info.label}</Text>
                <Text style={styles.infoValue}>{info.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>{userStatic.bio}</Text>
        </View>

        {/* Skills Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          <View style={styles.skillsContainer}>
            {userStatic.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillTag}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { flexDirection: "row", justifyContent: "flex-end", padding: 16 },
  settingsButton: { padding: 8 },
  profileSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 24,
    backgroundColor: "#fff",
    marginBottom: 16,
  },
  avatarContainer: { position: "relative", marginBottom: 16 },
  avatar: { width: 110, height: 110, borderRadius: 55 },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3B82F6",
    borderRadius: 16,
    width: 34,
    height: 34,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  userName: { fontSize: 24, fontWeight: "bold", color: "#111827", marginBottom: 4 },
  userTitle: { fontSize: 16, color: "#6B7280", marginBottom: 4 },

  statsCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: { fontSize: 16, fontWeight: "700", marginTop: 4, color: "#111827" },
  statLabel: { fontSize: 12, color: "#6B7280", marginTop: 2 },

  section: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#111827", marginBottom: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  infoLabel: { fontSize: 14, color: "#6B7280" },
  infoValue: { fontSize: 16, fontWeight: "600", color: "#111827" },
  aboutText: { fontSize: 16, color: "#6B7280", lineHeight: 22 },
  skillsContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  skillTag: { backgroundColor: "#EFF6FF", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  skillText: { fontSize: 14, color: "#3B82F6", fontWeight: "500" },
  logoutButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 14,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  logoutButtonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
