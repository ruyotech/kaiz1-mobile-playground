import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { useEssentiaStore } from '../../../store/essentiaStore';

// Pre-defined collections with curated colors
const DEFAULT_COLLECTIONS = [
    { id: '1', name: 'Must Reads', icon: 'star', color: '#F59E0B', bookIds: [] },
    { id: '2', name: 'Career Growth', icon: 'briefcase', color: '#3B82F6', bookIds: [] },
    { id: '3', name: 'Personal Development', icon: 'account-heart', color: '#EC4899', bookIds: [] },
    { id: '4', name: 'Health & Wellness', icon: 'heart-pulse', color: '#10B981', bookIds: [] },
    { id: '5', name: 'Relationships', icon: 'account-group', color: '#8B5CF6', bookIds: [] },
];

interface Collection {
    id: string;
    name: string;
    icon: string;
    color: string;
    bookIds: string[];
}

export default function EssentiaCollectionsScreen() {
    const router = useRouter();
    const { allBooks, savedBookIds } = useEssentiaStore();
    
    const [collections, setCollections] = useState<Collection[]>(DEFAULT_COLLECTIONS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newCollectionName, setNewCollectionName] = useState('');
    const [selectedIcon, setSelectedIcon] = useState('folder');
    const [selectedColor, setSelectedColor] = useState('#8B5CF6');

    const iconOptions = [
        'folder', 'star', 'heart', 'book', 'lightbulb', 'rocket', 
        'briefcase', 'school', 'trophy', 'target', 'flag', 'bookmark'
    ];

    const colorOptions = [
        '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#EC4899',
        '#06B6D4', '#84CC16', '#F97316', '#6366F1'
    ];

    const savedBooks = allBooks.filter(book => savedBookIds.includes(book.id));

    const handleCreateCollection = () => {
        if (newCollectionName.trim()) {
            const newCollection: Collection = {
                id: Date.now().toString(),
                name: newCollectionName.trim(),
                icon: selectedIcon,
                color: selectedColor,
                bookIds: [],
            };
            setCollections([...collections, newCollection]);
            setNewCollectionName('');
            setSelectedIcon('folder');
            setSelectedColor('#8B5CF6');
            setShowCreateModal(false);
        }
    };

    const getCollectionBookCount = (collection: Collection) => {
        return collection.bookIds.filter(id => savedBookIds.includes(id)).length;
    };

    return (
        <Container>
            <View className="flex-1">
                {/* Header */}
                <View className="p-4 pb-2">
                    <View className="flex-row items-center justify-between mb-4">
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-xl font-bold text-gray-900">Collections</Text>
                        <TouchableOpacity 
                            onPress={() => setShowCreateModal(true)}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <MaterialCommunityIcons name="plus" size={24} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>

                    {/* Quick Stats */}
                    <View className="flex-row gap-3 mb-4">
                        <Card className="flex-1 p-4 items-center">
                            <MaterialCommunityIcons name="folder-multiple" size={28} color="#8B5CF6" />
                            <Text className="text-2xl font-bold text-gray-900 mt-2">{collections.length}</Text>
                            <Text className="text-xs text-gray-600">Collections</Text>
                        </Card>
                        <Card className="flex-1 p-4 items-center">
                            <MaterialCommunityIcons name="book-multiple" size={28} color="#3B82F6" />
                            <Text className="text-2xl font-bold text-gray-900 mt-2">{savedBooks.length}</Text>
                            <Text className="text-xs text-gray-600">Saved Books</Text>
                        </Card>
                    </View>
                </View>

                <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                    {/* Smart Collections */}
                    <Text className="text-lg font-semibold text-gray-900 mb-3">Smart Collections</Text>
                    <View className="flex-row gap-3 mb-6">
                        <TouchableOpacity className="flex-1">
                            <Card className="p-4 items-center bg-gradient-to-br from-blue-50 to-purple-50">
                                <View className="w-12 h-12 bg-blue-100 rounded-2xl items-center justify-center mb-2">
                                    <MaterialCommunityIcons name="clock-outline" size={24} color="#3B82F6" />
                                </View>
                                <Text className="font-semibold text-gray-900">Recently Read</Text>
                                <Text className="text-xs text-gray-500">Auto-updated</Text>
                            </Card>
                        </TouchableOpacity>
                        <TouchableOpacity className="flex-1">
                            <Card className="p-4 items-center">
                                <View className="w-12 h-12 bg-green-100 rounded-2xl items-center justify-center mb-2">
                                    <MaterialCommunityIcons name="check-circle-outline" size={24} color="#10B981" />
                                </View>
                                <Text className="font-semibold text-gray-900">Completed</Text>
                                <Text className="text-xs text-gray-500">Auto-updated</Text>
                            </Card>
                        </TouchableOpacity>
                    </View>

                    {/* User Collections */}
                    <Text className="text-lg font-semibold text-gray-900 mb-3">My Collections</Text>
                    {collections.length === 0 ? (
                        <Card className="p-8 items-center">
                            <View className="w-16 h-16 bg-purple-100 rounded-full items-center justify-center mb-4">
                                <MaterialCommunityIcons name="folder-plus" size={32} color="#8B5CF6" />
                            </View>
                            <Text className="text-lg font-semibold text-gray-900 mb-2">No collections yet</Text>
                            <Text className="text-gray-600 text-center mb-4">
                                Create collections to organize your books by topics or goals
                            </Text>
                            <TouchableOpacity
                                onPress={() => setShowCreateModal(true)}
                                className="bg-purple-600 px-6 py-3 rounded-xl"
                            >
                                <Text className="text-white font-semibold">Create Collection</Text>
                            </TouchableOpacity>
                        </Card>
                    ) : (
                        collections.map(collection => (
                            <TouchableOpacity key={collection.id} className="mb-3">
                                <Card className="p-4">
                                    <View className="flex-row items-center">
                                        <View 
                                            className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                            style={{ backgroundColor: `${collection.color}20` }}
                                        >
                                            <MaterialCommunityIcons 
                                                name={collection.icon as any} 
                                                size={24} 
                                                color={collection.color} 
                                            />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-base font-semibold text-gray-900">
                                                {collection.name}
                                            </Text>
                                            <Text className="text-sm text-gray-500">
                                                {getCollectionBookCount(collection)} books
                                            </Text>
                                        </View>
                                        <MaterialCommunityIcons name="chevron-right" size={24} color="#9CA3AF" />
                                    </View>
                                </Card>
                            </TouchableOpacity>
                        ))
                    )}

                    {/* Tips Section */}
                    <Card className="p-4 mt-4 mb-6 bg-purple-50 border border-purple-100">
                        <View className="flex-row items-start">
                            <MaterialCommunityIcons name="lightbulb-outline" size={24} color="#8B5CF6" />
                            <View className="flex-1 ml-3">
                                <Text className="font-semibold text-purple-900 mb-1">Pro Tip</Text>
                                <Text className="text-sm text-purple-800">
                                    Create themed collections like "Leadership Skills" or "Morning Reads" to organize your learning journey.
                                </Text>
                            </View>
                        </View>
                    </Card>

                    <View className="h-24" />
                </ScrollView>
            </View>

            {/* Create Collection Modal */}
            <Modal visible={showCreateModal} transparent animationType="slide">
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row justify-between items-center mb-6">
                            <Text className="text-xl font-bold text-gray-900">New Collection</Text>
                            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Name Input */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Collection Name</Text>
                        <TextInput
                            value={newCollectionName}
                            onChangeText={setNewCollectionName}
                            placeholder="e.g., Business Books"
                            className="bg-gray-100 rounded-xl px-4 py-3 text-gray-900 mb-4"
                        />

                        {/* Icon Selection */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Choose Icon</Text>
                        <View className="flex-row flex-wrap gap-2 mb-4">
                            {iconOptions.map(icon => (
                                <TouchableOpacity
                                    key={icon}
                                    onPress={() => setSelectedIcon(icon)}
                                    className={`w-12 h-12 rounded-xl items-center justify-center ${
                                        selectedIcon === icon ? 'bg-purple-100 border-2 border-purple-500' : 'bg-gray-100'
                                    }`}
                                >
                                    <MaterialCommunityIcons 
                                        name={icon as any} 
                                        size={24} 
                                        color={selectedIcon === icon ? '#8B5CF6' : '#6B7280'} 
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Color Selection */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Choose Color</Text>
                        <View className="flex-row flex-wrap gap-2 mb-6">
                            {colorOptions.map(color => (
                                <TouchableOpacity
                                    key={color}
                                    onPress={() => setSelectedColor(color)}
                                    className={`w-10 h-10 rounded-full ${
                                        selectedColor === color ? 'border-4 border-gray-300' : ''
                                    }`}
                                    style={{ backgroundColor: color }}
                                />
                            ))}
                        </View>

                        {/* Preview */}
                        <Text className="text-sm font-medium text-gray-700 mb-2">Preview</Text>
                        <Card className="p-4 mb-6">
                            <View className="flex-row items-center">
                                <View 
                                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                                    style={{ backgroundColor: `${selectedColor}20` }}
                                >
                                    <MaterialCommunityIcons 
                                        name={selectedIcon as any} 
                                        size={24} 
                                        color={selectedColor} 
                                    />
                                </View>
                                <Text className="text-base font-semibold text-gray-900">
                                    {newCollectionName || 'Collection Name'}
                                </Text>
                            </View>
                        </Card>

                        {/* Create Button */}
                        <TouchableOpacity
                            onPress={handleCreateCollection}
                            className="bg-purple-600 py-4 rounded-xl items-center"
                        >
                            <Text className="text-white font-semibold text-lg">Create Collection</Text>
                        </TouchableOpacity>

                        <View className="h-4" />
                    </View>
                </View>
            </Modal>
        </Container>
    );
}
