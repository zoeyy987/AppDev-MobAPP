import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, MOCK_SERVICES, Service, SUBCATEGORY_MAP } from '../../constants/mockData';
import { useTheme } from '../../context/ThemeContext';

// --- SKELETON LOADER ---
const SkeletonItem = () => {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true })
      ])
    ).start();
  }, [opacity]);

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]}>
      <View style={styles.cardHeader}>
        <Animated.View style={{ width: 60, height: 60, borderRadius: 12, backgroundColor: theme.cardBorder, opacity }} />
        <View style={{ marginLeft: 12, flex: 1, gap: 8 }}>
          <Animated.View style={{ width: '70%', height: 16, borderRadius: 4, backgroundColor: theme.cardBorder, opacity }} />
          <Animated.View style={{ width: '40%', height: 12, borderRadius: 4, backgroundColor: theme.cardBorder, opacity }} />
          <Animated.View style={{ width: '30%', height: 14, borderRadius: 4, backgroundColor: theme.cardBorder, opacity }} />
        </View>
      </View>
      <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />
      <View style={{ gap: 6, marginBottom: 12 }}>
        <Animated.View style={{ width: '100%', height: 12, borderRadius: 4, backgroundColor: theme.cardBorder, opacity }} />
        <Animated.View style={{ width: '90%', height: 12, borderRadius: 4, backgroundColor: theme.cardBorder, opacity }} />
      </View>
      <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />
      <View style={styles.actionContainer}>
        <Animated.View style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: theme.cardBorder, opacity }} />
        <Animated.View style={{ flex: 1, height: 44, borderRadius: 12, backgroundColor: theme.cardBorder, opacity }} />
      </View>
    </View>
  );
};

export default function ManageServiceScreen() {
  const { theme, isDark } = useTheme();

  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Edit Modal State
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editCategory, setEditCategory] = useState(CATEGORIES[0]);
  const [editSubcategory, setEditSubcategory] = useState('');
  const [showEditCatModal, setShowEditCatModal] = useState(false);
  const [showEditSubCatModal, setShowEditSubCatModal] = useState(false);

  // Delete Modal State
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // Alert State
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState({ title: '', message: '', type: 'success' as 'success' | 'error' });

  useEffect(() => {
    setTimeout(() => {
      setServices(MOCK_SERVICES);
      setFilteredServices(MOCK_SERVICES);
      setLoading(false);
    }, 600);
  }, []);

  useEffect(() => {
    if (editModalVisible) {
      const subs = SUBCATEGORY_MAP[editCategory];
      if (subs && !subs.includes(editSubcategory)) {
        setEditSubcategory(subs[0] || '');
      }
    }
  }, [editCategory, editModalVisible]);

  useEffect(() => {
    if (searchQuery) {
      setFilteredServices(
        services.filter(s =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredServices(services);
    }
  }, [searchQuery, services]);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const showAlert = (title: string, message: string, type: 'success' | 'error' = 'success') => {
    setAlertConfig({ title, message, type });
    setAlertVisible(true);
  };

  const openEditModal = (service: Service) => {
    setEditingService(service);
    setEditTitle(service.title);
    setEditPrice(service.price);
    setEditDescription(service.description);
    let foundCategory = CATEGORIES[0];
    for (const [cat, subs] of Object.entries(SUBCATEGORY_MAP)) {
      if (subs.includes(service.label)) { foundCategory = cat; break; }
    }
    setEditCategory(foundCategory);
    setEditSubcategory(service.label);
    setEditModalVisible(true);
  };

  const handleUpdateService = () => {
    if (!editingService || !editTitle.trim() || !editPrice.trim() || !editDescription.trim()) {
      showAlert('Error', 'Please fill all fields', 'error');
      return;
    }
    setServices(prev => prev.map(s =>
      s.id === editingService.id
        ? { ...s, title: editTitle.trim(), price: editPrice.trim(), description: editDescription.trim(), label: editSubcategory }
        : s
    ));
    setEditModalVisible(false);
    showAlert('Success', 'Service updated successfully');
  };

  const handleDeleteService = () => {
    if (!serviceToDelete) return;
    setServices(prev => prev.filter(s => s.id !== serviceToDelete.id));
    setDeleteModalVisible(false);
    showAlert('Success', 'Service removed from your listings');
    setServiceToDelete(null);
  };

  const themeStyles = {
    container: { backgroundColor: theme.background },
    header: { backgroundColor: theme.card },
    text: { color: theme.text },
    textSecondary: { color: theme.textSecondary },
    card: { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 },
    input: { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.inputBorder, borderWidth: 1 },
    modalBg: { backgroundColor: theme.card },
    modal: { backgroundColor: theme.background },
  };

  const renderService = ({ item }: { item: Service }) => (
    <View style={[styles.card, themeStyles.card]}>
      <View style={styles.cardHeader}>
        {item.image_url ? (
          <Image source={{ uri: item.image_url }} style={styles.serviceImage} resizeMode="cover" />
        ) : (
          <View style={[styles.serviceIcon, { backgroundColor: isDark ? '#333' : '#e2e8f0' }]}>
            <Ionicons name="briefcase-outline" size={24} color={theme.text} />
          </View>
        )}
        <View style={styles.serviceInfo}>
          <Text style={[styles.serviceTitle, themeStyles.text]} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.serviceCategory, { color: theme.tint }]} numberOfLines={1}>{item.label}</Text>
          <Text style={[styles.servicePrice, themeStyles.text]}>₱ {item.price}</Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />
      <Text style={[styles.serviceDescription, themeStyles.textSecondary]} numberOfLines={3}>{item.description}</Text>
      <View style={[styles.divider, { backgroundColor: theme.cardBorder }]} />

      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.tint }]} onPress={() => openEditModal(item)}>
          <Ionicons name="pencil-outline" size={16} color="#fff" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, { backgroundColor: '#ef444415' }]} onPress={() => { setServiceToDelete(item); setDeleteModalVisible(true); }}>
          <Ionicons name="trash-outline" size={16} color="#ef4444" />
          <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, themeStyles.container]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* HEADER */}
      <View style={[styles.header, themeStyles.header]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, themeStyles.text]}>Manage Services</Text>
          <Pressable onPress={() => setIsSearchVisible(!isSearchVisible)} style={styles.iconButton}>
            <Ionicons name="search" size={24} color={theme.text} />
          </Pressable>
        </View>
        {isSearchVisible && (
          <View style={[styles.searchBarContainer, themeStyles.input]}>
            <Ionicons name="search" size={18} color={theme.textSecondary} />
            <TextInput
              placeholder="Search your services..."
              placeholderTextColor={theme.textSecondary}
              style={[styles.searchInput, { color: theme.text }]}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* SERVICE LIST */}
      {loading ? (
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {[1, 2, 3].map(key => <SkeletonItem key={key} />)}
        </ScrollView>
      ) : (
        <FlatList
          data={filteredServices}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderService}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.tint} />}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={80} color={theme.textSecondary} />
              <Text style={[styles.emptyTitle, themeStyles.text]}>No Services Found</Text>
              <Text style={[styles.emptySubtitle, themeStyles.textSecondary]}>
                {searchQuery ? 'No services match your search.' : "You haven't created any services yet."}
              </Text>
            </View>
          }
        />
      )}

      {/* EDIT MODAL */}
      <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, themeStyles.container]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Edit Service</Text>
            <Pressable onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color={theme.text} />
            </Pressable>
          </View>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
            <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
              <Text style={[styles.label, themeStyles.text]}>Service Title</Text>
              <TextInput style={[styles.input, themeStyles.input]} placeholder="Service title" placeholderTextColor={theme.textSecondary} value={editTitle} onChangeText={setEditTitle} />

              <Text style={[styles.label, themeStyles.text]}>Category</Text>
              <Pressable style={[styles.selector, themeStyles.input]} onPress={() => setShowEditCatModal(true)}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{editCategory}</Text>
                <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
              </Pressable>

              <Text style={[styles.label, themeStyles.text]}>Subcategory</Text>
              <Pressable style={[styles.selector, themeStyles.input]} onPress={() => setShowEditSubCatModal(true)}>
                <Text style={{ color: theme.text, fontSize: 16 }}>{editSubcategory || 'Select Subcategory'}</Text>
                <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
              </Pressable>

              <Text style={[styles.label, themeStyles.text]}>Price (₱)</Text>
              <TextInput style={[styles.input, themeStyles.input]} placeholder="Price" placeholderTextColor={theme.textSecondary} keyboardType="numeric" value={editPrice} onChangeText={setEditPrice} />

              <Text style={[styles.label, themeStyles.text]}>Description</Text>
              <TextInput style={[styles.input, styles.textArea, themeStyles.input]} placeholder="Service description" placeholderTextColor={theme.textSecondary} multiline numberOfLines={6} value={editDescription} onChangeText={setEditDescription} textAlignVertical="top" />

              <TouchableOpacity style={[styles.updateButton, { backgroundColor: theme.tint }]} onPress={handleUpdateService}>
                <Text style={styles.updateButtonText}>Update Service</Text>
              </TouchableOpacity>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>

      {/* CATEGORY MODAL */}
      <Modal visible={showEditCatModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowEditCatModal(false)}>
        <SafeAreaView style={[styles.modalContainer, themeStyles.modal]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Select Category</Text>
            <Pressable onPress={() => setShowEditCatModal(false)}>
              <Text style={{ color: theme.tint, fontSize: 16, fontWeight: '600' }}>Done</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {CATEGORIES.map((cat) => (
              <Pressable key={cat} style={[styles.catOption, editCategory === cat && { backgroundColor: theme.card }]} onPress={() => { setEditCategory(cat); setShowEditCatModal(false); }}>
                <Text style={[styles.catText, themeStyles.text, editCategory === cat && { color: theme.tint, fontWeight: '700' }]}>{cat}</Text>
                {editCategory === cat && <Ionicons name="checkmark" size={20} color={theme.tint} />}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* SUBCATEGORY MODAL */}
      <Modal visible={showEditSubCatModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowEditSubCatModal(false)}>
        <SafeAreaView style={[styles.modalContainer, themeStyles.modal]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, themeStyles.text]}>Select Subcategory</Text>
            <Pressable onPress={() => setShowEditSubCatModal(false)}>
              <Text style={{ color: theme.tint, fontSize: 16, fontWeight: '600' }}>Done</Text>
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            {SUBCATEGORY_MAP[editCategory]?.map((sub) => (
              <Pressable key={sub} style={[styles.catOption, editSubcategory === sub && { backgroundColor: theme.card }]} onPress={() => { setEditSubcategory(sub); setShowEditSubCatModal(false); }}>
                <Text style={[styles.catText, themeStyles.text, editSubcategory === sub && { color: theme.tint, fontWeight: '700' }]}>{sub}</Text>
                {editSubcategory === sub && <Ionicons name="checkmark" size={20} color={theme.tint} />}
              </Pressable>
            ))}
          </ScrollView>
        </SafeAreaView>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.deleteCard, themeStyles.modalBg]}>
            <View style={[styles.deleteIconCircle, { backgroundColor: '#ef444415' }]}>
              <Ionicons name="warning" size={48} color="#ef4444" />
            </View>
            <Text style={[styles.deleteTitle, themeStyles.text]}>Remove Service</Text>
            <Text style={[styles.deleteMessage, themeStyles.textSecondary]}>
              Remove "{serviceToDelete?.title}" from your listings?
            </Text>
            <View style={styles.deleteButtonContainer}>
              <TouchableOpacity style={[styles.deleteCancelButton, { backgroundColor: theme.inputBackground }]} onPress={() => { setDeleteModalVisible(false); setServiceToDelete(null); }}>
                <Text style={[styles.deleteCancelButtonText, themeStyles.text]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.deleteConfirmButton, { backgroundColor: '#ef4444' }]} onPress={handleDeleteService}>
                <Text style={styles.deleteConfirmButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ALERT MODAL */}
      <Modal visible={alertVisible} transparent animationType="fade">
        <View style={styles.modalBackdrop}>
          <View style={[styles.alertCard, themeStyles.modalBg]}>
            <Ionicons name={alertConfig.type === 'success' ? 'checkmark-circle' : 'close-circle'} size={48} color={alertConfig.type === 'success' ? '#10b981' : '#ef4444'} />
            <Text style={[styles.alertTitle, themeStyles.text]}>{alertConfig.title}</Text>
            <Text style={[styles.alertMessage, themeStyles.textSecondary]}>{alertConfig.message}</Text>
            <TouchableOpacity style={[styles.alertButton, { backgroundColor: theme.tint }]} onPress={() => setAlertVisible(false)}>
              <Text style={styles.alertButtonText}>Okay</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20, borderBottomLeftRadius: 24, borderBottomRightRadius: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 2 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: '700' },
  iconButton: { padding: 8, borderRadius: 12 },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 12, paddingHorizontal: 12, height: 44, marginTop: 16 },
  searchInput: { flex: 1, fontSize: 16, marginLeft: 8, marginRight: 8, height: '100%' },
  listContent: { padding: 20, paddingBottom: 120 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 3 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  serviceImage: { width: 60, height: 60, borderRadius: 12 },
  serviceIcon: { width: 60, height: 60, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  serviceInfo: { marginLeft: 12, flex: 1, gap: 4 },
  serviceTitle: { fontSize: 16, fontWeight: '600' },
  serviceCategory: { fontSize: 13, fontWeight: '500' },
  servicePrice: { fontSize: 15, fontWeight: '700' },
  divider: { height: 1, marginVertical: 12 },
  serviceDescription: { fontSize: 14, lineHeight: 20 },
  actionContainer: { flexDirection: 'row', gap: 12 },
  actionButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, borderRadius: 12, gap: 6 },
  actionButtonText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  emptyContainer: { alignItems: 'center', justifyContent: 'center', paddingTop: 100, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', marginTop: 16, marginBottom: 8 },
  emptySubtitle: { fontSize: 16, textAlign: 'center', lineHeight: 22 },
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalContent: { padding: 24, paddingBottom: 60 },
  label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
  textArea: { minHeight: 120, textAlignVertical: 'top' },
  selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
  updateButton: { marginTop: 24, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  updateButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  catOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, marginBottom: 4 },
  catText: { fontSize: 16, fontWeight: '500' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  deleteCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center' },
  deleteIconCircle: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  deleteTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  deleteMessage: { fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  deleteButtonContainer: { flexDirection: 'row', gap: 12, width: '100%' },
  deleteCancelButton: { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  deleteCancelButtonText: { fontSize: 16, fontWeight: '600' },
  deleteConfirmButton: { flex: 1, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
  deleteConfirmButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  alertCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center' },
  alertTitle: { fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 8 },
  alertMessage: { fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  alertButton: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
  alertButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});