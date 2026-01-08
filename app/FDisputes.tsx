import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Clock, CheckCircle2, XCircle, ChevronRight, ArrowLeft, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

interface Dispute {
  id: string;
  clientName: string;
  projectTitle: string;
  reason: string;
  status: 'Pending' | 'Resolved' | 'Denied';
  createdDate: string;
  amount: string;
}

const DISPUTES_DATA: Dispute[] = [
  { id: '1', clientName: 'Alice Brown', projectTitle: 'Landing Page Design', reason: 'Late payment', status: 'Pending', createdDate: 'Dec 12, 2025', amount: '$500' },
  { id: '2', clientName: 'Mark Lee', projectTitle: 'React Native App', reason: 'Scope change without notice', status: 'Resolved', createdDate: 'Dec 8, 2025', amount: '$1,200' },
  { id: '3', clientName: 'Jane Smith', projectTitle: 'Logo Design', reason: 'Feedback not applied', status: 'Denied', createdDate: 'Dec 5, 2025', amount: '$300' },
];

export default function FDisputes() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Resolved' | 'Denied'>('All');

  const statusColors = {
    Pending: '#F59E0B',
    Resolved: '#10B981',
    Denied: '#EF4444',
  };

  const statusBackground = {
    Pending: '#FEF3C7',
    Resolved: '#D1FAE5',
    Denied: '#FEE2E2',
  };

  const statusIcons = {
    Pending: <Clock size={22} color="#F59E0B" strokeWidth={2} />,
    Resolved: <CheckCircle2 size={22} color="#10B981" strokeWidth={2} />,
    Denied: <XCircle size={22} color="#EF4444" strokeWidth={2} />,
  };

  const filteredDisputes = activeFilter === 'All' ? DISPUTES_DATA : DISPUTES_DATA.filter(d => d.status === activeFilter);

  const counts = {
    All: DISPUTES_DATA.length,
    Pending: DISPUTES_DATA.filter(d => d.status === 'Pending').length,
    Resolved: DISPUTES_DATA.filter(d => d.status === 'Resolved').length,
    Denied: DISPUTES_DATA.filter(d => d.status === 'Denied').length,
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color="#1F2937" strokeWidth={2} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>My Disputes</Text>

        {/* New Dispute Button */}
        <TouchableOpacity
          style={styles.newButton}
          onPress={() => router.push('/FNewDispute')}
        >
          <Plus size={18} color="#fff" strokeWidth={2} />
          <Text style={styles.newButtonText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['All', 'Pending', 'Resolved', 'Denied'].map(tab => {
          const isActive = activeFilter === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => setActiveFilter(tab as any)}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {tab} ({counts[tab as keyof typeof counts]})
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Dispute List */}
      <ScrollView style={styles.disputesList} showsVerticalScrollIndicator={false}>
        {filteredDisputes.length === 0 ? (
          <Text style={styles.noDisputes}>No disputes found.</Text>
        ) : (
          filteredDisputes.map(dispute => (
            <TouchableOpacity
              key={dispute.id}
              style={[styles.disputeCard, { borderLeftColor: statusColors[dispute.status], borderLeftWidth: 5 }]}
              activeOpacity={0.8}
              onPress={() =>
                router.push({ pathname: '/FDisputeDetail', params: { dispute: JSON.stringify(dispute) } })
              }
            >
              <View style={styles.disputeHeader}>
                <View style={styles.disputeLeft}>
                  <View style={styles.iconContainer}>
                    {statusIcons[dispute.status]}
                  </View>
                  <View style={{ flexShrink: 1 }}>
                    <Text style={styles.projectTitle}>{dispute.projectTitle}</Text>
                    <Text style={styles.clientName}>vs {dispute.clientName}</Text>
                  </View>
                </View>
                <ChevronRight size={22} color="#6B7280" strokeWidth={2} />
              </View>

              <View style={styles.row}>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Amount</Text>
                  <Text style={styles.value}>{dispute.amount}</Text>
                </View>
                <View style={styles.rowItem}>
                  <Text style={styles.label}>Created</Text>
                  <Text style={styles.value}>{dispute.createdDate}</Text>
                </View>
              </View>

              <Text style={styles.reason}>{dispute.reason}</Text>

              <View style={[styles.statusBadge, { backgroundColor: statusBackground[dispute.status] }]}>
                <Text style={[styles.statusText, { color: statusColors[dispute.status] }]}>{dispute.status}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}

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
  backButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1F2937' },
  newButton: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#3B82F6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  newButtonText: { color: '#fff', fontWeight: '600', fontSize: 14 },

  // Tabs
  tabs: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 16, paddingHorizontal: 10 },
  tab: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, backgroundColor: '#E5E7EB' },
  tabActive: { backgroundColor: '#3B82F6' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#374151' },
  tabTextActive: { color: '#FFFFFF' },

  // Dispute cards
  disputesList: { flex: 1, paddingHorizontal: 20 },
  noDisputes: { textAlign: 'center', color: '#6B7280', marginTop: 40, fontSize: 16, fontWeight: '500' },
  disputeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 4,
  },
  disputeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  disputeLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  iconContainer: { width: 46, height: 46, borderRadius: 23, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' },
  projectTitle: { fontSize: 17, fontWeight: '700', color: '#1F2937' },
  clientName: { fontSize: 13, color: '#6B7280' },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  rowItem: { flex: 1 },
  label: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 2 },
  value: { fontSize: 14, fontWeight: '500', color: '#111827' },
  reason: { fontSize: 14, color: '#6B7280', marginBottom: 10 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: 'flex-start' },
  statusText: { fontSize: 12, fontWeight: '600' },
});
