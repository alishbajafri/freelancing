import { Slot, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { WalletProvider } from '@/contexts/WalletContext';
import { useEffect } from 'react';

function RootNavigationWrapper() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return; // wait until user is loaded

    // 🔹 Redirect unauthenticated users to login (except signup)
    const publicRoutes = ['/login', '/signup', '/forgot-password'];

    if (!user && !publicRoutes.includes(pathname)) {
      router.replace('/login');
      return;
    }


    // 🔹 Redirect logged-in users away from login page
    if (user && pathname === '/login') {
      if (user.role === 'freelancer') router.replace('/');
      else router.replace('/client');
      return;
    }

    // 🔹 Redirect logged-in users away from signup page
    if (user && pathname === '/signup') {
      if (user.role === 'freelancer') router.replace('/');
      else router.replace('/client');
      return;
    }
  }, [isLoading, user, pathname]);

  // Loading spinner while checking auth
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <WalletProvider>
        <RootNavigationWrapper />
        <StatusBar style="auto" />
      </WalletProvider>
    </AuthProvider>
  );
}
