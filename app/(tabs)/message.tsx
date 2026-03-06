import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MessageScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Messages Yet</Text>
          <Text style={styles.emptyDesc}>Start a conversation with a creator or client.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { padding: 20, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#0F172A' },
  content: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyState: { alignItems: 'center' },
  emptyTitle: { fontSize: 18, fontWeight: 'bold', color: '#334155', marginTop: 16 },
  emptyDesc: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center' },
});