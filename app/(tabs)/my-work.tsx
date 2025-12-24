import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import WorkCard from "@/components/WorkCard";
import { Briefcase, CheckCircle, FileText } from "lucide-react-native";

interface Milestone {
  title: string;
  approvalStatus: "pending" | "approved" | "requested";
  priceUSD?: string;
}

interface Project {
  id: string;
  title: string;
  client?: string;
  budget?: string;
  deadline?: string;
  location?: string;
  status: "available" | "proposal" | "inProgress" | "completed";
  description?: string;
  milestones?: Milestone[];
  postedTime?: string;
  proposalStatus?: "submitted" | "shortlisted" | "rejected"; // ✅ added
}

export default function MyWorkScreen() {
  const [activeTab, setActiveTab] = useState<"Active" | "Completed" | "Proposals">("Active");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalEarnings, setTotalEarnings] = useState(0);

  useEffect(() => {
    fetchProjects();
  }, [activeTab]);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/earnings`)
      .then(res => {
        const sum = res.data.reduce((acc: number, item: any) => acc + item.amount, 0);
        setTotalEarnings(sum);
      })
      .catch(err => console.log("❌ Earnings fetch error:", err));
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let statusFilter = "";

      if (activeTab === "Active") statusFilter = "inProgress";
      else if (activeTab === "Completed") statusFilter = "completed";
      else if (activeTab === "Proposals") statusFilter = "proposal";

      const res = await axios.get(`${API_BASE_URL}/projects?status=${statusFilter}`);

      const mapped = res.data.map((p: Project) => {
        const totalMilestones = p.milestones?.length || 0;
        const approvedMilestones =
          p.milestones?.filter((m) => m.approvalStatus === "approved").length || 0;
        const progress =
          totalMilestones > 0 ? Math.round((approvedMilestones / totalMilestones) * 100) : 0;

        return {
          ...p,
          client: p.client || "Unknown Client",
          budget: p.budget || "N/A",
          deadline: p.deadline || "No deadline",
          location: p.location || "Remote",
          progress: p.status === "inProgress" ? progress : p.status === "completed" ? 100 : 0,
          completedDate: p.status === "completed" ? "Oct 2025" : "—",
          rating: p.status === "completed" ? 4.8 : null,
          proposedBudget: p.budget,
          submittedDate: p.postedTime ? new Date(p.postedTime).toDateString() : "—",
        };
      });

      setProjects(mapped);
    } catch (error) {
      console.error("❌ Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    let total = 0;

    if (activeTab === "Active") {
      total = projects.reduce((sum, p) => {
        const approvedMilestones = p.milestones?.filter(m => m.approvalStatus === "approved") || [];
        const earned = approvedMilestones.reduce((s, m) => {
          const price = Number(m.priceUSD?.replace("$", "")) || 0;
          return s + price;
        }, 0);
        return sum + earned;
      }, 0);

      return { label: "Total Earned (Approved)", value: `$${total}`, color: "#2563EB" };
    }

    if (activeTab === "Completed") {
      total = projects.reduce((sum, p) => {
        const allMilestones = p.milestones || [];
        const earned = allMilestones.reduce((s, m) => {
          const price = Number(m.priceUSD?.replace("$", "")) || 0;
          return s + price;
        }, 0);
        return sum + earned;
      }, 0);

      return { label: "Total Earned", value: `$${total}`, color: "#10B981" };
    }

    return { label: "", value: "", color: "#F59E0B" }; // ✅ proposals won't use value now
  };

  const shortlistedCount = projects.filter(p => p.proposalStatus === "shortlisted").length;
  const stats = getStats();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Work</Text>
        <Text style={styles.headerSubtitle}>Track your active, completed, and proposed projects</Text>
      </View>

      {/* ✅ Stats */}
      <View style={[styles.statsContainer, { borderLeftColor: stats.color }]}>
        
        {/* Projects count */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{projects.length}</Text>
          <Text style={styles.statLabel}>Projects</Text>
        </View>

        <View style={styles.verticalDivider} />

        {/* ✅ Show money stats on Active & Completed only */}
        {activeTab !== "Proposals" && (
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: stats.color }]}>{stats.value}</Text>
            <Text style={styles.statLabel}>{stats.label}</Text>
          </View>
        )}

        {/* ✅ Show Shortlisted on proposals tab */}
        {activeTab === "Proposals" && (
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: "#2563EB" }]}>{shortlistedCount}</Text>
            <Text style={styles.statLabel}>Shortlisted</Text>
          </View>
        )}
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        {[
          { key: "Active", icon: Briefcase, color: "#2563EB" },
          { key: "Completed", icon: CheckCircle, color: "#10B981" },
          { key: "Proposals", icon: FileText, color: "#F59E0B" },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && { backgroundColor: tab.color }]}
              onPress={() => setActiveTab(tab.key as typeof activeTab)}
            >
              <Icon size={18} color={isActive ? "#fff" : tab.color} style={{ marginRight: 6 }} />
              <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Projects List */}
      <ScrollView style={styles.scrollContainer} contentContainerStyle={{ paddingBottom: 80 }}>
        {loading ? (
          <ActivityIndicator size="large" color={stats.color} style={{ marginTop: 50 }} />
        ) : projects.length > 0 ? (
          projects.map((project) => (
            <WorkCard key={project.id} project={project} type={activeTab.toLowerCase()} />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No {activeTab.toLowerCase()} projects found</Text>
            <Text style={styles.emptySubtext}>Try switching tabs or refresh</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerTitle: { fontSize: 26, fontWeight: "700", color: "#111827" },
  headerSubtitle: { color: "#6B7280", fontSize: 14, marginTop: 4 },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 18,
    marginTop: 16,
    paddingVertical: 14,
    borderRadius: 14,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 20, fontWeight: "700", color: "#111827" },
  statLabel: { fontSize: 13, color: "#6B7280", marginTop: 2 },
  verticalDivider: { width: 1, backgroundColor: "#E5E7EB", height: "100%" },

  tabsContainer: {
    flexDirection: "row",
    marginHorizontal: 18,
    marginTop: 16,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    overflow: "hidden",
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },
  tabText: { fontSize: 15, fontWeight: "600", color: "#374151" },
  activeTabText: { color: "#FFFFFF" },

  scrollContainer: { flex: 1, paddingHorizontal: 18, paddingTop: 16 },
  emptyState: { marginTop: 60, alignItems: "center" },
  emptyText: { fontSize: 16, fontWeight: "600", color: "#6B7280" },
  emptySubtext: { fontSize: 13, color: "#9CA3AF", marginTop: 6 },
});
