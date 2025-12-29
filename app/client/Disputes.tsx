import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { AlertCircle, Clock, CheckCircle2, XCircle, ChevronRight, ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Dispute {
  id: string;
  projectTitle: string;
  freelancerName: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Denied';
  createdDate: string;
  amount: string;
}

const DISPUTES_DATA: Dispute[] = [
  {
    id: '1',
    projectTitle: 'Mobile App UI/UX Design',
    freelancerName: 'Sarah Johnson',
    reason: 'Milestone not delivered as per requirements',
    status: 'Pending',
    createdDate: 'Dec 12, 2025',
    amount: '$1,000',
  },
  {
    id: '2',
    projectTitle: 'Logo Design & Branding',
    freelancerName: 'Emma Davis',
    reason: 'Quality of work does not match portfolio',
    status: 'Approved',
    createdDate: 'Dec 8, 2025',
    amount: '$800',
  },
  {
    id: '3',
    projectTitle: 'SEO Optimization & Content Writing',
    freelancerName: 'David Wilson',
    reason: 'Missed multiple deadlines without communication',
    status: 'Denied',
    createdDate: 'Dec 5, 2025',
    amount: '$1,200',
  },
  {
    id: '4',
    projectTitle: 'WordPress Blog Setup',
    freelancerName: 'Robert Taylor',
    reason: 'Website not functional after delivery',
    status: 'Pending',
    createdDate: 'Dec 3, 2025',
    amount: '$600',
  },
];

export default function Disputes() {
  const router = useRouter();

  const getStatusIcon = (status: Dispute['status']) => {
    switch (status) {
      case 'Pending':
        return <Clock size={20} color="#F59E0B" strokeWidth={2} />;
      case 'Approved':
        return <CheckCircle2 size={20} color="#10B981" strokeWidth={2} />;
      case 'Denied':
        return <XCircle size={20} color="#EF4444" strokeWidth={2} />;
    }
  };

  const getStatusColor = (status: Dispute['status']) => {
    switch (status) {
      case 'Pending':
        return '#F59E0B';
      case 'Approved':
        return '#10B981';
      case 'Denied':
        return '#EF4444';
    }
  };

  const getStatusBackground = (status: Dispute['status']) => {
    switch (status) {
      case 'Pending':
        return '#FEF3C7';
      case 'Approved':
        return '#D1FAE5';
      case 'Denied':
        return '#FEE2E2';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Arrow */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Disputes</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <AlertCircle size={20} color="#F59E0B" strokeWidth={2} />
          <Text style={styles.statValue}>2</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <CheckCircle2 size={20} color="#10B981" strokeWidth={2} />
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statCard}>
          <XCircle size={20} color="#EF4444" strokeWidth={2} />
          <Text style={styles.statValue}>1</Text>
          <Text style={styles.statLabel}>Denied</Text>
        </View>
      </View>

      <ScrollView style={styles.disputesList} showsVerticalScrollIndicator={false}>
        <View style={styles.disputesContent}>
          <View style={styles.infoBox}>
            <AlertCircle size={18} color="#3B82F6" strokeWidth={2} />
            <Text style={styles.infoText}>
              Disputes are reviewed by our admin team within 24-48 hours
            </Text>
          </View>

          {DISPUTES_DATA.map((dispute) => (
            <TouchableOpacity key={dispute.id} style={styles.disputeCard}>
              <View style={styles.disputeHeader}>
                <View style={styles.disputeLeft}>
                  <View style={styles.iconContainer}>{getStatusIcon(dispute.status)}</View>
                  <View style={styles.disputeInfo}>
                    <Text style={styles.projectTitle} numberOfLines={1}>
                      {dispute.projectTitle}
                    </Text>
                    <Text style={styles.freelancerName}>vs {dispute.freelancerName}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#6B7280" strokeWidth={2} />
              </View>

              <Text style={styles.reason} numberOfLines={2}>
                {dispute.reason}
              </Text>

              <View style={styles.disputeFooter}>
                <View style={styles.metaInfo}>
                  <Text style={styles.amount}>{dispute.amount}</Text>
                  <Text style={styles.date}>{dispute.createdDate}</Text>
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusBackground(dispute.status) },
                  ]}
                >
                  <Text style={[styles.statusText, { color: getStatusColor(dispute.status) }]}>
                    {dispute.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomAction}>
        <TouchableOpacity style={styles.createButton}>
          <AlertCircle size={20} color="#FFFFFF" strokeWidth={2} />
          <Text style={styles.createButtonText}>Raise New Dispute</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles remain the same as your previous code
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  statsRow: { flexDirection: 'row', padding: 20, gap: 12 },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1F2937', marginTop: 8, marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500' },
  disputesList: { flex: 1 },
  disputesContent: { padding: 20, paddingTop: 0 },
  infoBox: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#EFF6FF', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#BFDBFE' },
  infoText: { flex: 1, fontSize: 13, color: '#1F2937', lineHeight: 18 },
  disputeCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  disputeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  disputeLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  disputeInfo: { flex: 1 },
  projectTitle: { fontSize: 16, fontWeight: '600', color: '#1F2937', marginBottom: 4 },
  freelancerName: { fontSize: 13, color: '#6B7280' },
  reason: { fontSize: 14, color: '#6B7280', lineHeight: 20, marginBottom: 12 },
  disputeFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  metaInfo: { flex: 1 },
  amount: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 2 },
  date: { fontSize: 12, color: '#6B7280' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  statusText: { fontSize: 12, fontWeight: '600' },
  bottomAction: { padding: 20, backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  createButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#EF4444', paddingVertical: 16, borderRadius: 12 },
  createButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
