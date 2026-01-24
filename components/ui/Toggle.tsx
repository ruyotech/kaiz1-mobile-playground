import { Pressable, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withSpring,
    interpolateColor,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface ToggleProps {
    enabled: boolean;
    onToggle: () => void;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export function Toggle({ enabled, onToggle, disabled = false, size = 'md' }: ToggleProps) {
    const progress = useSharedValue(enabled ? 1 : 0);

    const sizes = {
        sm: { width: 40, height: 24, circle: 20 },
        md: { width: 48, height: 28, circle: 24 },
        lg: { width: 56, height: 32, circle: 28 },
    };

    const { width, height, circle } = sizes[size];

    useEffect(() => {
        progress.value = withSpring(enabled ? 1 : 0, {
            damping: 15,
            stiffness: 200,
        });
    }, [enabled]);

    const trackStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            ['#D1D5DB', '#2563EB'] // gray-300 to blue-600
        );

        return {
            backgroundColor,
        };
    });

    const circleStyle = useAnimatedStyle(() => {
        const translateX = progress.value * (width - circle - 4);

        return {
            transform: [{ translateX }],
        };
    });

    return (
        <Pressable
            onPress={onToggle}
            disabled={disabled}
            className={disabled ? 'opacity-50' : ''}
        >
            <Animated.View
                style={[
                    trackStyle,
                    {
                        width,
                        height,
                        borderRadius: height / 2,
                    },
                ]}
                className="p-0.5 justify-center"
            >
                <Animated.View
                    style={[
                        circleStyle,
                        {
                            width: circle,
                            height: circle,
                            borderRadius: circle / 2,
                        },
                    ]}
                    className="bg-white shadow-lg"
                />
            </Animated.View>
        </Pressable>
    );
}
