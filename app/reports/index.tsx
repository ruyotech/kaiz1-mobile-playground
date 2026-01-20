import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ReportsScreen() {
    const router = useRouter();

    const metrics = [
        { label: 'Tasks Completed', value: '47', icon: 'check-circle', color: '#10B981' },
        { label: 'In Progress', value: '12', icon: 'progress-clock', color: '#F59E0B' },
        { label: 'Avg Velocity', value: '23', icon: 'speedometer', color: '#3B82F6' },
        { label: 'Sprint Goal', value: '85%', icon: 'target', color: '#8B5CF6' },
    ];

    const velocityData = [
        { sprint: 'S1', points: 18 },
        { sprint: 'S2', points: 22 },
        { sprint: 'S3', points: 20 },
        { sprint: 'S4', points: 25 },
        { sprint: 'S5', points: 23 },
    ];

    return (
        <View className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-blue-500 pt-12 pb-6 px-4">
                <View className="flex-row items-center justify-between">
                    <TouchableOpacity onPress={() => router.back()}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                    </TouchableOpacity>
                    <Text className="text-white text-xl font-bold">Reports & Analytics</Text>
                    <TouchableOpacity>
                        <MaterialCommunityIcons name="calendar-range" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView className="flex-1 px-4 pt-4">
                {/* Metrics Grid */}
                <View className="flex-row flex-wrap -mx-2 mb-6">
                    {metrics.map((metric, index) => (
                        <View key={index} className="w-1/2 px-2 mb-4">
                            <View className="bg-white rounded-xl p-4 shadow-sm">
                                <View className="flex-row items-center justify-between mb-2">
                                    <Text className="text-gray-600 text-sm">{metric.label}</Text>
                                    <MaterialCommunityIcons
                                        name={metric.icon as any}
                                        size={20}
                                        color={metric.color}
                                    />
                                </View>
                                <Text className="text-2xl font-bold" style={{ color: metric.color }}>
                                    {metric.value}
                                </Text>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Velocity Chart */}
                <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
                    <Text className="text-lg font-bold mb-4">Velocity Trend</Text>
                    <View className="flex-row items-end justify-around h-40">
                        {velocityData.map((data, index) => (
                            <View key={index} className="items-center">
                                <View
                                    className="bg-blue-500 rounded-t-lg w-12"
                                    style={{ height: data.points * 4 }}
                                />
                                <Text className="text-xs text-gray-600 mt-2">{data.sprint}</Text>
                                <Text className="text-xs font-semibold">{data.points}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Completion Rate */}
                <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
                    <Text className="text-lg font-bold mb-4">Task Completion Rate</Text>
                    <View className="flex-row items-center justify-between mb-2">
                        <Text className="text-gray-600">This Sprint</Text>
                        <Text className="text-green-600 font-semibold">85%</Text>
                    </View>
                    <View className="bg-gray-200 h-3 rounded-full overflow-hidden">
                        <View className="bg-green-500 h-full" style={{ width: '85%' }} />
                    </View>
                    <View className="flex-row items-center justify-between mt-4">
                        <Text className="text-gray-600">Last Sprint</Text>
                        <Text className="text-blue-600 font-semibold">78%</Text>
                    </View>
                    <View className="bg-gray-200 h-3 rounded-full overflow-hidden">
                        <View className="bg-blue-500 h-full" style={{ width: '78%' }} />
                    </View>
                </View>

                {/* Time Distribution */}
                <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
                    <Text className="text-lg font-bold mb-4">Time by Category</Text>
                    {[
                        { category: 'Development', hours: 24, color: '#3B82F6' },
                        { category: 'Meetings', hours: 8, color: '#F59E0B' },
                        { category: 'Planning', hours: 6, color: '#8B5CF6' },
                        { category: 'Review', hours: 4, color: '#10B981' },
                    ].map((item, index) => (
                        <View key={index} className="mb-3">
                            <View className="flex-row justify-between mb-1">
                                <Text className="text-gray-700">{item.category}</Text>
                                <Text className="text-gray-900 font-semibold">{item.hours}h</Text>
                            </View>
                            <View className="bg-gray-200 h-2 rounded-full overflow-hidden">
                                <View
                                    className="h-full rounded-full"
                                    style={{ width: `${(item.hours / 42) * 100}%`, backgroundColor: item.color }}
                                />
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}
