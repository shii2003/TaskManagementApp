import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const Home = () => {
  const stats = {
    today: 5,
    inProgress: 12,
    completed: 45,
    total: 62
  };

  const recentTasks = [
    { title: "Design Homepage", status: "in_progress", priority: "high" },
    { title: "Fix Login Bug", status: "todo", priority: "high" },
    { title: "Update Documentation", status: "completed", priority: "low" },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in_progress":
        return { icon: "timer-outline", color: "#CA8A04" };
      case "completed":
        return { icon: "checkmark-circle", color: "#10B981" };
      default:
        return { icon: "ellipse-outline", color: "#3B82F6" };
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {/* Header */}
        <View className="bg-white px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            Welcome Back 👋
          </Text>
          <Text className="text-gray-500 text-sm">
            Stay on top of your tasks and manage your day efficiently
          </Text>
        </View>

        {/* Quick Stats */}
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Quick Stats
          </Text>

          <View className="flex-row justify-between mb-3">
            <View className="flex-1 bg-emerald-500 rounded-2xl p-4 mr-2 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-bold text-2xl">{stats.today}</Text>
                  <Text className="text-emerald-100 text-xs mt-1">Tasks Today</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="calendar" size={24} color="white" />
                </View>
              </View>
            </View>

            <View className="flex-1 bg-yellow-500 rounded-2xl p-4 ml-2 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-bold text-2xl">{stats.inProgress}</Text>
                  <Text className="text-yellow-100 text-xs mt-1">In Progress</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="time" size={24} color="white" />
                </View>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between">
            <View className="flex-1 bg-blue-500 rounded-2xl p-4 mr-2 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-bold text-2xl">{stats.completed}</Text>
                  <Text className="text-blue-100 text-xs mt-1">Completed</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="checkmark-done" size={24} color="white" />
                </View>
              </View>
            </View>

            <View className="flex-1 bg-purple-500 rounded-2xl p-4 ml-2 shadow-sm">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="text-white font-bold text-2xl">{stats.total}</Text>
                  <Text className="text-purple-100 text-xs mt-1">Total Tasks</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Ionicons name="list" size={24} color="white" />
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Tasks */}
        <View className="px-6 py-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-semibold text-gray-800">
              Recent Tasks
            </Text>
            <TouchableOpacity>
              <Text className="text-emerald-600 font-semibold text-sm">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {recentTasks.map((task, index) => {
              const { icon, color } = getStatusIcon(task.status);
              return (
                <TouchableOpacity
                  key={index}
                  className="flex-row items-center px-4 py-4 border-b border-gray-100 last:border-b-0"
                >
                  <View className={`w-10 h-10 rounded-full items-center justify-center mr-3`}
                    style={{ backgroundColor: `${color}20` }}>
                    <Ionicons name={icon as any} size={20} color={color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-semibold mb-0.5">
                      {task.title}
                    </Text>
                    <Text className="text-gray-400 text-xs capitalize">
                      {task.status.replace("_", " ")} • {task.priority} priority
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 py-4 pb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </Text>

          <View className="flex-row flex-wrap">
            <TouchableOpacity className="w-[48%] rounded-2xl p-4 mr-2 mb-2 shadow-sm border border-emerald-200" style={{ backgroundColor: '#ECFDF5' }}>
              <View className="w-12 h-12 bg-emerald-500 rounded-full items-center justify-center mb-3">
                <Feather name="plus" size={24} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-base">Create Task</Text>
              <Text className="text-gray-500 text-xs mt-1">Add a new task</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[48%] rounded-2xl p-4 ml-2 mb-2 shadow-sm border border-blue-200" style={{ backgroundColor: '#EFF6FF' }}>
              <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="search" size={24} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-base">Search Tasks</Text>
              <Text className="text-gray-500 text-xs mt-1">Find tasks quickly</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[48%] rounded-2xl p-4 mr-2 shadow-sm border border-purple-200" style={{ backgroundColor: '#FAF5FF' }}>
              <View className="w-12 h-12 bg-purple-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="stats-chart" size={24} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-base">Analytics</Text>
              <Text className="text-gray-500 text-xs mt-1">View statistics</Text>
            </TouchableOpacity>

            <TouchableOpacity className="w-[48%] rounded-2xl p-4 ml-2 shadow-sm border border-yellow-200" style={{ backgroundColor: '#FEFCE8' }}>
              <View className="w-12 h-12 bg-yellow-500 rounded-full items-center justify-center mb-3">
                <Ionicons name="settings" size={24} color="white" />
              </View>
              <Text className="text-gray-800 font-bold text-base">Settings</Text>
              <Text className="text-gray-500 text-xs mt-1">Manage preferences</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
