import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Pressable,
  TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { API_BASE_URL } from '@/config';
import { ArrowLeft, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function ReviewsScreen() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewsRes, projectsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/reviews`),
          axios.get(`${API_BASE_URL}/projects`)
        ]);

        const completedProjects = projectsRes.data.filter((p: any) => p.status === 'completed');
        setProjects(completedProjects);

        const completedTitles = completedProjects.map((p: any) => p.title);

        const filteredReviews = reviewsRes.data.filter((r: any) =>
          completedTitles.includes(r.projectTitle)
        );

        // Calculate overall rating for each review
        const reviewsWithRating = filteredReviews.map((r: any) => {
          const project = completedProjects.find((p: any) => p.title === r.projectTitle);

          // Get ratings from milestones (from review.milestones if available)
          const milestoneRatings = (r.milestones || []).map((m: any) => m.rating || 0);

          // Include communication, quality, punctuality
          const extraRatings = [r.communication || 0, r.quality || 0, r.punctuality || 0];
          const allRatings = [...milestoneRatings, ...extraRatings];

          const averageRating = allRatings.length > 0
            ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1)
            : '0';

          return { ...r, rating: averageRating };
        });

        setReviews(reviewsWithRating);
      } catch (err) {
        console.error(err);
        setError('Failed to load reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const renderStars = (count: number) => (
    <View style={{ flexDirection: 'row' }}>
      {[...Array(Math.round(count))].map((_, i) => (
        <Star key={i} size={14} color="#F59E0B" fill="#F59E0B" />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reviews</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {loading && <ActivityIndicator size="large" color="#6B7280" />}
        {error && <Text style={styles.error}>{error}</Text>}
        {!loading && !error && reviews.length === 0 && (
          <Text style={styles.noReviews}>No reviews for completed projects yet.</Text>
        )}

        {!loading && reviews.map((review: any) => (
          <Pressable
            key={review.id}
            style={({ pressed }) => [
              styles.reviewCard,
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
            ]}
            onPress={() => router.push({ pathname: '/reviewDetails', params: { id: review.id } })}
          >
            <View style={styles.cardTopRow}>
              <View style={styles.ratingPill}>
                {renderStars(Number(review.rating))}
                <Text style={styles.ratingText}>{review.rating} / 5</Text>
              </View>
              <Text style={styles.projectTitle}>{review.projectTitle}</Text>
            </View>

            <Text numberOfLines={2} style={styles.comment}>{review.comment}</Text>

            <View style={styles.cardFooter}>
              <Text style={styles.userName}>By {review.userName}</Text>
              <Text style={styles.duration}>{review.duration}</Text>
            </View>
          </Pressable>
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#111827' },
  scroll: { padding: 20 },
  error: { color: 'red', marginTop: 16 },
  noReviews: {
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
  },
  reviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  ratingText: {
    marginLeft: 4,
    fontWeight: '600',
    color: '#F59E0B',
    fontSize: 13,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    textAlign: 'right',
    flexShrink: 1,
    marginLeft: 12,
  },
  comment: {
    color: '#374151',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 8,
  },
  userName: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  duration: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
});
