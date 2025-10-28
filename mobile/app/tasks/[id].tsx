import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { fetchTaskById, deleteTaskAsync, updateTaskStatusAsync } from "../../src/store/slices/tasksSlice";

const TaskDetail = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const { currentTask, isLoading } = useAppSelector((state) => state.tasks);

    useEffect(() => {
        if (id && typeof id === 'string') {
            dispatch(fetchTaskById(id));
        }
    }, [id, dispatch]);

    const handleDelete = () => {
        Alert.alert(
            "Delete Task",
            "Are you sure you want to delete this task?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        if (id && typeof id === 'string') {
                            await dispatch(deleteTaskAsync(id));
                            router.back();
                        }
                    },
                },
            ]
        );
    };

    const handleStatusChange = (status: 'todo' | 'in_progress' | 'completed') => {
        if (id && typeof id === 'string') {
            dispatch(updateTaskStatusAsync({ id, status }));
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "todo":
                return "bg-blue-500";
            case "in_progress":
                return "bg-yellow-500";
            case "completed":
                return "bg-emerald-500";
            default:
                return "bg-gray-500";
        }
    };

    if (isLoading || !currentTask) {
        return (
            <SafeAreaView className="flex-1 bg-gray-50">
                <View className="flex-1 items-center justify-center">
                    <Text className="text-gray-500">Loading task details...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">Task Details</Text>
                </View>
                <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={24} color="#DC2626" />
                </TouchableOpacity>
            </View>

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                {/* Title Section */}
                <View className="bg-white px-6 py-5 border-b border-gray-100">
                    <Text className="text-2xl font-bold text-gray-800 mb-3">
                        {currentTask.title}
                    </Text>

                    <View className={`${getStatusColor(currentTask.status)} px-4 py-1.5 rounded-full w-fit`}>
                        <Text className="text-white text-xs font-bold capitalize">
                            {currentTask.status.replace("_", " ")}
                        </Text>
                    </View>
                </View>

                {/* Description Section */}
                {currentTask.description && (
                    <View className="bg-white px-6 py-5 border-b border-gray-100">
                        <Text className="text-base font-semibold text-gray-700 mb-3">
                            Description
                        </Text>
                        <Text className="text-gray-600 leading-6">
                            {currentTask.description}
                        </Text>
                    </View>
                )}

                {/* Info Section */}
                <View className="bg-white px-6 py-5 mb-4">
                    <Text className="text-base font-semibold text-gray-700 mb-4">
                        Task Information
                    </Text>

                    {currentTask.assignedTo && (
                        <View className="flex-row items-center mb-3">
                            <View className="bg-purple-100 p-2 rounded-lg mr-3">
                                <Ionicons name="person" size={20} color="#9333EA" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-xs text-gray-500 mb-0.5">Assigned To</Text>
                                <Text className="text-gray-800 font-semibold">{currentTask.assignedTo}</Text>
                            </View>
                        </View>
                    )}

                    <View className="flex-row items-center mb-3">
                        <View className="bg-green-100 p-2 rounded-lg mr-3">
                            <Ionicons name="person-outline" size={20} color="#16A34A" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-0.5">Created By</Text>
                            <Text className="text-gray-800 font-semibold">{currentTask.createdBy.name}</Text>
                            <Text className="text-gray-500 text-xs">{currentTask.createdBy.email}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center">
                        <View className="bg-blue-100 p-2 rounded-lg mr-3">
                            <Ionicons name="calendar-outline" size={20} color="#2563EB" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-gray-500 mb-0.5">Created</Text>
                            <Text className="text-gray-800 font-semibold">
                                {new Date(currentTask.createdAt).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Status Update Section */}
                <View className="bg-white px-6 py-5 mb-4">
                    <Text className="text-base font-semibold text-gray-700 mb-4">
                        Update Status
                    </Text>
                    <View className="flex-row gap-3">
                        {(["todo", "in_progress", "completed"] as const).map((status) => (
                            <TouchableOpacity
                                key={status}
                                onPress={() => handleStatusChange(status)}
                                className={`flex-1 py-3 rounded-xl border-2 ${currentTask.status === status
                                    ? "bg-emerald-50 border-emerald-500"
                                    : "bg-white border-gray-200"
                                    }`}
                            >
                                <Text
                                    className={`text-center font-semibold capitalize ${currentTask.status === status
                                        ? "text-emerald-600"
                                        : "text-gray-600"
                                        }`}
                                >
                                    {status.replace("_", " ")}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Action Buttons */}
                <View className="px-6 pb-8">
                    <TouchableOpacity
                        className="bg-emerald-500 py-4 rounded-xl mb-3 shadow-sm"
                        onPress={() => router.push(`/create-task?id=${id}`)}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Edit Task
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TaskDetail;
