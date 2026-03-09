import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Image,
    Modal,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { MOCK_USER_ROLE_STORAGE_KEY } from '../../constants/mockUser';
import { useRole } from '../../context/RoleContext';
import { useTheme } from '../../context/ThemeContext';
import { styles } from '../../styles/ProfileScreen.styles';

export default function ProfileScreen() {
    const { theme, isDark, mode, setMode } = useTheme();
    const { role, setRole: setRoleCtx } = useRole();
    const router = useRouter();

    // My Details modal state
    const [showDetailsModal, setShowDetailsModal] = React.useState(false);
    const [editName, setEditName] = React.useState('Mock User');
    const [editEmail, setEditEmail] = React.useState('mockuser@example.com');
    const [editPhone, setEditPhone] = React.useState('+63 912 345 6789');

    // Settings modal state
    const [showSettingsModal, setShowSettingsModal] = React.useState(false);
    const [pushNotifications, setPushNotifications] = React.useState(true);
    const [emailNotifications, setEmailNotifications] = React.useState(true);

    // Alert modal
    const [alertVisible, setAlertVisible] = React.useState(false);
    const [alertConfig, setAlertConfig] = React.useState({ title: '', message: '' });

    const handleLogout = async () => {
        await AsyncStorage.removeItem(MOCK_USER_ROLE_STORAGE_KEY);
        await setRoleCtx('client');
        router.replace('/login');
    };

    const handleSwitchRole = async () => {
        const newRole = role === 'creator' ? 'client' : 'creator';
        await setRoleCtx(newRole);
        setAlertConfig({
            title: 'Role Switched',
            message: `You are now in ${newRole.toUpperCase()} mode. The tabs have been updated.`,
        });
        setAlertVisible(true);
    };

    const handleSaveDetails = () => {
        setShowDetailsModal(false);
        setAlertConfig({ title: 'Saved', message: 'Your profile details have been updated.' });
        setAlertVisible(true);
    };

    const handleNotifications = () => {
        router.push('/notifications' as never);
    };

    const themeStyles = {
        container: { backgroundColor: theme.background },
        text: { color: theme.text },
        textSecondary: { color: theme.textSecondary },
        card: { backgroundColor: theme.card, borderColor: theme.cardBorder },
        input: { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.inputBorder, borderWidth: 1 },
        modalBg: { backgroundColor: theme.card },
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
                <Pressable onPress={handleNotifications} style={localStyles.bellButton}>
                    <Ionicons name="notifications-outline" size={24} color={theme.text} />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Card */}
                <View style={[styles.profileCard, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
                    <View style={styles.avatarWrapper}>
                        <Image source={{ uri: 'https://picsum.photos/seed/profile/150/150' }} style={styles.avatarImage} />
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={[styles.userName, { color: theme.text }]}>Mock User</Text>
                        <Text style={[styles.userRole, { color: theme.tint }]}>{role.toUpperCase()}</Text>
                    </View>
                </View>

                {/* Role Switch */}
                <Pressable
                    style={[localStyles.roleSwitchCard, { backgroundColor: role === 'creator' ? '#10b98115' : theme.tint + '15', borderColor: theme.cardBorder, borderWidth: 1 }]}
                    onPress={handleSwitchRole}
                >
                    <View style={localStyles.roleSwitchContent}>
                        <View style={[localStyles.roleSwitchIcon, { backgroundColor: role === 'creator' ? '#10b98120' : theme.tint + '20' }]}>
                            <Ionicons name={role === 'creator' ? "person-outline" : "sparkles"} size={20} color={role === 'creator' ? '#10b981' : theme.tint} />
                        </View>
                        <View style={localStyles.roleSwitchText}>
                            <Text style={[localStyles.roleSwitchTitle, { color: theme.text }]}>
                                {role === 'creator' ? 'Switch to Client' : 'Switch to Creator'}
                            </Text>
                            <Text style={[localStyles.roleSwitchSubtitle, { color: theme.textSecondary }]}>
                                {role === 'creator' ? 'Browse and order services' : 'Manage your services & earnings'}
                            </Text>
                        </View>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                {role === 'client' && (
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
                )}

                {role === 'creator' && (
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

                <Pressable
                    style={[styles.menuItem, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                    onPress={() => setShowDetailsModal(true)}
                >
                    <View style={styles.menuLeft}>
                        <Ionicons name="person-outline" size={20} color={theme.text} />
                        <Text style={[styles.menuText, { color: theme.text }]}>My Details</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                <Pressable
                    style={[styles.menuItem, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                    onPress={() => setShowSettingsModal(true)}
                >
                    <View style={styles.menuLeft}>
                        <Ionicons name="settings-outline" size={20} color={theme.text} />
                        <Text style={[styles.menuText, { color: theme.text }]}>Settings</Text>
                    </View>
                    <Feather name="chevron-right" size={20} color={theme.textSecondary} />
                </Pressable>

                <Pressable
                    style={[styles.menuItem, styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
                    onPress={handleNotifications}
                >
                    <View style={styles.menuLeft}>
                        <Ionicons name="notifications-outline" size={20} color={theme.text} />
                        <Text style={[styles.menuText, { color: theme.text }]}>Notifications</Text>
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

            {/* MY DETAILS MODAL */}
            <Modal visible={showDetailsModal} animationType="slide" presentationStyle="pageSheet">
                <View style={[localStyles.modalContainer, themeStyles.container]}>
                    <View style={[localStyles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
                        <Text style={[localStyles.modalTitle, themeStyles.text]}>My Details</Text>
                        <Pressable onPress={() => setShowDetailsModal(false)}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </Pressable>
                    </View>
                    <ScrollView contentContainerStyle={localStyles.modalContent}>
                        <View style={localStyles.avatarEditContainer}>
                            <Image source={{ uri: 'https://picsum.photos/seed/profile/150/150' }} style={localStyles.avatarLarge} />
                            <Pressable style={[localStyles.avatarEditButton, { backgroundColor: theme.tint }]}>
                                <Ionicons name="camera-outline" size={16} color="#fff" />
                            </Pressable>
                        </View>

                        <Text style={[localStyles.label, themeStyles.text]}>Full Name</Text>
                        <TextInput style={[localStyles.input, themeStyles.input]} value={editName} onChangeText={setEditName} placeholderTextColor={theme.textSecondary} />

                        <Text style={[localStyles.label, themeStyles.text]}>Email</Text>
                        <TextInput style={[localStyles.input, themeStyles.input]} value={editEmail} onChangeText={setEditEmail} keyboardType="email-address" placeholderTextColor={theme.textSecondary} />

                        <Text style={[localStyles.label, themeStyles.text]}>Phone</Text>
                        <TextInput style={[localStyles.input, themeStyles.input]} value={editPhone} onChangeText={setEditPhone} keyboardType="phone-pad" placeholderTextColor={theme.textSecondary} />

                        <TouchableOpacity style={[localStyles.saveButton, { backgroundColor: theme.tint }]} onPress={handleSaveDetails}>
                            <Text style={localStyles.saveButtonText}>Save Changes</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Modal>

            {/* SETTINGS MODAL */}
            <Modal visible={showSettingsModal} animationType="slide" presentationStyle="pageSheet">
                <View style={[localStyles.modalContainer, themeStyles.container]}>
                    <View style={[localStyles.modalHeader, { borderBottomColor: theme.cardBorder }]}>
                        <Text style={[localStyles.modalTitle, themeStyles.text]}>Settings</Text>
                        <Pressable onPress={() => setShowSettingsModal(false)}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </Pressable>
                    </View>
                    <ScrollView contentContainerStyle={localStyles.modalContent}>
                        <Text style={[localStyles.settingsSectionTitle, themeStyles.textSecondary]}>Appearance</Text>
                        <View style={[localStyles.settingsCard, themeStyles.card, { borderWidth: 1 }]}>
                            {(['light', 'dark', 'system'] as const).map((m) => (
                                <Pressable key={m} style={[localStyles.settingsRow, mode === m && { backgroundColor: theme.tint + '10' }]} onPress={() => setMode(m)}>
                                    <View style={localStyles.settingsRowLeft}>
                                        <Ionicons name={m === 'light' ? 'sunny-outline' : m === 'dark' ? 'moon-outline' : 'phone-portrait-outline'} size={20} color={mode === m ? theme.tint : theme.text} />
                                        <Text style={[localStyles.settingsLabel, { color: mode === m ? theme.tint : theme.text }]}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
                                    </View>
                                    {mode === m && <Ionicons name="checkmark" size={20} color={theme.tint} />}
                                </Pressable>
                            ))}
                        </View>

                        <Text style={[localStyles.settingsSectionTitle, themeStyles.textSecondary]}>Notifications</Text>
                        <View style={[localStyles.settingsCard, themeStyles.card, { borderWidth: 1 }]}>
                            <View style={localStyles.settingsRow}>
                                <View style={localStyles.settingsRowLeft}>
                                    <Ionicons name="notifications-outline" size={20} color={theme.text} />
                                    <Text style={[localStyles.settingsLabel, themeStyles.text]}>Push Notifications</Text>
                                </View>
                                <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#e2e8f0', true: theme.tint + '60' }} thumbColor={pushNotifications ? theme.tint : '#f4f3f4'} />
                            </View>
                            <View style={localStyles.settingsRow}>
                                <View style={localStyles.settingsRowLeft}>
                                    <Ionicons name="mail-outline" size={20} color={theme.text} />
                                    <Text style={[localStyles.settingsLabel, themeStyles.text]}>Email Notifications</Text>
                                </View>
                                <Switch value={emailNotifications} onValueChange={setEmailNotifications} trackColor={{ false: '#e2e8f0', true: theme.tint + '60' }} thumbColor={emailNotifications ? theme.tint : '#f4f3f4'} />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </Modal>

            {/* ALERT MODAL */}
            <Modal visible={alertVisible} transparent animationType="fade">
                <View style={localStyles.alertBackdrop}>
                    <View style={[localStyles.alertCard, themeStyles.modalBg]}>
                        <Ionicons name="checkmark-circle" size={48} color="#10b981" />
                        <Text style={[localStyles.alertTitle, themeStyles.text]}>{alertConfig.title}</Text>
                        <Text style={[localStyles.alertMessage, themeStyles.textSecondary]}>{alertConfig.message}</Text>
                        <TouchableOpacity style={[localStyles.alertButton, { backgroundColor: theme.tint }]} onPress={() => setAlertVisible(false)}>
                            <Text style={localStyles.alertButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const localStyles = StyleSheet.create({
    bellButton: { padding: 8, borderRadius: 12 },
    roleSwitchCard: { borderRadius: 16, padding: 16, marginBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    roleSwitchContent: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    roleSwitchIcon: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
    roleSwitchText: { flex: 1 },
    roleSwitchTitle: { fontSize: 16, fontWeight: '600', marginBottom: 2 },
    roleSwitchSubtitle: { fontSize: 13 },
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1 },
    modalTitle: { fontSize: 20, fontWeight: '700' },
    modalContent: { padding: 24, paddingBottom: 60 },
    avatarEditContainer: { alignItems: 'center', marginBottom: 24 },
    avatarLarge: { width: 100, height: 100, borderRadius: 50 },
    avatarEditButton: { position: 'absolute', bottom: 0, right: '35%', width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
    input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
    saveButton: { marginTop: 32, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    settingsSectionTitle: { fontSize: 14, fontWeight: '600', marginBottom: 12, marginTop: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
    settingsCard: { borderRadius: 16, overflow: 'hidden', marginBottom: 24 },
    settingsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
    settingsRowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    settingsLabel: { fontSize: 16, fontWeight: '500' },
    alertBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    alertCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center' },
    alertTitle: { fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 8 },
    alertMessage: { fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    alertButton: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
    alertButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
