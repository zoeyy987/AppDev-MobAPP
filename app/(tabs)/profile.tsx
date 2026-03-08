import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import {
    Image,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    View
} from 'react-native';
import { MOCK_USER_ROLE_STORAGE_KEY } from '../../constants/mockUser';
import { useTheme } from '../../context/ThemeContext';
import { styles } from '../../styles/ProfileScreen.styles';

export default function ProfileScreen() {
    const { theme } = useTheme();
    const router = useRouter();
    const [role, setRole] = React.useState<'client' | 'creator'>('client');

    useFocusEffect(
        React.useCallback(() => {
            let active = true;

            const loadRole = async () => {
                const storedRole = await AsyncStorage.getItem(MOCK_USER_ROLE_STORAGE_KEY);
                if (active) {
                    setRole(storedRole === 'creator' ? 'creator' : 'client');
                }
            };

            loadRole();

            return () => {
                active = false;
            };
        }, [])
    );

    const handleLogout = () => {
        AsyncStorage.removeItem(MOCK_USER_ROLE_STORAGE_KEY);
        router.replace('/login');
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={[styles.profileCard, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: 'https://via.placeholder.com/150' }} style={styles.avatarImage} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.userName, { color: theme.text }]}>Mock User</Text>
                        <Text style={[styles.userRole, { color: theme.tint }]}>{role.toUpperCase()}</Text>
                    </View>
                </View>

                {role === 'client' ? (
                    <Pressable
                        style={[styles.becomeCreatorCard, { backgroundColor: theme.tint }]}
                        onPress={() => router.push('/onboarding/become-creator')}
                    >
                        <View style={styles.bcContent}>
                            <View style={styles.bcIconCircle}>
                                <Ionicons name="sparkles" size={24} color={theme.tint} />
                            </View>
                            <View style={styles.bcTextContainer}>
                                <Text style={styles.bcTitle}>Become a Creator</Text>
                                <Text style={styles.bcSubtitle}>Start selling your services today</Text>
                            </View>
                        </View>
                        <Feather name="chevron-right" size={20} color="#fff" />
                    </Pressable>
                ) : (
                    <View style={[styles.creatorStatusCard, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                        <View style={styles.creatorStatusContent}>
                            <View style={[styles.creatorStatusIcon, { backgroundColor: theme.tint + '18' }]}>
                                <Ionicons name="sparkles" size={20} color={theme.tint} />
                            </View>
                            <View style={styles.creatorStatusText}>
                                <Text style={[styles.creatorStatusTitle, { color: theme.text }]}>Creator account active</Text>
                                <Text style={[styles.creatorStatusSubtitle, { color: theme.textSecondary }]}>
                                    Your profile is ready for creator features.
                                </Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Menu Items */}
                <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Account</Text>

                <Pressable style={[styles.menuItem, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="person-outline" size={20} color={theme.text} />
                        <Text style={[styles.menuText, { color: theme.text }]}>My Details</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                <Pressable style={[styles.menuItem, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <View style={styles.menuLeft}>
                        <Ionicons name="settings-outline" size={20} color={theme.text} />
                        <Text style={[styles.menuText, { color: theme.text }]}>Settings</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                <Pressable
                    onPress={handleLogout}
                    style={[styles.menuItem, styles.card, { backgroundColor: theme.card, borderColor: 'rgba(239, 68, 68, 0.2)' }]}
                >
                    <View style={styles.menuLeft}>
                        <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
                        <Text style={[styles.menuText, { color: '#ef4444' }]}>Logout</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color="#ef4444" />
                </Pressable>

            </ScrollView>
        </View>
    );
}
