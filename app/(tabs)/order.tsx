import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  Modal,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { MOCK_ORDERS, Order, OrderStatus } from '../../constants/mockData';
import { useTheme } from '../../context/ThemeContext';

type FilterType = 'All' | 'Pending' | 'Active' | 'Completed' | 'Cancelled';

// --- SKELETON ---
const SkeletonItem = ({ width, height, borderRadius = 4, style }: any) => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
    ])).start();
  }, [opacity]);
  return <Animated.View style={[{ width, height, borderRadius, backgroundColor: theme.cardBorder, opacity }, style]} />;
};

export default function OrderScreen() {
  const { theme, isDark } = useTheme();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [role] = useState<'client' | 'creator'>('client');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Action Modals
  const [alertConfig, setAlertConfig] = useState({ visible: false, title: '', message: '', type: 'success' as 'success' | 'error' });
  const [confirmModal, setConfirmModal] = useState({ visible: false, title: '', message: '', onConfirm: () => { } });

  useEffect(() => {
    setTimeout(() => { setOrders(MOCK_ORDERS); setLoading(false); }, 600);
  }, []);

  // Filter logic
  useEffect(() => {
    let result = orders;
    if (activeFilter === 'Pending') result = result.filter(o => o.status === 'pending');
    else if (activeFilter === 'Active') result = result.filter(o => ['accepted', 'in_progress', 'delivered'].includes(o.status));
    else if (activeFilter === 'Completed') result = result.filter(o => o.status === 'completed');
    else if (activeFilter === 'Cancelled') result = result.filter(o => ['cancelled', 'rejected', 'refunded'].includes(o.status));
    if (searchQuery) {
      result = result.filter(o =>
        o.service_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (role === 'client' ? o.creator_name : o.client_name)?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(result);
  }, [searchQuery, orders, activeFilter, role]);

  const onRefresh = () => { setRefreshing(true); setTimeout(() => setRefreshing(false), 500); };

  const showAlert = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setAlertConfig({ visible: true, title, message, type });
  };

  const updateOrderStatus = (orderId: number, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, updated_at: new Date().toISOString() } : o));
  };

  const getStatusConfig = (status: OrderStatus) => {
    const configs: Record<OrderStatus, { color: string; bgColor: string; label: string; icon: string }> = {
      pending: { color: '#f59e0b', bgColor: '#f59e0b15', label: 'Pending', icon: 'time-outline' },
      accepted: { color: '#3b82f6', bgColor: '#3b82f615', label: 'Accepted', icon: 'checkmark-circle-outline' },
      in_progress: { color: '#8b5cf6', bgColor: '#8b5cf615', label: 'In Progress', icon: 'construct-outline' },
      delivered: { color: '#06b6d4', bgColor: '#06b6d415', label: 'Delivered', icon: 'cube-outline' },
      completed: { color: '#10b981', bgColor: '#10b98115', label: 'Completed', icon: 'checkmark-done-outline' },
      refunded: { color: '#f97316', bgColor: '#f9731615', label: 'Refunded', icon: 'return-down-back-outline' },
      cancelled: { color: '#ef4444', bgColor: '#ef444415', label: 'Cancelled', icon: 'close-circle-outline' },
      rejected: { color: '#6b7280', bgColor: '#6b728015', label: 'Rejected', icon: 'ban-outline' },
    };
    return configs[status] || configs.pending;
  };

  const filters: FilterType[] = ['All', 'Pending', 'Active', 'Completed', 'Cancelled'];

  const themeStyles = {
    container: { backgroundColor: theme.background },
    header: { backgroundColor: theme.card },
    text: { color: theme.text },
    textSecondary: { color: theme.textSecondary },
    card: { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 },
    input: { backgroundColor: theme.inputBackground, color: theme.text },
    modalBg: { backgroundColor: theme.card },
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const statusConfig = getStatusConfig(item.status);
    const partnerName = role === 'client' ? item.creator_name : item.client_name;
    const formattedDate = new Date(item.updated_at || item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return (
      <Pressable style={[styles.orderCard, themeStyles.card]}>
        {/* Image */}
        <View style={styles.orderContent}>
          <View style={styles.imageContainer}>
            {item.image_url ? (
              <Image source={{ uri: item.image_url }} style={styles.orderImage} />
            ) : (
              <View style={[styles.orderImage, { backgroundColor: theme.cardBorder, justifyContent: 'center', alignItems: 'center' }]}>
                <Ionicons name="image-outline" size={24} color={theme.textSecondary} />
              </View>
            )}
          </View>

          <View style={styles.orderDetails}>
            <View style={styles.orderHeaderRow}>
              <Text numberOfLines={1} style={[styles.orderTitle, themeStyles.text]}>{item.service_title}</Text>
              <Text style={[styles.orderPrice, { color: theme.tint }]}>₱{item.price}</Text>
            </View>
            <Text style={[styles.partnerName, themeStyles.textSecondary]}>{partnerName}</Text>
            <View style={styles.orderMeta}>
              <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
                <Ionicons name={statusConfig.icon as any} size={12} color={statusConfig.color} />
                <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
              </View>
              <Text style={[styles.dateText, themeStyles.textSecondary]}>{formattedDate}</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        {item.status === 'pending' && role === 'creator' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: theme.tint }]} onPress={() => { updateOrderStatus(item.id, 'accepted'); showAlert('Accepted', 'Order has been accepted.'); }}>
              <Text style={styles.actionBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef444415' }]} onPress={() => { updateOrderStatus(item.id, 'rejected'); showAlert('Rejected', 'Order has been rejected.'); }}>
              <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Reject</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === 'pending' && role === 'client' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#ef444415' }]} onPress={() => {
              setConfirmModal({ visible: true, title: 'Cancel Order?', message: `Cancel "${item.service_title}"?`, onConfirm: () => { updateOrderStatus(item.id, 'cancelled'); showAlert('Cancelled', 'Order has been cancelled.'); setConfirmModal(prev => ({ ...prev, visible: false })); } });
            }}>
              <Text style={[styles.actionBtnText, { color: '#ef4444' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {item.status === 'delivered' && role === 'client' && (
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#10b98115' }]} onPress={() => { updateOrderStatus(item.id, 'completed'); showAlert('Completed', 'Order marked as completed!'); }}>
              <Text style={[styles.actionBtnText, { color: '#10b981' }]}>Mark Complete</Text>
            </TouchableOpacity>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER */}
      <View style={[styles.header, themeStyles.header]}>
        {isSearchVisible ? (
          <View style={[styles.searchBarContainer, themeStyles.input]}>
            <Ionicons name="search" size={20} color={theme.textSecondary} />
            <TextInput style={[styles.searchInput, { color: theme.text }]} placeholder="Search orders..." placeholderTextColor={theme.textSecondary} value={searchQuery} onChangeText={setSearchQuery} autoFocus />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')} style={{ marginRight: 8 }}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            )}
            <Pressable onPress={() => { setIsSearchVisible(false); setSearchQuery(''); }}>
              <Text style={{ color: theme.tint, fontWeight: '600' }}>Cancel</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.headerTop}>
            <View>
              <Text style={[styles.title, themeStyles.text]}>{role === 'creator' ? 'My Gigs' : 'Orders'}</Text>
              <Text style={[styles.subtitle, themeStyles.textSecondary]}>
                {loading ? '...' : filteredOrders.length} {filteredOrders.length === 1 ? 'order' : 'orders'}
              </Text>
            </View>
            <Pressable onPress={() => setIsSearchVisible(true)} style={styles.searchButton}>
              <Ionicons name="search" size={24} color={theme.text} />
            </Pressable>
          </View>
        )}

        {/* FILTER TABS */}
        <View style={styles.filterRow}>
          {filters.map((f) => (
            <Pressable key={f} style={[styles.filterTab, activeFilter === f && { backgroundColor: theme.tint }]} onPress={() => setActiveFilter(f)}>
              <Text style={[styles.filterTabText, activeFilter === f ? { color: '#fff' } : { color: theme.textSecondary }]}>{f}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* ORDER LIST */}
      {loading ? (
        <View style={styles.listContent}>
          {[1, 2, 3, 4].map(i => (
            <View key={i} style={[styles.orderCard, themeStyles.card]}>
              <View style={styles.orderContent}>
                <SkeletonItem width={70} height={70} borderRadius={12} style={{ marginRight: 16 }} />
                <View style={{ flex: 1 }}>
                  <SkeletonItem width="70%" height={18} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonItem width="40%" height={14} borderRadius={4} style={{ marginBottom: 8 }} />
                  <SkeletonItem width="50%" height={24} borderRadius={8} />
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="receipt-outline" size={80} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, themeStyles.text]}>No Orders</Text>
              <Text style={[styles.emptySubtitle, themeStyles.textSecondary]}>
                {searchQuery ? `No orders matching "${searchQuery}"` : `No ${activeFilter.toLowerCase()} orders found.`}
              </Text>
            </View>
          }
        />
      )}

      {/* ALERT MODAL */}
      <Modal visible={alertConfig.visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.alertCard, themeStyles.modalBg]}>
            <Ionicons name={alertConfig.type === 'success' ? 'checkmark-circle' : 'close-circle'} size={48} color={alertConfig.type === 'success' ? '#10b981' : '#ef4444'} />
            <Text style={[styles.alertTitle, themeStyles.text]}>{alertConfig.title}</Text>
            <Text style={[styles.alertMessage, themeStyles.textSecondary]}>{alertConfig.message}</Text>
            <TouchableOpacity style={[styles.alertButton, { backgroundColor: theme.tint }]} onPress={() => setAlertConfig(prev => ({ ...prev, visible: false }))}>
              <Text style={styles.alertButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CONFIRM MODAL */}
      <Modal visible={confirmModal.visible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.alertCard, themeStyles.modalBg]}>
            <Ionicons name="warning-outline" size={48} color="#f59e0b" />
            <Text style={[styles.alertTitle, themeStyles.text]}>{confirmModal.title}</Text>
            <Text style={[styles.alertMessage, themeStyles.textSecondary]}>{confirmModal.message}</Text>
            <View style={styles.confirmActions}>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: theme.inputBackground }]} onPress={() => setConfirmModal(prev => ({ ...prev, visible: false }))}>
                <Text style={[styles.confirmBtnText, themeStyles.text]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#ef4444' }]} onPress={confirmModal.onConfirm}>
                <Text style={[styles.confirmBtnText, { color: '#fff' }]}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 16, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  subtitle: { fontSize: 16, fontWeight: '500' },
  searchButton: { padding: 8, borderRadius: 12 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 48, marginBottom: 16 },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 8, marginRight: 8, height: '100%' },
  filterRow: { flexDirection: 'row', gap: 8 },
  filterTab: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.05)' },
  filterTabText: { fontSize: 14, fontWeight: '600' },
  listContent: { padding: 20, paddingBottom: 120 },
  orderCard: { borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  orderContent: { flexDirection: 'row' },
  imageContainer: { marginRight: 16 },
  orderImage: { width: 70, height: 70, borderRadius: 12 },
  orderDetails: { flex: 1, justifyContent: 'space-between' },
  orderHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  orderTitle: { fontSize: 15, fontWeight: '600', flex: 1, marginRight: 8 },
  orderPrice: { fontSize: 15, fontWeight: '700' },
  partnerName: { fontSize: 13, marginBottom: 8 },
  orderMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, gap: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  dateText: { fontSize: 12 },
  actionsRow: { flexDirection: 'row', gap: 10, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(0,0,0,0.05)', paddingTop: 12 },
  actionBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  alertCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center' },
  alertTitle: { fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  alertMessage: { fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  alertButton: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  alertButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  confirmActions: { flexDirection: 'row', gap: 12, width: '100%' },
  confirmBtn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  confirmBtnText: { fontSize: 16, fontWeight: '600' },
});