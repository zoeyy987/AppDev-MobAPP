import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../../context/LanguageContext';
import { useTheme } from '../../../context/ThemeContext';
import { Shadows } from '../../../constants/theme';

interface WalletTransaction {
  id: string;
  label: string;
  amount: number;
  status: 'credit' | 'debit';
  date: string;
}

interface WalletSectionProps {
  balance: number;
  currency?: string;
  onAddFunds?: () => void;
  onWithdraw?: () => void;
  recentTransactions?: WalletTransaction[];
}

const defaultTransactions: WalletTransaction[] = [
  { id: 'tx-1', label: 'Escrow Release', amount: 2800, status: 'credit', date: 'Today' },
  { id: 'tx-2', label: 'Service Fee', amount: 350, status: 'debit', date: 'Yesterday' },
  { id: 'tx-3', label: 'Payment Received', amount: 1450, status: 'credit', date: '2 days ago' },
];

export const WalletSection: React.FC<WalletSectionProps> = ({
  balance,
  currency = '₱',
  onAddFunds,
  onWithdraw,
  recentTransactions = []
}) => {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const router = useRouter();
  const transactions = recentTransactions.length > 0 ? recentTransactions : defaultTransactions;

  const handleAddFunds = () => {
    if (onAddFunds) {
      onAddFunds();
      return;
    }
    router.push('/profile');
  };

  const handleWithdraw = () => {
    if (onWithdraw) {
      onWithdraw();
      return;
    }
    router.push('/profile');
  };

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}>
        <View style={styles.headerRow}>
          <View>
            <Text style={[styles.title, { color: theme.text }]}>{t('wallet')}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Manage your balance and payouts.</Text>
          </View>
          <View style={[styles.iconWrapper, { backgroundColor: theme.background }]}> 
            <Ionicons name="wallet-outline" size={24} color={theme.tint} />
          </View>
        </View>

        <View style={styles.balanceRow}>
          <Text style={[styles.balanceLabel, { color: theme.textSecondary }]}>Available Balance</Text>
          <Text style={[styles.balanceAmount, { color: theme.text }]}>
            {currency} {balance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.tint },
              pressed && styles.actionPressed,
            ]}
            onPress={handleAddFunds}
          >
            <Text style={styles.actionText}>{t('topUp') || 'Top Up'}</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: theme.cardBorder },
              pressed && styles.actionPressed,
            ]}
            onPress={handleWithdraw}
          >
            <Text style={[styles.actionText, { color: theme.text }]}>{t('withdraw') || 'Withdraw'}</Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.activityCard, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}> 
        <View style={styles.activityHeader}>
          <Text style={[styles.activityTitle, { color: theme.text }]}>Recent Activity</Text>
          <Text style={[styles.activitySubtitle, { color: theme.textSecondary }]}>Latest wallet transactions</Text>
        </View>

        {transactions.slice(0, 3).map((transaction) => (
          <View key={transaction.id} style={styles.transactionRow}>
            <View style={styles.txLabelColumn}>
              <Text style={[styles.txLabel, { color: theme.text }]}>{transaction.label}</Text>
              <Text style={[styles.txDate, { color: theme.textSecondary }]}>{transaction.date}</Text>
            </View>
            <Text
              style={[
                styles.txAmount,
                { color: transaction.status === 'credit' ? '#16a34a' : theme.text },
              ]}
            >
              {transaction.status === 'debit' ? '- ' : '+ '}
              {currency}{transaction.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
  },
  card: {
    marginHorizontal: 24,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    ...Shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  iconWrapper: {
    width: 46,
    height: 46,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceRow: {
    marginBottom: 18,
  },
  balanceLabel: {
    fontSize: 12,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  actionPressed: {
    opacity: 0.85,
  },
  activityCard: {
    marginHorizontal: 24,
    marginTop: 18,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    ...Shadows.sm,
  },
  activityHeader: {
    marginBottom: 14,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  activitySubtitle: {
    fontSize: 12,
    lineHeight: 18,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  txLabelColumn: {
    flex: 1,
    marginRight: 12,
  },
  txLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  txDate: {
    fontSize: 12,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
});
