import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { useEffect } from 'react';

function RootNavigation() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // current path

  useEffect(() => {
    if (!isLoading && !user && pathname !== '/login') {
      router.replace('/login'); // redirect only if not already on login
    }
  }, [isLoading, user, pathname]);

  if (isLoading || (!user && pathname !== '/login')) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <Slot />; // user logged in or already on login
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <WalletProvider>
        <RootNavigation />
        <StatusBar style="auto" />
      </WalletProvider>
    </AuthProvider>
  );
}
