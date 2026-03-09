import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    FlatList,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatMessage, MOCK_CHAT_MESSAGES, MOCK_THREADS } from '../../constants/mockData';
import { useTheme } from '../../context/ThemeContext';

export default function ChatScreen() {
    const { theme, isDark } = useTheme();
    const router = useRouter();
    const { id } = useLocalSearchParams<{ id: string }>();
    const insets = useSafeAreaInsets();
    const flatListRef = useRef<FlatList>(null);

    const currentUserId = 'mock-user-1';
    const partner = MOCK_THREADS.find(t => t.partnerId === id);
    const partnerName = partner?.partnerName || 'User';
    const partnerAvatar = partner?.partnerAvatar || null;

    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (!inputText.trim()) return;
        const newMsg: ChatMessage = {
            id: messages.length + 1,
            senderId: currentUserId,
            content: inputText.trim(),
            created_at: new Date().toISOString(),
            is_read: false,
        };
        setMessages(prev => [...prev, newMsg]);
        setInputText('');
        setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    };

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = ({ item }: { item: ChatMessage }) => {
        const isMe = item.senderId === currentUserId;
        return (
            <View style={[styles.messageRow, isMe ? styles.messageRowRight : styles.messageRowLeft]}>
                {!isMe && (
                    <View style={styles.avatarSmall}>
                        {partnerAvatar ? (
                            <Image source={{ uri: partnerAvatar }} style={styles.avatarImg} />
                        ) : (
                            <View style={[styles.avatarImg, { backgroundColor: theme.tint, justifyContent: 'center', alignItems: 'center' }]}>
                                <Text style={{ color: '#fff', fontWeight: '700', fontSize: 12 }}>{partnerName.charAt(0)}</Text>
                            </View>
                        )}
                    </View>
                )}
                <View style={[styles.bubble, isMe ? [styles.bubbleRight, { backgroundColor: theme.tint }] : [styles.bubbleLeft, { backgroundColor: theme.card, borderColor: theme.cardBorder, borderWidth: 1 }]]}>
                    <Text style={[styles.bubbleText, { color: isMe ? '#fff' : theme.text }]}>{item.content}</Text>
                    <Text style={[styles.bubbleTime, { color: isMe ? 'rgba(255,255,255,0.7)' : theme.textSecondary }]}>{formatTime(item.created_at)}</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

            {/* Header */}
            <View style={[styles.header, { backgroundColor: theme.card, paddingTop: insets.top + 8 }]}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={theme.text} />
                </Pressable>
                <View style={styles.headerInfo}>
                    {partnerAvatar ? (
                        <Image source={{ uri: partnerAvatar }} style={styles.headerAvatar} />
                    ) : (
                        <View style={[styles.headerAvatar, { backgroundColor: theme.tint, justifyContent: 'center', alignItems: 'center' }]}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>{partnerName.charAt(0)}</Text>
                        </View>
                    )}
                    <View>
                        <Text style={[styles.headerName, { color: theme.text }]}>{partnerName}</Text>
                        <Text style={[styles.headerStatus, { color: theme.textSecondary }]}>Online</Text>
                    </View>
                </View>
                <Pressable style={styles.headerAction}>
                    <Ionicons name="ellipsis-vertical" size={20} color={theme.text} />
                </Pressable>
            </View>

            {/* Messages */}
            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={item => item.id.toString()}
                renderItem={renderMessage}
                contentContainerStyle={styles.messageList}
                showsVerticalScrollIndicator={false}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
            />

            {/* Input */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
                <View style={[styles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.cardBorder, paddingBottom: insets.bottom + 8 }]}>
                    <View style={[styles.inputContainer, { backgroundColor: theme.inputBackground, borderColor: theme.inputBorder, borderWidth: 1 }]}>
                        <TextInput
                            style={[styles.textInput, { color: theme.text }]}
                            placeholder="Type a message..."
                            placeholderTextColor={theme.textSecondary}
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            maxLength={1000}
                        />
                    </View>
                    <Pressable style={[styles.sendButton, { backgroundColor: theme.tint, opacity: inputText.trim() ? 1 : 0.5 }]} onPress={sendMessage} disabled={!inputText.trim()}>
                        <Ionicons name="send" size={20} color="#fff" />
                    </Pressable>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6, elevation: 2 },
    backButton: { padding: 8, borderRadius: 12, marginRight: 8 },
    headerInfo: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 12 },
    headerAvatar: { width: 40, height: 40, borderRadius: 20 },
    headerName: { fontSize: 17, fontWeight: '600' },
    headerStatus: { fontSize: 13 },
    headerAction: { padding: 8 },
    messageList: { paddingHorizontal: 16, paddingVertical: 20, paddingBottom: 8 },
    messageRow: { marginBottom: 12, flexDirection: 'row', alignItems: 'flex-end' },
    messageRowLeft: { justifyContent: 'flex-start' },
    messageRowRight: { justifyContent: 'flex-end' },
    avatarSmall: { marginRight: 8 },
    avatarImg: { width: 28, height: 28, borderRadius: 14 },
    bubble: { maxWidth: '75%', borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
    bubbleLeft: { borderBottomLeftRadius: 4 },
    bubbleRight: { borderBottomRightRadius: 4 },
    bubbleText: { fontSize: 15, lineHeight: 21 },
    bubbleTime: { fontSize: 11, marginTop: 4, alignSelf: 'flex-end' },
    inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, gap: 10 },
    inputContainer: { flex: 1, borderRadius: 24, paddingHorizontal: 16, minHeight: 44, justifyContent: 'center' },
    textInput: { fontSize: 16, maxHeight: 100, paddingVertical: 10 },
    sendButton: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
});
