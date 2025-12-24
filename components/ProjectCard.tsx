// ProjectCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Project {
  id: string;
  title: string;
  budget: string;
  deadline: string;
  skills: string[];
  client: string;
  description: string;
  location?: string;
  postedTime?: string;
  proposals?: number;
}

interface ProjectCardProps {
  project: Project;
  showDetails?: boolean;
}

export default function ProjectCard({ project, showDetails = false }: ProjectCardProps) {
  const router = useRouter(); // ✅ keep this BEFORE return

  // 🔹 Added timeAgo function for yellowish "5 days ago"
  const timeAgo = (timestamp?: string) => {
    if (!timestamp) return "";
    const postedDate = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - postedDate.getTime();

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return `${diffWeeks} week${diffWeeks > 1 ? "s" : ""} ago`;
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => router.push(`/project-details?id=${project.id}`)}
    >
      <View style={styles.header}>
        <Text style={styles.title} numberOfLines={2}>
          {project.title}
        </Text>
        <Text style={styles.client}>{project.client}</Text>
      </View>

      {showDetails && (
        <Text style={styles.description} numberOfLines={3}>
          {project.description}
        </Text>
      )}

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <DollarSign size={16} color="#10B981" />
          <Text style={styles.budget}>{project.budget}</Text>
        </View>
        <View style={styles.detailItem}>
          <Clock size={16} color="#F59E0B" />
          {/* 🔹 Yellowish posted time */}
          <Text style={styles.deadline}>{timeAgo(project.postedTime)}</Text>
        </View>
      </View>

      <View style={styles.skills}>
        {project.skills.slice(0, 3).map((skill, index) => (
          <View key={index} style={styles.skillTag}>
            <Text style={styles.skillText}>{skill}</Text>
          </View>
        ))}
        {project.skills.length > 3 && (
          <Text style={styles.moreSkills}>+{project.skills.length - 3} more</Text>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => router.push(`/Bid-now?id=${project.id}`)}
        >
          <Text style={styles.applyButtonText}>Bid Now</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  client: {
    fontSize: 14,
    color: '#6B7280',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  budget: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
  },
  deadline: {
    fontSize: 14,
    fontWeight: '500',
    color: '#F59E0B', // 🔹 yellowish color
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  applyButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  saveButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
});
