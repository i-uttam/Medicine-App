import React, { useCallback, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, type UserProfile } from '@/context/AuthContext';
import { useOrders } from '@/context/OrdersContext';
import { useTheme, type ThemePreference } from '@/context/ThemeContext';
import { useColors } from '@/hooks/useColors';

const TAB_BAR_HEIGHT = 60;

// ─── Extracted outside ProfileScreen to prevent remounting on re-render ───────
type FieldProps = {
  label: string;
  field: keyof UserProfile;
  form: UserProfile;
  onChangeText: (field: keyof UserProfile, value: string) => void;
  keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
  placeholder?: string;
  colors: any;
};

function ProfileField({ label, field, form, onChangeText, keyboardType = 'default', placeholder, colors }: FieldProps) {
  return (
    <View style={[fieldStyles.wrap, { borderBottomColor: colors.border }]}>
      <Text style={[fieldStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <TextInput
        style={[fieldStyles.input, { color: colors.foreground }]}
        value={form[field] as string}
        onChangeText={(v) => onChangeText(field, v)}
        keyboardType={keyboardType}
        placeholder={placeholder ?? `Enter ${label.toLowerCase()}`}
        placeholderTextColor={colors.mutedForeground}
        autoCorrect={false}
        autoCapitalize={keyboardType === 'email-address' ? 'none' : 'words'}
      />
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  label: { fontSize: 11, fontFamily: 'Inter_500Medium', marginBottom: 4, letterSpacing: 0.3 },
  input: { fontSize: 15, fontFamily: 'Inter_500Medium', paddingVertical: 0 },
});

// ─── Menu Row ─────────────────────────────────────────────────────────────────
type MenuRowProps = {
  icon: string;
  iconLib?: 'mci';
  iconBg?: string;
  iconColor?: string;
  label: string;
  sublabel?: string;
  badge?: string | number;
  onPress: () => void;
  last?: boolean;
  colors: any;
};

function MenuRow({ icon, iconLib, iconBg, iconColor, label, sublabel, badge, onPress, last, colors }: MenuRowProps) {
  const bg = iconBg ?? colors.muted;
  const ic = iconColor ?? colors.primary;
  return (
    <Pressable
      style={[menuRowStyles.row, { borderBottomColor: last ? 'transparent' : colors.border }]}
      onPress={() => { Haptics.selectionAsync(); onPress(); }}
      android_ripple={{ color: colors.muted }}
    >
      <View style={[menuRowStyles.iconWrap, { backgroundColor: bg }]}>
        {iconLib === 'mci'
          ? <MaterialCommunityIcons name={icon as any} size={18} color={ic} />
          : <Ionicons name={icon as any} size={18} color={ic} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[menuRowStyles.label, { color: colors.foreground }]}>{label}</Text>
        {sublabel ? <Text style={[menuRowStyles.sublabel, { color: colors.mutedForeground }]}>{sublabel}</Text> : null}
      </View>
      {badge != null && (
        <View style={[menuRowStyles.badge, { backgroundColor: colors.primary }]}>
          <Text style={menuRowStyles.badgeText}>{badge}</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

const menuRowStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 12,
  },
  iconWrap: { width: 38, height: 38, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 14, fontWeight: '500', fontFamily: 'Inter_500Medium' },
  sublabel: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 1 },
  badge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  badgeText: { color: '#FFF', fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold' },
});

// ─── Section Group ─────────────────────────────────────────────────────────────
function SectionGroup({ title, children, colors }: { title: string; children: React.ReactNode; colors: any }) {
  return (
    <View style={{ gap: 8 }}>
      <Text style={[groupStyles.title, { color: colors.mutedForeground }]}>{title}</Text>
      <View style={[groupStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );
}

const groupStyles = StyleSheet.create({
  title: { fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 1, textTransform: 'uppercase', paddingHorizontal: 4 },
  card: { borderWidth: 1, borderRadius: 18, overflow: 'hidden' },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile, logout, updateProfile } = useAuth();
  const { orders } = useOrders();
  const { preference, setPreference, isDark } = useTheme();

  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<UserProfile>({ ...profile });

  const topPad = Platform.OS === 'web' ? 67 : insets.top;
  const tabBarTotal = Platform.OS === 'web' ? TAB_BAR_HEIGHT : TAB_BAR_HEIGHT + insets.bottom;

  // Stats
  const deliveredOrders = orders.filter((o) => o.status === 'Delivered').length;
  const totalSpend = orders
    .filter((o) => o.status !== 'Cancelled')
    .reduce((s, o) => s + o.total, 0);

  // Profile completion
  const completionFields: (keyof UserProfile)[] = [
    'ownerName', 'businessName', 'phone', 'email', 'address', 'gstNumber', 'drugLicense',
  ];
  const filledCount = completionFields.filter((k) => {
    const v = profile[k];
    return typeof v === 'string' && v.trim() !== '';
  }).length;
  const completion = Math.round((filledCount / completionFields.length) * 100);

  // Avatar initials
  const avatarText = useMemo(() => {
    const name = profile.businessName || profile.ownerName || '';
    if (name) return name.slice(0, 2).toUpperCase();
    if (profile.phone) return profile.phone.slice(-2);
    return 'MW';
  }, [profile.businessName, profile.ownerName, profile.phone]);

  // Verification status
  const hasGst = profile.gstNumber.trim() !== '';
  const hasLicense = profile.drugLicense.trim() !== '';
  const isBusinessComplete = hasGst && hasLicense;
  const verificationStatus: 'incomplete' | 'pending' | 'verified' = isBusinessComplete ? 'pending' : 'incomplete';

  // Stable onChangeText to avoid re-render issues
  const handleFieldChange = useCallback((field: keyof UserProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProfile(form);
      setEditing(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setForm({ ...profile });
    setEditing(false);
  }

  async function handleLogout() {
    if (Platform.OS === 'web') {
      await logout();
      router.replace('/login');
      return;
    }
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  }

  function notImplemented(label: string) {
    Alert.alert(label, 'This feature is coming soon.', [{ text: 'OK' }]);
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: tabBarTotal + 24 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Profile Header ── */}
        <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <View style={styles.headerTop}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '40' }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>{avatarText}</Text>
            </View>

            {/* Name + details */}
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={[styles.profileName, { color: colors.foreground }]} numberOfLines={1}>
                {profile.businessName || profile.ownerName || 'Your Business'}
              </Text>
              {profile.phone ? (
                <Text style={[styles.profileDetail, { color: colors.mutedForeground }]}>
                  <Ionicons name="call-outline" size={12} /> {profile.phone}
                </Text>
              ) : null}
              {profile.email ? (
                <Text style={[styles.profileDetail, { color: colors.mutedForeground }]} numberOfLines={1}>
                  <Ionicons name="mail-outline" size={12} /> {profile.email}
                </Text>
              ) : null}

              {/* Completion */}
              <View style={styles.completionRow}>
                <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      { backgroundColor: completion >= 100 ? '#22C55E' : colors.primary, width: `${completion}%` },
                    ]}
                  />
                </View>
                <Text style={[styles.completionPct, { color: completion >= 100 ? '#22C55E' : colors.primary }]}>
                  {completion}%
                </Text>
              </View>
              <Text style={[styles.completionLabel, { color: colors.mutedForeground }]}>
                Profile Completion
              </Text>
            </View>

            {/* Edit button */}
            {!editing && (
              <Pressable
                style={[styles.editBtn, { borderColor: colors.primary, backgroundColor: colors.primary + '12' }]}
                onPress={() => { setForm({ ...profile }); setEditing(true); Haptics.selectionAsync(); }}
              >
                <Ionicons name="pencil-outline" size={14} color={colors.primary} />
                <Text style={[styles.editBtnText, { color: colors.primary }]}>Edit</Text>
              </Pressable>
            )}
          </View>

          {/* Stats row */}
          <View style={[styles.statsRow, { backgroundColor: colors.primary + '10', borderColor: colors.primary + '20' }]}>
            {[
              { label: 'Orders', value: orders.length },
              { label: 'Completed', value: deliveredOrders },
              { label: 'Total Spend', value: `₹${totalSpend >= 1000 ? (totalSpend / 1000).toFixed(1) + 'K' : totalSpend}` },
            ].map((s, i, arr) => (
              <React.Fragment key={s.label}>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: colors.primary }]}>{s.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={[styles.statDivider, { backgroundColor: colors.primary + '30' }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 20 }}>

          {/* ── Edit Mode ── */}
          {editing && (
            <>
              <View style={{ gap: 8 }}>
                <Text style={[groupStyles.title, { color: colors.mutedForeground }]}>BUSINESS PROFILE</Text>
                <View style={[groupStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <ProfileField label="Business Name" field="businessName" form={form} onChangeText={handleFieldChange} colors={colors} placeholder="e.g. Sharma Medical Store" />
                  <ProfileField label="Owner Name" field="ownerName" form={form} onChangeText={handleFieldChange} colors={colors} placeholder="e.g. Ramesh Sharma" />
                  <ProfileField label="GST Number" field="gstNumber" form={form} onChangeText={handleFieldChange} colors={colors} placeholder="e.g. 22AAAAA0000A1Z5" keyboardType="numeric" />
                  <ProfileField label="Drug License" field="drugLicense" form={form} onChangeText={handleFieldChange} colors={colors} placeholder="e.g. MH-123456" last />
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <Text style={[groupStyles.title, { color: colors.mutedForeground }]}>CONTACT DETAILS</Text>
                <View style={[groupStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <ProfileField label="Mobile Number" field="phone" form={form} onChangeText={handleFieldChange} keyboardType="phone-pad" colors={colors} />
                  <ProfileField label="Email Address" field="email" form={form} onChangeText={handleFieldChange} keyboardType="email-address" colors={colors} last />
                </View>
              </View>

              <View style={{ gap: 8 }}>
                <Text style={[groupStyles.title, { color: colors.mutedForeground }]}>BUSINESS ADDRESS</Text>
                <View style={[groupStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <ProfileField label="Street Address" field="address" form={form} onChangeText={handleFieldChange} colors={colors} placeholder="Shop/Building, Street" />
                  <ProfileField label="City" field="city" form={form} onChangeText={handleFieldChange} colors={colors} />
                  <ProfileField label="State" field="state" form={form} onChangeText={handleFieldChange} colors={colors} />
                  <ProfileField label="Pincode" field="pincode" form={form} onChangeText={handleFieldChange} keyboardType="numeric" colors={colors} last />
                </View>
              </View>

              {/* Save / Cancel */}
              <View style={styles.saveRow}>
                <Pressable
                  style={[styles.cancelBtn, { borderColor: colors.border }]}
                  onPress={handleCancelEdit}
                >
                  <Text style={[styles.cancelBtnText, { color: colors.mutedForeground }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.saveBtn, { backgroundColor: saving ? colors.muted : colors.primary }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.saveBtnText}>{saving ? 'Saving…' : 'Save Changes'}</Text>
                </Pressable>
              </View>
            </>
          )}

          {/* ── View Mode ── */}
          {!editing && (
            <>
              {/* Business verification card */}
              <Pressable
                style={[
                  styles.verifyCard,
                  {
                    backgroundColor: verificationStatus === 'verified'
                      ? '#DCFCE7' : verificationStatus === 'incomplete'
                      ? colors.primary + '10' : '#FEF9C3',
                    borderColor: verificationStatus === 'verified'
                      ? '#86EFAC' : verificationStatus === 'incomplete'
                      ? colors.primary + '30' : '#FDE68A',
                  },
                ]}
                onPress={() => verificationStatus === 'incomplete' ? (setForm({ ...profile }), setEditing(true)) : notImplemented('Verification Status')}
              >
                <View style={[
                  styles.verifyIcon,
                  {
                    backgroundColor: verificationStatus === 'verified' ? '#22C55E' : verificationStatus === 'incomplete' ? colors.primary : '#EAB308',
                  },
                ]}>
                  <Ionicons
                    name={verificationStatus === 'verified' ? 'shield-checkmark' : verificationStatus === 'incomplete' ? 'business-outline' : 'time-outline'}
                    size={20}
                    color="#FFF"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[
                    styles.verifyTitle,
                    { color: verificationStatus === 'verified' ? '#15803D' : verificationStatus === 'incomplete' ? colors.primary : '#92400E' },
                  ]}>
                    {verificationStatus === 'verified'
                      ? 'Business Verified'
                      : verificationStatus === 'incomplete'
                      ? 'Complete Your Business Profile'
                      : 'Verification Pending'}
                  </Text>
                  <Text style={[
                    styles.verifySubtitle,
                    { color: verificationStatus === 'verified' ? '#16A34A' : verificationStatus === 'incomplete' ? colors.mutedForeground : '#B45309' },
                  ]}>
                    {verificationStatus === 'verified'
                      ? 'Your pharmacy business details are verified'
                      : verificationStatus === 'incomplete'
                      ? 'Add GST & Drug License to unlock full ordering features'
                      : 'Your documents are under review'}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={colors.mutedForeground} />
              </Pressable>

              {/* ACCOUNT section */}
              <SectionGroup title="Account" colors={colors}>
                <MenuRow
                  icon="receipt-outline"
                  label="My Orders"
                  sublabel={orders.length > 0 ? `${orders.length} orders placed` : 'No orders yet'}
                  badge={orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled').length || undefined}
                  onPress={() => router.push('/(tabs)/orders')}
                  colors={colors}
                  iconBg={colors.primary + '15'}
                  iconColor={colors.primary}
                />
                <MenuRow
                  icon="location-outline"
                  label="My Addresses"
                  sublabel={profile.address ? profile.city || profile.address : 'No address saved'}
                  onPress={() => { setForm({ ...profile }); setEditing(true); }}
                  colors={colors}
                  iconBg="#FFF3E0"
                  iconColor="#F57C00"
                />
                <MenuRow
                  icon="heart-outline"
                  label="Saved Products"
                  onPress={() => router.push('/(tabs)/wishlist')}
                  colors={colors}
                  iconBg="#FCE4EC"
                  iconColor="#E91E63"
                />
                <MenuRow
                  icon="notifications-outline"
                  label="Notifications"
                  onPress={() => router.push('/notifications')}
                  colors={colors}
                  iconBg="#E3F2FD"
                  iconColor="#1976D2"
                />
                <MenuRow
                  icon="business-outline"
                  label="Business Details"
                  sublabel={profile.businessName || 'Tap to add business info'}
                  onPress={() => { setForm({ ...profile }); setEditing(true); }}
                  colors={colors}
                  iconBg="#E8F5E9"
                  iconColor="#388E3C"
                />
                <MenuRow
                  icon="document-text-outline"
                  label="GST & License Details"
                  sublabel={hasGst && hasLicense ? 'Details on file' : 'Not yet added'}
                  onPress={() => { setForm({ ...profile }); setEditing(true); }}
                  colors={colors}
                  iconBg="#EDE7F6"
                  iconColor="#673AB7"
                  last
                />
              </SectionGroup>

              {/* PREFERENCES section */}
              <SectionGroup title="Preferences" colors={colors}>
                <View style={[menuRowStyles.row, { borderBottomColor: colors.border }]}>
                  <View style={[menuRowStyles.iconWrap, { backgroundColor: isDark ? '#1E1B4B' : '#FFF8E1' }]}>
                    <Ionicons name={isDark ? 'moon' : 'sunny'} size={18} color={isDark ? '#818CF8' : '#FBBC05'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[menuRowStyles.label, { color: colors.foreground }]}>Dark Mode</Text>
                    <Text style={[menuRowStyles.sublabel, { color: colors.mutedForeground }]}>
                      {preference === 'system' ? 'Following system' : isDark ? 'Dark theme active' : 'Light theme active'}
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={(v) => { setPreference(v ? 'dark' : 'light'); Haptics.selectionAsync(); }}
                    trackColor={{ false: colors.border, true: colors.primary }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <View style={[styles.themeRow, { borderBottomColor: 'transparent' }]}>
                  {(['light', 'system', 'dark'] as ThemePreference[]).map((p) => {
                    const active = preference === p;
                    const icon = p === 'light' ? 'sunny-outline' : p === 'dark' ? 'moon-outline' : 'phone-portrait-outline';
                    const label = p === 'light' ? 'Light' : p === 'dark' ? 'Dark' : 'Auto';
                    return (
                      <Pressable
                        key={p}
                        style={[
                          styles.themeChip,
                          { borderColor: active ? colors.primary : colors.border, backgroundColor: active ? colors.primary + '15' : colors.muted },
                        ]}
                        onPress={() => { setPreference(p); Haptics.selectionAsync(); }}
                      >
                        <Ionicons name={icon as any} size={14} color={active ? colors.primary : colors.mutedForeground} />
                        <Text style={[styles.themeChipText, { color: active ? colors.primary : colors.mutedForeground }]}>{label}</Text>
                      </Pressable>
                    );
                  })}
                </View>
              </SectionGroup>

              {/* SUPPORT section */}
              <SectionGroup title="Support" colors={colors}>
                <MenuRow
                  icon="help-circle-outline"
                  label="Help & Support"
                  sublabel="Chat, call, or report issues"
                  onPress={() => Alert.alert(
                    'Help & Support',
                    'Contact us:\nPhone: 1800-XXX-XXXX\nEmail: support@mediwholesale.in',
                    [{ text: 'OK' }],
                  )}
                  colors={colors}
                  iconBg="#E3F2FD"
                  iconColor="#0288D1"
                />
                <MenuRow
                  icon="chatbubble-ellipses-outline"
                  label="Report an Issue"
                  onPress={() => notImplemented('Issue reporting')}
                  colors={colors}
                  iconBg="#FFF3E0"
                  iconColor="#EF6C00"
                  last
                />
              </SectionGroup>

              {/* LEGAL section */}
              <SectionGroup title="Legal" colors={colors}>
                <MenuRow
                  icon="shield-outline"
                  label="Privacy Policy"
                  onPress={() => router.push('/privacy')}
                  colors={colors}
                  iconBg={colors.muted}
                  iconColor={colors.mutedForeground}
                />
                <MenuRow
                  icon="document-text-outline"
                  label="Terms & Conditions"
                  onPress={() => router.push('/terms')}
                  colors={colors}
                  iconBg={colors.muted}
                  iconColor={colors.mutedForeground}
                />
                <MenuRow
                  icon="information-circle-outline"
                  label="About MediWholesale"
                  onPress={() => router.push('/about')}
                  colors={colors}
                  iconBg={colors.muted}
                  iconColor={colors.mutedForeground}
                  last
                />
              </SectionGroup>

              {/* Logout */}
              <Pressable
                style={[styles.logoutBtn, { borderColor: colors.destructive + '60', backgroundColor: colors.destructive + '08' }]}
                onPress={handleLogout}
              >
                <Ionicons name="log-out-outline" size={20} color={colors.destructive} />
                <Text style={[styles.logoutText, { color: colors.destructive }]}>Log Out</Text>
              </Pressable>

              <Text style={[styles.version, { color: colors.mutedForeground }]}>MediWholesale v1.0.0</Text>
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // ── Header
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 14,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  profileName: {
    fontSize: 17,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  profileDetail: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
  },
  completionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  progressTrack: {
    flex: 1,
    height: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressFill: {
    height: 5,
    borderRadius: 10,
  },
  completionPct: {
    fontSize: 12,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  completionLabel: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Inter_600SemiBold',
  },

  // ── Stats
  statsRow: {
    flexDirection: 'row',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'space-around',
    borderWidth: 1,
  },
  statItem: { alignItems: 'center', gap: 2, flex: 1 },
  statValue: { fontSize: 17, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 11, fontFamily: 'Inter_400Regular' },
  statDivider: { width: 1, marginVertical: 4 },

  // ── Verification card
  verifyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 14,
    gap: 12,
  },
  verifyIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verifyTitle: {
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  verifySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },

  // ── Theme
  themeRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  themeChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  themeChipText: { fontSize: 12, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  // ── Edit mode Save/Cancel
  saveRow: { flexDirection: 'row', gap: 12 },
  cancelBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  cancelBtnText: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  saveBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 16,
  },
  saveBtnText: { color: '#FFF', fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },

  // ── Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 15,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  logoutText: { fontSize: 15, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  version: { fontSize: 12, textAlign: 'center', fontFamily: 'Inter_400Regular', marginTop: 4, marginBottom: 8 },
});
