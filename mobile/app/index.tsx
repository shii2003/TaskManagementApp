import { Redirect } from "expo-router";
import { useAppSelector } from "../src/hooks/redux";

export default function Index() {
    const { isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

    if (isLoading) {
        return null;
    }

    if (isAuthenticated) {
        return <Redirect href="/(tabs)" />;
    }

    return <Redirect href="/login" />;
}
