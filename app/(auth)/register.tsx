import {
    View,
    Text,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Container } from '../../components/layout/Container';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export default function RegisterScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Form state
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreeToTerms, setAgreeToTerms] = useState(false);

    // Error state
    const [fullNameError, setFullNameError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');

    const validateFullName = (name: string): boolean => {
        if (!name.trim()) {
            setFullNameError('Full name is required');
            return false;
        }
        if (name.trim().length < 2) {
            setFullNameError('Name must be at least 2 characters');
            return false;
        }
        setFullNameError('');
        return true;
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setEmailError('Email is required');
            return false;
        }
        if (!emailRegex.test(email)) {
            setEmailError('Please enter a valid email');
            return false;
        }
        setEmailError('');
        return true;
    };

    const validatePassword = (password: string): boolean => {
        if (!password) {
            setPasswordError('Password is required');
            return false;
        }
        if (password.length < 8) {
            setPasswordError('Password must be at least 8 characters');
            return false;
        }
        if (!/(?=.*[a-z])/.test(password)) {
            setPasswordError('Password must contain a lowercase letter');
            return false;
        }
        if (!/(?=.*[A-Z])/.test(password)) {
            setPasswordError('Password must contain an uppercase letter');
            return false;
        }
        if (!/(?=.*\d)/.test(password)) {
            setPasswordError('Password must contain a number');
            return false;
        }
        setPasswordError('');
        return true;
    };

    const validateConfirmPassword = (confirmPwd: string): boolean => {
        if (!confirmPwd) {
            setConfirmPasswordError('Please confirm your password');
            return false;
        }
        if (confirmPwd !== password) {
            setConfirmPasswordError('Passwords do not match');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    const getPasswordStrength = (pwd: string): { strength: number; label: string; color: string } => {
        let strength = 0;
        if (pwd.length >= 8) strength++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
        if (/\d/.test(pwd)) strength++;
        if (/[^a-zA-Z\d]/.test(pwd)) strength++;

        if (strength <= 1) return { strength: 25, label: 'Weak', color: 'bg-red-500' };
        if (strength === 2) return { strength: 50, label: 'Fair', color: 'bg-yellow-500' };
        if (strength === 3) return { strength: 75, label: 'Good', color: 'bg-blue-500' };
        return { strength: 100, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    const handleRegister = async () => {
        const isNameValid = validateFullName(fullName);
        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);
        const isConfirmValid = validateConfirmPassword(confirmPassword);

        if (!isNameValid || !isEmailValid || !isPasswordValid || !isConfirmValid) {
            return;
        }

        if (!agreeToTerms) {
            Alert.alert('Terms Required', 'Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            Alert.alert(
                'Success!',
                'Your account has been created. Please check your email to verify your account.',
                [
                    {
                        text: 'OK',
                        onPress: () => router.push('/(auth)/verify-email'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container safeArea={false}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >
                    <View className="flex-1 px-6 pt-16 pb-8">
                        {/* Header */}
                        <Animated.View
                            entering={FadeInDown.delay(100).springify()}
                            className="mb-8"
                        >
                            <Pressable onPress={() => router.back()} className="mb-4">
                                <Text className="text-blue-600 font-semibold text-lg">
                                    ← Back
                                </Text>
                            </Pressable>
                            <Text className="text-4xl font-bold text-gray-900">
                                Create Account
                            </Text>
                            <Text className="text-base text-gray-600 mt-2">
                                Join thousands achieving their life goals
                            </Text>
                        </Animated.View>

                        {/* Registration Form */}
                        <Animated.View entering={FadeInDown.delay(200).springify()}>
                            <Input
                                label="Full Name"
                                value={fullName}
                                onChangeText={(text) => {
                                    setFullName(text);
                                    if (fullNameError) validateFullName(text);
                                }}
                                placeholder="John Doe"
                                error={fullNameError}
                            />

                            <Input
                                label="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (emailError) validateEmail(text);
                                }}
                                placeholder="your@email.com"
                                keyboardType="email-address"
                                error={emailError}
                            />

                            <View className="relative">
                                <Input
                                    label="Password"
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                        if (passwordError) validatePassword(text);
                                    }}
                                    placeholder="Create a strong password"
                                    secureTextEntry={!showPassword}
                                    error={passwordError}
                                />
                                <Pressable
                                    onPress={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-11"
                                >
                                    <Text className="text-blue-600 font-semibold">
                                        {showPassword ? 'Hide' : 'Show'}
                                    </Text>
                                </Pressable>
                            </View>

                            {/* Password Strength Indicator */}
                            {password.length > 0 && (
                                <View className="mb-4 -mt-2">
                                    <View className="flex-row justify-between items-center mb-2">
                                        <Text className="text-sm text-gray-600">
                                            Password Strength
                                        </Text>
                                        <Text className={`text-sm font-semibold`}>
                                            {passwordStrength.label}
                                        </Text>
                                    </View>
                                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <View
                                            className={`h-full ${passwordStrength.color} rounded-full`}
                                            style={{ width: `${passwordStrength.strength}%` }}
                                        />
                                    </View>
                                </View>
                            )}

                            <Input
                                label="Confirm Password"
                                value={confirmPassword}
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    if (confirmPasswordError) validateConfirmPassword(text);
                                }}
                                placeholder="Re-enter your password"
                                secureTextEntry={!showPassword}
                                error={confirmPasswordError}
                            />

                            {/* Terms Checkbox */}
                            <Pressable
                                onPress={() => setAgreeToTerms(!agreeToTerms)}
                                className="flex-row items-start mb-6"
                            >
                                <View
                                    className={`w-5 h-5 rounded border-2 items-center justify-center mr-3 mt-1 ${
                                        agreeToTerms
                                            ? 'bg-blue-600 border-blue-600'
                                            : 'border-gray-300'
                                    }`}
                                >
                                    {agreeToTerms && (
                                        <Text className="text-white text-xs font-bold">✓</Text>
                                    )}
                                </View>
                                <Text className="flex-1 text-sm text-gray-600 leading-5">
                                    I agree to the{' '}
                                    <Text className="text-blue-600 font-semibold">
                                        Terms of Service
                                    </Text>{' '}
                                    and{' '}
                                    <Text className="text-blue-600 font-semibold">
                                        Privacy Policy
                                    </Text>
                                </Text>
                            </Pressable>

                            <Button
                                onPress={handleRegister}
                                loading={loading}
                                fullWidth
                                size="lg"
                            >
                                Create Account
                            </Button>
                        </Animated.View>

                        {/* Divider */}
                        <Animated.View
                            entering={FadeInDown.delay(300).springify()}
                            className="flex-row items-center my-6"
                        >
                            <View className="flex-1 h-px bg-gray-300" />
                            <Text className="mx-4 text-gray-500 font-medium">OR</Text>
                            <View className="flex-1 h-px bg-gray-300" />
                        </Animated.View>

                        {/* Social Registration */}
                        <Animated.View
                            entering={FadeInDown.delay(400).springify()}
                            className="gap-3"
                        >
                            <Pressable className="flex-row items-center justify-center py-4 border-2 border-gray-300 rounded-lg bg-white">
                                <Text className="text-2xl mr-2">🍎</Text>
                                <Text className="font-semibold text-gray-900">
                                    Sign up with Apple
                                </Text>
                            </Pressable>

                            <Pressable className="flex-row items-center justify-center py-4 border-2 border-gray-300 rounded-lg bg-white">
                                <Text className="text-2xl mr-2">📧</Text>
                                <Text className="font-semibold text-gray-900">
                                    Sign up with Google
                                </Text>
                            </Pressable>
                        </Animated.View>

                        {/* Login Link */}
                        <Animated.View
                            entering={FadeInUp.delay(500).springify()}
                            className="flex-row justify-center mt-8"
                        >
                            <Text className="text-gray-600">Already have an account? </Text>
                            <Pressable onPress={() => router.back()}>
                                <Text className="text-blue-600 font-semibold">Sign In</Text>
                            </Pressable>
                        </Animated.View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </Container>
    );
}
