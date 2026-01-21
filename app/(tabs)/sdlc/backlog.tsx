import { useState, useEffect } from 'react';
import { View, Text, FlatList, Pressable } from 'react-native';
import { Container } from '../../../components/layout/Container';
import { ScreenHeader } from '../../../components/layout/ScreenHeader';
import { Card } from '../../../components/ui/Card';
import { Badge } from '../../../components/ui/Badge';
import { Button } from '../../../components/ui/Button';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Loading } from '../../../components/ui/Loading';
import { useRouter } from 'expo-router';
import { Task } from '../../../types/models';
import { useTaskStore } from '../../../store/taskStore';

export default function BacklogScreen() {
    const router = useRouter();
    const { tasks, loading, fetchTasks } = useTaskStore();

    useEffect(() => {
        fetchTasks({ status: 'backlog' }); // Fetch tasks with status 'backlog' for unplanned items
    }, []);

    const renderTask = ({ item }: { item: Task }) => {
        const getQuadrantColor = (id: string) => {
            const colors: Record<string, string> = {
                'eq-1': 'bg-red-100 text-red-800',
                'eq-2': 'bg-blue-100 text-blue-800',
                'eq-3': 'bg-yellow-100 text-yellow-800',
                'eq-4': 'bg-gray-100 text-gray-800',
            };
            return colors[id] || colors['eq-2'];
        };

        return (
            <Pressable onPress={() => router.push(`/(tabs)/sdlc/task/${item.id}` as any)}>
                <Card className="mb-3">
                    <View className="flex-row items-start justify-between mb-2">
                        <Text className="text-base font-semibold flex-1 mr-2">{item.title}</Text>
                        <Badge className={getQuadrantColor(item.eisenhowerQuadrantId)} size="sm">
                            {item.storyPoints}
                        </Badge>
                    </View>
                    {item.description && (
                        <Text className="text-sm text-gray-600 mb-2" numberOfLines={2}>
                            {item.description}
                        </Text>
                    )}
                    <View className="flex-row gap-2">
                        <Badge size="sm" variant="outline">📋 Backlog</Badge>
                    </View>
                </Card>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <Container>
                <ScreenHeader title="Backlog" subtitle="Raw tasks to be planned" />
                <Loading />
            </Container>
        );
    }

    return (
        <Container>
            <ScreenHeader
                title="Backlog"
                subtitle="Raw tasks to be planned"
                rightAction={
                    <Button
                        onPress={() => router.push('/(tabs)/sdlc/create-task' as any)}
                        size="sm"
                    >
                        + New
                    </Button>
                }
            />
            {tasks.length === 0 ? (
                <EmptyState
                    icon="inbox"
                    title="No backlog items"
                    message="Create your first task to add to the backlog"
                    actionLabel="Create Task"
                    onAction={() => router.push('/(tabs)/sdlc/create-task' as any)}
                />
            ) : (
                <FlatList
                    data={tasks}
                    renderItem={renderTask}
                    keyExtractor={(item) => item.id}
                    contentContainerClassName="p-4"
                />
            )}
        </Container>
    );
}
