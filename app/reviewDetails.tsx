import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { ArrowLeft, Star } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReviewDetails() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [review, setReview] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/reviews/${id}`)
      .then(res => setReview(res.data))
      .catch(() => setReview(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!review) return;
    axios.get(`${API_BASE_URL}/projects`)
      .then(res => {
        const proj = res.data.find((p: any) => 
          p.title === review.projectTitle && p.status === 'completed'
        );
        setProject(proj);
      })
      .catch(err => console.log(err));
  }, [review]);

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} size="large" />;
  if (!review) return <Text style={{ textAlign: 'center', marginTop: 20 }}>Review not found</Text>;
  if (!project) return <Text style={{ textAlign: 'center', marginTop: 20 }}>This review is not for a completed project.</Text>;

  // Use milestone ratings from review instead of project
  const milestoneRatings = (review?.milestones || []).map((m: any) => m.rating || 0);
  const extraRatings = [review?.communication || 0, review?.quality || 0, review?.punctuality || 0];
  const allRatings = [...milestoneRatings, ...extraRatings];
  const averageRating = allRatings.length > 0
    ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
    : '0';

  const renderStars = (count: number) => (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(Math.round(count))].map((_, i) => (
        <Star key={i} size={16} color="#F59E0B" fill="#F59E0B" />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{review.projectTitle}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Overall Rating */}
        <View style={styles.overallBox}>
          <View style={styles.starRow}>{renderStars(Number(averageRating))}</View>
          <Text style={styles.overallText}>{averageRating} / 5 Overall Rating</Text>
        </View>

        {/* Sub Ratings */}
        <View style={styles.subRatings}>
          <View style={styles.subRatingRow}>
            <Text style={styles.subLabel}>Communication</Text>
            {renderStars(review.communication)}
          </View>
          <View style={styles.subRatingRow}>
            <Text style={styles.subLabel}>Quality of Work</Text>
            {renderStars(review.quality)}
          </View>
          <View style={styles.subRatingRow}>
            <Text style={styles.subLabel}>Punctuality</Text>
            {renderStars(review.punctuality)}
          </View>
        </View>

        <Text style={styles.comment}>{review.comment}</Text>
        <Text style={styles.duration}>⏱ Duration: {review.duration}</Text>

        {/* Milestones from review */}
        <Text style={styles.sectionTitle}>Completed Milestones</Text>
        {(review?.milestones || []).map((m: any, idx: number) => (
          <View key={idx} style={styles.milestone}>
            <View style={styles.milestoneHeader}>
              <Text style={styles.milestoneTitle}>{m.title}</Text>
              {renderStars(m.rating || 0)}
            </View>
            {/* Optional: get duration/details from project if needed */}
            {project?.milestones?.find((pm: any) => pm.title === m.title) && (
              <>
                <Text style={styles.milestoneDuration}>
                  {project.milestones.find((pm: any) => pm.title === m.title).duration}
                </Text>
                <Text style={styles.milestoneDetails}>
                  {project.milestones.find((pm: any) => pm.title === m.title).details}
                </Text>
              </>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#111827' },
  content: { padding: 20 },

  overallBox: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  starRow: { flexDirection: 'row', marginBottom: 4 },
  overallText: { fontWeight: 'bold', color: '#111827', fontSize: 16 },

  subRatings: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    marginBottom: 20,
  },
  subRatingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  subLabel: { fontWeight: '500', color: '#374151', fontSize: 15 },

  comment: { fontSize: 15, color: '#374151', marginBottom: 12, textAlign: 'center' },
  duration: { color: '#6B7280', marginBottom: 20, textAlign: 'center' },

  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 10 },
  milestone: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  milestoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  milestoneTitle: { fontWeight: 'bold', color: '#111827', fontSize: 15 },
  milestoneDuration: { color: '#6B7280', marginBottom: 4 },
  milestoneDetails: { color: '#374151', fontSize: 14 },
});
