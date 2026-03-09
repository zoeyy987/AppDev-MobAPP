import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Image, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MOCK_CREATORS, MOCK_SERVICES } from '../../constants/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function SearchServicesScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'services' | 'creators'>('services');

    const filteredServices = searchQuery
        ? MOCK_SERVICES.filter(s => s.title.toLowerCase().includes(searchQuery.toLowerCase()) || s.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : MOCK_SERVICES;

    const filteredCreators = searchQuery
        ? MOCK_CREATORS.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.role.toLowerCase().includes(searchQuery.toLowerCase()))
        : MOCK_CREATORS;

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={[styles.header, { backgroundColor: theme.card, paddingTop: insets.top + 8 }]}>
                <Pressable onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </Pressable>
                <View style={[styles.searchBar, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, borderWidth: 1 }]}>
                    <Ionicons name="search" size={18} color={theme.textSecondary} />
                    <TextInput style={[styles.searchInput, { color: theme.text }]} placeholder="Search services & creators..." placeholderTextColor={theme.textSecondary} value={searchQuery} onChangeText={setSearchQuery} autoFocus />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery('')}><Ionicons name="close-circle" size={18} color={theme.textSecondary} /></Pressable>
                    )}
                </View>
            </View>

            {/* Tabs */}
            <View style={[styles.tabs, { borderBottomColor: theme.cardBorder }]}>
                <Pressable style={[styles.tab, activeTab === 'services' && { borderBottomColor: theme.tint, borderBottomWidth: 2 }]} onPress={() => setActiveTab('services')}>
                    <Text style={[styles.tabText, { color: activeTab === 'services' ? theme.tint : theme.textSecondary }]}>Services</Text>
                </Pressable>
                <Pressable style={[styles.tab, activeTab === 'creators' && { borderBottomColor: theme.tint, borderBottomWidth: 2 }]} onPress={() => setActiveTab('creators')}>
                    <Text style={[styles.tabText, { color: activeTab === 'creators' ? theme.tint : theme.textSecondary }]}>Creators</Text>
                </Pressable>
            </View>

            {activeTab === 'services' ? (
                <FlatList
                    data={filteredServices}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}><Ionicons name="search-outline" size={60} color={theme.textSecondary} /><Text style={[styles.emptyText, { color: theme.textSecondary }]}>No services found</Text></View>
                    }
                    renderItem={({ item }) => (
                        <Pressable style={[styles.serviceCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                            {item.image_url && <Image source={{ uri: item.image_url }} style={styles.serviceImg} />}
                            <View style={styles.serviceBody}>
                                <Text style={[styles.serviceLabel, { color: theme.tint }]}>{item.label}</Text>
                                <Text style={[styles.serviceTitle, { color: theme.text }]} numberOfLines={2}>{item.title}</Text>
                                <Text style={[styles.servicePrice, { color: theme.text }]}>₱{item.price}</Text>
                            </View>
                        </Pressable>
                    )}
                />
            ) : (
                <FlatList
                    data={filteredCreators}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    ListEmptyComponent={
                        <View style={styles.empty}><Ionicons name="people-outline" size={60} color={theme.textSecondary} /><Text style={[styles.emptyText, { color: theme.textSecondary }]}>No creators found</Text></View>
                    }
                    renderItem={({ item }) => (
                        <Pressable style={[styles.creatorCard, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}>
                            {item.avatar ? (
                                <Image source={{ uri: item.avatar }} style={styles.creatorAvatar} />
                            ) : (
                                <View style={[styles.creatorAvatar, { backgroundColor: theme.tint, justifyContent: 'center', alignItems: 'center' }]}>
                                    <Text style={{ color: '#fff', fontWeight: '700', fontSize: 18 }}>{item.name.charAt(0)}</Text>
                                </View>
                            )}
                            <View style={styles.creatorInfo}>
                                <Text style={[styles.creatorName, { color: theme.text }]}>{item.name}</Text>
                                <Text style={[styles.creatorRole, { color: theme.textSecondary }]}>{item.role}</Text>
                                <View style={styles.creatorMeta}>
                                    <View style={styles.ratingBadge}>
                                        <Ionicons name="star" size={12} color="#fbbf24" />
                                        <Text style={styles.ratingText}>{item.rating}</Text>
                                    </View>
                                    <Text style={[styles.reviewCount, { color: theme.textSecondary }]}>{item.reviewCount} reviews</Text>
                                    <Text style={[styles.location, { color: theme.textSecondary }]}>📍 {item.location}</Text>
                                </View>
                            </View>
                        </Pressable>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, gap: 12 },
    backBtn: { padding: 8, borderRadius: 12 },
    searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 44 },
    searchInput: { flex: 1, fontSize: 16, marginLeft: 8, marginRight: 8, height: '100%' },
    tabs: { flexDirection: 'row', borderBottomWidth: 1, paddingHorizontal: 24 },
    tab: { flex: 1, alignItems: 'center', paddingVertical: 14 },
    tabText: { fontSize: 16, fontWeight: '600' },
    listContent: { padding: 20, paddingBottom: 60 },
    empty: { alignItems: 'center', paddingTop: 80 },
    emptyText: { marginTop: 12, fontSize: 16 },
    serviceCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 16 },
    serviceImg: { width: '100%', height: 160, backgroundColor: '#e2e8f0' },
    serviceBody: { padding: 16 },
    serviceLabel: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
    serviceTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
    servicePrice: { fontSize: 16, fontWeight: '700' },
    creatorCard: { flexDirection: 'row', padding: 16, borderRadius: 16, marginBottom: 12 },
    creatorAvatar: { width: 56, height: 56, borderRadius: 28, marginRight: 14 },
    creatorInfo: { flex: 1 },
    creatorName: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    creatorRole: { fontSize: 14, marginBottom: 8 },
    creatorMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    ratingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    ratingText: { fontSize: 13, fontWeight: '600', color: '#f59e0b' },
    reviewCount: { fontSize: 12 },
    location: { fontSize: 12 },
});
