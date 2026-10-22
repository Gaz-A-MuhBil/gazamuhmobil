import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { colors, radius } from '../../src/theme';
import { ScreenHeader } from '../../src/components/ScreenHeader';
import { Button, ErrorBox } from '../../src/components/Form';
import { call } from '../../src/links';
import { serviceIcon, useServices } from '../../src/services';

// Hizmet detayı: giriş, kapsam, sık sorulan sorular ve teklif butonu (sitedeki /hizmetlerimiz/<slug>)
export default function ServiceDetail() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data, error, retry } = useServices();
  const x = data?.services.find((v) => v.slug === slug);
  const [open, setOpen] = useState(0);
  const quote = () => router.push({ pathname: '/lead', params: { teklif: '1', hizmet: slug } });

  return (
    <View style={s.screen}>
      <ScreenHeader title={x?.short ?? 'Hizmet'} />
      {error ? (
        <View style={{ padding: 20 }}><ErrorBox text={error} /><Button label="Tekrar dene" variant="ghost" onPress={retry} /></View>
      ) : !data ? (
        <ActivityIndicator style={{ marginTop: 48 }} color={colors.primary} />
      ) : !x ? (
        <View style={{ padding: 20 }}><ErrorBox text="Bu hizmet bulunamadı." /><Button label="Tüm hizmetler" variant="ghost" onPress={() => router.replace('/services')} /></View>
      ) : (
        <ScrollView contentContainerStyle={s.body}>
          <LinearGradient colors={['#0B1D45', colors.primary]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={s.hero}>
            <View style={s.heroIcon}><MaterialCommunityIcons name={serviceIcon[x.icon]} size={28} color={colors.accent} /></View>
            <Text style={s.heroTitle}>{x.title}</Text>
            <View style={{ gap: 8, marginTop: 14 }}>
              {x.sections.map((sec) => (
                <View key={sec.h} style={s.heroRow}>
                  <Ionicons name="checkmark-circle" size={17} color={colors.accent} />
                  <Text style={s.heroRowText}>{sec.h}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>

          {x.intro.map((p) => <Text key={p} style={s.p}>{p}</Text>)}

          {x.sections.map((sec, n) => (
            <View key={sec.h} style={s.section}>
              <Text style={s.num}>{String(n + 1).padStart(2, '0')}</Text>
              <Text style={s.h2}>{sec.h}</Text>
              <Text style={s.sectionText}>{sec.p}</Text>
            </View>
          ))}

          <Text style={[s.h2, { marginTop: 28 }]}>Sık sorulan sorular</Text>
          <View style={s.faq}>
            {x.faq.map((f, n) => (
              <Pressable key={f.q} onPress={() => setOpen(open === n ? -1 : n)} accessibilityRole="button" accessibilityState={{ expanded: open === n }}
                style={[s.faqItem, n > 0 && s.faqBorder]}>
                <View style={s.faqHead}>
                  <Text style={s.faqQ}>{f.q}</Text>
                  <Ionicons name={open === n ? 'remove' : 'add'} size={20} color={colors.accent} />
                </View>
                {open === n && <Text style={s.faqA}>{f.a}</Text>}
              </Pressable>
            ))}
          </View>

          <View style={s.closing}>
            <Text style={s.closingText}>{x.closing}</Text>
            <Button label={x.cta} icon="document-text-outline" onPress={quote} />
            <View style={{ height: 10 }} />
            <Button label="Hemen ara" icon="call-outline" variant="ghost" onPress={call} />
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  body: { padding: 20, paddingBottom: 110 },
  hero: { borderRadius: radius, padding: 20, marginBottom: 20 },
  heroIcon: { width: 52, height: 52, borderRadius: radius, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', lineHeight: 28, marginTop: 14 },
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  heroRowText: { flex: 1, color: 'rgba(255,255,255,0.9)', fontSize: 13.5, fontWeight: '600' },
  p: { color: colors.text, fontSize: 15, lineHeight: 23, marginBottom: 12 },
  section: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 18, marginTop: 14 },
  num: { color: colors.accent, fontSize: 13, fontWeight: '700' },
  h2: { color: colors.text, fontSize: 18, fontWeight: '800', marginTop: 6 },
  sectionText: { color: colors.muted, fontSize: 14.5, lineHeight: 22, marginTop: 8 },
  faq: { borderRadius: radius, borderWidth: 1, borderColor: colors.border, marginTop: 12 },
  faqItem: { padding: 16 },
  faqBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  faqHead: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  faqQ: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700', lineHeight: 21 },
  faqA: { color: colors.muted, fontSize: 14, lineHeight: 21, marginTop: 8 },
  closing: { borderRadius: radius, backgroundColor: colors.surface, padding: 18, marginTop: 24 },
  closingText: { color: colors.text, fontSize: 14.5, lineHeight: 22, marginBottom: 16 },
});
