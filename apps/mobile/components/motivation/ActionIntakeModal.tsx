import { View, Text, TouchableOpacity, Modal, Pressable, TextInput } from 'react-native';
import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MindsetContent } from '../../types/models';
import { BlurView } from 'expo-blur';

interface ActionIntakeModalProps {
    visible: boolean;
    content: MindsetContent | null;
    onClose: () => void;
    onInternalize: (note: string) => void;
    onOperationalize: (taskTitle: string) => void;
    onAddToCollection: () => void;
}

export function ActionIntakeModal({
    visible,
    content,
    onClose,
    onInternalize,
    onOperationalize,
    onAddToCollection,
}: ActionIntakeModalProps) {
    const [actionType, setActionType] = useState<'internalize' | 'operationalize' | null>(null);
    const [inputText, setInputText] = useState('');

    const handleSubmit = () => {
        if (!inputText.trim()) return;

        if (actionType === 'internalize') {
            onInternalize(inputText);
        } else if (actionType === 'operationalize') {
            onOperationalize(inputText);
        }

        setInputText('');
        setActionType(null);
        onClose();
    };

    const handleCollection = () => {
        onAddToCollection();
        onClose();
    };

    if (!content) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable className="flex-1 bg-black/60" onPress={onClose}>
                <View className="flex-1 justify-end">
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <BlurView intensity={80} tint="light" className="rounded-t-3xl overflow-hidden">
                            <View className="bg-white/95 rounded-t-3xl p-6 pb-8">
                                {/* Header */}
                                <View className="flex-row items-center justify-between mb-4">
                                    <Text className="text-xl font-bold text-gray-900">
                                        Make It Actionable
                                    </Text>
                                    <TouchableOpacity onPress={onClose}>
                                        <MaterialCommunityIcons name="close" size={24} color="#6B7280" />
                                    </TouchableOpacity>
                                </View>

                                {/* Quote Preview */}
                                <View className="bg-gray-50 rounded-xl p-4 mb-6">
                                    <Text className="text-sm text-gray-700 italic" numberOfLines={3}>
                                        "{content.body}"
                                    </Text>
                                </View>

                                {!actionType ? (
                                    // Main Actions
                                    <View className="gap-3">
                                        <TouchableOpacity
                                            onPress={() => setActionType('internalize')}
                                            className="flex-row items-center p-4 bg-purple-50 rounded-xl border-2 border-purple-200"
                                        >
                                            <View className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center mr-4">
                                                <MaterialCommunityIcons name="book-open-variant" size={24} color="white" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-base font-bold text-purple-900">
                                                    📝 Internalize
                                                </Text>
                                                <Text className="text-sm text-purple-700">
                                                    Save as journal prompt or reflection
                                                </Text>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={() => setActionType('operationalize')}
                                            className="flex-row items-center p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
                                        >
                                            <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-4">
                                                <MaterialCommunityIcons name="checkbox-marked-circle" size={24} color="white" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-base font-bold text-blue-900">
                                                    ✅ Operationalize
                                                </Text>
                                                <Text className="text-sm text-blue-700">
                                                    Convert to actionable task
                                                </Text>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            onPress={handleCollection}
                                            className="flex-row items-center p-4 bg-amber-50 rounded-xl border-2 border-amber-200"
                                        >
                                            <View className="w-12 h-12 bg-amber-500 rounded-full items-center justify-center mr-4">
                                                <MaterialCommunityIcons name="star" size={24} color="white" />
                                            </View>
                                            <View className="flex-1">
                                                <Text className="text-base font-bold text-amber-900">
                                                    ⭐ Collection
                                                </Text>
                                                <Text className="text-sm text-amber-700">
                                                    Save to favorites for widget
                                                </Text>
                                            </View>
                                            <MaterialCommunityIcons name="chevron-right" size={20} color="#6B7280" />
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    // Input Form
                                    <View>
                                        <Text className="text-sm font-semibold text-gray-700 mb-2">
                                            {actionType === 'internalize' ? 'Add your reflection:' : 'Create task:'}
                                        </Text>
                                        <TextInput
                                            value={inputText}
                                            onChangeText={setInputText}
                                            placeholder={
                                                actionType === 'internalize'
                                                    ? 'What does this mean to you?'
                                                    : 'What action will you take?'
                                            }
                                            multiline
                                            className="bg-gray-50 rounded-xl p-4 text-base border border-gray-200 min-h-24 mb-4"
                                            placeholderTextColor="#9CA3AF"
                                            autoFocus
                                        />

                                        <View className="flex-row gap-3">
                                            <TouchableOpacity
                                                onPress={() => {
                                                    setActionType(null);
                                                    setInputText('');
                                                }}
                                                className="flex-1 bg-gray-100 rounded-xl p-4 items-center"
                                            >
                                                <Text className="text-gray-700 font-semibold">Cancel</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={handleSubmit}
                                                disabled={!inputText.trim()}
                                                className={`flex-1 rounded-xl p-4 items-center ${
                                                    inputText.trim() ? 'bg-blue-600' : 'bg-gray-300'
                                                }`}
                                            >
                                                <Text className="text-white font-bold">
                                                    {actionType === 'internalize' ? 'Save to Journal' : 'Create Task'}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )}
                            </View>
                        </BlurView>
                    </Pressable>
                </View>
            </Pressable>
        </Modal>
    );
}
