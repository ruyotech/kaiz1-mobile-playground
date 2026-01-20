import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CommunityScreen() {
    const router = useRouter();

    const members = [
        { id: 1, name: 'Sarah Johnson', role: 'Team Lead', avatar: '👩‍💼', points: 2450, status: 'online' },
        { id: 2, name: 'Mike Chen', role: 'Developer', avatar: '👨‍💻', points: 2180, status: 'online' },
        { id: 3, name: 'Emily Davis', role: 'Designer', avatar: '👩‍🎨', points: 1950, status: 'away' },
        { id: 4, name: 'Alex Kumar', role: 'Developer', avatar: '👨‍💼', points: 1720, status: 'offline' },
    ];

    const activities = [
        { user: 'Sarah', action: 'completed', item: 'Sprint Planning', time: '2h ago', icon: 'check-circle', color: '#10B981' },
        { user: 'Mike', action: 'joined', item: '30-Day Code Challenge', time: '5h ago', icon: 'trophy', color: '#F59E0B' },
        { user: 'Emily', action: 'shared', item: 'UI Design Tips', time: '1d ago', icon: 'share-variant', color: '#3B82F6' },
        { user: 'Alex', action: 'achieved', item: 'Velocity Master Badge', time: '2d ago', icon: 'medal', color: '#8B5CF6' },
    ];

    const challenges = [
        { name: '30-Day Code', participants: 12, progress: 65, color: '#3B82F6' },
        { name: 'Morning Standup', participants: 8, progress: 90, color: '#10B981' },
        { name: 'Weekly Reading', participants: 15, progress: 45, color: '#F59E0B' },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-purple-500 pt-12 pb-6 px-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Community</Text>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="account-plus" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1">
                {/* Team Members */}
                <View className="px-4 pt-4">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-lg font-bold">Team Members</Text>
                        <Text className="text-sm text-gray-600">{members.length} active</Text>
                    </View>

                    {members.map((member) => (
                        <View key={member.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                            <View className="flex-row items-center">
                                <View className="relative">
                                    <Text className="text-4xl">{member.avatar}</Text>
                                    <View
                                        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-green-500' :
                                                member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                                            }`}
                                    />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-base font-semibold">{member.name}</Text>
                                    <Text className="text-sm text-gray-600">{member.role}</Text>
                                </View>
                                <View className="items-end">
                                    <View className="flex-row items-center">
                                        <MaterialCommunityIcons name="star" size={16} color="#F59E0B" />
                                        <Text className="ml-1 font-semibold text-gray-700">{member.points}</Text>
                                    </View>
                                    <Text className="text-xs text-gray-500 mt-1 capitalize">{member.status}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Shared Challenges */}
                <View className="px-4 mt-6">
                    <Text className="text-lg font-bold mb-3">Team Challenges</Text>
                    {challenges.map((challenge, index) => (
                        <View key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                            <View className="flex-row justify-between items-start mb-2">
                                <View className="flex-1">
                                    <Text className="text-base font-semibold">{challenge.name}</Text>
                                    <Text className="text-sm text-gray-600 mt-1">
                                        {challenge.participants} participants
                                    </Text>
                                </View>
                                <TouchableOpacity className="bg-gray-100 px-3 py-1 rounded-full">
                                    <Text className="text-sm font-semibold">Join</Text>
                                </TouchableOpacity>
                            </View>
                            <View className="mt-3">
                                <View className="flex-row justify-between mb-1">
                                    <Text className="text-xs text-gray-600">Team Progress</Text>
                                    <Text className="text-xs font-semibold" style={{ color: challenge.color }}>
                                        {challenge.progress}%
                                    </Text>
                                </View>
                                <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                    <View
                                        className="h-full rounded-full"
                                        style={{ width: `${challenge.progress}%`, backgroundColor: challenge.color }}
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Activity Feed */}
                <View className="px-4 mt-6 mb-6">
                    <Text className="text-lg font-bold mb-3">Recent Activity</Text>
                    {activities.map((activity, index) => (
                        <View key={index} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
                            <View className="flex-row items-start">
                                <View
                                    className="w-10 h-10 rounded-full items-center justify-center"
                                    style={{ backgroundColor: activity.color + '20' }}
                                >
                                    <MaterialCommunityIcons
                                        name={activity.icon as any}
                                        size={20}
                                        color={activity.color}
                                    />
                                </View>
                                <View className="ml-3 flex-1">
                                    <Text className="text-sm">
                                        <Text className="font-semibold">{activity.user}</Text>
                                        {' '}{activity.action}{' '}
                                        <Text className="font-semibold">{activity.item}</Text>
                                    </Text>
                                    <Text className="text-xs text-gray-500 mt-1">{activity.time}</Text>
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
