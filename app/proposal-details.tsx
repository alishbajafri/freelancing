import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "@/config";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Star,
  FileText,
} from "lucide-react-native";

interface Milestone {
  title: string;
  duration: string;
  details: string;
  pricePKR: string;
  priceUSD: string;
  approvalStatus: "pending" | "approved" | "rejected";
}

interface Project {
  id: string;
  title: string;
  client: string;
  budget: string;
  deadline: string;
  skills: string[];
  description: string;
  proposalStatus: "pending" | "viewed" | "shortlisted" | "rejected" | "accepted";
  milestones?: Milestone[];
}

export default function ProposalDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRemind, setShowRemind] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/projects/${id}`);
        setProject(response.data);
      } catch (error) {
        console.error("Error fetching project:", error);
        Alert.alert("Error", "Unable to fetch project details.");
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [id]);

  const handleViewedPress = async () => {
    setShowRemind(true);
  };

  const handleRemindClient = async () => {
    if (!project) return;
    const today = new Date().toISOString().split("T")[0];
    const key = `reminded_${project.id}_${today}`;

    const reminded = await AsyncStorage.getItem(key);
    if (reminded) {
      Alert.alert("Notice", "You’ve already reminded the client today.");
      return;
    }

    await AsyncStorage.setItem(key, "true");
    Alert.alert("Success", "Client has been reminded!");
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#6B7280" }}>Project not found.</Text>
      </View>
    );
  }

  const steps = [
    { label: "Pending", icon: Clock, key: "pending" },
    { label: "Viewed", icon: Eye, key: "viewed", onPress: handleViewedPress },
    { label: "Shortlisted", icon: Star, key: "shortlisted" },
    { label: "Rejected", icon: XCircle, key: "rejected" },
    { label: "Accepted", icon: CheckCircle, key: "accepted" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === project.proposalStatus);
  const isRejected = project.proposalStatus === "rejected";

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={22} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Proposal Details</Text>
      </View>

      {/* Project Info */}
      <View style={styles.card}>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.client}>
          Client: <Text style={styles.bold}>{project.client}</Text>
        </Text>
        <Text style={styles.info}>
          💰 Budget: <Text style={styles.bold}>{project.budget}</Text>
        </Text>
        <Text style={styles.info}>
          🕒 Deadline: <Text style={styles.bold}>{project.deadline}</Text>
        </Text>
        <Text style={styles.info}>🧠 Skills: {project.skills.join(", ")}</Text>
        <Text style={styles.desc}>{project.description}</Text>
      </View>

      {/* Proposal Tracker */}
      <View style={styles.statusCard}>
        <Text style={styles.sectionTitle}>Proposal Progress</Text>

        <View style={styles.trackerContainer}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const active = index <= currentStepIndex;

            return (
              <View key={index} style={styles.step}>
                {index < steps.length - 1 && (
                  <View
                    style={[
                      styles.line,
                      index < currentStepIndex && !isRejected
                        ? { backgroundColor: "#2563EB" }
                        : { backgroundColor: "#E5E7EB" },
                    ]}
                  />
                )}

                <TouchableOpacity
                  disabled={!step.onPress}
                  onPress={step.onPress}
                  style={[
                    styles.iconCircle,
                    active && !isRejected && { backgroundColor: "#2563EB" },
                    step.key === "rejected" && isRejected && { backgroundColor: "#DC2626" },
                  ]}
                >
                  <Icon
                    size={20}
                    color={
                      active || (isRejected && step.key === "rejected")
                        ? "#fff"
                        : "#9CA3AF"
                    }
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.stepLabel,
                    active && !isRejected && { color: "#2563EB", fontWeight: "600" },
                    step.key === "rejected" && isRejected && { color: "#DC2626", fontWeight: "600" },
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.statusMessage}>
          <Text
            style={[
              styles.statusText,
              isRejected ? { color: "#DC2626" } : { color: "#2563EB" },
            ]}
          >
            Current Status:{" "}
            {project.proposalStatus.charAt(0).toUpperCase() +
              project.proposalStatus.slice(1)}
          </Text>
        </View>

        {showRemind && (
          <TouchableOpacity style={styles.remindButton} onPress={handleRemindClient}>
            <Text style={styles.remindButtonText}>Remind Client</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Milestones */}
      {project.milestones && (
        <View style={styles.milestoneCard}>
          <View style={styles.milestoneHeader}>
            <FileText size={18} color="#2563EB" />
            <Text style={styles.sectionTitle}>Milestones</Text>
          </View>

          {project.milestones.map((m, i) => (
            <View key={i} style={styles.milestoneItem}>
              <View style={styles.milestoneTop}>
                <Text style={styles.milestoneTitle}>{m.title}</Text>
                <Text
                  style={[
                    styles.approvalStatus,
                    m.approvalStatus === "approved"
                      ? styles.approved
                      : m.approvalStatus === "rejected"
                      ? styles.rejected
                      : styles.pending,
                  ]}
                >
                  {m.approvalStatus.toUpperCase()}
                </Text>
              </View>
              <Text style={styles.milestoneDetail}>{m.details}</Text>
              <View style={styles.milestoneFooter}>
                <Text style={styles.milestoneDuration}>⏳ {m.duration}</Text>
                <Text style={styles.milestonePrice}>
                  💵 {m.priceUSD} / {m.pricePKR}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB", paddingHorizontal: 16 },
  header: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  backButton: { backgroundColor: "#E5E7EB", padding: 8, borderRadius: 10 },
  headerTitle: { fontSize: 20, fontWeight: "700", marginLeft: 10, color: "#111827" },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 22,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  projectTitle: { fontSize: 19, fontWeight: "700", color: "#111827" },
  client: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  info: { color: "#374151", fontSize: 14, marginTop: 6 },
  bold: { fontWeight: "600", color: "#111827" },
  desc: { color: "#4B5563", fontSize: 14, marginTop: 12, lineHeight: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 14,
    marginLeft: 4,
  },
  statusCard: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
    marginBottom: 22,
  },
  trackerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    position: "relative",
  },
  step: { alignItems: "center", flex: 1 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
  },
  stepLabel: { marginTop: 6, fontSize: 12, color: "#6B7280", textAlign: "center" },
  line: {
    position: "absolute",
    top: 21,
    right: -21,
    width: 42,
    height: 3,
    backgroundColor: "#E5E7EB",
    zIndex: -1,
  },
  statusMessage: {
    marginTop: 22,
    paddingVertical: 12,
    backgroundColor: "#F3F4F6",
    borderRadius: 10,
    alignItems: "center",
  },
  statusText: { fontSize: 15, fontWeight: "600" },
  remindButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 16,
  },
  remindButtonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  milestoneCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
  },
  milestoneHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  milestoneItem: { borderBottomWidth: 1, borderBottomColor: "#E5E7EB", paddingVertical: 10 },
  milestoneTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  milestoneTitle: { fontSize: 15, fontWeight: "600", color: "#111827" },
  milestoneDetail: { fontSize: 13, color: "#4B5563", marginTop: 4 },
  milestoneFooter: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
  milestoneDuration: { color: "#6B7280", fontSize: 13 },
  milestonePrice: { color: "#2563EB", fontSize: 13, fontWeight: "600" },
  approvalStatus: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  approved: { backgroundColor: "#DCFCE7", color: "#16A34A" },
  rejected: { backgroundColor: "#FEE2E2", color: "#DC2626" },
  pending: { backgroundColor: "#FEF9C3", color: "#CA8A04" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
