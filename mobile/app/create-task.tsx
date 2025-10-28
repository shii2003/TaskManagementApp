import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAppDispatch, useAppSelector } from "../src/hooks/redux";
import { createTaskAsync, fetchTaskById, updateTaskAsync } from "../src/store/slices/tasksSlice";
import { AssignedUserEmail } from "../src/services/tasks";

const CreateTask = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const dispatch = useAppDispatch();
    const { isLoading, error, currentTask } = useAppSelector((state) => state.tasks);
    const isEditMode = !!id;

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [selectedStatus, setSelectedStatus] = useState<"todo" | "in_progress" | "completed">("todo");
    const [selectedAssignedTo, setSelectedAssignedTo] = useState<AssignedUserEmail | undefined>(undefined);
    const [showAssignedToPicker, setShowAssignedToPicker] = useState(false);

    const statusOptions = ["todo", "in_progress", "completed"];
    const assignedToOptions: { email: AssignedUserEmail; name: string }[] = [
        { email: 'john.doe@example.com', name: 'John Doe' },
        { email: 'jane.smith@example.com', name: 'Jane Smith' },
        { email: 'mike.johnson@example.com', name: 'Mike Johnson' },
        { email: 'sarah.wilson@example.com', name: 'Sarah Wilson' },
    ];


    React.useEffect(() => {
        if (isEditMode && id) {
            dispatch(fetchTaskById(id as string));
        }
    }, [isEditMode, id, dispatch]);

    React.useEffect(() => {
        if (isEditMode && currentTask) {
            setTitle(currentTask.title);
            setDescription(currentTask.description || "");
            setSelectedStatus(currentTask.status);
            setSelectedAssignedTo(currentTask.assignedTo);
        }
    }, [isEditMode, currentTask]);

    const handleSave = async () => {
        if (!title.trim()) {
            Alert.alert("Error", "Please enter a task title");
            return;
        }

        try {
            const taskData = {
                title: title.trim(),
                description: description.trim() || undefined,
                status: selectedStatus,
                assignedTo: selectedAssignedTo,
            };

            if (isEditMode && id) {
                await dispatch(updateTaskAsync({ id: id as string, data: taskData })).unwrap();
                Alert.alert("Success", "Task updated successfully!");
            } else {
                await dispatch(createTaskAsync(taskData)).unwrap();
                Alert.alert("Success", "Task created successfully!");
            }
            router.replace("/(tabs)/tasks");
        } catch (error: any) {
            Alert.alert("Error", error || "Failed to save task");
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

            <View className="bg-white border-b border-gray-200 px-6 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center">
                    <TouchableOpacity onPress={() => router.back()} className="mr-3">
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>
                    <Text className="text-xl font-bold text-gray-800">{isEditMode ? "Edit Task" : "New Task"}</Text>
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

                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2">Assign To</Text>
                        <TouchableOpacity
                            onPress={() => setShowAssignedToPicker(!showAssignedToPicker)}
                            className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex-row items-center justify-between"
                        >
                            <Text className={`${selectedAssignedTo ? 'text-gray-800' : 'text-gray-400'}`}>
                                {selectedAssignedTo
                                    ? assignedToOptions.find(option => option.email === selectedAssignedTo)?.name || selectedAssignedTo
                                    : 'Select a user'
                                }
                            </Text>
                            <Ionicons
                                name={showAssignedToPicker ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#9CA3AF"
                            />
                        </TouchableOpacity>

                        {showAssignedToPicker && (
                            <View className="bg-white border border-gray-200 rounded-xl mt-2 shadow-sm">
                                <TouchableOpacity
                                    onPress={() => {
                                        setSelectedAssignedTo(undefined);
                                        setShowAssignedToPicker(false);
                                    }}
                                    className="px-4 py-3 border-b border-gray-100"
                                >
                                    <Text className={`${!selectedAssignedTo ? 'text-emerald-600 font-semibold' : 'text-gray-600'}`}>
                                        No assignment
                                    </Text>
                                </TouchableOpacity>
                                {assignedToOptions.map((option) => (
                                    <TouchableOpacity
                                        key={option.email}
                                        onPress={() => {
                                            setSelectedAssignedTo(option.email);
                                            setShowAssignedToPicker(false);
                                        }}
                                        className="px-4 py-3 border-b border-gray-100 last:border-b-0"
                                    >
                                        <Text className={`${selectedAssignedTo === option.email ? 'text-emerald-600 font-semibold' : 'text-gray-600'}`}>
                                            {option.name}
                                        </Text>
                                        <Text className="text-xs text-gray-400 mt-1">{option.email}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        className="bg-emerald-500 py-4 rounded-xl shadow-sm mb-4"
                        onPress={handleSave}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <View className="flex-row items-center justify-center">
                                <ActivityIndicator color="white" />
                                <Text className="text-white ml-2 font-bold text-lg">
                                    {isEditMode ? "Updating..." : "Creating..."}
                                </Text>
                            </View>
                        ) : (
                            <Text className="text-white text-center font-bold text-lg">
                                {isEditMode ? "Update Task" : "Create Task"}
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
