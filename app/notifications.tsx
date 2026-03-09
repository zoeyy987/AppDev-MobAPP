import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { MOCK_NOTIFICATIONS, Notification } from '../constants/mockData';
import { useTheme } from '../context/ThemeContext';

export default function NotificationsScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'order': return 'receipt-outline';
            case 'message': return 'chatbubble-outline';
            case 'review': return 'star-outline';
            case 'system': return 'information-circle-outline';
        }
    };

    const getIconColor = (type: Notification['type']) => {
        switch (type) {
            case 'order': return '#3b82f6';
            case 'message': return '#10b981';
            case 'review': return '#f59e0b';
            case 'system': return '#8b5cf6';
        }
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
        if (diffHours < 1) return `${Math.floor(diffHours * 60)}m ago`;
        if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
        if (diffHours < 168) return date.toLocaleDateString('en-US', { weekday: 'short' });
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={[styles.header, { backgroundColor: theme.card }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </Pressable>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Notifications</Text>
                <Pressable onPress={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}>
                    <Text style={{ color: theme.tint, fontSize: 14, fontWeight: '600' }}>Read All</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
                {notifications.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="notifications-off-outline" size={80} color={theme.textSecondary} />
                        <Text style={[styles.emptyTitle, { color: theme.text }]}>No Notifications</Text>
                        <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>You're all caught up!</Text>
                    </View>
                ) : (
                    notifications.map(notif => (
                        <Pressable
                            key={notif.id}
                            style={[styles.notifCard, { backgroundColor: notif.read ? theme.card : theme.tint + '08', borderColor: theme.cardBorder, borderWidth: 1 }]}
                            onPress={() => markAsRead(notif.id)}
                        >
                            <View style={[styles.iconCircle, { backgroundColor: getIconColor(notif.type) + '15' }]}>
                                <Ionicons name={getIcon(notif.type) as any} size={22} color={getIconColor(notif.type)} />
                            </View>
                            <View style={styles.notifBody}>
                                <View style={styles.notifHeader}>
                                    <Text style={[styles.notifTitle, { color: theme.text }]} numberOfLines={1}>{notif.title}</Text>
                                    <Text style={[styles.notifTime, { color: theme.textSecondary }]}>{formatTime(notif.created_at)}</Text>
                                </View>
                                <Text style={[styles.notifMessage, { color: theme.textSecondary }]} numberOfLines={2}>{notif.message}</Text>
                            </View>
                            {!notif.read && <View style={[styles.unreadDot, { backgroundColor: theme.tint }]} />}
                        </Pressable>
                    ))
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
    backButton: { padding: 8, borderRadius: 12 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    listContent: { padding: 20, paddingBottom: 60 },
    emptyContainer: { alignItems: 'center', paddingTop: 100, paddingHorizontal: 40 },
    emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8 },
    emptySubtitle: { fontSize: 16, textAlign: 'center' },
    notifCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 10 },
    iconCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
    notifBody: { flex: 1 },
    notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
    notifTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
    notifTime: { fontSize: 12 },
    notifMessage: { fontSize: 14, lineHeight: 19 },
    unreadDot: { width: 8, height: 8, borderRadius: 4, marginLeft: 8 },
});
