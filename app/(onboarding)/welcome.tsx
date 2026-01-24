import { View, Text, Dimensions, Pressable } from 'react-native';
import { useRef, useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    interpolate,
    SharedValue,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native-gesture-handler';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeatureSlide {
    id: number;
    icon: string;
    title: string;
    subtitle: string;
    description: string;
    gradient: string[];
}

const FEATURES: FeatureSlide[] = [
    {
        id: 0,
        icon: '🚀',
        title: 'Welcome to Kaiz1',
        subtitle: 'Your Life, Engineered',
        description: 'Transform your life into an agile project. Plan, execute, and iterate your way to success with professional SDLC methodology.',
        gradient: ['#667eea', '#764ba2'],
    },
    {
        id: 1,
        icon: '📊',
        title: 'SDLC Task Management',
        subtitle: 'Build Your Life in Sprints',
        description: 'Break down life goals into epics and tasks. Use story points, track velocity across 52 weekly sprints, and let AI be your scrum master.',
        gradient: ['#f093fb', '#f5576c'],
    },
    {
        id: 2,
        icon: '💰',
        title: 'Smart Bill Tracking',
        subtitle: 'Scan, Track, Pay',
        description: 'Snap a photo of any bill and let AI extract all details. Track payments, get reminders, and never miss a due date again.',
        gradient: ['#4facfe', '#00f2fe'],
    },
    {
        id: 3,
        icon: '🌟',
        title: 'Daily Motivation',
        subtitle: 'Fuel Your Growth',
        description: 'Start each day with curated quotes, book summaries from thought leaders, and life wheel insights to balance all areas of your life.',
        gradient: ['#43e97b', '#38f9d7'],
    },
    {
        id: 4,
        icon: '🏆',
        title: 'Social Challenges',
        subtitle: 'Compete & Grow Together',
        description: 'Create challenges with friends and family. Track streaks, celebrate wins with reactions, and make personal growth a team sport.',
        gradient: ['#fa709a', '#fee140'],
    },
];

export default function WelcomeScreen() {
    const router = useRouter();
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useSharedValue(0);

    const handleScroll = (event: any) => {
        const offsetX = event.nativeEvent.contentOffset.x;
        scrollX.value = offsetX;
        const index = Math.round(offsetX / SCREEN_WIDTH);
        setCurrentIndex(index);
    };

    const scrollToNext = () => {
        if (currentIndex < FEATURES.length - 1) {
            scrollViewRef.current?.scrollTo({
                x: (currentIndex + 1) * SCREEN_WIDTH,
                animated: true,
            });
        } else {
            // @ts-ignore - Dynamic route
            router.push('/(onboarding)/setup');
        }
    };

    const scrollToIndex = (index: number) => {
        scrollViewRef.current?.scrollTo({
            x: index * SCREEN_WIDTH,
            animated: true,
        });
    };

    const handleSkip = () => {
        // @ts-ignore - Dynamic route
        router.push('/(onboarding)/setup');
    };

    return (
        <Container safeArea={false}>
            <View className="flex-1">
                {/* Skip Button */}
                <View className="absolute top-12 right-6 z-10">
                    <Pressable onPress={handleSkip}>
                        <Text className="text-base font-semibold text-gray-600">
                            Skip
                        </Text>
                    </Pressable>
                </View>

                {/* Feature Slides */}
                <ScrollView
                    ref={scrollViewRef}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onScroll={handleScroll}
                    scrollEventThrottle={16}
                    bounces={false}
                >
                    {FEATURES.map((feature) => (
                        <FeatureSlide
                            key={feature.id}
                            feature={feature}
                            scrollX={scrollX}
                        />
                    ))}
                </ScrollView>

                {/* Bottom Section */}
                <View className="px-8 pb-12 bg-white">
                    {/* Pagination Dots */}
                    <View className="flex-row justify-center items-center mb-8">
                        {FEATURES.map((_, index) => {
                            const dotStyle = useAnimatedStyle(() => {
                                const inputRange = [
                                    (index - 1) * SCREEN_WIDTH,
                                    index * SCREEN_WIDTH,
                                    (index + 1) * SCREEN_WIDTH,
                                ];

                                const width = interpolate(
                                    scrollX.value,
                                    inputRange,
                                    [8, 24, 8],
                                    'clamp'
                                );

                                const opacity = interpolate(
                                    scrollX.value,
                                    inputRange,
                                    [0.3, 1, 0.3],
                                    'clamp'
                                );

                                return {
                                    width,
                                    opacity,
                                };
                            });

                            return (
                                <Pressable
                                    key={index}
                                    onPress={() => scrollToIndex(index)}
                                >
                                    <Animated.View
                                        style={[dotStyle]}
                                        className="h-2 bg-blue-600 rounded-full mx-1"
                                    />
                                </Pressable>
                            );
                        })}
                    </View>

                    {/* Action Button */}
                    <Button onPress={scrollToNext} fullWidth size="lg">
                        {currentIndex === FEATURES.length - 1 ? 'Get Started' : 'Continue'}
                    </Button>
                </View>
            </View>
        </Container>
    );
}

function FeatureSlide({
    feature,
    scrollX,
}: {
    feature: FeatureSlide;
    scrollX: SharedValue<number>;
}) {
    const animatedStyle = useAnimatedStyle(() => {
        const inputRange = [
            (feature.id - 1) * SCREEN_WIDTH,
            feature.id * SCREEN_WIDTH,
            (feature.id + 1) * SCREEN_WIDTH,
        ];

        const scale = interpolate(scrollX.value, inputRange, [0.8, 1, 0.8], 'clamp');
        const opacity = interpolate(scrollX.value, inputRange, [0.5, 1, 0.5], 'clamp');

        return {
            transform: [{ scale }],
            opacity,
        };
    });

    return (
        <Animated.View
            style={[animatedStyle, { width: SCREEN_WIDTH }]}
            className="flex-1 justify-center items-center px-8 pt-24"
        >
            <View className="items-center">
                {/* Icon */}
                <View className="w-32 h-32 rounded-full bg-blue-50 items-center justify-center mb-8">
                    <Text className="text-7xl">{feature.icon}</Text>
                </View>

                {/* Title */}
                <Text className="text-4xl font-bold text-center mb-3 text-gray-900">
                    {feature.title}
                </Text>

                {/* Subtitle */}
                <Text className="text-xl font-semibold text-center mb-6 text-blue-600">
                    {feature.subtitle}
                </Text>

                {/* Description */}
                <Text className="text-base text-center text-gray-600 leading-7 px-4">
                    {feature.description}
                </Text>
            </View>
        </Animated.View>
    );
}
