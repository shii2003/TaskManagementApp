
import { Tabs } from "expo-router";
import React from 'react'

const _layout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    headerShown: false
                }}
            />
            <Tabs.Screen
                name="search"
                options={{
                    title: "Search",
                    headerShown: false
                }}
            >
            </Tabs.Screen>
            <Tabs.Screen
                name="tasks"
                options={{
                    title: "tasks",
                    headerShown: false
                }}
            >
            </Tabs.Screen>
            <Tabs.Screen
                name="profile"
                options={{
                    title: "profile",
                    headerShown: false
                }}
            >
            </Tabs.Screen>
        </Tabs>
    )
}

export default _layout