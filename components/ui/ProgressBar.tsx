import { View, Text } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    withSpring,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface ProgressBarProps {
    progress: number; // 0-100
    showLabel?: boolean;
    height?: number;
    color?: string;
    backgroundColor?: string;
    label?: string;
}

export function ProgressBar({
    progress,
    showLabel = true,
    height = 8,
    color = 'bg-blue-600',
    backgroundColor = 'bg-gray-200',
    label,
}: ProgressBarProps) {
    const animatedWidth = useSharedValue(0);

    useEffect(() => {
        animatedWidth.value = withSpring(progress, {
            damping: 15,
            stiffness: 100,
        });
    }, [progress]);

    const progressStyle = useAnimatedStyle(() => ({
        width: `${animatedWidth.value}%`,
    }));

    return (
        <View>
            {showLabel && (
                <View className="flex-row justify-between items-center mb-2">
                    {label && (
                        <Text className="text-sm font-semibold text-gray-900">
                            {label}
                        </Text>
                    )}
                    <Text className="text-sm text-gray-600">
                        {Math.round(progress)}%
                    </Text>
                </View>
            )}
            
            <View 
                className={`${backgroundColor} rounded-full overflow-hidden`}
                style={{ height }}
            >
                <Animated.View
                    style={[progressStyle, { height: '100%' }]}
                    className={`${color} rounded-full`}
                />
            </View>
        </View>
    );
}
