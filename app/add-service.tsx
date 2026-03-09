import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CATEGORIES, SUBCATEGORY_MAP } from '../constants/mockData';
import { useTheme } from '../context/ThemeContext';

export default function AddServiceScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [subcategory, setSubcategory] = useState(SUBCATEGORY_MAP[CATEGORIES[0]][0]);
    const [showCatModal, setShowCatModal] = useState(false);
    const [showSubCatModal, setShowSubCatModal] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertConfig, setAlertConfig] = useState({ title: '', message: '' });

    const themeStyles = {
        container: { backgroundColor: theme.background },
        text: { color: theme.text },
        textSecondary: { color: theme.textSecondary },
        input: { backgroundColor: theme.inputBackground, color: theme.text, borderColor: theme.inputBorder, borderWidth: 1 },
        modal: { backgroundColor: theme.background },
        modalBg: { backgroundColor: theme.card },
    };

    const handleSubmit = () => {
        if (!title.trim() || !price.trim() || !description.trim()) {
            setAlertConfig({ title: 'Error', message: 'Please fill in all fields.' });
            setAlertVisible(true);
            return;
        }
        setAlertConfig({ title: 'Success', message: 'Service created successfully!' });
        setAlertVisible(true);
    };

    return (
        <SafeAreaView style={[styles.container, themeStyles.container]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </Pressable>
                <Text style={[styles.headerTitle, themeStyles.text]}>Add Service</Text>
                <View style={{ width: 40 }} />
            </View>

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Image Placeholder */}
                    <Pressable style={[styles.uploadBox, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, borderWidth: 1 }]}>
                        <Ionicons name="image-outline" size={40} color={theme.textSecondary} />
                        <Text style={[styles.uploadText, themeStyles.textSecondary]}>Tap to upload cover image</Text>
                    </Pressable>

                    <Text style={[styles.label, themeStyles.text]}>Service Title</Text>
                    <TextInput style={[styles.input, themeStyles.input]} placeholder="e.g. Professional Logo Design" placeholderTextColor={theme.textSecondary} value={title} onChangeText={setTitle} />

                    <Text style={[styles.label, themeStyles.text]}>Category</Text>
                    <Pressable style={[styles.selector, themeStyles.input]} onPress={() => setShowCatModal(true)}>
                        <Text style={{ color: theme.text, fontSize: 16 }}>{category}</Text>
                        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
                    </Pressable>

                    <Text style={[styles.label, themeStyles.text]}>Subcategory</Text>
                    <Pressable style={[styles.selector, themeStyles.input]} onPress={() => setShowSubCatModal(true)}>
                        <Text style={{ color: theme.text, fontSize: 16 }}>{subcategory}</Text>
                        <Ionicons name="chevron-down" size={20} color={theme.textSecondary} />
                    </Pressable>

                    <Text style={[styles.label, themeStyles.text]}>Price (₱)</Text>
                    <TextInput style={[styles.input, themeStyles.input]} placeholder="e.g. 2500" placeholderTextColor={theme.textSecondary} keyboardType="numeric" value={price} onChangeText={setPrice} />

                    <Text style={[styles.label, themeStyles.text]}>Description</Text>
                    <TextInput style={[styles.input, styles.textArea, themeStyles.input]} placeholder="Describe your service..." placeholderTextColor={theme.textSecondary} multiline numberOfLines={6} value={description} onChangeText={setDescription} textAlignVertical="top" />

                    <TouchableOpacity style={[styles.submitButton, { backgroundColor: theme.tint }]} onPress={handleSubmit}>
                        <Text style={styles.submitButtonText}>Create Service</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>

            {/* Category Modal */}
            <Modal visible={showCatModal} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={[styles.modalContainer, themeStyles.modal]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, themeStyles.text]}>Select Category</Text>
                        <Pressable onPress={() => setShowCatModal(false)}><Text style={{ color: theme.tint, fontSize: 16, fontWeight: '600' }}>Done</Text></Pressable>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        {CATEGORIES.map(cat => (
                            <Pressable key={cat} style={[styles.catOption, category === cat && { backgroundColor: theme.card }]} onPress={() => { setCategory(cat); setSubcategory(SUBCATEGORY_MAP[cat][0]); setShowCatModal(false); }}>
                                <Text style={[styles.catText, themeStyles.text, category === cat && { color: theme.tint, fontWeight: '700' }]}>{cat}</Text>
                                {category === cat && <Ionicons name="checkmark" size={20} color={theme.tint} />}
                            </Pressable>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Subcategory Modal */}
            <Modal visible={showSubCatModal} animationType="slide" presentationStyle="pageSheet">
                <SafeAreaView style={[styles.modalContainer, themeStyles.modal]}>
                    <View style={styles.modalHeader}>
                        <Text style={[styles.modalTitle, themeStyles.text]}>Select Subcategory</Text>
                        <Pressable onPress={() => setShowSubCatModal(false)}><Text style={{ color: theme.tint, fontSize: 16, fontWeight: '600' }}>Done</Text></Pressable>
                    </View>
                    <ScrollView contentContainerStyle={{ padding: 20 }}>
                        {SUBCATEGORY_MAP[category]?.map(sub => (
                            <Pressable key={sub} style={[styles.catOption, subcategory === sub && { backgroundColor: theme.card }]} onPress={() => { setSubcategory(sub); setShowSubCatModal(false); }}>
                                <Text style={[styles.catText, themeStyles.text, subcategory === sub && { color: theme.tint, fontWeight: '700' }]}>{sub}</Text>
                                {subcategory === sub && <Ionicons name="checkmark" size={20} color={theme.tint} />}
                            </Pressable>
                        ))}
                    </ScrollView>
                </SafeAreaView>
            </Modal>

            {/* Alert */}
            <Modal visible={alertVisible} transparent animationType="fade">
                <View style={styles.alertBackdrop}>
                    <View style={[styles.alertCard, themeStyles.modalBg]}>
                        <Ionicons name={alertConfig.title === 'Success' ? 'checkmark-circle' : 'close-circle'} size={48} color={alertConfig.title === 'Success' ? '#10b981' : '#ef4444'} />
                        <Text style={[styles.alertTitle, themeStyles.text]}>{alertConfig.title}</Text>
                        <Text style={[styles.alertMessage, themeStyles.textSecondary]}>{alertConfig.message}</Text>
                        <TouchableOpacity style={[styles.alertButton, { backgroundColor: theme.tint }]} onPress={() => { setAlertVisible(false); if (alertConfig.title === 'Success') router.back(); }}>
                            <Text style={styles.alertButtonText}>Okay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 },
    backButton: { padding: 8, borderRadius: 12 },
    headerTitle: { fontSize: 20, fontWeight: '700' },
    content: { padding: 24, paddingBottom: 60 },
    uploadBox: { height: 180, borderRadius: 16, borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
    uploadText: { marginTop: 8, fontSize: 14 },
    label: { fontSize: 14, fontWeight: '600', marginBottom: 8, marginTop: 16 },
    input: { borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16 },
    textArea: { minHeight: 120, textAlignVertical: 'top' },
    selector: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14 },
    submitButton: { marginTop: 32, paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
    modalContainer: { flex: 1 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
    modalTitle: { fontSize: 20, fontWeight: '700' },
    catOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 16, borderRadius: 12, marginBottom: 4 },
    catText: { fontSize: 16, fontWeight: '500' },
    alertBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    alertCard: { width: '100%', borderRadius: 24, padding: 32, alignItems: 'center' },
    alertTitle: { fontSize: 20, fontWeight: '700', marginTop: 12, marginBottom: 8 },
    alertMessage: { fontSize: 16, textAlign: 'center', lineHeight: 22, marginBottom: 24 },
    alertButton: { paddingVertical: 14, paddingHorizontal: 40, borderRadius: 14 },
    alertButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
