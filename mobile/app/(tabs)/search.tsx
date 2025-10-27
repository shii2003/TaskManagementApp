import { View, TextInput, Text, ScrollView, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Feather, Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const Search = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [recentSearches] = useState([
        "Design Homepage",
        "Fix Login Bug",
        "Update Documentation"
    ]);

    const popularTags = ["High Priority", "In Progress", "Today", "This Week", "Design", "Frontend", "Backend"];

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
            <View className="flex-1">
                {/* Search Header */}
                <View className="bg-white px-6 pt-6 pb-4 border-b border-gray-100">
                    <Text className="text-2xl font-bold text-gray-800 mb-4">
                        Search Tasks
                    </Text>

                    {/* Search Bar */}
                    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
                        <Feather name="search" size={20} color="#9CA3AF" />
                        <TextInput
                            placeholder="Search tasks, descriptions, assignees..."
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
                </View>

                <ScrollView
                    className="flex-1 px-6"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 24 }}
                >
                    {searchQuery.length === 0 ? (
                        <>
                            {/* Recent Searches */}
                            <View className="py-6">
                                <Text className="text-gray-700 font-semibold mb-4 text-base">
                                    Recent Searches
                                </Text>
                                {recentSearches.map((search, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSearchQuery(search)}
                                        className="flex-row items-center py-3 bg-white rounded-xl px-4 mb-2 shadow-sm border border-gray-100"
                                    >
                                        <Ionicons name="time-outline" size={18} color="#9CA3AF" />
                                        <Text className="ml-3 text-gray-700 font-semibold flex-1">
                                            {search}
                                        </Text>
                                        <Ionicons name="arrow-up-outline" size={18} color="#9CA3AF" />
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Popular Tags */}
                            <View className="py-6 border-t border-gray-200">
                                <Text className="text-gray-700 font-semibold mb-4 text-base">
                                    Popular Tags
                                </Text>
                                <View className="flex-row flex-wrap">
                                    {popularTags.map((tag, index) => (
                                        <TouchableOpacity
                                            key={index}
                                            className="bg-emerald-100 px-4 py-2 rounded-full mr-2 mb-2"
                                        >
                                            <Text className="text-emerald-700 font-semibold text-sm">
                                                {tag}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Search Tips */}
                            <View className="py-6 border-t border-gray-200 pb-12">
                                <Text className="text-gray-700 font-semibold mb-4 text-base">
                                    Search Tips
                                </Text>
                                <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                                    <View className="flex-row items-start mb-3">
                                        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
                                            <Ionicons name="search" size={16} color="#2563EB" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold text-sm">
                                                Search by task title
                                            </Text>
                                            <Text className="text-gray-500 text-xs mt-0.5">
                                                Find tasks by their title or keywords
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-start mb-3">
                                        <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3">
                                            <Ionicons name="person" size={16} color="#9333EA" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold text-sm">
                                                Search by assignee
                                            </Text>
                                            <Text className="text-gray-500 text-xs mt-0.5">
                                                Find tasks assigned to specific users
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="flex-row items-start">
                                        <View className="w-8 h-8 bg-emerald-100 rounded-full items-center justify-center mr-3">
                                            <Ionicons name="funnel" size={16} color="#10B981" />
                                        </View>
                                        <View className="flex-1">
                                            <Text className="text-gray-800 font-semibold text-sm">
                                                Filter by status
                                            </Text>
                                            <Text className="text-gray-500 text-xs mt-0.5">
                                                Use filters to narrow down results
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </>
                    ) : (
                        <View className="py-20 items-center">
                            <View className="w-20 h-20 bg-gray-100 rounded-full items-center justify-center mb-4">
                                <Feather name="search" size={32} color="#9CA3AF" />
                            </View>
                            <Text className="text-gray-400 text-center font-semibold mb-1">
                                No results found
                            </Text>
                            <Text className="text-gray-400 text-center text-sm">
                                Try adjusting your search query
                            </Text>
                        </View>
                    )}
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default Search;
