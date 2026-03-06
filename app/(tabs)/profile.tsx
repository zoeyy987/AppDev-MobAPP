import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Image,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const isDark = false;
const theme = {
    background: '#f8fafc',
    card: '#ffffff',
    text: '#0f172a',
    textSecondary: '#64748b',
    tint: '#2563eb',
    danger: '#ef4444',
    cardBorder: '#e2e8f0',
};

export default function ProfileScreen() {
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={[styles.profileCard, styles.card]}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatarImage} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.userName}>Mock User</Text>
                        <Text style={[styles.userRole, { color: theme.tint }]}>CLIENT</Text>
                    </View>
                </View>

                {/* Menu Items */}
                <Text style={styles.sectionTitle}>Account</Text>
                
                <Pressable style={[styles.menuItem, styles.card]}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="person-outline" size={20} color={theme.text} />
                        <Text style={styles.menuText}>My Details</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                <Pressable style={[styles.menuItem, styles.card]}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="settings-outline" size={20} color={theme.text} />
                        <Text style={styles.menuText}>Settings</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                <Pressable style={[styles.menuItem, styles.card]}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="log-out-outline" size={20} color={theme.danger} />
                        <Text style={[styles.menuText, { color: theme.danger }]}>Log Out</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: theme.background },
    header: { padding: 20, paddingTop: Platform.OS === 'ios' ? 60 : 40, backgroundColor: theme.card, borderBottomWidth: 1, borderBottomColor: theme.cardBorder },
    headerTitle: { fontSize: 24, fontWeight: '700', color: theme.text },
    scrollContent: { padding: 16, paddingBottom: 100 },
    card: { backgroundColor: theme.card, borderRadius: 16, borderColor: theme.cardBorder, borderWidth: 1, padding: 16, marginBottom: 16 },
    profileCard: { flexDirection: 'row', alignItems: 'center' },
    avatarWrapper: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#e2e8f0', marginRight: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
    avatarImage: { width: '100%', height: '100%' },
    profileInfo: { flex: 1 },
    userName: { fontSize: 20, fontWeight: '700', color: theme.text, marginBottom: 4 },
    userRole: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
    sectionTitle: { fontSize: 16, fontWeight: '600', color: theme.textSecondary, marginTop: 16, marginBottom: 8, marginLeft: 4, textTransform: 'uppercase', letterSpacing: 0.5 },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuText: { fontSize: 16, fontWeight: '500', color: theme.text },
});
