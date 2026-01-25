import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { usePomodoroStore } from '@/store/pomodoroStore';

export default function SessionControls() {
  const { isPaused, pauseSession, resumeSession, skipSession } = usePomodoroStore();

  return (
    <View className="mt-4">
      <View className="flex-row gap-2">
        <TouchableOpacity
          className="flex-1 bg-blue-600 rounded-lg p-3 items-center justify-center"
          onPress={isPaused ? resumeSession : pauseSession}
        >
          <MaterialCommunityIcons
            name={isPaused ? 'play' : 'pause'}
            size={20}
            color="white"
          />
          <Text className="text-white text-sm font-semibold mt-1">
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 bg-purple-600 rounded-lg p-3 items-center justify-center"
          onPress={skipSession}
        >
          <MaterialCommunityIcons name="skip-next" size={20} color="white" />
          <Text className="text-white text-sm font-semibold mt-1">Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
