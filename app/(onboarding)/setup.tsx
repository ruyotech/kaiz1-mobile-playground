import { View, Text, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { Container } from '../../components/layout/Container';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppStore } from '../../store/appStore';

interface LifeWheelArea {
    id: string;
    name: string;
    icon: string;
    color: string;
}

const LIFE_WHEEL_AREAS: LifeWheelArea[] = [
    { id: '1', name: 'Career', icon: '💼', color: 'bg-blue-500' },
    { id: '2', name: 'Health', icon: '💪', color: 'bg-green-500' },
    { id: '3', name: 'Finance', icon: '💰', color: 'bg-yellow-500' },
    { id: '4', name: 'Relationships', icon: '❤️', color: 'bg-red-500' },
    { id: '5', name: 'Personal Growth', icon: '🌱', color: 'bg-purple-500' },
    { id: '6', name: 'Fun & Recreation', icon: '🎉', color: 'bg-pink-500' },
    { id: '7', name: 'Physical Environment', icon: '🏡', color: 'bg-orange-500' },
    { id: '8', name: 'Contribution', icon: '🤝', color: 'bg-teal-500' },
];

type SetupStep = 'profile' | 'areas' | 'preferences' | 'notifications';

export default function SetupScreen() {
    const router = useRouter();
    const { setOnboarded } = useAppStore();
    const [currentStep, setCurrentStep] = useState<SetupStep>('profile');
    const [loading, setLoading] = useState(false);

    // Profile state
    const [fullName, setFullName] = useState('');
    const [timezone, setTimezone] = useState('America/New_York');

    // Life wheel areas state
    const [selectedAreas, setSelectedAreas] = useState<string[]>([]);

    // Preferences state
    const [weekStartsOn, setWeekStartsOn] = useState<'sunday' | 'monday'>('monday');
    const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto');

    // Notifications state
    const [enableDailyReminders, setEnableDailyReminders] = useState(true);
    const [enableAiInsights, setEnableAiInsights] = useState(true);
    const [enableChallenges, setEnableChallenges] = useState(true);

    const steps: SetupStep[] = ['profile', 'areas', 'preferences', 'notifications'];
    const currentStepIndex = steps.indexOf(currentStep);
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const toggleArea = (areaId: string) => {
        setSelectedAreas((prev) =>
            prev.includes(areaId)
                ? prev.filter((id) => id !== areaId)
                : [...prev, areaId]
        );
    };

    const validateCurrentStep = (): boolean => {
        switch (currentStep) {
            case 'profile':
                if (!fullName.trim()) {
                    Alert.alert('Required', 'Please enter your full name');
                    return false;
                }
                return true;
            case 'areas':
                if (selectedAreas.length === 0) {
                    Alert.alert('Required', 'Please select at least one life area to focus on');
                    return false;
                }
                return true;
            default:
                return true;
        }
    };

    const handleNext = () => {
        if (!validateCurrentStep()) return;

        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            setCurrentStep(steps[nextIndex]);
        } else {
            handleComplete();
        }
    };

    const handleBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            setCurrentStep(steps[prevIndex]);
        }
    };

    const handleComplete = async () => {
        setLoading(true);
        
        // Simulate API call to save preferences
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        setOnboarded(true);
        setLoading(false);
        router.replace('/(auth)/login');
    };

    return (
        <Container safeArea={false}>
            <View className="flex-1 pt-12">
                {/* Progress Bar */}
                <View className="px-6 mb-6">
                    <View className="flex-row justify-between items-center mb-2">
                        <Text className="text-sm font-semibold text-gray-900">
                            {currentStepIndex + 1} of {steps.length}
                        </Text>
                        <Text className="text-sm text-gray-600">
                            {Math.round(progress)}% Complete
                        </Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <Animated.View
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${progress}%` }}
                        />
                    </View>
                </View>

                {/* Content */}
                <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                    {currentStep === 'profile' && (
                        <ProfileStep
                            fullName={fullName}
                            setFullName={setFullName}
                            timezone={timezone}
                            setTimezone={setTimezone}
                        />
                    )}

                    {currentStep === 'areas' && (
                        <AreasStep
                            areas={LIFE_WHEEL_AREAS}
                            selectedAreas={selectedAreas}
                            toggleArea={toggleArea}
                        />
                    )}

                    {currentStep === 'preferences' && (
                        <PreferencesStep
                            weekStartsOn={weekStartsOn}
                            setWeekStartsOn={setWeekStartsOn}
                            theme={theme}
                            setTheme={setTheme}
                        />
                    )}

                    {currentStep === 'notifications' && (
                        <NotificationsStep
                            enableDailyReminders={enableDailyReminders}
                            setEnableDailyReminders={setEnableDailyReminders}
                            enableAiInsights={enableAiInsights}
                            setEnableAiInsights={setEnableAiInsights}
                            enableChallenges={enableChallenges}
                            setEnableChallenges={setEnableChallenges}
                        />
                    )}
                </ScrollView>

                {/* Bottom Actions */}
                <View className="px-6 py-4 bg-white border-t border-gray-200">
                    <View className="flex-row gap-3">
                        {currentStepIndex > 0 && (
                            <Button
                                onPress={handleBack}
                                variant="outline"
                                size="lg"
                                fullWidth
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            onPress={handleNext}
                            size="lg"
                            fullWidth
                            loading={loading}
                        >
                            {currentStepIndex === steps.length - 1 ? 'Complete' : 'Continue'}
                        </Button>
                    </View>
                </View>
            </View>
        </Container>
    );
}

function ProfileStep({
    fullName,
    setFullName,
    timezone,
    setTimezone,
}: {
    fullName: string;
    setFullName: (value: string) => void;
    timezone: string;
    setTimezone: (value: string) => void;
}) {
    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutUp} className="px-6">
            <Text className="text-3xl font-bold mb-2">Tell us about yourself</Text>
            <Text className="text-base text-gray-600 mb-8">
                Let's personalize your experience
            </Text>

            <Input
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="John Doe"
            />

            <Input
                label="Timezone"
                value={timezone}
                onChangeText={setTimezone}
                placeholder="America/New_York"
            />

            <View className="mt-6 p-4 bg-blue-50 rounded-lg">
                <Text className="text-sm text-blue-900">
                    💡 <Text className="font-semibold">Pro Tip:</Text> Your timezone helps us
                    send reminders and insights at the perfect time for you.
                </Text>
            </View>
        </Animated.View>
    );
}

function AreasStep({
    areas,
    selectedAreas,
    toggleArea,
}: {
    areas: LifeWheelArea[];
    selectedAreas: string[];
    toggleArea: (id: string) => void;
}) {
    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutUp} className="px-6">
            <Text className="text-3xl font-bold mb-2">Choose your focus areas</Text>
            <Text className="text-base text-gray-600 mb-8">
                Select the life areas you want to improve (choose at least one)
            </Text>

            <View className="flex-row flex-wrap gap-3">
                {areas.map((area) => {
                    const isSelected = selectedAreas.includes(area.id);
                    return (
                        <Pressable
                            key={area.id}
                            onPress={() => toggleArea(area.id)}
                            className={`
                                px-4 py-3 rounded-xl border-2 flex-row items-center gap-2
                                ${isSelected ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}
                            `}
                        >
                            <Text className="text-2xl">{area.icon}</Text>
                            <Text
                                className={`font-semibold ${
                                    isSelected ? 'text-blue-900' : 'text-gray-700'
                                }`}
                            >
                                {area.name}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            <View className="mt-6 p-4 bg-purple-50 rounded-lg">
                <Text className="text-sm text-purple-900">
                    🎯 <Text className="font-semibold">Life Wheel:</Text> Balance across these
                    areas leads to a fulfilling life. You can adjust these anytime.
                </Text>
            </View>
        </Animated.View>
    );
}

function PreferencesStep({
    weekStartsOn,
    setWeekStartsOn,
    theme,
    setTheme,
}: {
    weekStartsOn: 'sunday' | 'monday';
    setWeekStartsOn: (value: 'sunday' | 'monday') => void;
    theme: 'light' | 'dark' | 'auto';
    setTheme: (value: 'light' | 'dark' | 'auto') => void;
}) {
    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutUp} className="px-6">
            <Text className="text-3xl font-bold mb-2">Set your preferences</Text>
            <Text className="text-base text-gray-600 mb-8">
                Customize how the app works for you
            </Text>

            <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                    Week starts on
                </Text>
                <View className="flex-row gap-3">
                    <Pressable
                        onPress={() => setWeekStartsOn('monday')}
                        className={`
                            flex-1 py-4 rounded-lg border-2
                            ${weekStartsOn === 'monday' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                        `}
                    >
                        <Text
                            className={`text-center font-semibold ${
                                weekStartsOn === 'monday' ? 'text-blue-900' : 'text-gray-700'
                            }`}
                        >
                            Monday
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setWeekStartsOn('sunday')}
                        className={`
                            flex-1 py-4 rounded-lg border-2
                            ${weekStartsOn === 'sunday' ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                        `}
                    >
                        <Text
                            className={`text-center font-semibold ${
                                weekStartsOn === 'sunday' ? 'text-blue-900' : 'text-gray-700'
                            }`}
                        >
                            Sunday
                        </Text>
                    </Pressable>
                </View>
            </View>

            <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-3">Theme</Text>
                <View className="gap-3">
                    {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                        <Pressable
                            key={themeOption}
                            onPress={() => setTheme(themeOption)}
                            className={`
                                py-4 px-4 rounded-lg border-2 flex-row items-center justify-between
                                ${theme === themeOption ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}
                            `}
                        >
                            <Text
                                className={`font-semibold capitalize ${
                                    theme === themeOption ? 'text-blue-900' : 'text-gray-700'
                                }`}
                            >
                                {themeOption === 'auto' ? 'Auto (System)' : themeOption}
                            </Text>
                            {theme === themeOption && (
                                <Text className="text-blue-600 text-xl">✓</Text>
                            )}
                        </Pressable>
                    ))}
                </View>
            </View>
        </Animated.View>
    );
}

function NotificationsStep({
    enableDailyReminders,
    setEnableDailyReminders,
    enableAiInsights,
    setEnableAiInsights,
    enableChallenges,
    setEnableChallenges,
}: {
    enableDailyReminders: boolean;
    setEnableDailyReminders: (value: boolean) => void;
    enableAiInsights: boolean;
    setEnableAiInsights: (value: boolean) => void;
    enableChallenges: boolean;
    setEnableChallenges: (value: boolean) => void;
}) {
    const NotificationToggle = ({
        title,
        description,
        icon,
        enabled,
        onToggle,
    }: {
        title: string;
        description: string;
        icon: string;
        enabled: boolean;
        onToggle: () => void;
    }) => (
        <Pressable
            onPress={onToggle}
            className={`
                p-4 rounded-lg border-2 mb-3
                ${enabled ? 'border-blue-600 bg-blue-50' : 'border-gray-300 bg-white'}
            `}
        >
            <View className="flex-row items-start justify-between">
                <View className="flex-1 flex-row gap-3">
                    <Text className="text-2xl">{icon}</Text>
                    <View className="flex-1">
                        <Text
                            className={`font-semibold text-base mb-1 ${
                                enabled ? 'text-blue-900' : 'text-gray-900'
                            }`}
                        >
                            {title}
                        </Text>
                        <Text className="text-sm text-gray-600">{description}</Text>
                    </View>
                </View>
                <View
                    className={`w-12 h-7 rounded-full p-1 ${
                        enabled ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                >
                    <View
                        className={`w-5 h-5 rounded-full bg-white ${
                            enabled ? 'ml-auto' : ''
                        }`}
                    />
                </View>
            </View>
        </Pressable>
    );

    return (
        <Animated.View entering={FadeInDown} exiting={FadeOutUp} className="px-6">
            <Text className="text-3xl font-bold mb-2">Stay in the loop</Text>
            <Text className="text-base text-gray-600 mb-8">
                Choose which notifications you'd like to receive
            </Text>

            <NotificationToggle
                title="Daily Reminders"
                description="Get reminded about your tasks and goals each morning"
                icon="⏰"
                enabled={enableDailyReminders}
                onToggle={() => setEnableDailyReminders(!enableDailyReminders)}
            />

            <NotificationToggle
                title="AI Scrum Master Insights"
                description="Receive smart suggestions and sprint planning tips"
                icon="🤖"
                enabled={enableAiInsights}
                onToggle={() => setEnableAiInsights(!enableAiInsights)}
            />

            <NotificationToggle
                title="Challenge Updates"
                description="Get notified when friends complete challenges"
                icon="🏆"
                enabled={enableChallenges}
                onToggle={() => setEnableChallenges(!enableChallenges)}
            />

            <View className="mt-6 p-4 bg-green-50 rounded-lg">
                <Text className="text-sm text-green-900">
                    🔔 <Text className="font-semibold">You're in control:</Text> You can always
                    change these settings later in your profile.
                </Text>
            </View>
        </Animated.View>
    );
}
