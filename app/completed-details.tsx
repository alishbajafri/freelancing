import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import axios from "axios";
import { ArrowLeft, CheckCircle2, Clock4, FileText } from "lucide-react-native";
import { API_BASE_URL } from "@/config";

type MilestoneFromApi = {
  title: string;
  duration?: string;
  details?: string;
  pricePKR?: string;
  priceUSD?: string;
  approvalStatus?: "pending" | "approved" | "inReview" | "requested";
  status?: "completed" | "pending";
};

type ProjectFromApi = {
  id: string;
  title?: string;
  client?: string;
  budget?: string;
  deadline?: string;
  status?: string;
  location?: string;
  description?: string;
  postedTime?: string;
  milestones?: MilestoneFromApi[];
  completedDate?: string;
};

type Milestone = {
  title: string;
  duration?: string;
  details?: string;
  pricePKR?: string;
  priceUSD?: string;
  status: "completed" | "pending";
};

type Project = {
  id: string;
  title: string;
  client: string;
  budget: string;
  deadline: string;
  status: string;
  location?: string;
  description?: string;
  milestones: Milestone[];
  completedDate?: string;
};

export default function CompletedDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [debugMsg, setDebugMsg] = useState<string | null>(null);

  useEffect(() => {
    fetchProjectDetails();
  }, [id]);

  const normalize = (data: ProjectFromApi): Project => {
    const milestones: Milestone[] =
      (data.milestones || []).map((m) => ({
        title: m.title,
        duration: m.duration,
        details: m.details,
        pricePKR: m.pricePKR,
        priceUSD: m.priceUSD,
        status:
          m.approvalStatus === "approved" ||
          m.status === "completed" ||
          m.approvalStatus === "inReview"
            ? "completed"
            : "pending",
      })) || [];

    return {
      id: data.id,
      title: data.title || "Untitled Project",
      client: data.client || "Unknown Client",
      budget: data.budget || "N/A",
      deadline: data.deadline || "—",
      status: data.status || "completed",
      location: data.location || undefined,
      description: data.description || "",
      milestones,
      completedDate: data.completedDate || undefined,
    };
  };

  const fetchProjectDetails = async () => {
    if (!id) {
      setDebugMsg("Missing project id in route params.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setDebugMsg(null);

    try {
      // Fetch only from projects collection
      const res = await axios.get<ProjectFromApi>(`${API_BASE_URL}/projects/${id}`);

      if (res?.data && Object.keys(res.data).length > 0) {
        const normalized = normalize(res.data);
        setProject(normalized);
        setDebugMsg(`Loaded from projects collection`);
      } else {
        setProject(null);
        setDebugMsg("Project not found in projects collection.");
      }
    } catch (error) {
      setProject(null);
      setDebugMsg("Project not found or server error.");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  if (!project) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Project not found.</Text>
        {debugMsg ? <Text style={styles.debugText}>{debugMsg}</Text> : null}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconWrap}>
          <ArrowLeft color="#111827" size={22} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Completed Project</Text>
      </View>

      {/* Project Info */}
      <View style={styles.card}>
        <Text style={styles.projectTitle}>{project.title}</Text>
        <Text style={styles.client}>👤 Client: {project.client}</Text>
        <Text style={styles.info}>💰 Budget: {project.budget}</Text>
        <Text style={styles.info}>🕒 Deadline: {project.deadline}</Text>
        {project.location && <Text style={styles.info}>📍 Location: {project.location}</Text>}
        {project.description ? (
          <Text style={styles.desc}>{project.description}</Text>
        ) : null}
      </View>

      {/* Milestones */}
      <View style={styles.milestoneCard}>
        <View style={styles.milestoneHeader}>
          <FileText size={18} color="#2563EB" />
          <Text style={styles.sectionTitle}>Milestones</Text>
        </View>

        {project.milestones.length === 0 ? (
          <Text style={styles.noMilestone}>No milestones recorded.</Text>
        ) : (
          project.milestones.map((m, i) => (
            <View key={i} style={styles.milestoneItem}>
              <View style={styles.milestoneTop}>
                <View style={styles.milestoneLeft}>
                  {m.status === "completed" ? (
                    <CheckCircle2 size={18} color="#16A34A" />
                  ) : (
                    <Clock4 size={18} color="#F59E0B" />
                  )}
                  <Text style={styles.milestoneTitle}>{m.title}</Text>
                </View>
                <Text
                  style={[
                    styles.approvalStatus,
                    m.status === "completed" ? styles.approved : styles.pending,
                  ]}
                >
                  {m.status === "completed" ? "COMPLETED" : "PENDING"}
                </Text>
              </View>

              {m.details ? <Text style={styles.milestoneDetail}>{m.details}</Text> : null}

              <View style={styles.milestoneFooter}>
                {m.duration && <Text style={styles.milestoneDuration}>⏳ {m.duration}</Text>}
                {(m.priceUSD || m.pricePKR) && (
                  <Text style={styles.milestonePrice}>
                    💵 {m.priceUSD} {m.pricePKR ? `(${m.pricePKR})` : ""}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </View>

      {/* Completion message */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>🎉 Congratulations! Project Completed</Text>
        {project.completedDate && (
          <Text style={styles.summarySubText}>Completed on {project.completedDate}</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  errorText: { color: "#DC2626", fontSize: 16, marginBottom: 8 },
  debugText: { color: "#6B7280", fontSize: 12, textAlign: "center", marginBottom: 12 },
  backButton: {
    backgroundColor: "#111827",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  backText: { color: "#fff", fontWeight: "600" },

  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  iconWrap: { backgroundColor: "#EFF6FF", padding: 8, borderRadius: 10 },
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111827", marginLeft: 10 },

  card: {
    backgroundColor: "#fff",
    margin: 16,
    padding: 18,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  projectTitle: { fontSize: 18, fontWeight: "700", color: "#111827" },
  client: { fontSize: 14, color: "#6B7280", marginTop: 6 },
  info: { fontSize: 14, color: "#374151", marginTop: 4 },
  desc: { color: "#4B5563", fontSize: 14, marginTop: 10, lineHeight: 20 },

  milestoneCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#10B981",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 2,
  },
  milestoneHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10, gap: 6 },
  sectionTitle: { fontSize: 16, fontWeight: "700", color: "#111827" },
  milestoneItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 10,
  },
  milestoneTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  milestoneLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  milestoneTitle: { fontSize: 14, fontWeight: "600", color: "#111827" },
  milestoneDetail: { fontSize: 13, color: "#4B5563", marginTop: 6 },
  milestoneFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 6,
  },
  milestoneDuration: { color: "#6B7280", fontSize: 13 },
  milestonePrice: { color: "#2563EB", fontSize: 13, fontWeight: "600" },
  approvalStatus: {
    fontSize: 12,
    fontWeight: "700",
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  approved: { backgroundColor: "#DCFCE7", color: "#16A34A" },
  pending: { backgroundColor: "#FEF9C3", color: "#CA8A04" },

  summaryCard: {
    backgroundColor: "#E0F2FE",
    margin: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  summaryText: { color: "#0369A1", fontWeight: "700", fontSize: 15 },
  summarySubText: { color: "#0369A1", marginTop: 4 },
});
