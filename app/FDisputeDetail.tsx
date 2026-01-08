import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  User,
  DollarSign,
  Calendar,
  FileText,
  Image as ImageIcon,
  MessageSquare,
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface Evidence {
  id: string;
  type: 'document' | 'image' | 'message';
  title: string;
  description: string;
  date: string;
}

type DisputeStatus = 'Pending' | 'Resolved' | 'Denied';

export default function FDisputeDetail() {
  const router = useRouter();
  const { dispute } = useLocalSearchParams<{ dispute: string }>();
  const parsedDispute = dispute ? JSON.parse(dispute) : null;

  if (!parsedDispute) return <Text style={{ padding: 20 }}>No dispute data found!</Text>;

  const {
    projectTitle,
    clientName,
    reason,
    status,
    createdDate,
    amount,
    freelancerName = 'N/A',
    milestoneNumber = 1,
    description = reason,
  } = parsedDispute;

  // Dummy evidence data
  const EVIDENCE_DATA: Evidence[] = [
    {
      id: '1',
      type: 'document',
      title: 'Project Brief',
      description: 'Initial agreed requirements',
      date: 'Dec 1, 2025',
    },
    {
      id: '2',
      type: 'image',
      title: 'Submitted Work',
      description: 'Screenshot of submitted milestone',
      date: 'Dec 10, 2025',
    },
    {
      id: '3',
      type: 'message',
      title: 'Chat History',
      description: 'Messages with client',
      date: 'Dec 5-11, 2025',
    },
  ];

  const getEvidenceIcon = (type: Evidence['type']) => {
    switch (type) {
      case 'document':
        return <FileText size={20} color="#3B82F6" strokeWidth={2} />;
      case 'image':
        return <ImageIcon size={20} color="#10B981" strokeWidth={2} />;
      case 'message':
        return <MessageSquare size={20} color="#F59E0B" strokeWidth={2} />;
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'Pending':
        return <Clock size={24} color="#F59E0B" strokeWidth={2} />;
      case 'Resolved':
        return <CheckCircle2 size={24} color="#10B981" strokeWidth={2} />;
      case 'Denied':
        return <XCircle size={24} color="#EF4444" strokeWidth={2} />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'Pending':
        return '#F59E0B';
      case 'Resolved':
        return '#10B981';
      case 'Denied':
        return '#EF4444';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dispute Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            {getStatusIcon()}
            <View style={styles.statusInfo}>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={[styles.statusValue, { color: getStatusColor() }]}>{status}</Text>
            </View>
          </View>
        </View>

        {/* Project Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Project Information</Text>
          <View style={styles.infoCard}>
            <Text style={styles.projectTitle}>{projectTitle}</Text>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <User size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.infoText}>{freelancerName}</Text>
              </View>
              <View style={styles.infoItem}>
                <DollarSign size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.infoText}>{amount}</Text>
              </View>
            </View>
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Calendar size={16} color="#6B7280" strokeWidth={2} />
                <Text style={styles.infoText}>{createdDate}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={[styles.infoText, { fontWeight: '600' }]}>Milestone {milestoneNumber}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Reason */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reason for Dispute</Text>
          <View style={styles.reasonCard}>
            <Text style={styles.reasonTitle}>{reason}</Text>
            <Text style={styles.reasonDescription}>{description}</Text>
          </View>
        </View>

        {/* Evidence */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Submitted Evidence</Text>
          {EVIDENCE_DATA.map((evidence) => (
            <TouchableOpacity key={evidence.id} style={styles.evidenceCard}>
              <View style={styles.evidenceIcon}>{getEvidenceIcon(evidence.type)}</View>
              <View style={styles.evidenceInfo}>
                <Text style={styles.evidenceTitle}>{evidence.title}</Text>
                <Text style={styles.evidenceDescription}>{evidence.description}</Text>
                <Text style={styles.evidenceDate}>{evidence.date}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.addEvidenceButton}>
            <FileText size={18} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.addEvidenceText}>Add More Evidence</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  content: { flex: 1 },
  statusCard: { margin: 20, padding: 20, backgroundColor: '#FFFFFF', borderRadius: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  statusHeader: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  statusInfo: { flex: 1 },
  statusLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  statusValue: { fontSize: 20, fontWeight: '700' },
  section: { marginHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  infoCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  projectTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 12 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  infoItem: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  infoText: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  reasonCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  reasonTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 8 },
  reasonDescription: { fontSize: 14, color: '#6B7280', lineHeight: 22 },
  evidenceCard: { flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  evidenceIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  evidenceInfo: { flex: 1 },
  evidenceTitle: { fontSize: 15, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  evidenceDescription: { fontSize: 13, color: '#6B7280', marginBottom: 4, lineHeight: 18 },
  evidenceDate: { fontSize: 12, color: '#9CA3AF' },
  addEvidenceButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, borderWidth: 2, borderColor: '#3B82F6', borderStyle: 'dashed', marginTop: 8 },
  addEvidenceText: { fontSize: 15, color: '#3B82F6', fontWeight: '600' },
});
