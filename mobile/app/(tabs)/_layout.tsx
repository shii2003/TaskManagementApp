import { Tabs } from "expo-router";
import React from "react";
import { Ionicons, Feather, FontAwesome5 } from "@expo/vector-icons";

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E7EB',
                    backgroundColor: 'white',
                },
                tabBarActiveTintColor: '#10B981',
                tabBarInactiveTintColor: '#9CA3AF',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? "home" : "home-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="search"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Feather
                            name="search"
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="tasks"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? "list" : "list-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="profile"
                options={{
                    tabBarIcon: ({ focused, color }) => (
                        <Ionicons
                            name={focused ? "person" : "person-outline"}
                            size={28}
                            color={color}
                        />
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
