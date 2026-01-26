import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Container } from '../../../components/layout/Container';
import { Card } from '../../../components/ui/Card';
import { useEssentiaStore } from '../../../store/essentiaStore';

type FilterType = 'all' | 'due' | 'new' | 'review';

export default function EssentiaFlashcardsScreen() {
    const router = useRouter();
    const { flashcards, getFlashcardsDueToday, reviewFlashcard, allBooks, userStats } = useEssentiaStore();
    
    const [filter, setFilter] = useState<FilterType>('all');
    const [isReviewMode, setIsReviewMode] = useState(false);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);

    const dueCards = getFlashcardsDueToday();
    
    const filteredCards = filter === 'due' 
        ? dueCards 
        : filter === 'new' 
            ? flashcards.filter(f => f.reviewCount === 0)
            : filter === 'review'
                ? flashcards.filter(f => f.reviewCount > 0)
                : flashcards;

    const getBookTitle = (bookId: string) => {
        const book = allBooks.find(b => b.id === bookId);
        return book?.title || 'Unknown Book';
    };

    const handleReviewAnswer = (correct: boolean) => {
        if (filteredCards[currentCardIndex]) {
            reviewFlashcard(filteredCards[currentCardIndex].id, correct);
        }
        setShowAnswer(false);
        if (currentCardIndex < filteredCards.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        } else {
            setIsReviewMode(false);
            setCurrentCardIndex(0);
        }
    };

    const startReview = () => {
        setIsReviewMode(true);
        setCurrentCardIndex(0);
        setShowAnswer(false);
    };

    if (isReviewMode && filteredCards.length > 0) {
        const currentCard = filteredCards[currentCardIndex];
        
        return (
            <Container>
                <View className="flex-1 p-4">
                    {/* Review Header */}
                    <View className="flex-row items-center justify-between mb-6">
                        <TouchableOpacity 
                            onPress={() => setIsReviewMode(false)}
                            className="w-10 h-10 items-center justify-center"
                        >
                            <MaterialCommunityIcons name="close" size={24} color="#374151" />
                        </TouchableOpacity>
                        <Text className="text-lg font-semibold text-gray-900">
                            {currentCardIndex + 1} / {filteredCards.length}
                        </Text>
                        <View className="w-10" />
                    </View>

                    {/* Progress Bar */}
                    <View className="h-2 bg-gray-200 rounded-full mb-8">
                        <View 
                            className="h-full bg-purple-600 rounded-full" 
                            style={{ width: `${((currentCardIndex + 1) / filteredCards.length) * 100}%` }} 
                        />
                    </View>

                    {/* Flashcard */}
                    <TouchableOpacity
                        onPress={() => setShowAnswer(!showAnswer)}
                        activeOpacity={0.9}
                        className="flex-1"
                    >
                        <Card className="flex-1 p-6 justify-center items-center">
                            <Text className="text-xs text-purple-600 font-medium mb-4">
                                {getBookTitle(currentCard.bookId)}
                            </Text>
                            
                            {!showAnswer ? (
                                <>
                                    <MaterialCommunityIcons name="help-circle-outline" size={48} color="#8B5CF6" />
                                    <Text className="text-xl text-gray-900 text-center mt-4 leading-8">
                                        {currentCard.question}
                                    </Text>
                                    <Text className="text-sm text-gray-500 mt-8">
                                        Tap to reveal answer
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <MaterialCommunityIcons name="lightbulb-on-outline" size={48} color="#10B981" />
                                    <Text className="text-xl text-gray-900 text-center mt-4 leading-8">
                                        {currentCard.answer}
                                    </Text>
                                </>
                            )}
                        </Card>
                    </TouchableOpacity>

                    {/* Answer Buttons */}
                    {showAnswer && (
                        <View className="flex-row gap-4 mt-6">
                            <TouchableOpacity
                                onPress={() => handleReviewAnswer(false)}
                                className="flex-1 bg-red-500 py-4 rounded-2xl flex-row items-center justify-center"
                            >
                                <MaterialCommunityIcons name="close" size={24} color="white" />
                                <Text className="text-white font-semibold ml-2">Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => handleReviewAnswer(true)}
                                className="flex-1 bg-green-500 py-4 rounded-2xl flex-row items-center justify-center"
                            >
                                <MaterialCommunityIcons name="check" size={24} color="white" />
                                <Text className="text-white font-semibold ml-2">Got it!</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </Container>
        );
    }

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
                        <Text className="text-xl font-bold text-gray-900">Flashcards</Text>
                        <View className="w-10" />
                    </View>

                    {/* Stats Overview */}
                    <View className="flex-row gap-3 mb-4">
                        <Card className="flex-1 p-4 items-center bg-purple-50 border border-purple-100">
                            <MaterialCommunityIcons name="cards" size={28} color="#8B5CF6" />
                            <Text className="text-2xl font-bold text-purple-600 mt-2">{flashcards.length}</Text>
                            <Text className="text-xs text-gray-600">Total Cards</Text>
                        </Card>
                        <Card className="flex-1 p-4 items-center bg-orange-50 border border-orange-100">
                            <MaterialCommunityIcons name="clock-alert-outline" size={28} color="#F59E0B" />
                            <Text className="text-2xl font-bold text-orange-600 mt-2">{dueCards.length}</Text>
                            <Text className="text-xs text-gray-600">Due Today</Text>
                        </Card>
                        <Card className="flex-1 p-4 items-center bg-green-50 border border-green-100">
                            <MaterialCommunityIcons name="check-circle-outline" size={28} color="#10B981" />
                            <Text className="text-2xl font-bold text-green-600 mt-2">
                                {userStats?.flashcardsReviewed || 0}
                            </Text>
                            <Text className="text-xs text-gray-600">Reviewed</Text>
                        </Card>
                    </View>

                    {/* Start Review Button */}
                    {dueCards.length > 0 && (
                        <TouchableOpacity
                            onPress={startReview}
                            className="bg-purple-600 py-4 rounded-2xl flex-row items-center justify-center mb-4"
                        >
                            <MaterialCommunityIcons name="play" size={24} color="white" />
                            <Text className="text-white font-semibold text-lg ml-2">
                                Review {dueCards.length} Cards
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* Filter Tabs */}
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
                        <View className="flex-row gap-2">
                            {[
                                { id: 'all', label: 'All', count: flashcards.length },
                                { id: 'due', label: 'Due', count: dueCards.length },
                                { id: 'new', label: 'New', count: flashcards.filter(f => f.reviewCount === 0).length },
                                { id: 'review', label: 'Reviewed', count: flashcards.filter(f => f.reviewCount > 0).length },
                            ].map(item => (
                                <TouchableOpacity
                                    key={item.id}
                                    onPress={() => setFilter(item.id as FilterType)}
                                    className={`px-4 py-2 rounded-full ${filter === item.id ? 'bg-purple-600' : 'bg-gray-100'}`}
                                >
                                    <Text className={`text-sm font-medium ${filter === item.id ? 'text-white' : 'text-gray-700'}`}>
                                        {item.label} ({item.count})
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                    {filteredCards.length === 0 ? (
                        <View className="items-center py-12">
                            <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center mb-4">
                                <MaterialCommunityIcons name="cards-outline" size={40} color="#8B5CF6" />
                            </View>
                            <Text className="text-lg font-semibold text-gray-900 mb-2">No flashcards yet</Text>
                            <Text className="text-gray-600 text-center px-8">
                                Create flashcards from your highlights to reinforce learning
                            </Text>
                        </View>
                    ) : (
                        filteredCards.map(card => (
                            <Card key={card.id} className="p-4 mb-3">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-xs text-purple-600 font-medium">
                                        {getBookTitle(card.bookId)}
                                    </Text>
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons 
                                            name="repeat" 
                                            size={14} 
                                            color="#9CA3AF" 
                                        />
                                        <Text className="text-xs text-gray-500 ml-1">
                                            {card.reviewCount} reviews
                                        </Text>
                                    </View>
                                </View>
                                
                                <Text className="text-gray-900 font-medium mb-2">{card.question}</Text>
                                <Text className="text-gray-600 text-sm">{card.answer}</Text>
                                
                                {card.nextReviewDate && (
                                    <View className="mt-3 pt-3 border-t border-gray-100">
                                        <Text className="text-xs text-gray-500">
                                            Next review: {new Date(card.nextReviewDate).toLocaleDateString()}
                                        </Text>
                                    </View>
                                )}
                            </Card>
                        ))
                    )}
                    <View className="h-24" />
                </ScrollView>
            </View>
        </Container>
    );
}
