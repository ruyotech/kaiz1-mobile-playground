import { Pressable, Text, View } from 'react-native';
import Animated, { 
    useAnimatedStyle, 
    withSpring,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

interface CheckboxProps {
    checked: boolean;
    onPress: () => void;
    label?: string;
    disabled?: boolean;
}

export function Checkbox({ checked, onPress, label, disabled = false }: CheckboxProps) {
    const scale = useSharedValue(1);

    const handlePress = () => {
        if (disabled) return;
        
        scale.value = withSpring(0.9, {}, () => {
            scale.value = withSpring(1);
        });
        
        onPress();
    };

    const checkboxStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    return (
        <Pressable
            onPress={handlePress}
            disabled={disabled}
            className="flex-row items-center"
        >
            <Animated.View
                style={[checkboxStyle]}
                className={`
                    w-6 h-6 rounded border-2 items-center justify-center
                    ${checked ? 'bg-blue-600 border-blue-600' : 'border-gray-300 bg-white'}
                    ${disabled ? 'opacity-50' : ''}
                `}
            >
                {checked && (
                    <Text className="text-white text-sm font-bold">✓</Text>
                )}
            </Animated.View>
            
            {label && (
                <Text 
                    className={`
                        ml-3 text-base text-gray-700
                        ${disabled ? 'opacity-50' : ''}
                    `}
                >
                    {label}
                </Text>
            )}
        </Pressable>
    );
}
