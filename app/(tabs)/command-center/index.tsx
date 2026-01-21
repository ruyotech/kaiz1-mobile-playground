import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Modal, Pressable } from 'react-native';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

type CreateType = 'task' | 'challenge' | 'bill' | 'note' | null;

const CREATE_OPTIONS = [
    { id: 'task', icon: 'checkbox-marked-circle-outline', label: 'Task', color: '#3B82F6', route: '/(tabs)/sdlc/create-task' },
    { id: 'challenge', icon: 'trophy-outline', label: 'Challenge', color: '#F59E0B', route: '/(tabs)/challenges/create' },
    { id: 'bill', icon: 'cash-multiple', label: 'Bill', color: '#10B981', route: '/(tabs)/bills/create' },
    { id: 'note', icon: 'note-text-outline', label: 'Note', color: '#8B5CF6', route: '/(tabs)/command-center' },
    { id: 'book', icon: 'book-open-variant', label: 'Book', color: '#EC4899', route: '/(tabs)/books/add' },
    { id: 'event', icon: 'calendar-star', label: 'Event', color: '#06B6D4', route: '/(tabs)/command-center' },
];

export default function CommandCenterScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [input, setInput] = useState('');
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [selectedType, setSelectedType] = useState<CreateType>(null);

    const handleQuickCreate = () => {
        if (input.trim()) {
            // AI processing logic would go here
            console.log('Processing input:', input);
            setInput('');
        }
    };

    const handleCreateOption = (option: typeof CREATE_OPTIONS[0]) => {
        setShowCreateMenu(false);
        if (option.route) {
            router.push(option.route as any);
        }
    };

    const inputLineCount = input.split('\n').length;
    const dynamicHeight = Math.min(Math.max(inputLineCount * 24, 48), 200);

    return (
        <Container>
            <ScreenHeader
                title="Command Center"
                subtitle="AI-powered quick input"
            />

            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                {/* Quick Create Cards */}
                <ScrollView className="flex-1 px-4 pt-4">
                    <Text className="text-sm font-semibold text-gray-700 mb-3">Quick Create</Text>
                    <View className="flex-row flex-wrap gap-3 mb-6">
                        {CREATE_OPTIONS.map((option) => (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => handleCreateOption(option)}
                                className="flex-1 min-w-[45%] bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
                                style={{ minWidth: '45%' }}
                            >
                                <View
                                    className="w-12 h-12 rounded-2xl items-center justify-center mb-3"
                                    style={{ backgroundColor: option.color + '20' }}
                                >
                                    <MaterialCommunityIcons
                                        name={option.icon as any}
                                        size={24}
                                        color={option.color}
                                    />
                                </View>
                                <Text className="font-semibold text-gray-800 mb-1">{option.label}</Text>
                                <Text className="text-xs text-gray-500">Create new</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* AI Suggestions */}
                    <Text className="text-sm font-semibold text-gray-700 mb-3">AI Suggestions</Text>
                    <View className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-4 border border-purple-100 mb-4">
                        <View className="flex-row items-center mb-3">
                            <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                                <MaterialCommunityIcons name="sparkles" size={16} color="#8B5CF6" />
                            </View>
                            <Text className="text-sm font-semibold text-gray-800">Smart Parse</Text>
                        </View>
                        <Text className="text-sm text-gray-600 leading-5">
                            Type naturally and I'll automatically detect what you're creating - a task, bill, or note.
                            Try: "Buy groceries tomorrow" or "Internet bill $89.99 due 25th"
                        </Text>
                    </View>

                    {/* Recent Activity */}
                    <Text className="text-sm font-semibold text-gray-700 mb-3">Recent</Text>
                    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                        <View className="flex-row items-center mb-2">
                            <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                                <MaterialCommunityIcons name="checkbox-marked-circle" size={16} color="#3B82F6" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-800">Review designs</Text>
                                <Text className="text-xs text-gray-500">2 min ago • Task</Text>
                            </View>
                        </View>
                    </View>

                    <View className="bg-white rounded-xl p-4 mb-20 shadow-sm">
                        <View className="flex-row items-center mb-2">
                            <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
                                <MaterialCommunityIcons name="cash" size={16} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="font-medium text-gray-800">Netflix subscription $15.99</Text>
                                <Text className="text-xs text-gray-500">5 min ago • Bill</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>

                {/* Enhanced Input Bar */}
                <View
                    className="bg-white border-t border-gray-200"
                    style={{
                        paddingBottom: insets.bottom + 16,
                        paddingTop: 16,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: -2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 10,
                    }}
                >
                    <View className="px-4">
                        {/* Multi-line Text Input */}
                        <View className="bg-gray-50 rounded-2xl border-2 border-gray-200 mb-3 overflow-hidden">
                            <TextInput
                                value={input}
                                onChangeText={setInput}
                                placeholder="What would you like to create?"
                                placeholderTextColor="#9CA3AF"
                                className="px-4 py-3 text-base text-gray-800"
                                multiline
                                style={{
                                    minHeight: 48,
                                    maxHeight: 200,
                                    height: dynamicHeight
                                }}
                                textAlignVertical="top"
                            />
                        </View>

                        {/* Action Buttons */}
                        <View className="flex-row items-center gap-2">
                            {/* Plus Button */}
                            <TouchableOpacity
                                onPress={() => setShowCreateMenu(true)}
                                className="w-12 h-12 bg-gray-100 rounded-xl items-center justify-center"
                            >
                                <MaterialCommunityIcons name="plus-circle" size={28} color="#6B7280" />
                            </TouchableOpacity>

                            {/* Send/Create Button */}
                            <TouchableOpacity
                                onPress={handleQuickCreate}
                                disabled={!input.trim()}
                                className={`flex-1 h-12 rounded-xl items-center justify-center ${input.trim()
                                    ? 'bg-gradient-to-r from-blue-600 to-blue-700'
                                    : 'bg-gray-200'
                                    }`}
                            >
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons
                                        name="sparkles"
                                        size={20}
                                        color={input.trim() ? 'white' : '#9CA3AF'}
                                    />
                                    <Text
                                        className={`font-semibold ml-2 ${input.trim() ? 'text-white' : 'text-gray-400'
                                            }`}
                                    >
                                        AI Create
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>

            {/* Create Options Modal */}
            <Modal visible={showCreateMenu} transparent animationType="slide">
                <Pressable
                    className="flex-1 bg-black/50 justify-end"
                    onPress={() => setShowCreateMenu(false)}
                >
                    <Pressable>
                        <View className="bg-white rounded-t-3xl pt-4 pb-8 px-4">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold">What do you want to create?</Text>
                                <TouchableOpacity onPress={() => setShowCreateMenu(false)}>
                                    <MaterialCommunityIcons name="close" size={24} color="#000" />
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row flex-wrap gap-3">
                                {CREATE_OPTIONS.map((option) => (
                                    <TouchableOpacity
                                        key={option.id}
                                        onPress={() => handleCreateOption(option)}
                                        className="flex-1 min-w-[30%] items-center py-4"
                                    >
                                        <View
                                            className="w-16 h-16 rounded-2xl items-center justify-center mb-2"
                                            style={{ backgroundColor: option.color + '20' }}
                                        >
                                            <MaterialCommunityIcons
                                                name={option.icon as any}
                                                size={28}
                                                color={option.color}
                                            />
                                        </View>
                                        <Text className="text-sm font-medium text-gray-700">{option.label}</Text>
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
