import { Ionicons, Octicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/ThemeContext';



export default function TabLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const unreadCount = 0;
  const unseenOrderCount = 0;

  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Mock user role
    setRole('client');
    setLoading(false);
  }, []);

  // Center Button
  const CenterButton = () => {
    const isCreator = role === 'creator';
    return (
      <View style={[styles.plusButton, { backgroundColor: theme.tint, borderColor: theme.background }]}>
        {isCreator ? (
          <Ionicons name="add" size={30} color="#fff" />
        ) : (
          <Octicons name="sparkle-fill" size={28} color="#fff" />
        )}
      </View>
    );
  };

  const handleOrderPress = () => {
    // markOrdersAsSeen();
    // Navigate to order screen
    router.push('/order' as never);
  };

  // Show loading indicator while fetching role
  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: theme.tint,
        tabBarInactiveTintColor: theme.tabIconDefault,
        tabBarStyle: {
          backgroundColor: theme.card,
          borderTopWidth: 0,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingTop: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 10,
        },
      }}>

      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />
        }}
      />

      {/* For Creators: Show briefcase icon that goes to ManageService */}
      <Tabs.Screen
        name="ManageService"
        options={{
          title: 'My Services',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={26} color={color} />,
          href: role === 'creator' ? undefined : null
        }}
      />

      {/* For Regular Users: Show search icon that goes to search */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={color} />,
          href: role !== 'creator' ? undefined : null
        }}
      />

      <Tabs.Screen
        name="create_placeholder"
        options={{
          title: '',
          tabBarButton: (props) => {
            const { ref: _ref, ...rest } = props;
            return (
              <Pressable
                {...rest}
                style={styles.plusContainer}
                onPress={() => {
                  if (role === 'creator') {
                    router.push('/add-service' as never);
                  } else {
                    router.push('/smart-match/match' as never);
                  }
                }}
              >
                <CenterButton />
              </Pressable>
            );
          }
        }}
        listeners={() => ({ tabPress: (e) => { e.preventDefault(); }, })}
      />

      <Tabs.Screen
        name="message"
        options={{
          title: 'Message',
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.danger,
            fontSize: 10,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            lineHeight: 16
          },
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"} size={26} color={color} />
        }}
      />

      {/* ORDERS TAB */}
      <Tabs.Screen
        name="order"
        options={{
          title: role === 'creator' ? 'My Gigs' : 'Orders',
          tabBarBadge: unseenOrderCount > 0 ? unseenOrderCount : undefined,
          tabBarBadgeStyle: {
            backgroundColor: theme.danger,
            fontSize: 10,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            lineHeight: 16
          },
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "clipboard" : "clipboard-outline"} size={26} color={color} />
        }}
        listeners={() => ({
          tabPress: (_e) => {
            handleOrderPress();
          },
        })}
      />

      {/* Hidden Routes */}
      <Tabs.Screen name="profile" options={{ href: null }} />
      <Tabs.Screen name="AnalyticsScreen" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusContainer: { top: -20, justifyContent: 'center', alignItems: 'center', zIndex: 10 },
  plusButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5
  }
});