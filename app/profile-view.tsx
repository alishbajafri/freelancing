import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react-native";
import { useRouter } from "expo-router";
import { API_BASE_URL } from "@/config";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function ProfileViewScreen() {
  const router = useRouter();

  // profile + projects + reviews
  const [user, setUser] = useState<any>(null);
  const [completedProjects, setCompletedProjects] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // edit state + form fields
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formName, setFormName] = useState("");
  const [formTitle, setFormTitle] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formSkills, setFormSkills] = useState("");
  const [formBio, setFormBio] = useState("");
  const [formPricing, setFormPricing] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);

  // expanded project index for dropdown
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

 useEffect(() => {
  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/profile`);
      setUser(res.data);
      setAvatarUri(res.data.avatar || null);
      setFormName(res.data.name || "");
      setFormTitle(res.data.title || "");
      setFormEmail(res.data.email || "");
      setFormSkills((res.data.skills || []).join(", "));
      setFormBio(res.data.bio || "");
      setFormPricing(res.data.pricing || "");

      const completed = (res.data.projects || []).filter((p: any) => (p.status || "").toLowerCase() === "completed");
      setCompletedProjects(completed);

      setReviews(res.data.reviews || []);
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  fetchProfile();
}, []);


  // calculate average rating for a project based on reviews array
  const getProjectAverageRating = (projectTitle: string) => {
    if (!reviews || reviews.length === 0) return null;
    const review = reviews.find((r: any) => r.projectTitle === projectTitle);
    if (!review) return null;
    const milestoneRatings = (review.milestones || []).map((m: any) => Number(m.rating || 0));
    const other = [Number(review.communication || 0), Number(review.quality || 0), Number(review.punctuality || 0)];
    const all = [...milestoneRatings, ...other].filter((v) => typeof v === "number" && !Number.isNaN(v));
    if (all.length === 0) return null;
    const avg = all.reduce((a: number, b: number) => a + b, 0) / all.length;
    return Number(avg.toFixed(1));
  };

  // pick image (expo-image-picker)
  const pickImage = async () => {
    if (!editMode) return;
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Permission to access media library is required");
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if ((res as any).canceled) return;
    const uri = (res as any).assets ? (res as any).assets[0].uri : (res as any).uri;
    if (uri) setAvatarUri(uri);
  };

  const openEmail = (email?: string) => {
    if (!email) return;
    Linking.openURL(`mailto:${email}`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        name: formName,
        title: formTitle,
        email: formEmail,
        skills: formSkills.split(",").map((s) => s.trim()).filter(Boolean),
        bio: formBio,
        pricing: formPricing,
        avatar: avatarUri,
        balance: user?.balance || 0, // ✅ Preserve balance
      };

      await axios.put(`${API_BASE_URL}/profile`, payload); // ✅ PUT instead of PATCH

      setUser((prev) => ({ ...(prev || {}), ...payload }));
      Alert.alert("Success", "Profile saved successfully.");
      setEditMode(false);
    } catch (err) {
      console.error("Save error:", err);
      Alert.alert("Error", "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };


  const toggleExpand = (index: number) => {
    LayoutAnimation.easeInEaseOut();
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <TouchableOpacity onPress={pickImage} disabled={!editMode} style={styles.avatarWrapper}>
            {avatarUri ? (
              <Image source={{ uri: avatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarInitial}>{(user?.name || "?").charAt(0).toUpperCase()}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Name */}
          {editMode ? (
            <TextInput style={styles.nameInput} value={formName} onChangeText={setFormName} />
          ) : (
            <Text style={styles.name}>{user?.name}</Text>
          )}

          {/* Title */}
          {editMode ? (
            <TextInput style={[styles.input, { marginTop: 8 }]} value={formTitle} onChangeText={setFormTitle} placeholder="e.g. UI/UX Designer" />
          ) : (
            <Text style={styles.role}>{user?.title}</Text>
          )}

          {/* Email */}
          <View style={{ marginTop: 8, width: "100%" }}>
            {editMode ? (
              <TextInput style={styles.input} value={formEmail} onChangeText={setFormEmail} keyboardType="email-address" placeholder="email@example.com" />
            ) : (
              <TouchableOpacity onPress={() => openEmail(user?.email)}>
                <Text style={styles.emailLink}>{user?.email}</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Skills */}
          <View style={{ width: "100%", marginTop: 12 }}>
            <Text style={styles.sectionLabel}>Skills</Text>
            {editMode ? (
              <TextInput style={styles.input} value={formSkills} onChangeText={setFormSkills} placeholder="comma, separated, skills" />
            ) : (
              <View style={styles.skillsContainer}>
                {(user?.skills || []).length === 0 ? (
                  <Text style={styles.emptyText}>No skills listed</Text>
                ) : (
                  (user.skills || []).map((skill: string) => (
                    <View key={skill} style={styles.skillBadge}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>

          {/* Bio */}
          <View style={styles.bioContainer}>
            <Text style={styles.sectionLabel}>Bio</Text>
            {editMode ? (
              <TextInput style={styles.bioInput} value={formBio} onChangeText={setFormBio} placeholder="Tell people about yourself..." multiline />
            ) : (
              <View style={styles.bioCard}>
                <Text style={styles.bioText}>{user?.bio || "Creative and detail-oriented designer passionate about building smooth mobile experiences."}</Text>
              </View>
            )}
          </View>

          {/* Pricing */}
          <View style={{ width: "100%", marginTop: 12 }}>
            <Text style={styles.sectionLabel}>Pricing</Text>
            {editMode ? (
              <TextInput style={styles.input} value={formPricing} onChangeText={setFormPricing} placeholder="$25/hr" />
            ) : (
              <View style={styles.pricingBox}>
                <Text style={styles.pricingText}>{user?.pricing || "$25/hr"}</Text>
                <Text style={styles.pricingNote}>Flexible based on project scope and duration</Text>
              </View>
            )}
          </View>

          {/* Edit/Save */}
          <TouchableOpacity style={editMode ? styles.saveButton : styles.editButton} onPress={editMode ? handleSave : () => setEditMode(true)} disabled={saving}>
            {saving ? <ActivityIndicator /> : <Text style={styles.buttonText}>{editMode ? "Save Changes" : "Edit Profile"}</Text>}
          </TouchableOpacity>
        </View>

        {/* Completed Projects header */}
        <Text style={styles.sectionTitle}>Completed Projects</Text>

        {/* Completed Projects list */}
        {completedProjects.length === 0 ? (
          <Text style={styles.emptyText}>No completed projects yet.</Text>
        ) : (
          completedProjects.map((proj, idx) => {
            const avg = getProjectAverageRating(proj.title);
            const review = reviews.find((r: any) => (r.projectTitle || r.project || "").toLowerCase() === (proj.title || "").toLowerCase());
            const preview = review?.feedback || review?.comment || review?.text || null;
            const expanded = expandedIndex === idx;

            return (
              <View key={proj.id ?? `proj-${idx}`} style={styles.projectCard}>
                <TouchableOpacity style={styles.projectHeader} activeOpacity={0.8} onPress={() => toggleExpand(idx)}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.projectTitle}>{proj.title}</Text>
                    {avg !== null && <Text style={styles.projectRating}>⭐ {avg} / 5</Text>}
                    {preview ? <Text style={styles.projectReview} numberOfLines={2}>“{preview}”</Text> : <Text style={styles.projectNoReview}>No review available</Text>}
                  </View>

                  {expanded ? <ChevronUp size={22} color="#111827" /> : <ChevronDown size={22} color="#111827" />}
                </TouchableOpacity>

                {expanded && (
                  <View style={styles.milestonesContainer}>
                    {review?.milestones && review.milestones.length > 0 ? (
                      review.milestones.map((m: any, i: number) => (
                        <View key={i} style={styles.milestoneBox}>
                          <Text style={styles.milestoneTitle}>{m.title}</Text>
                          <Text style={styles.milestoneRating}>⭐ {Number(m.rating || 0).toFixed(1)} / 5</Text>
                          {m.comment ? <Text style={styles.milestoneComment}>{m.comment}</Text> : null}
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noMilestones}>No milestone ratings found.</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

/* ===== styles ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 12, gap: 12 },
  headerTitle: { fontSize: 20, fontWeight: "700", color: "#111827" },

  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },

  avatarWrapper: { marginBottom: 8 },
  avatar: { width: 96, height: 96, borderRadius: 48, resizeMode: "cover" },
  avatarPlaceholder: { backgroundColor: "#e0f2fe", justifyContent: "center", alignItems: "center" },
  avatarInitial: { fontSize: 32, fontWeight: "700", color: "#0369A1" },

  name: { fontSize: 20, fontWeight: "700", color: "#111827" },
  nameInput: { fontSize: 20, fontWeight: "700", color: "#111827", textAlign: "center", width: "100%" },

  role: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  emailLink: { color: "#2563eb", fontSize: 14, marginTop: 6 },

  sectionLabel: { fontSize: 13, color: "#374151", marginBottom: 6, alignSelf: "flex-start" },
  input: {
    backgroundColor: "#f9fafb",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 10,
    width: "100%",
  },

  skillsContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "center" },
  skillBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 6,
    marginBottom: 6,
  },
  skillText: { color: "#0369A1", fontSize: 14, fontWeight: "600" },

  /* Bio */
  bioContainer: { width: "100%", marginTop: 12 },
  bioCard: { backgroundColor: "#f9fafb", borderRadius: 12, padding: 14, borderWidth: 1, borderColor: "#e5e7eb" },
  bioText: { fontSize: 14.5, color: "#374151", lineHeight: 20 },
  bioInput: { backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#d1d5db", padding: 10, height: 110, textAlignVertical: "top", color: "#111827" },

  /* Pricing */
  pricingBox: { backgroundColor: "#ECFDF5", paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10, alignItems: "center", borderWidth: 1, borderColor: "#D1FAE5" },
  pricingText: { fontSize: 16, fontWeight: "700", color: "#065F46" },
  pricingNote: { fontSize: 12, color: "#047857", marginTop: 4 },

  /* Buttons */
  editButton: { backgroundColor: "#3b82f6", marginTop: 12, borderRadius: 10, paddingVertical: 12, alignItems: "center", width: "100%" },
  saveButton: { backgroundColor: "#10b981", marginTop: 12, borderRadius: 10, paddingVertical: 12, alignItems: "center", width: "100%" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginTop: 6, marginBottom: 8 },
  emptyText: { textAlign: "center", color: "#777", marginTop: 6 },

  /* Projects */
  projectCard: { backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8, shadowColor: "#000", shadowOpacity: 0.04, shadowOffset: { width: 0, height: 1 }, shadowRadius: 3, elevation: 2 },
  projectHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  projectTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  projectRating: { fontSize: 14, color: "#f59e0b", marginTop: 4 },
  projectReview: { fontSize: 13, color: "#4b5563", fontStyle: "italic", marginTop: 6 },
  projectNoReview: { fontSize: 13, color: "#9CA3AF", marginTop: 6, fontStyle: "italic" },

  milestonesContainer: { marginTop: 10 },
  milestoneBox: { backgroundColor: "#f4f6fc", borderRadius: 10, padding: 8, marginBottom: 6, borderLeftWidth: 3, borderLeftColor: "#f59e0b" },
  milestoneTitle: { fontSize: 13, fontWeight: "700", color: "#111827" },
  milestoneComment: { fontSize: 12, color: "#475569", marginTop: 4 },
  milestoneRating: { fontSize: 13, color: "#f59e0b", marginTop: 4 },
  noMilestones: { color: "#888", fontSize: 13, fontStyle: "italic" },
});
