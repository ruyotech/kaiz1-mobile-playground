/**
 * LifeWheelChart Component
 * 
 * Displays the 9-dimension Life Wheel with balance indicators.
 */

import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Svg, { Circle, Path, Text as SvgText, G } from 'react-native-svg';
import { LifeWheelMetrics, DimensionMetric, LIFE_WHEEL_DIMENSIONS } from '../../types/sensai.types';

interface LifeWheelChartProps {
    metrics: LifeWheelMetrics;
    size?: number;
    showLegend?: boolean;
}

export function LifeWheelChart({ metrics, size = 280, showLegend = true }: LifeWheelChartProps) {
    const center = size / 2;
    const maxRadius = (size / 2) - 30;
    const dimensions = metrics.dimensions;
    const angleStep = (2 * Math.PI) / dimensions.length;

    // Calculate points for each dimension
    const getPointForDimension = (index: number, value: number) => {
        const angle = (index * angleStep) - (Math.PI / 2); // Start from top
        const normalizedValue = Math.min(value / 100, 1); // Normalize to 0-1
        const radius = normalizedValue * maxRadius;
        return {
            x: center + radius * Math.cos(angle),
            y: center + radius * Math.sin(angle),
        };
    };

    // Create path for the radar chart
    const createPath = () => {
        if (dimensions.length === 0) return '';
        
        const points = dimensions.map((dim, i) => {
            const point = getPointForDimension(i, dim.percentageOfTotal * 10); // Scale up for visibility
            return `${i === 0 ? 'M' : 'L'} ${point.x} ${point.y}`;
        });
        return points.join(' ') + ' Z';
    };

    return (
        <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <View>
                    <Text className="text-lg font-bold text-gray-900">Life Balance</Text>
                    <Text className="text-sm text-gray-500">9-Dimension Overview</Text>
                </View>
                <View className="bg-blue-50 px-3 py-1 rounded-full">
                    <Text className="text-sm font-semibold text-blue-700">
                        Score: {metrics.balanceScore}/100
                    </Text>
                </View>
            </View>

            {/* Radar Chart */}
            <View className="items-center my-4">
                <Svg width={size} height={size}>
                    {/* Background circles */}
                    {[0.25, 0.5, 0.75, 1].map((scale, i) => (
                        <Circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={maxRadius * scale}
                            fill="none"
                            stroke="#E5E7EB"
                            strokeWidth={1}
                        />
                    ))}
                    
                    {/* Axis lines */}
                    {dimensions.map((_, i) => {
                        const angle = (i * angleStep) - (Math.PI / 2);
                        const endX = center + maxRadius * Math.cos(angle);
                        const endY = center + maxRadius * Math.sin(angle);
                        return (
                            <Path
                                key={i}
                                d={`M ${center} ${center} L ${endX} ${endY}`}
                                stroke="#E5E7EB"
                                strokeWidth={1}
                            />
                        );
                    })}
                    
                    {/* Data polygon */}
                    <Path
                        d={createPath()}
                        fill="rgba(59, 130, 246, 0.2)"
                        stroke="#3B82F6"
                        strokeWidth={2}
                    />
                    
                    {/* Dimension labels */}
                    {dimensions.map((dim, i) => {
                        const angle = (i * angleStep) - (Math.PI / 2);
                        const labelRadius = maxRadius + 20;
                        const x = center + labelRadius * Math.cos(angle);
                        const y = center + labelRadius * Math.sin(angle);
                        const lwDim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dim.dimension);
                        
                        return (
                            <SvgText
                                key={i}
                                x={x}
                                y={y}
                                fontSize={9}
                                fill={dim.isNeglected ? '#EF4444' : '#6B7280'}
                                fontWeight={dim.isNeglected ? 'bold' : 'normal'}
                                textAnchor="middle"
                                alignmentBaseline="middle"
                            >
                                {lwDim?.name.split(' ')[0] || dim.dimensionName}
                            </SvgText>
                        );
                    })}
                    
                    {/* Data points */}
                    {dimensions.map((dim, i) => {
                        const point = getPointForDimension(i, dim.percentageOfTotal * 10);
                        const lwDim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dim.dimension);
                        
                        return (
                            <Circle
                                key={i}
                                cx={point.x}
                                cy={point.y}
                                r={6}
                                fill={dim.isNeglected ? '#EF4444' : (lwDim?.color || '#3B82F6')}
                                stroke="white"
                                strokeWidth={2}
                            />
                        );
                    })}
                </Svg>
            </View>

            {/* Neglected Dimensions Alert */}
            {metrics.neglectedDimensions.length > 0 && (
                <View className="bg-red-50 rounded-xl p-3 mb-4">
                    <View className="flex-row items-center mb-2">
                        <MaterialCommunityIcons name="alert-circle" size={18} color="#EF4444" />
                        <Text className="text-sm font-semibold text-red-700 ml-2">
                            Needs Attention
                        </Text>
                    </View>
                    <View className="flex-row flex-wrap">
                        {metrics.neglectedDimensions.map((dimId, i) => {
                            const lwDim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dimId);
                            return (
                                <View key={i} className="bg-red-100 px-2 py-1 rounded-full mr-2 mb-1">
                                    <Text className="text-xs text-red-700">{lwDim?.name || dimId}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}

            {/* Legend */}
            {showLegend && (
                <View className="border-t border-gray-100 pt-4">
                    <View className="flex-row flex-wrap">
                        {dimensions.slice(0, 6).map((dim, i) => {
                            const lwDim = LIFE_WHEEL_DIMENSIONS.find(d => d.id === dim.dimension);
                            return (
                                <View key={i} className="w-1/3 flex-row items-center mb-2">
                                    <View 
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: lwDim?.color || '#6B7280' }}
                                    />
                                    <Text className="text-xs text-gray-600" numberOfLines={1}>
                                        {dim.percentageOfTotal.toFixed(0)}%
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            )}
        </View>
    );
}

export default LifeWheelChart;
