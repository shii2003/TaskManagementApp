import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const login = () => {
    return (
        <View className="flex-1 justify-center px-6 bg-stone-800">
            <Text className="text-3xl font-bold text-white text-center mb-6">Login</Text>


            {/* <TextInput
        placeholder="Email"
        placeholderTextColor="#9ca3af"
        value={email}
        onChangeText={setEmail}
        className="bg-[#111827] text-white rounded-md px-4 py-3 mb-4"
        /> */}


            {/* <TextInput
        placeholder="Password"
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-[#111827] text-white rounded-md px-4 py-3 mb-2"
        /> */}


            {/* {error && <Text className="text-red-500 mb-2">{error}</Text>} */}


            <TouchableOpacity
                // onPress={handleLogin}
                // disabled={loading}
                className="bg-emerald-600 rounded-lg py-3  mt-2"
            >
                {/* {loading ? (
        <ActivityIndicator color="#fff" />
        ) : ( */}
                <Text className="text-white text-center text-lg font-semibold">Login</Text>
                {/* )} */}
            </TouchableOpacity>


            {/* <TouchableOpacity onPress={() => navigation.navigate('Register')} className="mt-4"> */}
            <Text className="text-cyan-400 text-center">Don't have an account? Register</Text>
            {/* </TouchableOpacity> */}
        </View>
    )
}

export default login

const styles = StyleSheet.create({})