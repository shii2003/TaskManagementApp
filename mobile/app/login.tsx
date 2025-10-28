import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import React, { useState } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../src/hooks/redux";
import { loginAsync } from "../src/store/slices/authSlice";
import { useEffect } from "react";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (error) {
            Alert.alert("Login Failed", error);
        }
    }, [error]);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        try {
            await dispatch(loginAsync({ email, password })).unwrap();
            router.replace("/(tabs)");
        } catch (error: any) {
            // Error is handled by Alert in useEffect
        }
    };

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: '#F0FDF4' }}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 24, paddingVertical: 48 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="items-center mb-8">
                        <View className="w-20 h-20 bg-emerald-500 rounded-full items-center justify-center mb-4">
                            <Ionicons name="checkmark-done-circle" size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-gray-800 mb-2">
                            Welcome Back
                        </Text>
                        <Text className="text-gray-500 text-center">
                            Sign in to continue managing your tasks
                        </Text>
                    </View>


                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2 text-sm">Email</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
                            <Feather name="mail" size={20} color="#10B981" />
                            <TextInput
                                placeholder="Enter your email"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                className="ml-3 flex-1 text-gray-800"
                                style={{ fontSize: 16 }}
                            />
                        </View>

                        <Text className="text-gray-700 font-semibold mb-2 text-sm">Password</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                            <Feather name="lock" size={20} color="#10B981" />
                            <TextInput
                                placeholder="Enter your password"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry
                                value={password}
                                onChangeText={setPassword}
                                className="ml-3 flex-1 text-gray-800"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity className="self-end mb-6">
                        <Text className="text-emerald-600 font-semibold text-sm">
                            Forgot Password?
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-emerald-500 py-4 rounded-xl shadow-lg shadow-emerald-500/50 mb-6"
                        activeOpacity={0.8}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {isLoading ? "Signing In..." : "Sign In"}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center my-6">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="mx-4 text-gray-400 text-sm">OR</Text>
                        <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    <View className="flex-row justify-center items-center">
                        <Text className="text-gray-600">Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text className="text-emerald-600 font-bold text-base">
                                    Sign Up
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Login;
