// ProjectDetails.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react-native';
import { API_BASE_URL } from '@/config';

export default function ProjectDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // ✅ Works for string IDs like "1"
    axios
      .get(`${API_BASE_URL}/projects/${id}`)
      .then((res) => {
        setProject(res.data);

      })
      .catch(() => setError('Failed to load project details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#2563EB" />;
  if (error)
    return <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>;
  if (!project) return null;

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Project Card */}
      <View style={styles.card}>
        <Text style={styles.title}>{project.title}</Text>
        <Text style={styles.budget}>💰 {project.budget}</Text>
        <Text style={styles.deadline}>🕒 {project.deadline}</Text>
        <Text style={styles.client}>👤 {project.client}</Text>
        <Text style={styles.location}>📍 {project.location}</Text>

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{project.description}</Text>

        <Text style={styles.sectionTitle}>Skills Required</Text>
        <View style={styles.skillContainer}>
          {project.skills?.map((skill, i) => (
            <Text key={i} style={styles.skillTag}>{skill}</Text>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Project Milestones</Text>
        {project.milestones?.map((m, i) => (
          <View key={i} style={styles.milestoneCard}>
            <Text style={styles.milestoneTitle}>{i + 1}. {m.title}</Text>
            <Text style={styles.milestoneDetail}>{m.details}</Text>
            <Text style={styles.milestoneDuration}>⏳ {m.duration}</Text>
            <Text style={styles.milestonePrice}>{m.pricePKR} • {m.priceUSD}</Text>
          </View>
        ))}

        <TouchableOpacity
          style={styles.applyButton}
          onPress={() => router.push(`/Bid-now?id=${project.id}`)}
        >
          <Text style={styles.applyButtonText}>🚀 Bid Now</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  title: { fontSize: 22, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  budget: { fontSize: 16, color: '#3B82F6', marginBottom: 4 },
  deadline: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  client: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  location: { fontSize: 16, color: '#6B7280', marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginTop: 16, marginBottom: 6 },
  description: { fontSize: 16, color: '#374151', lineHeight: 22 },
  skillContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  skillTag: {
    backgroundColor: '#EFF6FF',
    color: '#2563EB',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    marginRight: 6,
    marginBottom: 6,
    fontSize: 14,
  },
  milestoneCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },
  milestoneTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  milestoneDetail: { fontSize: 14, color: '#374151', marginTop: 2 },
  milestoneDuration: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  milestonePrice: { fontSize: 14, color: '#10B981', marginTop: 4 },
  applyButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  applyButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});
