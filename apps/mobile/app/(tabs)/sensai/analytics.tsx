/**
 * SensAI Analytics Screen
 * 
 * Comprehensive analytics dashboard showing trends, patterns,
 * and insights across velocity, life dimensions, and productivity.
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import Svg, { Path, Circle, Line, Text as SvgText, Rect } from 'react-native-svg';
import { useSensAIStore } from '../../../store/sensaiStore';
import { LIFE_WHEEL_DIMENSIONS } from '../../../types/sensai.types';

type TimeRange = 'week' | 'month' | 'quarter' | 'year';
type AnalyticsTab = 'overview' | 'velocity' | 'dimensions' | 'patterns';

const { width: screenWidth } = Dimensions.get('window');
const chartWidth = screenWidth - 64;

export default function AnalyticsScreen() {
    const { velocityMetrics, lifeWheelMetrics } = useSensAIStore();
    const [timeRange, setTimeRange] = useState<TimeRange>('month');
    const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview');

    // Mock analytics data
    const weeklyData = [32, 38, 45, 35, 42, 28, 40];
    const monthlyTrend = [85, 92, 78, 88, 95, 82, 90, 87];
    const dimensionTrends = {
        health: [7, 8, 7, 9, 8],
        career: [8, 7, 8, 8, 9],
        family: [6, 7, 7, 8, 7],
        finance: [5, 5, 6, 5, 6],
        growth: [8, 9, 8, 9, 9],
    };

    const insights = [
        {
            type: 'positive',
            icon: 'trending-up',
            title: 'Velocity Improving',
            description: 'Your average velocity has increased 15% over the last month.',
        },
        {
            type: 'warning',
            icon: 'alert-circle',
            title: 'Finance Neglected',
            description: 'Finance dimension has been below 6 for 3 consecutive sprints.',
        },
        {
            type: 'insight',
            icon: 'lightbulb',
            title: 'Best Day Pattern',
            description: 'You complete 40% more tasks on Tuesdays and Wednesdays.',
        },
        {
            type: 'positive',
            icon: 'check-circle',
            title: 'Consistent Health',
            description: 'Health dimension maintained above 7 for 5 sprints.',
        },
    ];

    const renderTimeRangeSelector = () => (
        <View className="flex-row bg-gray-800 rounded-xl p-1 mb-4">
            {(['week', 'month', 'quarter', 'year'] as TimeRange[]).map(range => (
                <TouchableOpacity
                    key={range}
                    onPress={() => setTimeRange(range)}
                    className={`flex-1 py-2 rounded-lg ${
                        timeRange === range ? 'bg-emerald-500' : ''
                    }`}
                >
                    <Text className={`text-center ${
                        timeRange === range ? 'text-white font-semibold' : 'text-gray-400'
                    }`}>
                        {range.charAt(0).toUpperCase() + range.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderTabSelector = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-4"
        >
            {[
                { id: 'overview', label: 'Overview', icon: 'view-dashboard' },
                { id: 'velocity', label: 'Velocity', icon: 'speedometer' },
                { id: 'dimensions', label: 'Dimensions', icon: 'chart-donut' },
                { id: 'patterns', label: 'Patterns', icon: 'brain' },
            ].map(tab => (
                <TouchableOpacity
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id as AnalyticsTab)}
                    className={`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                        activeTab === tab.id ? 'bg-emerald-500' : 'bg-gray-800'
                    }`}
                >
                    <MaterialCommunityIcons 
                        name={tab.icon as any} 
                        size={18} 
                        color={activeTab === tab.id ? '#fff' : '#6B7280'} 
                    />
                    <Text className={`ml-2 ${
                        activeTab === tab.id ? 'text-white font-semibold' : 'text-gray-400'
                    }`}>
                        {tab.label}
                    </Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );

    const renderBarChart = (data: number[], labels: string[], maxValue: number = 100) => {
        const chartHeight = 120;
        const barWidth = (chartWidth - 40) / data.length - 8;
        
        return (
            <Svg width={chartWidth} height={chartHeight + 30}>
                {data.map((value, index) => {
                    const barHeight = (value / maxValue) * chartHeight;
                    const x = 20 + index * (barWidth + 8);
                    const y = chartHeight - barHeight;
                    
                    return (
                        <React.Fragment key={index}>
                            <Rect
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx={4}
                                fill="#10B981"
                                opacity={0.8}
                            />
                            <SvgText
                                x={x + barWidth / 2}
                                y={chartHeight + 20}
                                fill="#6B7280"
                                fontSize="10"
                                textAnchor="middle"
                            >
                                {labels[index]}
                            </SvgText>
                        </React.Fragment>
                    );
                })}
            </Svg>
        );
    };

    const renderLineChart = (data: number[], color: string = '#10B981') => {
        const chartHeight = 100;
        const maxValue = Math.max(...data);
        const minValue = Math.min(...data);
        const range = maxValue - minValue || 1;
        
        const points = data.map((value, index) => {
            const x = 20 + (index / (data.length - 1)) * (chartWidth - 40);
            const y = chartHeight - ((value - minValue) / range) * (chartHeight - 20) - 10;
            return `${x},${y}`;
        }).join(' ');

        const pathD = data.map((value, index) => {
            const x = 20 + (index / (data.length - 1)) * (chartWidth - 40);
            const y = chartHeight - ((value - minValue) / range) * (chartHeight - 20) - 10;
            return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        }).join(' ');

        return (
            <Svg width={chartWidth} height={chartHeight}>
                {/* Grid lines */}
                {[0, 1, 2].map(i => (
                    <Line
                        key={i}
                        x1={20}
                        y1={10 + i * 40}
                        x2={chartWidth - 20}
                        y2={10 + i * 40}
                        stroke="#374151"
                        strokeWidth={1}
                    />
                ))}
                
                {/* Line path */}
                <Path
                    d={pathD}
                    stroke={color}
                    strokeWidth={2}
                    fill="none"
                />
                
                {/* Data points */}
                {data.map((value, index) => {
                    const x = 20 + (index / (data.length - 1)) * (chartWidth - 40);
                    const y = chartHeight - ((value - minValue) / range) * (chartHeight - 20) - 10;
                    return (
                        <Circle
                            key={index}
                            cx={x}
                            cy={y}
                            r={4}
                            fill={color}
                        />
                    );
                })}
            </Svg>
        );
    };

    const renderOverviewTab = () => (
        <>
            {/* Key Metrics */}
            <View className="flex-row mb-4">
                <View className="flex-1 bg-gray-800 rounded-2xl p-4 mr-2">
                    <MaterialCommunityIcons name="speedometer" size={24} color="#10B981" />
                    <Text className="text-white text-2xl font-bold mt-2">
                        {velocityMetrics?.averageCompleted || 38}
                    </Text>
                    <Text className="text-gray-400 text-sm">Avg Velocity</Text>
                    <Text className="text-emerald-400 text-xs mt-1">+12% vs last period</Text>
                </View>
                <View className="flex-1 bg-gray-800 rounded-2xl p-4">
                    <MaterialCommunityIcons name="percent" size={24} color="#3B82F6" />
                    <Text className="text-white text-2xl font-bold mt-2">87%</Text>
                    <Text className="text-gray-400 text-sm">Completion Rate</Text>
                    <Text className="text-blue-400 text-xs mt-1">+5% vs last period</Text>
                </View>
            </View>

            <View className="flex-row mb-4">
                <View className="flex-1 bg-gray-800 rounded-2xl p-4 mr-2">
                    <MaterialCommunityIcons name="fire" size={24} color="#F59E0B" />
                    <Text className="text-white text-2xl font-bold mt-2">14</Text>
                    <Text className="text-gray-400 text-sm">Day Streak</Text>
                </View>
                <View className="flex-1 bg-gray-800 rounded-2xl p-4">
                    <MaterialCommunityIcons name="chart-donut" size={24} color="#A855F7" />
                    <Text className="text-white text-2xl font-bold mt-2">7.2</Text>
                    <Text className="text-gray-400 text-sm">Life Balance</Text>
                </View>
            </View>

            {/* Weekly Progress Chart */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Weekly Progress</Text>
                {renderBarChart(weeklyData, ['M', 'T', 'W', 'T', 'F', 'S', 'S'], 50)}
            </View>

            {/* AI Insights */}
            <View className="mb-4">
                <Text className="text-white font-semibold mb-3">AI Insights</Text>
                {insights.slice(0, 3).map((insight, idx) => (
                    <View 
                        key={idx}
                        className={`p-4 rounded-xl mb-2 ${
                            insight.type === 'positive' ? 'bg-emerald-500/20' :
                            insight.type === 'warning' ? 'bg-yellow-500/20' :
                            'bg-blue-500/20'
                        }`}
                    >
                        <View className="flex-row items-center mb-1">
                            <MaterialCommunityIcons 
                                name={insight.icon as any} 
                                size={18} 
                                color={
                                    insight.type === 'positive' ? '#10B981' :
                                    insight.type === 'warning' ? '#EAB308' :
                                    '#3B82F6'
                                } 
                            />
                            <Text className={`font-semibold ml-2 ${
                                insight.type === 'positive' ? 'text-emerald-400' :
                                insight.type === 'warning' ? 'text-yellow-400' :
                                'text-blue-400'
                            }`}>
                                {insight.title}
                            </Text>
                        </View>
                        <Text className="text-gray-300 text-sm">{insight.description}</Text>
                    </View>
                ))}
            </View>
        </>
    );

    const renderVelocityTab = () => (
        <>
            {/* Velocity Trend */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-2">Velocity Trend</Text>
                <Text className="text-gray-400 text-sm mb-4">Points completed per sprint</Text>
                {renderLineChart(monthlyTrend, '#10B981')}
                <View className="flex-row justify-between mt-4">
                    <View>
                        <Text className="text-gray-400 text-xs">Average</Text>
                        <Text className="text-white font-semibold">
                            {Math.round(monthlyTrend.reduce((a, b) => a + b) / monthlyTrend.length)}%
                        </Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs">Peak</Text>
                        <Text className="text-emerald-400 font-semibold">{Math.max(...monthlyTrend)}%</Text>
                    </View>
                    <View>
                        <Text className="text-gray-400 text-xs">Low</Text>
                        <Text className="text-yellow-400 font-semibold">{Math.min(...monthlyTrend)}%</Text>
                    </View>
                </View>
            </View>

            {/* Velocity Breakdown */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Sprint Breakdown</Text>
                {[
                    { label: 'Committed', value: 45, color: '#3B82F6' },
                    { label: 'Completed', value: 38, color: '#10B981' },
                    { label: 'Carried Over', value: 7, color: '#F59E0B' },
                ].map((item, idx) => (
                    <View key={idx} className="mb-3">
                        <View className="flex-row justify-between mb-1">
                            <Text className="text-white">{item.label}</Text>
                            <Text style={{ color: item.color }}>{item.value} pts</Text>
                        </View>
                        <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <View 
                                className="h-full rounded-full"
                                style={{ width: `${(item.value / 45) * 100}%`, backgroundColor: item.color }}
                            />
                        </View>
                    </View>
                ))}
            </View>

            {/* Overcommitment History */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Overcommitment Frequency</Text>
                <View className="flex-row items-center mb-2">
                    <View className="flex-1 h-8 bg-gray-700 rounded-lg overflow-hidden flex-row">
                        <View className="bg-emerald-500 h-full" style={{ width: '70%' }} />
                        <View className="bg-yellow-500 h-full" style={{ width: '20%' }} />
                        <View className="bg-red-500 h-full" style={{ width: '10%' }} />
                    </View>
                </View>
                <View className="flex-row justify-between">
                    <Text className="text-emerald-400 text-xs">On Track 70%</Text>
                    <Text className="text-yellow-400 text-xs">Slightly Over 20%</Text>
                    <Text className="text-red-400 text-xs">Over 10%</Text>
                </View>
            </View>
        </>
    );

    const renderDimensionsTab = () => (
        <>
            {/* Dimension Scores */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Current Balance</Text>
                {LIFE_WHEEL_DIMENSIONS.map(dim => {
                    const score = lifeWheelMetrics?.dimensions.find(d => d.dimensionId === dim.id)?.currentScore || 7;
                    return (
                        <View key={dim.id} className="mb-4">
                            <View className="flex-row justify-between items-center mb-2">
                                <View className="flex-row items-center">
                                    <MaterialCommunityIcons name={dim.icon as any} size={16} color={dim.color} />
                                    <Text className="text-white ml-2">{dim.name}</Text>
                                </View>
                                <Text style={{ color: dim.color }}>{score}/10</Text>
                            </View>
                            <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                <View 
                                    className="h-full rounded-full"
                                    style={{ width: `${score * 10}%`, backgroundColor: dim.color }}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>

            {/* Dimension Trends */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">5-Sprint Trends</Text>
                {Object.entries(dimensionTrends).map(([dimId, data]) => {
                    const dim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dimId);
                    if (!dim) return null;
                    const trend = data[data.length - 1] - data[0];
                    
                    return (
                        <View key={dimId} className="flex-row items-center justify-between py-2 border-b border-gray-700">
                            <View className="flex-row items-center flex-1">
                                <MaterialCommunityIcons name={dim.icon as any} size={16} color={dim.color} />
                                <Text className="text-white ml-2">{dim.name}</Text>
                            </View>
                            <View className="flex-row items-center">
                                {data.map((val, idx) => (
                                    <View 
                                        key={idx}
                                        className="w-4 h-4 rounded-sm mx-0.5"
                                        style={{ 
                                            backgroundColor: dim.color,
                                            opacity: 0.3 + (val / 10) * 0.7
                                        }}
                                    />
                                ))}
                                <MaterialCommunityIcons 
                                    name={trend > 0 ? 'arrow-up' : trend < 0 ? 'arrow-down' : 'minus'} 
                                    size={16} 
                                    color={trend > 0 ? '#10B981' : trend < 0 ? '#EF4444' : '#6B7280'} 
                                    style={{ marginLeft: 8 }}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </>
    );

    const renderPatternsTab = () => (
        <>
            {/* Best Days */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Most Productive Days</Text>
                {[
                    { day: 'Tuesday', tasks: 8.2, color: '#10B981' },
                    { day: 'Wednesday', tasks: 7.8, color: '#10B981' },
                    { day: 'Monday', tasks: 6.5, color: '#3B82F6' },
                    { day: 'Thursday', tasks: 6.1, color: '#3B82F6' },
                    { day: 'Friday', tasks: 4.8, color: '#F59E0B' },
                    { day: 'Saturday', tasks: 3.2, color: '#F59E0B' },
                    { day: 'Sunday', tasks: 2.5, color: '#EF4444' },
                ].map((item, idx) => (
                    <View key={idx} className="flex-row items-center mb-2">
                        <Text className="text-white w-24">{item.day}</Text>
                        <View className="flex-1 h-4 bg-gray-700 rounded-full overflow-hidden mx-3">
                            <View 
                                className="h-full rounded-full"
                                style={{ width: `${(item.tasks / 10) * 100}%`, backgroundColor: item.color }}
                            />
                        </View>
                        <Text className="text-gray-400 w-10 text-right">{item.tasks}</Text>
                    </View>
                ))}
            </View>

            {/* Time of Day */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Peak Hours</Text>
                <View className="flex-row justify-between">
                    {[
                        { time: 'Morning', icon: 'weather-sunny', value: 35, color: '#F59E0B' },
                        { time: 'Afternoon', icon: 'white-balance-sunny', value: 45, color: '#10B981' },
                        { time: 'Evening', icon: 'weather-night', value: 20, color: '#6366F1' },
                    ].map((item, idx) => (
                        <View key={idx} className="items-center">
                            <View 
                                className="w-16 h-16 rounded-full items-center justify-center mb-2"
                                style={{ backgroundColor: item.color + '30' }}
                            >
                                <MaterialCommunityIcons name={item.icon as any} size={24} color={item.color} />
                            </View>
                            <Text className="text-white font-semibold">{item.value}%</Text>
                            <Text className="text-gray-400 text-xs">{item.time}</Text>
                        </View>
                    ))}
                </View>
            </View>

            {/* Behavioral Insights */}
            <View className="bg-gray-800 rounded-2xl p-4 mb-4">
                <Text className="text-white font-semibold mb-4">Behavioral Patterns</Text>
                {[
                    { 
                        pattern: 'Task Batching', 
                        description: 'You complete more when grouping similar tasks',
                        recommendation: 'Schedule focused blocks for each dimension'
                    },
                    { 
                        pattern: 'Recovery Needed', 
                        description: 'Productivity drops after 5+ high-intensity days',
                        recommendation: 'Plan lighter days every 5th day'
                    },
                    { 
                        pattern: 'Social Boost', 
                        description: 'Completion rate 20% higher on accountability days',
                        recommendation: 'Share goals with your support circle'
                    },
                ].map((item, idx) => (
                    <View key={idx} className="mb-4 p-3 bg-gray-700/50 rounded-xl">
                        <Text className="text-white font-semibold">{item.pattern}</Text>
                        <Text className="text-gray-400 text-sm mt-1">{item.description}</Text>
                        <View className="flex-row items-center mt-2">
                            <MaterialCommunityIcons name="lightbulb" size={14} color="#F59E0B" />
                            <Text className="text-yellow-400 text-xs ml-1">{item.recommendation}</Text>
                        </View>
                    </View>
                ))}
            </View>
        </>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {/* Header */}
            <View className="flex-row items-center p-4 border-b border-gray-800">
                <TouchableOpacity onPress={() => router.back()} className="mr-4">
                    <MaterialCommunityIcons name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>
                <Text className="text-white text-xl font-semibold">Analytics</Text>
            </View>

            <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
                {renderTimeRangeSelector()}
                {renderTabSelector()}

                {activeTab === 'overview' && renderOverviewTab()}
                {activeTab === 'velocity' && renderVelocityTab()}
                {activeTab === 'dimensions' && renderDimensionsTab()}
                {activeTab === 'patterns' && renderPatternsTab()}
            </ScrollView>
        </SafeAreaView>
    );
}
