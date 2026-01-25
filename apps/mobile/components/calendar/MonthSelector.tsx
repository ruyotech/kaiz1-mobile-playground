import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';
import { generateMonthList, MonthItem } from '../../utils/dateHelpers';

interface MonthSelectorProps {
    currentDate: Date;
    onMonthSelect: (date: Date) => void;
}

export function MonthSelector({ currentDate, onMonthSelect }: MonthSelectorProps) {
    const months = generateMonthList(new Date(), 12); // 12 months before and after current date
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const renderYearIndicator = (month: MonthItem, index: number) => {
        // Show year between December and January
        if (index > 0) {
            const prevMonth = months[index - 1];
            if (prevMonth.month === 11 && month.month === 0) {
                return (
                    <View className="items-center justify-center px-3">
                        <Text className="text-xs font-bold text-white">{month.year}</Text>
                    </View>
                );
            }
        }
        return null;
    };

    return (
        <View className="py-3">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8 }}
            >
                {months.map((month, index) => {
                    const isSelected = month.month === currentMonth && month.year === currentYear;

                    return (
                        <View key={`${month.year}-${month.month}`} className="flex-row items-center">
                            {renderYearIndicator(month, index)}

                            <TouchableOpacity
                                onPress={() => onMonthSelect(month.date)}
                                className={`px-4 py-2 mx-1 rounded-full ${isSelected
                                        ? 'bg-white'
                                        : 'bg-white/20'
                                    }`}
                            >
                                <Text
                                    className={`text-sm font-semibold ${isSelected
                                            ? 'text-gray-900'
                                            : 'text-white'
                                        }`}
                                >
                                    {month.label}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    );
                })}
            </ScrollView>
        </View>
    );
}
