// ProfileScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Edit, Star, Briefcase, DollarSign } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Redirect } from 'expo-router';
import { useRouter } from 'expo-router';



export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    router.replace("/login");
    return null;
  }

  const stats = [
    { icon: <Star size={20} color="#F59E0B" />, label: 'Email', value: user.email },
    { icon: <Briefcase size={20} color="#3B82F6" />, label: 'Role', value: user.role },
    { icon: <DollarSign size={20} color="#10B981" />, label: 'Balance', value: `$${user.balance ?? 0}` },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.settingsButton}>
            <Settings size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg' }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Edit size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userTitle}>{user.title || user.role}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              {stat.icon}
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* About / Bio (always show, even if empty) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            {user.bio || 'No bio available.'}
          </Text>
        </View>

        {/* Skills */}
        {user.skills && user.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <View style={styles.skillsContainer}>
              {user.skills.map((skill, idx) => (
                <View key={idx} style={styles.skillTag}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();       // clear storage and set user to null
            router.replace('/login'); // force navigation to login
          }}
        >
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { flexDirection: 'row', justifyContent: 'flex-end', padding: 16 },
  settingsButton: { padding: 8 },
  profileSection: { alignItems: 'center', paddingHorizontal: 20, paddingBottom: 24, backgroundColor: '#fff', marginBottom: 16 },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editAvatarButton: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#3B82F6', borderRadius: 16, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: '#fff' },
  userName: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 4 },
  userTitle: { fontSize: 16, color: '#6B7280', marginBottom: 4 },
  statsSection: { flexDirection: 'row', backgroundColor: '#fff', paddingVertical: 20, marginBottom: 16 },
  statItem: { flex: 1, alignItems: 'center', gap: 4 },
  statValue: { fontSize: 16, fontWeight: 'bold', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280' },
  section: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  aboutText: { fontSize: 16, color: '#6B7280', lineHeight: 24 },
  skillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillTag: { backgroundColor: '#EFF6FF', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  skillText: { fontSize: 14, color: '#3B82F6', fontWeight: '500' },
  logoutButton: { backgroundColor: '#EF4444', paddingVertical: 12, marginHorizontal: 20, borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  logoutButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});
