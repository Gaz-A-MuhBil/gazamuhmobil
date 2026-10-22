import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius } from '../../src/theme';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { ServiceCard } from '../../src/components/ServiceCard';
import { Button, ErrorBox } from '../../src/components/Form';
import { useServices } from '../../src/services';

// Hizmetlerimiz: ticari ve endüstriyel hizmetlerin listesi (sitedeki /hizmetlerimiz)
export default function Services() {
  const { data, error, retry } = useServices();

  return (
    <View style={s.screen}>
      <ScreenHeader title="Hizmetlerimiz" />
      {error ? (
        <View style={{ padding: 20 }}><ErrorBox text={error} /><Button label="Tekrar dene" variant="ghost" onPress={retry} /></View>
      ) : !data ? (
        <ActivityIndicator style={{ marginTop: 48 }} color={colors.primary} />
      ) : (
        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.eyebrow}>Ticari ve endüstriyel</Text>
          <Text style={s.title}>{data.intro.title}</Text>
          <Text style={s.text}>{data.intro.text}</Text>

          <View style={{ gap: 12, marginTop: 22 }}>
            {data.services.map((x, n) => <ServiceCard key={x.slug} service={x} n={n} />)}
          </View>

          <LinearGradient colors={['#0B1D45', colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.quote}>
            <Text style={s.quoteTitle}>{data.intro.quoteTitle}</Text>
            <Text style={s.quoteText}>{data.intro.quoteText}</Text>
            <Pressable onPress={() => router.push({ pathname: '/lead', params: { teklif: '1' } })} style={({ pressed }) => [s.quoteBtn, pressed && { opacity: 0.85 }]} accessibilityRole="button">
              <Text style={s.quoteBtnText}>Teklif Al</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.primary} />
            </Pressable>
          </LinearGradient>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 20, paddingBottom: 110 },
  eyebrow: { color: colors.accent, fontSize: 11, fontWeight: '800', letterSpacing: 1.4, textTransform: 'uppercase' },
  title: { color: colors.text, fontSize: 23, fontWeight: '800', lineHeight: 29, marginTop: 8 },
  text: { color: colors.muted, fontSize: 14.5, lineHeight: 22, marginTop: 10 },
  quote: { borderRadius: radius, padding: 20, marginTop: 24 },
  quoteTitle: { color: '#FFFFFF', fontSize: 19, fontWeight: '800' },
  quoteText: { color: 'rgba(255,255,255,0.8)', fontSize: 13.5, lineHeight: 20, marginTop: 6 },
  quoteBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, height: 46, borderRadius: radius, backgroundColor: '#FFFFFF', marginTop: 16 },
  quoteBtnText: { color: colors.primary, fontSize: 14.5, fontWeight: '800' },
});
