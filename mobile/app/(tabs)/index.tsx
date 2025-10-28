import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";

const Home = () => {
  const infoCards = [
    {
      title: "Welcome to TaskFlow",
      description: "Your personal task management companion designed to help you stay organized and productive.",
      icon: "rocket-outline",
      color: "#10B981",
      bgColor: "#ECFDF5"
    },
    {
      title: "Smart Organization",
      description: "Create, assign, and track tasks with ease. Set priorities and deadlines to manage your workflow effectively.",
      icon: "bulb-outline",
      color: "#3B82F6",
      bgColor: "#EFF6FF"
    },
    {
      title: "Team Collaboration",
      description: "Assign tasks to team members and track progress in real-time. Stay connected with your team.",
      icon: "people-outline",
      color: "#8B5CF6",
      bgColor: "#FAF5FF"
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <View className="bg-white px-6 pt-6 pb-4">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            Welcome to TaskFlow 🚀
          </Text>
          <Text className="text-gray-500 text-sm">
            Your personal task management companion for staying organized and productive
          </Text>
        </View>

        <View className="px-6 py-4">
          <View className=" rounded-2xl overflow-hidden">
            <Image
              source={require('../../assets/background.png')}
              className="w-full h-48"
              resizeMode="contain"
            />
          </View>
        </View>
        <View className="px-6 py-4">
          <Text className="text-lg font-semibold text-gray-800 mb-4">
            About TaskFlow
          </Text>

          {infoCards.map((card, index) => (
            <View key={index} className="mb-4">
              <View
                className="rounded-2xl p-4 shadow-sm border border-gray-100"
                style={{ backgroundColor: card.bgColor }}
              >
                <View className="flex-row items-start">
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center mr-4"
                    style={{ backgroundColor: card.color + '20' }}
                  >
                    <Ionicons name={card.icon as any} size={24} color={card.color} />
                  </View>
                  <View className="flex-1">
                    <Text className="text-gray-800 font-bold text-base mb-2">
                      {card.title}
                    </Text>
                    <Text className="text-gray-600 text-sm leading-5">
                      {card.description}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
