import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_CREATORS, MOCK_SERVICES } from '../../constants/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function SmartMatchScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [phase, setPhase] = useState<'loading' | 'result'>('loading');
    const spinAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const matchedCreator = MOCK_CREATORS[0];
    const matchedService = MOCK_SERVICES[0];

    useEffect(() => {
        // Spin animation
        Animated.loop(
            Animated.timing(spinAnim, { toValue: 1, duration: 1500, useNativeDriver: true })
        ).start();

        // Show result after delay
        const timer = setTimeout(() => {
            setPhase('result');
            Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    const spin = spinAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

    if (phase === 'loading') {
        return (
            <View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </Pressable>
                <View style={styles.loadingCenter}>
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                        <View style={[styles.sparkleCircle, { borderColor: theme.tint }]}>
                            <Ionicons name="sparkles" size={40} color={theme.tint} />
                        </View>
                    </Animated.View>
                    <Text style={[styles.loadingTitle, { color: theme.text }]}>Finding your perfect match...</Text>
                    <Text style={[styles.loadingSubtitle, { color: theme.textSecondary }]}>
                        Analyzing your needs and matching with the best creators
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <Animated.View style={[styles.container, { backgroundColor: theme.background, paddingTop: insets.top, opacity: fadeAnim }]}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
                <Ionicons name="arrow-back" size={24} color={theme.text} />
            </Pressable>

            <View style={styles.resultCenter}>
                <View style={[styles.matchBadge, { backgroundColor: theme.tint + '15' }]}>
                    <Ionicons name="sparkles" size={20} color={theme.tint} />
                    <Text style={[styles.matchBadgeText, { color: theme.tint }]}>Smart Match Found!</Text>
                </View>

                {/* Creator Card */}
                <View style={[styles.creatorCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                    {matchedCreator.avatar ? (
                        <Image source={{ uri: matchedCreator.avatar }} style={styles.creatorAvatar} />
                    ) : (
                        <View style={[styles.creatorAvatar, { backgroundColor: theme.tint, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 28 }}>{matchedCreator.name.charAt(0)}</Text>
                        </View>
                    )}
                    <Text style={[styles.creatorName, { color: theme.text }]}>{matchedCreator.name}</Text>
                    <Text style={[styles.creatorRole, { color: theme.textSecondary }]}>{matchedCreator.role}</Text>
                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#fbbf24" />
                        <Text style={styles.ratingText}>{matchedCreator.rating}</Text>
                        <Text style={[styles.reviewText, { color: theme.textSecondary }]}>({matchedCreator.reviewCount} reviews)</Text>
                    </View>
                </View>

                {/* Suggested Service */}
                <View style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                    <Text style={[styles.serviceLabel, { color: theme.textSecondary }]}>Recommended Service</Text>
                    <Text style={[styles.serviceTitle, { color: theme.text }]}>{matchedService.title}</Text>
                    <Text style={[styles.servicePrice, { color: theme.tint }]}>₱{matchedService.price}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                    <Pressable style={[styles.primaryBtn, { backgroundColor: theme.tint }]} onPress={() => router.push(`/chat/user-1` as never)}>
                        <Ionicons name="chatbubble-outline" size={20} color="#fff" />
                        <Text style={styles.primaryBtnText}>Message Creator</Text>
                    </Pressable>
                    <Pressable style={[styles.secondaryBtn, { borderColor: theme.cardBorder, borderWidth: 1 }]} onPress={() => router.back()}>
                        <Text style={[styles.secondaryBtnText, { color: theme.text }]}>Try Again</Text>
                    </Pressable>
                </View>
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, paddingHorizontal: 24 },
    backBtn: { padding: 12, alignSelf: 'flex-start', borderRadius: 12 },
    loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 80 },
    sparkleCircle: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, justifyContent: 'center', alignItems: 'center', marginBottom: 32 },
    loadingTitle: { fontSize: 22, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
    loadingSubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22, paddingHorizontal: 20 },
    resultCenter: { flex: 1, alignItems: 'center', paddingTop: 20 },
    matchBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, gap: 8, marginBottom: 24 },
    matchBadgeText: { fontSize: 16, fontWeight: '600' },
    creatorCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center', marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 4 },
    creatorAvatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 16 },
    creatorName: { fontSize: 22, fontWeight: '700', marginBottom: 4 },
    creatorRole: { fontSize: 16, marginBottom: 12 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    ratingText: { fontSize: 16, fontWeight: '700', color: '#f59e0b' },
    reviewText: { fontSize: 14 },
    serviceCard: { width: '100%', borderRadius: 16, padding: 20, marginBottom: 24 },
    serviceLabel: { fontSize: 13, fontWeight: '500', marginBottom: 6 },
    serviceTitle: { fontSize: 17, fontWeight: '600', marginBottom: 8 },
    servicePrice: { fontSize: 18, fontWeight: '700' },
    actions: { width: '100%', gap: 12 },
    primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, borderRadius: 16, gap: 8 },
    primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    secondaryBtn: { paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    secondaryBtnText: { fontSize: 16, fontWeight: '600' },
});
