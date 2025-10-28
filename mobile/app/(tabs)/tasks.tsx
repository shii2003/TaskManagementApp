import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Alert, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { fetchTasks, setFilter, deleteTaskAsync } from "../../src/store/slices/tasksSlice";
import { useRouter } from "expo-router";

const Tasks = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedFilter, setSelectedFilter] = useState<"all" | "todo" | "in_progress" | "completed">("all");

    const dispatch = useAppDispatch();
    const { tasks, isLoading, isRefreshing, error } = useAppSelector((state) => state.tasks);
    const router = useRouter();

    useEffect(() => {

        dispatch(fetchTasks({
            search: searchQuery || undefined,
            status: selectedFilter === 'all' ? undefined : selectedFilter
        }));
    }, [searchQuery, selectedFilter, dispatch]);

    const handleRefresh = () => {
        dispatch(fetchTasks({
            search: searchQuery || undefined,
            status: selectedFilter === 'all' ? undefined : selectedFilter
        }));
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                        dispatch(deleteTaskAsync(id));
                    },
                },
            ]
        );
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "todo":
                return "bg-blue-100 text-blue-700 border-blue-300";
            case "in_progress":
                return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "completed":
                return "bg-emerald-100 text-emerald-700 border-emerald-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const filteredTasks = tasks.filter(task => {
        if (!searchQuery) return true;
        const query = searchQuery.toLowerCase();
        return (
            task.title.toLowerCase().includes(query) ||
            task.description?.toLowerCase().includes(query) ||
            task.assignedTo?.toLowerCase().includes(query)
        );
    });

    const renderTask = ({ item }: { item: any }) => (
        <TouchableOpacity
            className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
            onPress={() => router.push(`/tasks/${item._id}`)}
        >
            <View className="flex-row justify-between items-start mb-2">
                <Text className="text-base font-bold text-gray-800 flex-1 pr-2">
                    {item.title}
                </Text>
                <View className={`px-3 py-1 rounded-full border ${getStatusColor(item.status)}`}>
                    <Text className="text-xs font-semibold capitalize">
                        {item.status.replace("_", " ")}
                    </Text>
                </View>
            </View>

            {item.description && (
                <Text className="text-sm text-gray-500 mb-3" numberOfLines={2}>
                    {item.description}
                </Text>
            )}

            <View className="flex-row items-center justify-between">
                {item.assignedTo && (
                    <View className="flex-row items-center">
                        <Ionicons name="person-outline" size={14} color="#9CA3AF" />
                        <Text className="text-xs text-gray-500 ml-1">{item.assignedTo}</Text>
                    </View>
                )}

                <View className="flex-row items-center">
                    <TouchableOpacity
                        onPress={() => handleDelete(item._id)}
                        className="ml-2"
                    >
                        <Ionicons name="trash-outline" size={18} color="#DC2626" />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <View className="px-6 pt-6 pb-4 bg-white border-b border-gray-100">
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-2xl font-bold text-gray-800">My Tasks</Text>
                    <TouchableOpacity
                        className="bg-emerald-500 p-3 rounded-xl shadow-sm"
                        onPress={() => router.push('/create-task')}
                    >
                        <Feather name="plus" size={20} color="white" />
                    </TouchableOpacity>
                </View>

                <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-4">
                    <Feather name="search" size={18} color="#9CA3AF" />
                    <TextInput
                        placeholder="Search by title, description, or assignee..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        className="ml-2 flex-1 text-gray-800"
                        style={{ fontSize: 15 }}
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery("")}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="flex-row"
                >
                    {["all", "todo", "in_progress", "completed"].map((filter) => (
                        <TouchableOpacity
                            key={filter}
                            onPress={() => setSelectedFilter(filter as any)}
                            className={`px-4 py-2 rounded-full mr-2 ${selectedFilter === filter
                                ? "bg-emerald-500"
                                : "bg-gray-100"
                                }`}
                        >
                            <Text
                                className={`text-sm font-semibold capitalize ${selectedFilter === filter
                                    ? "text-white"
                                    : "text-gray-600"
                                    }`}
                            >
                                {filter.replace("_", " ")}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {error && (
                <View className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4">
                    <Text className="text-red-700 text-sm">{error}</Text>
                </View>
            )}

            <FlatList
                data={filteredTasks}
                renderItem={renderTask}
                keyExtractor={(item) => item._id}
                contentContainerStyle={{ padding: 24 }}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        tintColor="#10B981"
                    />
                }
                ListEmptyComponent={
                    <View className="items-center justify-center py-12">
                        <Ionicons name="document-text-outline" size={64} color="#D1D5DB" />
                        <Text className="text-gray-400 text-center mt-4 font-semibold">
                            {isLoading ? "Loading tasks..." : "No tasks found"}
                        </Text>
                        <Text className="text-gray-400 text-center text-sm mt-1">
                            {searchQuery ? "Try adjusting your search" : "Create your first task"}
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

export default Tasks;