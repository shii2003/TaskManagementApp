import { Stack } from "expo-router";
import './globals.css'
import { Provider } from 'react-redux';
import { store } from '../src/store';
import { useAppSelector } from '../src/hooks/redux';
import { useEffect } from 'react';
import { useAppDispatch } from '../src/hooks/redux';
import { checkAuth } from '../src/store/slices/authSlice';
import { View, ActivityIndicator, Text } from "react-native";

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 10, color: '#6B7280' }}>Loading...</Text>
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="tasks"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="create-task"
            options={{ headerShown: false }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="login"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="register"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
            initialParams={{ redirect: true }}
          />
          <Stack.Screen
            name="tasks"
            options={{ headerShown: false }}
            initialParams={{ redirect: true }}
          />
          <Stack.Screen
            name="create-task"
            options={{ headerShown: false }}
            initialParams={{ redirect: true }}
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <RootLayoutNav />
    </Provider>
  );
}
