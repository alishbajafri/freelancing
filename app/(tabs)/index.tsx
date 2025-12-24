//hompe page 
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { storageGet, storageSet } from "@/utils/storage";


import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Wallet, TrendingUp, Star } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useWallet } from '@/contexts/WalletContext';
import ProjectCard from '@/components/ProjectCard';
import StatsCard from '@/components/StatsCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { balance } = useWallet();
  const router = useRouter();

  const [recentProjects, setRecentProjects] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkRole = async () => {
      const storedUser = await storageGet("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);

        if (user.role?.toLowerCase() !== "freelancer") {
          router.replace("/client");

        }
      }
    };

    checkRole();
  }, []);


  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const [projectsRes, earningsRes, reviewsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/projects`),
          axios.get(`${API_BASE_URL}/earnings`),
          axios.get(`${API_BASE_URL}/reviews`),
        ]);

        const userSkills = (user.skills || []).map(s => s.trim().toLowerCase());

        const availableProjects = projectsRes.data.filter((project: any) => {
          if (!project.status || !project.skills) return false;
          if (project.status.toLowerCase() !== 'available') return false;

          const projectSkills = project.skills.map((s: string) => s.trim().toLowerCase());

          // Return true if any skill matches exactly
          return projectSkills.some(ps => userSkills.includes(ps));
        });

        setRecentProjects(availableProjects);

        setEarnings(earningsRes.data);

        // Calculate review ratings
        const reviewsWithRating = reviewsRes.data.map((r: any) => {
          const milestoneRatings = (r.milestones || []).map((m: any) =>
            Number(m.rating) || 0
          );
          const extraRatings = [
            Number(r.communication) || 0,
            Number(r.quality) || 0,
            Number(r.punctuality) || 0,
          ];
          const allRatings = [...milestoneRatings, ...extraRatings];
          const averageRating =
            allRatings.length > 0
              ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
              : '0';
          return { ...r, rating: averageRating };
        });

        setReviews(reviewsWithRating);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // Calculate total earnings
  const totalEarnings = earnings.reduce((acc, e) => acc + Number(e.amount), 0);

  // Calculate average rating for user
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + Number(r.rating), 0) / reviews.length
        ).toFixed(1)
      : user?.rating?.toFixed(1) || '0';

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning,</Text>
            <Text style={styles.userName}>{user?.name || 'Freelancer'}</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.walletButton}
              onPress={() => router.push('/wallet')}
            >
              <Wallet size={20} color="#3B82F6" />
              <Text style={styles.walletText}>${balance}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.notificationButton}>
              <Bell size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <StatsCard
            icon={<TrendingUp size={24} color="#10B981" />}
            title="Earnings"
            value={`$${totalEarnings}`}
            subtitle="Total Earnings"
            color="#10B981"
            onPress={() => router.push('/earnings')}
          />

          <StatsCard
            icon={<Star size={24} color="#F59E0B" />}
            title="Rating"
            value={avgRating}
            subtitle="Average"
            color="#F59E0B"
            onPress={() => router.push('/reviews')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={() => router.push('/find-projects')}
            >
              <Text style={styles.actionButtonText}>Find Projects</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, styles.actionButtonSecondary]}
              onPress={() => router.push('/profile-view')}
            >
              <Text
                style={[
                  styles.actionButtonText,
                  styles.actionButtonSecondaryText,
                ]}
              >
                Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recommended Projects */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recommended Projects</Text>

          {loading && (
            <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
          )}

          {error && (
            <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text>
          )}

          {!loading && !error && recentProjects.length === 0 && (
            <Text style={{ color: '#6B7280', marginBottom: 12 }}>
              No projects found.
            </Text>
          )}

          {!loading &&
            recentProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  greeting: { fontSize: 16, color: '#6B7280' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  walletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  walletText: { fontSize: 14, fontWeight: '600', color: '#3B82F6' },
  notificationButton: { padding: 8 },
  statsContainer: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 24 },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827', marginBottom: 16 },
  quickActions: { flexDirection: 'row', gap: 12 },
  actionButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonSecondary: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D1D5DB' },
  actionButtonText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
  actionButtonSecondaryText: { color: '#374151' },
});
