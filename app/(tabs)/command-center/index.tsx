import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Message = {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
};

const ATTACHMENT_OPTIONS = [
    { id: 'image', icon: 'image', label: 'Image', color: '#3B82F6' },
    { id: 'camera', icon: 'camera', label: 'Camera', color: '#10B981' },
    { id: 'file', icon: 'file-document', label: 'File', color: '#F59E0B' },
    { id: 'voice', icon: 'microphone', label: 'Voice', color: '#EC4899' },
    { id: 'location', icon: 'map-marker', label: 'Location', color: '#8B5CF6' },
];

export default function CommandCenterScreen() {
    const insets = useSafeAreaInsets();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Hi! I\'m your AI assistant. I can help you create tasks, parse bills from photos, set reminders, and more. What can I help you with today?',
            sender: 'ai',
            timestamp: new Date(),
        },
    ]);
    const [showAttachments, setShowAttachments] = useState(false);

    const handleSend = () => {
        if (message.trim()) {
            const newMessage: Message = {
                id: Date.now().toString(),
                text: message,
                sender: 'user',
                timestamp: new Date(),
            };
            setMessages([...messages, newMessage]);
            setMessage('');

            // Simulate AI response
            setTimeout(() => {
                const aiResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'I received your message. This is a demo response. In production, this would connect to your AI backend.',
                    sender: 'ai',
                    timestamp: new Date(),
                };
                setMessages((prev) => [...prev, aiResponse]);
            }, 1000);
        }
    };

    const handleAttachmentSelect = (optionId: string) => {
        console.log('Selected attachment:', optionId);
        setShowAttachments(false);
        // TODO: Implement actual attachment logic
    };

    return (
        <Container>
            <ScreenHeader
                title="AI Assistant"
                subtitle="Multi-modal input & chat"
            />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                {/* Messages Area */}
                <ScrollView className="flex-1 px-4">
                    {messages.map((msg) => (
                        <View
                            key={msg.id}
                            className={`mb-3 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                            <View
                                className={`max-w-[80%] px-4 py-3 rounded-2xl ${msg.sender === 'user'
                                    ? 'bg-blue-600'
                                    : 'bg-gray-100'
                                    }`}
                            >
                                <Text
                                    className={`text-base ${msg.sender === 'user' ? 'text-white' : 'text-gray-800'
                                        }`}
                                >
                                    {msg.text}
                                </Text>
                            </View>
                            <Text className="text-xs text-gray-500 mt-1 px-2">
                                {msg.timestamp.toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </Text>
                        </View>
                    ))}
                </ScrollView>

                {/* Input Bar */}
                <View
                    className="px-4 py-3 bg-white border-t border-gray-200"
                    style={{ paddingBottom: insets.bottom + 12 }}
                >
                    <View className="flex-row items-center">
                        {/* Plus Button for Attachments */}
                        <TouchableOpacity
                            onPress={() => setShowAttachments(true)}
                            className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-2"
                        >
                            <MaterialCommunityIcons name="plus" size={24} color="#6B7280" />
                        </TouchableOpacity>

                        {/* Text Input */}
                        <View className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2">
                            <TextInput
                                value={message}
                                onChangeText={setMessage}
                                placeholder="Message..."
                                placeholderTextColor="#9CA3AF"
                                className="text-base"
                                multiline
                                maxLength={500}
                                style={{ maxHeight: 100 }}
                            />
                        </View>

                        {/* Send Button */}
                        <TouchableOpacity
                            onPress={handleSend}
                            disabled={!message.trim()}
                            className={`w-10 h-10 rounded-full items-center justify-center ${message.trim() ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <MaterialCommunityIcons
                                name="send"
                                size={20}
                                color="white"
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Attachment Options Modal */}
            <Modal
                visible={showAttachments}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAttachments(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setShowAttachments(false)}
                >
                    <Pressable>
                        <View className="bg-white rounded-t-3xl pt-4 pb-8 px-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold">Add Attachment</Text>
                                <TouchableOpacity onPress={() => setShowAttachments(false)}>
                                    <MaterialCommunityIcons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row flex-wrap justify-around">
                                {ATTACHMENT_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => handleAttachmentSelect(option.id)}
                                        className="items-center mb-4"
                                        style={{ width: '30%' }}
                                    >
                                        <View
                                            className="w-16 h-16 rounded-full items-center justify-center mb-2"
                                            style={{ backgroundColor: option.color + '20' }}
                                        >
                                            <MaterialCommunityIcons
                                                name={option.icon as any}
                                                size={28}
                                                color={option.color}
                                            />
                                        </View>
                                        <Text className="text-sm text-gray-700">{option.label}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </Pressable>
                </Pressable>
            </Modal>
        </Container>
    );
}
