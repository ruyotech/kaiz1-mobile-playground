import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface TimerProps {
  timeRemaining: number;
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'idle';
  isPaused: boolean;
}

export default function Timer({ timeRemaining, mode, isPaused }: TimerProps) {
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [soundType, setSoundType] = useState<'tick' | 'none'>('none');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return {
      mins: mins.toString().padStart(2, '0'),
      secs: secs.toString().padStart(2, '0')
    };
  };

  const getModeConfig = () => {
    if (isPaused) {
      return {
        bgColor: '#FEF3C7',
        icon: 'pause-circle',
        iconColor: '#F59E0B',
        textColor: '#92400E',
        label: 'Paused'
      };
    }
    switch (mode) {
      case 'focus':
        return {
          bgColor: '#D1FAE5',
          icon: 'brain',
          iconColor: '#10B981',
          textColor: '#065F46',
          label: 'Focus'
        };
      case 'shortBreak':
        return {
          bgColor: '#DBEAFE',
          icon: 'coffee',
          iconColor: '#3B82F6',
          textColor: '#1E40AF',
          label: 'Short Break'
        };
      case 'longBreak':
        return {
          bgColor: '#EDE9FE',
          icon: 'spa',
          iconColor: '#8B5CF6',
          textColor: '#5B21B6',
          label: 'Long Break'
        };
      default:
        return {
          bgColor: '#F1F5F9',
          icon: 'timer-outline',
          iconColor: '#64748B',
          textColor: '#1E293B',
          label: 'Idle'
        };
    }
  };

  const toggleSound = () => {
    if (soundEnabled) {
      setSoundEnabled(false);
      setSoundType('none');
    } else {
      setSoundEnabled(true);
      setSoundType('tick');
    }
  };

  const config = getModeConfig();
  const time = formatTime(timeRemaining);

  return (
    <View className="items-center my-6">
      {/* Main Timer Circle */}
      <View 
        className="items-center justify-center rounded-full p-8 shadow-lg relative"
        style={{ 
          backgroundColor: config.bgColor,
          width: 280,
          height: 280
        }}
      >
        {/* Icon */}
        <View className="mb-2">
          <MaterialCommunityIcons 
            name={config.icon as any} 
            size={36} 
            color={config.iconColor} 
          />
        </View>
        
        {/* Time Display */}
        <View className="flex-row items-center justify-center">
          <Text 
            className="text-8xl font-bold tracking-tight"
            style={{ color: config.textColor }}
          >
            {time.mins}
          </Text>
          <Text 
            className="text-6xl font-bold mx-1"
            style={{ color: config.textColor, opacity: 0.5 }}
          >
            :
          </Text>
          <Text 
            className="text-8xl font-bold tracking-tight"
            style={{ color: config.textColor }}
          >
            {time.secs}
          </Text>
        </View>

        {/* Status Label */}
        <View className="mt-2 px-3 py-1 rounded-full" style={{ backgroundColor: config.iconColor + '20' }}>
          <Text 
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: config.iconColor }}
          >
            {config.label}
          </Text>
        </View>

        {/* Sound Toggle - Top Right Corner */}
        <TouchableOpacity
          className="absolute top-4 right-4 p-2 rounded-full"
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
          onPress={toggleSound}
        >
          <MaterialCommunityIcons 
            name={soundEnabled ? 'volume-high' : 'volume-off'} 
            size={20} 
            color={config.iconColor} 
          />
        </TouchableOpacity>
      </View>

      {/* Sound Type Indicator */}
      {soundEnabled && (
        <View className="mt-3 flex-row items-center gap-2">
          <MaterialCommunityIcons name="clock-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600">Tick sound enabled</Text>
        </View>
      )}
    </View>
  );
}
