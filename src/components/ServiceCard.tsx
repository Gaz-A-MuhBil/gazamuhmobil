import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radius } from '../theme';
import { serviceIcon, type ProService } from '../services';

// Hizmet kartı: Hizmetlerimiz ekranı ve ana sayfa bölümü kullanır; dokununca hizmet detayı açılır
// width verilirse yatay listede sabit genişlikte durur (ana sayfa)
export function ServiceCard({ service: x, n, width }: { service: ProService; n: number; width?: number }) {
  return (
    <Pressable onPress={() => router.push({ pathname: '/services/[slug]', params: { slug: x.slug } })} accessibilityRole="button"
      style={({ pressed }) => [s.card, width ? { width } : null, pressed && { backgroundColor: colors.surface }]}>
      <View style={s.top}>
        <View style={s.icon}><MaterialCommunityIcons name={serviceIcon[x.icon]} size={24} color="#FFFFFF" /></View>
        <Text style={s.num}>{String(n + 1).padStart(2, '0')}</Text>
      </View>
      <Text style={s.title}>{x.short}</Text>
      <Text style={[s.text, width ? { flex: 1 } : null]}>{x.card}</Text>
      <View style={s.more}>
        <Text style={s.moreText}>İncele</Text>
        <Ionicons name="chevron-forward" size={15} color={colors.accent} />
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  card: { borderRadius: radius, borderWidth: 1, borderColor: colors.border, padding: 18, backgroundColor: colors.bg },
  top: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  icon: { width: 48, height: 48, borderRadius: radius, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  num: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  title: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 16 },
  text: { color: colors.muted, fontSize: 13.5, lineHeight: 20, marginTop: 6 },
  more: { flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 12 },
  moreText: { color: colors.accent, fontSize: 13.5, fontWeight: '800' },
});
