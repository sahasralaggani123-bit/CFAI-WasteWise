import React from 'react';
import { Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './src/services/AuthContext';
import { COLORS } from './src/utils/constants';
import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import ClassifyScreen from './src/screens/ClassifyScreen';
import SmartBinScreen from './src/screens/SmartBinScreen';
import GPSMapScreen from './src/screens/GPSMapScreen';
import AnalyticsScreen from './src/screens/AnalyticsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AdminDashboard from './src/screens/AdminDashboard';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PhoneShell({ children }: { children: React.ReactNode }) {
  const { width, height } = useWindowDimensions();
  const isDesktop = Platform.OS === 'web' && width >= 768;
  if (!isDesktop) return <>{children}</>;
  const shellHeight = Math.min(height - 32, 860);
  return (
    <View style={styles.desktopStage}>
      <View style={[styles.phoneFrame, { height: shellHeight }]}>{children}</View>
    </View>
  );
}

function MainTabs() {
  const { user } = useAuth();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: '#bfc8c2',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home-outline', Classify: 'camera-outline', Map: 'location-outline',
            Analytics: 'bar-chart-outline', Alerts: 'notifications-outline', Admin: 'settings-outline',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Classify" component={ClassifyScreen} />
      <Tab.Screen name="Map" component={GPSMapScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Alerts" component={NotificationsScreen} />
      {user?.role === 'admin' && <Tab.Screen name="Admin" component={AdminDashboard} />}
    </Tab.Navigator>
  );
}

function RootNavigator() {
  const { token } = useAuth();
  return (
    <PhoneShell>
      <NavigationContainer theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: COLORS.background } }}>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
          {!token ? (
            <>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Main" component={MainTabs} />
              <Stack.Screen name="Profile" component={ProfileScreen} />
              <Stack.Screen name="SmartBins" component={SmartBinScreen} />
              <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </PhoneShell>
  );
}

export default function App() {
  return <AuthProvider><RootNavigator /></AuthProvider>;
}

const styles = StyleSheet.create({
  desktopStage: { flex: 1, backgroundColor: '#1f1f1d', alignItems: 'center', justifyContent: 'center', padding: 16 },
  phoneFrame: { width: 390, maxHeight: 860, borderRadius: 30, overflow: 'hidden', borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.background },
  tabBar: { backgroundColor: COLORS.surface, borderTopColor: COLORS.border, height: 70, paddingBottom: 10, paddingTop: 8 },
});
