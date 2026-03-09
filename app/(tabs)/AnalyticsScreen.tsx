import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { formatCurrency, MOCK_ANALYTICS, MOCK_ONGOING_PROJECTS } from '../../constants/mockData';
import { useTheme } from '../../context/ThemeContext';

// --- SKELETON COMPONENT ---
const SkeletonItem = ({ style, color }: { style: any, color: string }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [opacity]);

  return <Animated.View style={[{ opacity, backgroundColor: color }, style]} />;
};

export default function AnalyticsScreen() {
  const { theme, isDark, setMode } = useTheme();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(MOCK_ANALYTICS);
  const [ongoingProjects, setOngoingProjects] = useState(MOCK_ONGOING_PROJECTS);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  type IconName = React.ComponentProps<typeof Ionicons>['name'];

  const getTrendColor = (trend: string, baseColor: string) => {
    if (trend.includes('-')) return '#ef4444';
    if (trend === '+0%') return '#6b7280';
    return baseColor;
  };

  const interactionsData: {
    id: number; title: string; value: string; icon: IconName;
    color: string; trend: string; description: string;
  }[] = [
      { id: 1, title: 'Views', value: stats.totalViews.toString(), icon: 'eye-outline', color: '#4379d1', trend: stats.viewsTrend, description: 'Profile visits' },
      { id: 2, title: 'Rating', value: stats.avgRating, icon: 'star-outline', color: '#10b981', trend: stats.ratingTrend, description: 'Average Score' },
      { id: 3, title: 'Clicks', value: stats.totalClicks.toString(), icon: 'hand-left-outline', color: '#f59e0b', trend: stats.clicksTrend, description: 'Service Interest' },
      { id: 4, title: 'Active Jobs', value: stats.activeProjectsCount.toString(), icon: 'cart-outline', color: '#ef4444', trend: stats.ordersTrend, description: 'In Progress' },
    ];

  // SKELETON LOADER
  if (loading && !refreshing) {
    const skeletonColor = isDark ? '#333' : '#e1e9ee';
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {/* Header even during loading */}
        <View style={[styles.dashboardHeader, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
          <View>
            <Text style={[styles.headerGreeting, { color: theme.textSecondary }]}>Creator Dashboard</Text>
            <Text style={[styles.headerName, { color: theme.text }]}>Mock User 🎨</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable onPress={() => setMode(isDark ? 'light' : 'dark')} style={styles.headerButton}>
              <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.text} />
            </Pressable>
            <Pressable onPress={() => router.push('/notifications' as never)} style={styles.headerButton}>
              <Ionicons name="notifications-outline" size={20} color={theme.text} />
            </Pressable>
            <Pressable style={styles.avatarButton} onPress={() => router.push('/profile' as never)}>
              <Image source={{ uri: 'https://picsum.photos/seed/profile/150/150' }} style={styles.avatarImage} />
            </Pressable>
          </View>
        </View>
        <View style={styles.topRow}>
          <View style={[styles.card, styles.earningsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
              <SkeletonItem color={skeletonColor} style={{ width: 100, height: 16, borderRadius: 4 }} />
              <SkeletonItem color={skeletonColor} style={{ width: 24, height: 24, borderRadius: 12 }} />
            </View>
            <SkeletonItem color={skeletonColor} style={{ width: 120, height: 40, borderRadius: 8, marginBottom: 20 }} />
            <SkeletonItem color={skeletonColor} style={{ width: '100%', height: 16, borderRadius: 4 }} />
          </View>
          <View style={styles.statsContainer}>
            {[1, 2].map((i) => (
              <View key={i} style={[styles.card, styles.statsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <SkeletonItem color={skeletonColor} style={{ width: 40, height: 40, borderRadius: 12, marginBottom: 12 }} />
                <SkeletonItem color={skeletonColor} style={{ width: 60, height: 24, borderRadius: 4, marginBottom: 4 }} />
                <SkeletonItem color={skeletonColor} style={{ width: 80, height: 12, borderRadius: 4 }} />
              </View>
            ))}
          </View>
        </View>
        <View style={{ marginBottom: 24 }}>
          <SkeletonItem color={skeletonColor} style={{ width: 150, height: 24, borderRadius: 4, marginBottom: 20 }} />
          <View style={styles.interactionsGrid}>
            {[1, 2, 3, 4].map((i) => (
              <View key={i} style={[styles.fancyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <SkeletonItem color={skeletonColor} style={{ width: 48, height: 48, borderRadius: 24, marginBottom: 16 }} />
                <SkeletonItem color={skeletonColor} style={{ width: 80, height: 28, borderRadius: 4, marginBottom: 8 }} />
                <SkeletonItem color={skeletonColor} style={{ width: 60, height: 16, borderRadius: 4 }} />
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
    >
      {/* Dashboard Header */}
      <View style={[styles.dashboardHeader, { backgroundColor: theme.card, borderBottomColor: theme.cardBorder }]}>
        <View>
          <Text style={[styles.headerGreeting, { color: theme.textSecondary }]}>Creator Dashboard</Text>
          <Text style={[styles.headerName, { color: theme.text }]}>Mock User 🎨</Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={() => setMode(isDark ? 'light' : 'dark')} style={styles.headerButton}>
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={20} color={theme.text} />
          </Pressable>
          <Pressable onPress={() => router.push('/notifications' as never)} style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={20} color={theme.text} />
          </Pressable>
          <Pressable style={styles.avatarButton} onPress={() => router.push('/profile' as never)}>
            <Image source={{ uri: 'https://picsum.photos/seed/profile/150/150' }} style={styles.avatarImage} />
          </Pressable>
        </View>
      </View>

      {/* Top Row - Earnings and Stats */}
      <View style={styles.topRow}>
        <View style={[styles.card, styles.earningsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
          <View style={styles.earningsHeader}>
            <Text style={[styles.earningsTitle, { color: theme.text }]}>Today's Earnings</Text>
            <View style={[styles.trendBadge, { backgroundColor: `${getTrendColor(stats.earningsTrend, '#10b981')}15` }]}>
              <Ionicons name={stats.earningsTrend.includes('-') ? 'trending-down' : 'trending-up'} size={12} color={getTrendColor(stats.earningsTrend, '#10b981')} />
              <Text style={[styles.trendText, { color: getTrendColor(stats.earningsTrend, '#10b981') }]}>{stats.earningsTrend}</Text>
            </View>
          </View>
          <Text style={[styles.earningsAmount, { color: theme.text }]}>{formatCurrency(stats.todayEarnings)}</Text>
          <View style={styles.earningsComparisonContainer}>
            <View style={styles.compRow}>
              <Text style={[styles.compLabel, { color: theme.textSecondary }]}>Yesterday</Text>
              <Text style={[styles.compValue, { color: theme.textSecondary }]}>{formatCurrency(stats.yesterdayEarnings)}</Text>
            </View>
            <View style={styles.compRow}>
              <Text style={[styles.compLabel, { color: theme.textSecondary }]}>Last Month</Text>
              <Text style={[styles.compValue, { color: theme.textSecondary }]}>{formatCurrency(stats.lastMonthEarnings)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          <View style={[styles.card, styles.statsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(67, 121, 209, 0.1)' }]}>
              <Ionicons name="time-outline" size={24} color="#4379d1" />
            </View>
            <Text style={[styles.statValue, { color: theme.text }]}>~1 hr</Text>
            <Text style={[styles.fancyDescription, { color: theme.textSecondary }]}>Avg Response</Text>
          </View>
          <View style={[styles.card, styles.statsCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
            <View style={[styles.iconContainer, { backgroundColor: 'rgba(251, 191, 36, 0.1)' }]}>
              <Ionicons name="star" size={24} color="#fbbf24" />
            </View>
            <View style={styles.ratingContainer}>
              <Text style={[styles.ratingValue, { color: theme.text }]}>{stats.avgRating}</Text>
              <Text style={[styles.ratingMax, { color: theme.textSecondary }]}>/5.0</Text>
            </View>
            <Text style={[styles.fancyDescription, { color: theme.textSecondary }]}>Rating</Text>
          </View>
        </View>
      </View>

      {/* Interactions Section */}
      <View style={styles.interactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Interactions</Text>
        </View>
        <View style={styles.interactionsGrid}>
          {interactionsData.map((item) => {
            const trendColor = getTrendColor(item.trend, item.color);
            return (
              <View key={item.id} style={[styles.fancyCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                <View style={styles.cardHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
                    <Ionicons name={item.icon} size={24} color={item.color} />
                  </View>
                  <View style={[styles.trendBadge, { backgroundColor: `${trendColor}15` }]}>
                    <Ionicons name={item.trend.includes('-') ? 'trending-down' : 'trending-up'} size={12} color={trendColor} />
                    <Text style={[styles.trendText, { color: trendColor }]}>{item.trend}</Text>
                  </View>
                </View>
                <View style={styles.cardContent}>
                  <Text style={[styles.fancyValue, { color: theme.text }]}>{item.value}</Text>
                  <Text style={[styles.fancyTitle, { color: theme.text }]}>{item.title}</Text>
                  <Text style={[styles.fancyDescription, { color: theme.textSecondary }]}>{item.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Ongoing Projects */}
      <View style={styles.ongoingProjectSection}>
        <View style={styles.projectHeader}>
          <Text style={[styles.ongoingProjectTitle, { color: theme.text }]}>Ongoing Projects</Text>
          <Pressable style={styles.seeMoreButton} onPress={() => router.push('/order' as never)}>
            <Text style={[styles.seeMoreText, { color: theme.tint }]}>View All</Text>
            <Ionicons name="chevron-forward" size={16} color={theme.tint} />
          </Pressable>
        </View>

        {ongoingProjects.length === 0 ? (
          <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder, padding: 30, alignItems: 'center' }]}>
            <Ionicons name="document-text-outline" size={40} color={theme.textSecondary} style={{ marginBottom: 10, opacity: 0.5 }} />
            <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>No active projects right now.</Text>
          </View>
        ) : (
          ongoingProjects.map((project) => (
            <Pressable
              key={project.id}
              style={[styles.card, styles.projectCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, marginBottom: 12 }]}
            >
              <View style={styles.projectContent}>
                <View style={styles.imageContainer}>
                  {project.image_url ? (
                    <Image source={{ uri: project.image_url }} style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: theme.cardBorder }} />
                  ) : (
                    <View style={styles.imagePlaceholder}>
                      <Text style={styles.placeholderText}>Img</Text>
                    </View>
                  )}
                </View>
                <View style={styles.projectDetails}>
                  <View style={styles.projectHeaderRow}>
                    <Text numberOfLines={1} style={[styles.projectTitle, { color: theme.text }]}>{project.service_title}</Text>
                    <Text style={[styles.projectPrice, { color: theme.text }]}>{project.price}</Text>
                  </View>
                  <Text style={[styles.clientName, { color: theme.textSecondary }]}>{project.client_name}</Text>
                  <View style={styles.projectMeta}>
                    <View style={styles.tagsContainer}>
                      <View style={[styles.statusBadge, { backgroundColor: theme.cardBorder }]}>
                        <Text style={[styles.statusText, { color: theme.text, textTransform: 'capitalize' }]}>{project.status.replace('_', ' ')}</Text>
                      </View>
                      <View style={[styles.daysBadge, { backgroundColor: 'rgba(67, 121, 209, 0.1)' }]}>
                        <Ionicons name="calendar-outline" size={12} color="#4379d1" />
                        <Text style={[styles.daysText, { color: '#4379d1' }]}>Active</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </Pressable>
          ))
        )}
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 0 },
  dashboardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingTop: 60, marginHorizontal: -20, paddingHorizontal: 20, marginBottom: 16, borderBottomWidth: 1 },
  headerGreeting: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  headerName: { fontSize: 22, fontWeight: '700' },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerButton: { padding: 8, borderRadius: 12 },
  avatarButton: { marginLeft: 4 },
  avatarImage: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e2e8f0' },
  bottomSpacer: { height: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 16 },
  statsContainer: { flex: 1, gap: 12 },
  card: { borderRadius: 16, padding: 20, borderWidth: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 5 },
  earningsCard: { flex: 1.4, justifyContent: 'space-between' },
  statsCard: { height: 120, justifyContent: 'space-between' },
  earningsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  earningsTitle: { fontSize: 14, fontWeight: '600', opacity: 0.8 },
  earningsAmount: { fontSize: 32, fontWeight: '700', marginBottom: 8 },
  earningsComparisonContainer: { gap: 2 },
  compRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  compLabel: { fontSize: 12, fontWeight: '400' },
  compValue: { fontSize: 14, fontWeight: '600' },
  iconContainer: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  statValue: { fontSize: 18, fontWeight: '700', marginBottom: 4 },
  ratingContainer: { flexDirection: 'row', alignItems: 'baseline' },
  ratingValue: { fontSize: 18, fontWeight: '700' },
  ratingMax: { fontSize: 14, fontWeight: '600', opacity: 0.7 },
  interactionsSection: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '700' },
  interactionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  fancyCard: { width: '48%', borderRadius: 20, padding: 16, borderWidth: 1, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 6 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  iconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  trendBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, gap: 4 },
  trendText: { fontSize: 11, fontWeight: '700' },
  cardContent: { gap: 2 },
  fancyValue: { fontSize: 28, fontWeight: '800' },
  fancyTitle: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  fancyDescription: { fontSize: 12, fontWeight: '500', opacity: 0.7 },
  ongoingProjectSection: { marginBottom: 24 },
  projectHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  ongoingProjectTitle: { fontSize: 20, fontWeight: '700' },
  seeMoreButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeMoreText: { fontSize: 14, fontWeight: '600' },
  projectCard: {},
  projectContent: { flexDirection: 'row' },
  imageContainer: { marginRight: 16 },
  imagePlaceholder: { width: 80, height: 80, borderRadius: 12, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#94a3b8', fontSize: 12 },
  projectDetails: { flex: 1, justifyContent: 'space-between' },
  projectHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  projectTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  projectPrice: { fontSize: 14, fontWeight: '700' },
  clientName: { fontSize: 13, marginTop: 4 },
  projectMeta: { marginTop: 8 },
  tagsContainer: { flexDirection: 'row', gap: 8 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '500' },
  daysBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  daysText: { fontSize: 12, fontWeight: '500' },
});