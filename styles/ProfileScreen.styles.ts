import { Platform, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        padding: 20,
        paddingTop: Platform.OS === 'ios' ? 60 : 40,
        borderBottomWidth: 1
    },
    headerTitle: { fontSize: 24, fontWeight: '700' },
    scrollContent: { padding: 16, paddingBottom: 100 },
    card: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
    profileCard: { flexDirection: 'row', alignItems: 'center' },
    avatarWrapper: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#e2e8f0',
        marginRight: 16,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    avatarImage: { width: '100%', height: '100%' },
    profileInfo: { flex: 1 },
    userName: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
    userRole: { fontSize: 14, fontWeight: '600', letterSpacing: 0.5 },
    becomeCreatorCard: {
        borderRadius: 18,
        paddingVertical: 18,
        paddingHorizontal: 18,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bcContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1
    },
    bcIconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14
    },
    bcTextContainer: {
        flex: 1
    },
    bcTitle: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 2
    },
    bcSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontWeight: '500'
    },
    creatorStatusCard: {
        paddingVertical: 18,
        paddingHorizontal: 16
    },
    creatorStatusContent: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    creatorStatusIcon: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    creatorStatusText: {
        flex: 1
    },
    creatorStatusTitle: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 2
    },
    creatorStatusSubtitle: {
        fontSize: 13,
        lineHeight: 18
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        marginLeft: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12 },
    menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    menuText: { fontSize: 16, fontWeight: '500' },
});
