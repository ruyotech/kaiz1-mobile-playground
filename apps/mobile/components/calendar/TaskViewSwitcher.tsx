import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ViewMode = 'eisenhower' | 'status' | 'size';

interface TaskViewSwitcherProps {
    currentView: ViewMode;
    onViewChange: (view: ViewMode) => void;
}

export function TaskViewSwitcher({ currentView, onViewChange }: TaskViewSwitcherProps) {
    const views: { mode: ViewMode; label: string; icon: string }[] = [
        { mode: 'eisenhower', label: 'Matrix', icon: 'grid' },
        { mode: 'status', label: 'Status', icon: 'check-circle' },
        { mode: 'size', label: 'Size', icon: 'ruler' },
    ];

    return (
        <View className="bg-white border-b border-gray-200 px-4 py-3">
            <View className="flex-row justify-around">
                {views.map((view) => (
                    <TouchableOpacity
                        key={view.mode}
                        onPress={() => onViewChange(view.mode)}
                        className={`flex-row items-center px-4 py-2 rounded-full ${currentView === view.mode ? 'bg-blue-500' : 'bg-gray-100'
                            }`}
                    >
                        <MaterialCommunityIcons
                            name={view.icon as any}
                            size={18}
                            color={currentView === view.mode ? '#fff' : '#666'}
                        />
                        <Text
                            className={`ml-2 font-semibold ${currentView === view.mode ? 'text-white' : 'text-gray-700'
                                }`}
                        >
                            {view.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}
