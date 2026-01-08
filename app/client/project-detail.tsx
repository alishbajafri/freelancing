import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  User,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  AlertCircle,
  MessageSquare,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Milestone {
  id: string;
  title: string;
  description: string;
  duration: string;
  amountPKR: string;
  amountUSD: string;
  status: 'completed' | 'in-progress' | 'pending';
}

const PROJECTS_DATA = [
  {
    id: '1',
    title: 'React Native Mobile App',
    budget: '$300 – $600',
    duration: '2 Weeks',
    client: 'Tech Startup',
    location: 'Remote',
    description:
      'We are looking for an experienced React Native developer to build a modern and scalable mobile application.',
    freelancer: { name: 'Sarah Johnson', rating: 4.9, completedProjects: 127 },
    skills: ['React Native', 'JavaScript', 'API Integration', 'UI/UX'],
    milestones: [
      {
        id: '1',
        title: 'UI Design',
        description: 'Design application screens',
        duration: '3 days',
        amountPKR: 'PKR 30,000',
        amountUSD: '$100',
        status: 'completed',
      },
      {
        id: '2',
        title: 'Development',
        description: 'Develop app functionality',
        duration: '7 days',
        amountPKR: 'PKR 90,000',
        amountUSD: '$300',
        status: 'in-progress',
      },
      {
        id: '3',
        title: 'Testing & Delivery',
        description: 'Final testing and deployment',
        duration: '4 days',
        amountPKR: 'PKR 30,000',
        amountUSD: '$100',
        status: 'pending',
      },
    ],
  },
];

export default function ProjectDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const project = PROJECTS_DATA.find((p) => p.id === id);

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={{ margin: 20, fontSize: 16 }}>Project not found.</Text>
      </View>
    );
  }

  const getMilestoneIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} color="#10B981" strokeWidth={2} />;
      case 'in-progress':
        return <Clock size={20} color="#3B82F6" strokeWidth={2} />;
      case 'pending':
        return <AlertCircle size={20} color="#6B7280" strokeWidth={2} />;
    }
  };

  const getMilestoneColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed':
        return '#10B981';
      case 'in-progress':
        return '#3B82F6';
      case 'pending':
        return '#6B7280';
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Project Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* TITLE */}
        <View style={styles.titleCard}>
          <Text style={styles.projectTitle}>{project.title}</Text>
          <View style={[styles.statusBadge, { backgroundColor: '#3B82F6' }]}>
            <Text style={styles.statusText}>{project.duration}</Text>
          </View>
        </View>

        {/* INFO */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <DollarSign size={18} color="#6B7280" strokeWidth={2} />
              <View>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>{project.budget}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Calendar size={18} color="#6B7280" strokeWidth={2} />
              <View>
                <Text style={styles.infoLabel}>Duration</Text>
                <Text style={styles.infoValue}>{project.duration}</Text>
              </View>
            </View>
          </View>

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <View style={styles.infoItem}>
              <User size={18} color="#6B7280" strokeWidth={2} />
              <View>
                <Text style={styles.infoLabel}>Client</Text>
                <Text style={styles.infoValue}>{project.client}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { marginTop: 2 }]}>📍</Text>
              <View>
                <Text style={styles.infoValue}>{project.location}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* FREELANCER */}
        <View style={styles.freelancerCard}>
          <View style={styles.freelancerHeader}>
            <View style={styles.avatarContainer}>
              <User size={24} color="#3B82F6" strokeWidth={2} />
            </View>
            <View style={styles.freelancerInfo}>
              <Text style={styles.freelancerName}>{project.freelancer?.name}</Text>
              <Text style={styles.freelancerStats}>
                ⭐ {project.freelancer?.rating} • {project.freelancer?.completedProjects} projects
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.messageButton}
            onPress={() => router.push('/client/messages')}
          >
            <MessageSquare size={18} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.messageButtonText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* DESCRIPTION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{project.description}</Text>
        </View>

        {/* SKILLS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills Required</Text>
          <View style={styles.skillsContainer}>
            {project.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* MILESTONES */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Milestones</Text>
          {project.milestones.map((ms, index) => (
            <View key={ms.id} style={styles.milestoneCard}>
              <View style={styles.milestoneLeft}>
                {getMilestoneIcon(ms.status)}
                <View style={styles.milestoneInfo}>
                  <Text style={styles.milestoneTitle}>{ms.title}</Text>
                  <Text style={styles.milestoneDescription}>{ms.description}</Text>
                </View>
              </View>

              <View style={styles.milestoneFooter}>
                <Text style={styles.milestoneDuration}>⏳ {ms.duration}</Text>
                <Text style={[styles.milestoneAmount, { color: getMilestoneColor(ms.status) }]}>
                  {ms.amountPKR} • {ms.amountUSD}
                </Text>
              </View>

              {index < project.milestones.length - 1 && <View style={styles.timelineLine} />}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1 },
  titleCard: { margin: 20, padding: 20, backgroundColor: '#FFFFFF', borderRadius: 16, elevation: 3 },
  projectTitle: { fontSize: 22, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  statusBadge: { marginTop: 12, padding: 6, borderRadius: 8 },
  statusText: { color: '#FFF', fontWeight: '600' },

  infoCard: { marginHorizontal: 20, marginBottom: 20, padding: 20, backgroundColor: '#FFF', borderRadius: 16 },
  infoRow: { flexDirection: 'row', gap: 24 },
  infoItem: { flexDirection: 'row', gap: 12 },
  infoLabel: { fontSize: 12, color: '#6B7280' },
  infoValue: { fontSize: 16, fontWeight: '700' },

  freelancerCard: { marginHorizontal: 20, marginBottom: 20, padding: 20, backgroundColor: '#FFF', borderRadius: 16 },
  freelancerHeader: { flexDirection: 'row', marginBottom: 16 },
  avatarContainer: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  freelancerName: { fontSize: 18, fontWeight: '700' },
  freelancerStats: { color: '#6B7280' },
  messageButton: { flexDirection: 'row', justifyContent: 'center', gap: 8, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#3B82F6' },
  messageButtonText: { color: '#3B82F6', fontWeight: '600' },

  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  description: { backgroundColor: '#FFF', padding: 16, borderRadius: 12, color: '#6B7280' },

  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { backgroundColor: '#E0F2FE', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12 },
  skillText: { color: '#0369A1', fontWeight: '600', fontSize: 12 },

  milestoneCard: { backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginBottom: 12, position: 'relative' },
  milestoneLeft: { flexDirection: 'row', gap: 12 },
  milestoneInfo: {},
  milestoneTitle: { fontWeight: '600' },
  milestoneDescription: { color: '#6B7280', fontSize: 13 },
  milestoneFooter: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  milestoneDuration: { color: '#6B7280', fontSize: 12 },
  milestoneAmount: { fontWeight: '700' },
  timelineLine: { position: 'absolute', left: 24, top: 50, bottom: -12, width: 2, backgroundColor: '#E5E7EB' },
});
