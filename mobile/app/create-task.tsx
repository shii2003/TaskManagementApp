import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAppDispatch, useAppSelector } from "../src/hooks/redux";
import { createTaskAsync } from "../src/store/slices/tasksSlice";

const CreateTask = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.tasks);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<"todo" | "in_progress" | "completed">("todo");
    const [showStatusPicker, setShowStatusPicker] = useState(false);

    const statusOptions = ["todo", "in_progress", "completed"];

    const handleCreate = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter a task title");
            return;
        }

        try {
            await dispatch(createTaskAsync({
                title: title.trim(),
                description: description.trim() || undefined,
                status: selectedStatus,
            })).unwrap();
            router.back();
        } catch (error: any) {
            Alert.alert("Error", error || "Failed to create task");
        }
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

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            {/* Header */}
            <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">New Task</Text>
                </View>
            </View>

            {error && (
                <View className="bg-red-50 border-l-4 border-red-500 p-4 mx-6 mt-4">
                    <Text className="text-red-700 text-sm">{error}</Text>
                </View>
            )}

            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="px-6 py-6">
                    {/* Title Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Task Title *</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 py-3">
                            <TextInput
                                placeholder="Enter task title"
                                placeholderTextColor="#9CA3AF"
                                value={title}
                                onChangeText={setTitle}
                                className="text-gray-800"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>

                    {/* Description Input */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Description</Text>
                        <View className="bg-white border border-gray-200 rounded-xl px-4 py-3 h-32">
                            <TextInput
                                placeholder="Enter task description"
                                placeholderTextColor="#9CA3AF"
                                value={description}
                                onChangeText={setDescription}
                                multiline
                                className="text-gray-800"
                                style={{ fontSize: 16, textAlignVertical: "top" }}
                            />
                        </View>
                    </View>

                    {/* Status Selection */}
                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Status</Text>
                        <View className="flex-row gap-3">
                            {statusOptions.map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => setSelectedStatus(status as any)}
                                    className={`flex-1 py-3 rounded-xl border-2 ${selectedStatus === status
                                            ? "bg-emerald-50 border-emerald-500"
                                            : "bg-white border-gray-200"
                                        }`}
                                >
                                    <Text
                                        className={`text-center font-semibold capitalize ${selectedStatus === status
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

                    {/* Create Button */}
                    <TouchableOpacity
                        className="bg-emerald-500 py-4 rounded-xl shadow-sm mb-4"
                        onPress={handleCreate}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View className="flex-row items-center justify-center">
                                <ActivityIndicator color="white" />
                                <Text className="text-white ml-2 font-bold text-lg">Creating...</Text>
                            </View>
                        ) : (
                            <Text className="text-white text-center font-bold text-lg">
                                Create Task
                            </Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => router.back()} className="py-3">
                        <Text className="text-gray-500 text-center font-semibold">
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default CreateTask;
