import { View, Text } from 'react-native';
import { format, addDays } from 'date-fns';
import { getWeekStartDate, getSprintColor } from '../../utils/dateHelpers';

export function WeekHeader({ currentDate, sprintName }: { currentDate: Date; sprintName: string }) {
    const weekStart = getWeekStartDate(currentDate);
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
    const colorScheme = getSprintColor(currentDate);
    const monthName = format(currentDate, 'MMMM yyyy');

    const bgColor = colorScheme === 'yellow' ? 'bg-yellow-500' :
        colorScheme === 'red' ? 'bg-red-500' : 'bg-green-500';

    return (
        <View className={bgColor + ' pt-12 pb-2 px-4'}>
            {/* Sprint Name - Centered */}
            <View className="items-center mb-2">
                <Text className="text-white text-xl font-bold">{sprintName}</Text>
                <Text className="text-white text-sm mt-1 opacity-90">{monthName}</Text>
            </View>

            {/* Week Days */}
            <View className="flex-row justify-around">
                {weekDays.map((day, index) => {
                    const isToday = format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');
                    return (
                        <View key={index} className="items-center">
                            <Text className="text-white text-xs font-semibold mb-1">
                                {format(day, 'EEE')}
                            </Text>
                            <View
                                className={'w-8 h-8 rounded-full items-center justify-center ' + (isToday ? 'bg-white' : '')}
                            >
                                <Text className={isToday ? 'text-gray-900 font-bold' : 'text-white'}>
                                    {format(day, 'd')}
                                </Text>
                            </View>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}
