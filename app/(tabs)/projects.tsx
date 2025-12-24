import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Filter, MapPin, Clock, X } from "lucide-react-native";
import axios from "axios";
import { API_BASE_URL } from "@/config";
import ProjectCard from "@/components/ProjectCard";

export default function ProjectsScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  // Filter states
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [postedWithin, setPostedWithin] = useState("");
  const [duration, setDuration] = useState("");
  const [location, setLocation] = useState("");

  const categories = [
    "All",
    "Design",
    "Development",
    "Writing",
    "Marketing",
    "Data",
  ];

  
  // Function to calculate how long ago a project was posted
  const timeAgo = (timestamp) => {
    const postedDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now - postedDate;

    if (isNaN(diffMs)) return "Unknown";

    const diffMinutes = Math.round(diffMs / (1000 * 60));
    const diffHours = Math.round(diffMinutes / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    if (diffMinutes < 1) return "Just now";
    if (diffHours < 1) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffWeeks < 5) return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
  };


  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/projects`);
      const availableProjects = response.data.filter(
        (p) => p.status === "available"
      );
      setProjects(availableProjects);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" ||
      project.skills?.some((skill) =>
        skill.toLowerCase().includes(selectedCategory.toLowerCase())
      );

    // Price filter (assuming project.budget = "$500 - $1000")
    const [minBudget, maxBudget] = project.budget
      ? project.budget
          .replace(/\$/g, "")
          .split("-")
          .map((b) => parseInt(b.trim()))
      : [0, 0];

    const matchesMinPrice = minPrice ? maxBudget >= parseInt(minPrice) : true;
    const matchesMaxPrice = maxPrice ? minBudget <= parseInt(maxPrice) : true;

    // Posted within filter
    const daysSincePost =
      (new Date() - new Date(project.postedTime)) / (1000 * 60 * 60 * 24);
    const matchesPostedWithin =
      postedWithin === ""
        ? true
        : postedWithin === "1"
        ? daysSincePost <= 1
        : postedWithin === "3"
        ? daysSincePost <= 3
        : postedWithin === "7"
        ? daysSincePost <= 7
        : postedWithin === "30"
        ? daysSincePost <= 30
        : postedWithin === "90"
        ? daysSincePost <= 90
        : postedWithin === "365"
        ? daysSincePost <= 365
        : true;

    // Duration filter (assuming project.deadline = "5 days")
    const durationDays = project.deadline
      ? parseInt(project.deadline.replace(/\D/g, ""))
      : 0;
    const matchesDuration =
      duration === ""
        ? true
        : duration === "3"
        ? durationDays <= 3
        : duration === "7"
        ? durationDays <= 7
        : duration === "30"
        ? durationDays <= 30
        : duration === "90"
        ? durationDays <= 90
        : duration === "180"
        ? durationDays <= 180
        : duration === "365"
        ? durationDays <= 365
        : true;

    // Location filter
    const matchesLocation = location
      ? project.location?.toLowerCase().includes(location.toLowerCase())
      : true;

    return (
      matchesSearch &&
      matchesCategory &&
      matchesMinPrice &&
      matchesMaxPrice &&
      matchesPostedWithin &&
      matchesDuration &&
      matchesLocation
    );
  });

  const resetFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setPostedWithin("");
    setDuration("");
    setSelectedCategory("All");
    setLocation("");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Available Tasks</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilter(true)}
        >
          <Filter size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search available tasks..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryButton,
                selectedCategory === category && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.categoryTextActive,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Project List */}
      <ScrollView style={styles.projectsList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" style={{ marginTop: 50 }} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <>
            <Text style={styles.resultsText}>
              {filteredProjects.length} available tasks
            </Text>
            {filteredProjects.map((project) => (
              <View key={project.id} style={styles.projectCardContainer}>
                <ProjectCard project={project} showDetails />
                <View style={styles.projectMeta}>
                  <View style={styles.metaItem}>
                    <MapPin size={14} color="#6B7280" />
                    <Text style={styles.metaText}>{project.location}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Clock size={14} color="#6B7280" />
                    <Text style={styles.metaText}>
                      {timeAgo(project.postedTime)}
                    </Text>
                  </View>
                  <Text style={styles.proposalsText}>
                    {project.proposals} proposals
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* 🔽 Filter Bottom Sheet */}
      <Modal
        visible={showFilter}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilter(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Options</Text>
              <TouchableOpacity onPress={() => setShowFilter(false)}>
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Price Range */}
              <Text style={styles.modalLabel}>Price Range ($)</Text>
              <View style={styles.row}>
                <TextInput
                  style={styles.input}
                  placeholder="Min"
                  keyboardType="numeric"
                  value={minPrice}
                  onChangeText={setMinPrice}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Max"
                  keyboardType="numeric"
                  value={maxPrice}
                  onChangeText={setMaxPrice}
                />
              </View>

              {/* Posted Within */}
              <Text style={styles.modalLabel}>Posted Within</Text>
              <View style={styles.row}>
                {["1", "3", "7", "30", "90", "365"].map((days) => (
                  <TouchableOpacity
                    key={days}
                    style={[
                      styles.optionButton,
                      postedWithin === days && styles.optionActive,
                    ]}
                    onPress={() => setPostedWithin(days)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        postedWithin === days && styles.optionTextActive,
                      ]}
                    >
                      {days === "30"
                        ? "Last 1 month"
                        : days === "90"
                        ? "Last 3 months"
                        : days === "365"
                        ? "Last 1 year"
                        : `Last ${days} day${days > 1 ? "s" : ""}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Duration */}
              <Text style={styles.modalLabel}>Project Duration</Text>
              <View style={styles.row}>
                {["3", "7", "30", "90", "180", "365"].map((d) => (
                  <TouchableOpacity
                    key={d}
                    style={[
                      styles.optionButton,
                      duration === d && styles.optionActive,
                    ]}
                    onPress={() => setDuration(d)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        duration === d && styles.optionTextActive,
                      ]}
                    >
                      {d === "30"
                        ? "< 1 month"
                        : d === "90"
                        ? "< 3 months"
                        : d === "180"
                        ? "< 6 months"
                        : d === "365"
                        ? "< 1 year"
                        : `< ${d} days`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Location */}
              <Text style={styles.modalLabel}>Location</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter location (e.g. Karachi, Remote)"
                value={location}
                onChangeText={setLocation}
              />

              {/* Category */}
              <Text style={styles.modalLabel}>Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.optionButton,
                      selectedCategory === cat && styles.optionActive,
                    ]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selectedCategory === cat && styles.optionTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              {/* Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.resetBtn}
                  onPress={resetFilters}
                >
                  <Text style={styles.resetText}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={() => setShowFilter(false)}
                >
                  <Text style={styles.applyText}>Apply</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#111827" },
  filterButton: { padding: 8 },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInput: { flex: 1, fontSize: 16, color: "#111827" },
  categoriesContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 8,
  },
  categoriesContent: { paddingHorizontal: 16, gap: 10 },
  categoryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
  },
  categoryButtonActive: { backgroundColor: "#3B82F6" },
  categoryText: { fontSize: 15, fontWeight: "500", color: "#6B7280" },
  categoryTextActive: { color: "#FFFFFF" },
  projectsList: { flex: 1, paddingHorizontal: 20 },
  resultsText: { fontSize: 16, color: "#6B7280", marginVertical: 16 },
  projectCardContainer: { marginBottom: 16 },
  projectMeta: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 16,
  },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaText: { fontSize: 12, color: "#6B7280" },
  proposalsText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
    marginLeft: "auto",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 50,
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  filterModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: "85%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  modalLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#374151",
    marginTop: 16,
    marginBottom: 6,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    padding: 10,
    fontSize: 15,
  },
  optionButton: {
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  optionActive: { backgroundColor: "#3B82F6" },
  optionText: { color: "#374151", fontSize: 14 },
  optionTextActive: { color: "#fff" },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  resetBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#E5E7EB",
    marginRight: 10,
    alignItems: "center",
  },
  applyBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    alignItems: "center",
  },
  resetText: { color: "#111827", fontWeight: "500" },
  applyText: { color: "#fff", fontWeight: "500" },
});
