/**
 * Sprint Retrospective Screen
 * 
 * Facilitates sprint retrospective ceremony with structured reflection,
 * improvement identification, and action item generation.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSensAIStore } from '../../../store/sensaiStore';

type RetroCategory = 'went_well' | 'improve' | 'try_next';

interface RetroItem {
    id: string;
    category: RetroCategory;
    text: string;
    votes: number;
}

export default function SprintRetrospectiveScreen() {
    const { startCeremony } = useSensAIStore();
    const [isStarted, setIsStarted] = useState(false);
    const [step, setStep] = useState<'collect' | 'discuss' | 'actions'>('collect');
    const [items, setItems] = useState<RetroItem[]>([
        // Pre-populated suggestions based on sprint data
        { id: '1', category: 'went_well', text: 'Consistent morning routine', votes: 0 },
        { id: '2', category: 'went_well', text: 'Completed reading goal', votes: 0 },
        { id: '3', category: 'improve', text: 'Finance tasks keep getting pushed', votes: 0 },
        { id: '4', category: 'improve', text: 'Overcommitted on points', votes: 0 },
    ]);
    const [newItem, setNewItem] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<RetroCategory>('went_well');
    const [actionItems, setActionItems] = useState<string[]>([]);
    const [newAction, setNewAction] = useState('');

    const handleStartRetro = async () => {
        await startCeremony('retrospective');
        setIsStarted(true);
    };

    const addItem = () => {
        if (newItem.trim()) {
            setItems([
                ...items,
                {
                    id: Date.now().toString(),
                    category: selectedCategory,
                    text: newItem.trim(),
                    votes: 0,
                },
            ]);
            setNewItem('');
        }
    };

    const toggleVote = (id: string) => {
        setItems(items.map(item => 
            item.id === id 
                ? { ...item, votes: item.votes > 0 ? 0 : 1 }
                : item
        ));
    };

    const addAction = () => {
        if (newAction.trim()) {
            setActionItems([...actionItems, newAction.trim()]);
            setNewAction('');
        }
    };

    const categoryConfig: Record<RetroCategory, { title: string; icon: string; color: string; bgColor: string }> = {
        went_well: { title: 'What Went Well', icon: 'thumb-up', color: '#10B981', bgColor: 'bg-emerald-500/20' },
        improve: { title: 'What to Improve', icon: 'alert-circle', color: '#F59E0B', bgColor: 'bg-yellow-500/20' },
        try_next: { title: 'Try Next Sprint', icon: 'lightbulb', color: '#3B82F6', bgColor: 'bg-blue-500/20' },
    };

    const renderCollectStep = () => (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            {/* Category Tabs */}
            <View className="flex-row mb-4">
                {(Object.keys(categoryConfig) as RetroCategory[]).map(cat => (
                    <TouchableOpacity
                        key={cat}
                        onPress={() => setSelectedCategory(cat)}
                        className={`flex-1 p-3 rounded-xl mr-2 ${
                            selectedCategory === cat 
                                ? categoryConfig[cat].bgColor 
                                : 'bg-gray-800'
                        }`}
                    >
                        <View className="items-center">
                            <MaterialCommunityIcons 
                                name={categoryConfig[cat].icon as any} 
                                size={24} 
                                color={selectedCategory === cat ? categoryConfig[cat].color : '#6B7280'} 
                            />
                            <Text 
                                className={`text-xs mt-1 ${
                                    selectedCategory === cat ? 'text-white' : 'text-gray-500'
                                }`}
                            >
                                {categoryConfig[cat].title.split(' ').slice(-1)}
                            </Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Add New Item */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-3">{categoryConfig[selectedCategory].title}</Text>
                <View className="flex-row">
                    <TextInput
                        value={newItem}
                        onChangeText={setNewItem}
                        placeholder="Add your thought..."
                        placeholderTextColor="#6B7280"
                        className="flex-1 bg-gray-700 text-white p-3 rounded-xl mr-2"
                    />
                    <TouchableOpacity
                        onPress={addItem}
                        className="bg-emerald-500 w-12 h-12 rounded-xl items-center justify-center"
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Items by Category */}
            {(Object.keys(categoryConfig) as RetroCategory[]).map(cat => {
                const catItems = items.filter(i => i.category === cat);
                if (catItems.length === 0) return null;

                return (
                    <View key={cat} className="mb-4">
                        <View className="flex-row items-center mb-3">
                            <MaterialCommunityIcons 
                                name={categoryConfig[cat].icon as any} 
                                size={20} 
                                color={categoryConfig[cat].color} 
                            />
                            <Text className="text-white font-semibold ml-2">
                                {categoryConfig[cat].title}
                            </Text>
                            <View 
                                className={`ml-2 px-2 py-0.5 rounded-full ${categoryConfig[cat].bgColor}`}
                            >
                                <Text style={{ color: categoryConfig[cat].color }}>{catItems.length}</Text>
                            </View>
                        </View>
                        {catItems.map(item => (
                            <TouchableOpacity
                                key={item.id}
                                onPress={() => toggleVote(item.id)}
                                className={`bg-gray-800 p-4 rounded-xl mb-2 flex-row items-center ${
                                    item.votes > 0 ? 'border-2' : ''
                                }`}
                                style={item.votes > 0 ? { borderColor: categoryConfig[cat].color } : {}}
                            >
                                <Text className="text-white flex-1">{item.text}</Text>
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons 
                                        name={item.votes > 0 ? 'star' : 'star-outline'} 
                                        size={20} 
                                        color={item.votes > 0 ? '#F59E0B' : '#6B7280'} 
                                    />
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                );
            })}

            {/* Continue Button */}
            <TouchableOpacity
                onPress={() => setStep('discuss')}
                className="bg-emerald-500 p-4 rounded-xl mt-4"
            >
                <Text className="text-white text-center font-semibold text-lg">Continue to Discussion</Text>
            </TouchableOpacity>
        </ScrollView>
    );

    const renderDiscussStep = () => {
        const starredItems = items.filter(i => i.votes > 0);
        const topItems = starredItems.length > 0 ? starredItems : items.slice(0, 3);

        return (
            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                    <View className="flex-row items-center mb-4">
                        <MaterialCommunityIcons name="robot" size={24} color="#10B981" />
                        <Text className="text-white text-lg font-semibold ml-2">Coach's Analysis</Text>
                    </View>
                    
                    <Text className="text-gray-300 mb-4">
                        Based on your sprint data and reflection, here are the key themes:
                    </Text>

                    <View className="space-y-4">
                        <View className="bg-emerald-500/20 p-4 rounded-xl">
                            <Text className="text-emerald-400 font-semibold mb-2">🌟 Strength Pattern</Text>
                            <Text className="text-gray-300">
                                Your Health and Growth dimensions showed consistent progress. 
                                Morning routines are working well for you.
                            </Text>
                        </View>

                        <View className="bg-yellow-500/20 p-4 rounded-xl mt-4">
                            <Text className="text-yellow-400 font-semibold mb-2">⚠️ Improvement Area</Text>
                            <Text className="text-gray-300">
                                Finance tasks were deprioritized 3 sprints in a row. 
                                Consider scheduling them earlier in the sprint.
                            </Text>
                        </View>

                        <View className="bg-blue-500/20 p-4 rounded-xl mt-4">
                            <Text className="text-blue-400 font-semibold mb-2">💡 Suggestion</Text>
                            <Text className="text-gray-300">
                                Your completion rate improves when you plan 15% fewer points. 
                                Quality over quantity is your winning strategy.
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Starred Items for Discussion */}
                <View className="mb-4">
                    <Text className="text-white text-lg font-semibold mb-3">Focus Items</Text>
                    {topItems.map(item => (
                        <View 
                            key={item.id}
                            className={`bg-gray-800 p-4 rounded-xl mb-2 border-l-4`}
                            style={{ borderLeftColor: categoryConfig[item.category].color }}
                        >
                            <Text className="text-gray-400 text-xs mb-1">
                                {categoryConfig[item.category].title}
                            </Text>
                            <Text className="text-white">{item.text}</Text>
                        </View>
                    ))}
                </View>

                <View className="flex-row gap-3">
                    <TouchableOpacity
                        onPress={() => setStep('collect')}
                        className="flex-1 bg-gray-700 p-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold">Back</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setStep('actions')}
                        className="flex-1 bg-emerald-500 p-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold">Create Actions</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    };

    const renderActionsStep = () => (
        <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
            <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                <Text className="text-white text-lg font-semibold mb-2">Action Items</Text>
                <Text className="text-gray-400 mb-4">
                    What specific changes will you make next sprint?
                </Text>

                {/* Suggested Actions */}
                <Text className="text-gray-500 text-sm mb-2">Suggested by Coach:</Text>
                {[
                    'Schedule finance review for sprint day 2',
                    'Reduce planned points by 10%',
                    'Add morning routine as recurring task',
                ].map((suggestion, idx) => (
                    <TouchableOpacity
                        key={idx}
                        onPress={() => {
                            if (!actionItems.includes(suggestion)) {
                                setActionItems([...actionItems, suggestion]);
                            }
                        }}
                        className={`flex-row items-center p-3 rounded-lg mb-2 ${
                            actionItems.includes(suggestion) ? 'bg-emerald-500/20' : 'bg-gray-700'
                        }`}
                    >
                        <MaterialCommunityIcons 
                            name={actionItems.includes(suggestion) ? 'check-circle' : 'plus-circle-outline'} 
                            size={20} 
                            color={actionItems.includes(suggestion) ? '#10B981' : '#6B7280'} 
                        />
                        <Text className="text-white ml-3">{suggestion}</Text>
                    </TouchableOpacity>
                ))}

                {/* Custom Action Input */}
                <View className="flex-row mt-4">
                    <TextInput
                        value={newAction}
                        onChangeText={setNewAction}
                        placeholder="Add custom action..."
                        placeholderTextColor="#6B7280"
                        className="flex-1 bg-gray-700 text-white p-3 rounded-xl mr-2"
                    />
                    <TouchableOpacity
                        onPress={addAction}
                        className="bg-emerald-500 w-12 h-12 rounded-xl items-center justify-center"
                    >
                        <MaterialCommunityIcons name="plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Action Items List */}
            {actionItems.length > 0 && (
                <View className="bg-gray-800 rounded-2xl p-6 mb-4">
                    <Text className="text-white font-semibold mb-3">
                        Your Action Items ({actionItems.length})
                    </Text>
                    {actionItems.map((action, idx) => (
                        <View 
                            key={idx}
                            className="flex-row items-center p-3 bg-emerald-500/10 rounded-lg mb-2"
                        >
                            <View className="w-6 h-6 rounded-full bg-emerald-500 items-center justify-center mr-3">
                                <Text className="text-white font-bold text-sm">{idx + 1}</Text>
                            </View>
                            <Text className="text-white flex-1">{action}</Text>
                            <TouchableOpacity
                                onPress={() => setActionItems(actionItems.filter((_, i) => i !== idx))}
                            >
                                <MaterialCommunityIcons name="close" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            )}

            {/* Complete Retro */}
            <View className="flex-row gap-3">
                <TouchableOpacity
                    onPress={() => setStep('discuss')}
                    className="flex-1 bg-gray-700 p-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        // Save action items and complete retro
                        router.back();
                    }}
                    className="flex-1 bg-emerald-500 p-4 rounded-xl"
                >
                    <Text className="text-white text-center font-semibold">Complete Retro</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

    if (!isStarted) {
        return (
            <SafeAreaView className="flex-1 bg-gray-900">
                {/* Header */}
                <View className="flex-row items-center p-4 border-b border-gray-800">
                    <TouchableOpacity onPress={() => router.back()} className="mr-4">
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-semibold">Retrospective</Text>
                </View>

                <View className="flex-1 justify-center items-center p-6">
                    <View className="bg-orange-500/20 w-24 h-24 rounded-full items-center justify-center mb-6">
                        <MaterialCommunityIcons name="comment-multiple" size={48} color="#F97316" />
                    </View>
                    
                    <Text className="text-white text-2xl font-bold mb-2 text-center">
                        Time to Reflect
                    </Text>
                    <Text className="text-gray-400 text-center mb-8">
                        Let's examine what worked, what didn't, and how to improve next sprint.
                    </Text>

                    <View className="bg-gray-800 rounded-2xl p-6 w-full mb-6">
                        <Text className="text-white font-semibold mb-4">Retrospective process:</Text>
                        {[
                            { icon: 'thumb-up', text: 'Identify what went well', color: '#10B981' },
                            { icon: 'alert-circle', text: 'Note areas for improvement', color: '#F59E0B' },
                            { icon: 'lightbulb', text: 'Brainstorm experiments', color: '#3B82F6' },
                            { icon: 'checkbox-marked', text: 'Commit to action items', color: '#A855F7' },
                        ].map((item, idx) => (
                            <View key={idx} className="flex-row items-center mb-3">
                                <MaterialCommunityIcons name={item.icon as any} size={20} color={item.color} />
                                <Text className="text-gray-300 ml-3">{item.text}</Text>
                            </View>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleStartRetro}
                        className="bg-orange-500 w-full p-4 rounded-xl"
                    >
                        <Text className="text-white text-center font-semibold text-lg">Start Retrospective</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-semibold flex-1">Retrospective</Text>
                
                {/* Step indicator */}
                <View className="flex-row">
                    {['collect', 'discuss', 'actions'].map((s, idx) => (
                        <View 
                            key={s}
                            className={`w-2 h-2 rounded-full mx-1 ${
                                ['collect', 'discuss', 'actions'].indexOf(step) >= idx 
                                    ? 'bg-orange-500' 
                                    : 'bg-gray-600'
                            }`}
                        />
                    ))}
                </View>
            </View>

            {step === 'collect' && renderCollectStep()}
            {step === 'discuss' && renderDiscussStep()}
            {step === 'actions' && renderActionsStep()}
        </SafeAreaView>
    );
}
