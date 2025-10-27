import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../../src/hooks/redux";
import { logoutAsync } from "../../src/store/slices/authSlice";
import { useRouter } from "expo-router";

const Profile = () => {
    const { user } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await dispatch(logoutAsync());
                        router.replace("/login");
                    },
                },
            ]
        );
    };

    const userInitials = (user?.name || "U").split(' ').map(n => n[0]).join('').toUpperCase();

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 32 }}
            >
                {/* Header Section */}
                <View className="bg-emerald-500 px-6 py-10 items-center mb-8">
                    <View className="w-24 h-24 bg-white rounded-full items-center justify-center mb-4 shadow-lg">
                        <Text className="text-3xl font-bold text-emerald-600">
                            {userInitials}
                        </Text>
                    </View>
                    <Text className="text-xl font-bold text-white mb-1">
                        {user?.name || "Guest User"}
                    </Text>
                    <Text className="text-emerald-100 text-sm">
                        {user?.email || "guest@example.com"}
                    </Text>
                </View>

                {/* Profile Information Card */}
                <View className="px-6 mb-6">
                    <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                        <View className="flex-row items-center mb-4 pb-4 border-b border-gray-100">
                            <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-4">
                                <Ionicons name="person" size={24} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm text-gray-500 mb-1">Name</Text>
                                <Text className="text-base font-semibold text-gray-800">
                                    {user?.name || "Not Available"}
                                </Text>
                            </View>
                        </View>

                        <View className="flex-row items-center">
                            <View className="w-12 h-12 bg-emerald-100 rounded-full items-center justify-center mr-4">
                                <Ionicons name="mail" size={24} color="#10B981" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm text-gray-500 mb-1">Email</Text>
                                <Text className="text-base font-semibold text-gray-800">
                                    {user?.email || "Not Available"}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Logout Button */}
                <View className="px-6">
                    <TouchableOpacity
                        className="bg-red-50 border-2 border-red-200 py-4 rounded-xl flex-row items-center justify-center"
                        onPress={handleLogout}
                    >
                        <Ionicons name="log-out-outline" size={22} color="#DC2626" />
                        <Text className="text-red-600 font-bold text-lg ml-2">
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
