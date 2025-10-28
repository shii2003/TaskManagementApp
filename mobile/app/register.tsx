import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import { Link, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "../src/hooks/redux";
import { registerAsync } from "../src/store/slices/authSlice";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
        if (error) {
            Alert.alert("Registration Failed", error);
        }
    }, [error]);

    const isValidEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const isValidPassword = (password: string): boolean => {

        return password.length >= 6 && /[A-Za-z]/.test(password) && /[0-9]/.test(password);
    };

    const handleRegister = async () => {

        const trimmedName = name.trim();
        const trimmedEmail = email.trim().toLowerCase();
        const trimmedPassword = password.trim();
        const trimmedConfirmPassword = confirmPassword.trim();


        if (!trimmedName || !trimmedEmail || !trimmedPassword || !trimmedConfirmPassword) {
            Alert.alert("Error", "Please fill in all fields");
            return;
        }

        if (trimmedName.length < 2) {
            Alert.alert("Error", "Name must be at least 2 characters long");
            return;
        }

        if (!isValidEmail(trimmedEmail)) {
            Alert.alert("Error", "Please enter a valid email address");
            return;
        }

        if (!isValidPassword(trimmedPassword)) {
            Alert.alert(
                "Error",
                "Password must be at least 6 characters long, has at least one lowercase letter, at least one uppercase letter,at least one number and at least onespecial character."
            );
            return;
        }

        if (trimmedPassword !== trimmedConfirmPassword) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        try {
            await dispatch(registerAsync({
                name: trimmedName,
                email: trimmedEmail,
                password: trimmedPassword,
                confirmPassword: trimmedConfirmPassword
            })).unwrap();
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
                    contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 32 }}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps="handled"
                >

                    <View className="items-center mb-8 mt-4">
                        <View className="w-20 h-20 bg-emerald-500 rounded-full items-center justify-center mb-4">
                            <Ionicons name="person-add" size={40} color="white" />
                        </View>
                        <Text className="text-3xl font-bold text-gray-800 mb-2">
                            Create Account
                        </Text>
                        <Text className="text-gray-500 text-center">
                            Join us and start managing your tasks efficiently
                        </Text>
                    </View>


                    <View className="mb-6">
                        <Text className="text-gray-700 font-semibold mb-2 text-sm">Full Name</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
                            <Feather name="user" size={20} color="#10B981" />
                            <TextInput
                                placeholder="Enter your full name"
                                placeholderTextColor="#9CA3AF"
                                value={name}
                                onChangeText={setName}
                                className="ml-3 flex-1 text-gray-800"
                                style={{ fontSize: 16 }}
                            />
                        </View>

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
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 mb-4 shadow-sm">
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

                        <Text className="text-gray-700 font-semibold mb-2 text-sm">Confirm Password</Text>
                        <View className="flex-row items-center bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-sm">
                            <Feather name="lock" size={20} color="#10B981" />
                            <TextInput
                                placeholder="Confirm your password"
                                placeholderTextColor="#9CA3AF"
                                secureTextEntry
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                className="ml-3 flex-1 text-gray-800"
                                style={{ fontSize: 16 }}
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-emerald-500 py-4 rounded-xl shadow-lg shadow-emerald-500/50 mb-6"
                        activeOpacity={0.8}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </Text>
                    </TouchableOpacity>

                    <View className="flex-row items-center mb-6">
                        <View className="flex-1 h-px bg-gray-200" />
                        <Text className="mx-4 text-gray-400 text-sm">OR</Text>
                        <View className="flex-1 h-px bg-gray-200" />
                    </View>

                    <View className="flex-row justify-center items-center mb-8">
                        <Text className="text-gray-600">Already have an account? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text className="text-emerald-600 font-bold text-base">
                                    Sign In
                                </Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default Register;