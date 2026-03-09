import { Ionicons, Octicons } from '@expo/vector-icons';
import { Tabs, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useRole } from '@/context/RoleContext';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { theme } = useTheme();
  const router = useRouter();
  const { role, loading } = useRole();

  const unreadCount = 0;
  const unseenOrderCount = 0;

  const insets = useSafeAreaInsets();

  const isCreator = role === 'creator';

  // When creator logs in, auto-navigate to AnalyticsScreen tab
  useEffect(() => {
    if (!loading && isCreator) {
      // Small delay to let tabs mount first
      const timer = setTimeout(() => {
        router.replace('/(tabs)/AnalyticsScreen' as never);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [loading, isCreator]);

  // Center Button
  const CenterButton = () => {
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
          tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={26} color={color} />,
          href: isCreator ? null : undefined,
        }}
      />

      {/* Creator-only: Analytics Dashboard as first tab */}
      <Tabs.Screen
        name="AnalyticsScreen"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "analytics" : "analytics-outline"} size={26} color={color} />,
          href: isCreator ? undefined : null,
        }}
      />

      {/* For Creators: Show briefcase icon that goes to ManageService */}
      <Tabs.Screen
        name="ManageService"
        options={{
          title: 'My Services',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "briefcase" : "briefcase-outline"} size={26} color={color} />,
          href: isCreator ? undefined : null,
        }}
      />

      {/* For Regular Users: Show search icon that goes to search */}
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) =>
            <Ionicons name={focused ? "search" : "search-outline"} size={26} color={color} />,
          href: !isCreator ? undefined : null,
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
                  if (isCreator) {
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
          title: isCreator ? 'My Gigs' : 'Orders',
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
      />

      {/* Hidden Routes */}
      <Tabs.Screen name="profile" options={{ href: null }} />
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