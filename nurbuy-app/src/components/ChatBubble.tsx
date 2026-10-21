import { useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { Image } from 'expo-image';
import { memo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import type { ChatMsg } from '@/api/chat';
import { digits, useI18n, useT } from '@/store/i18n';
import { useViewer } from '@/store/viewer';
import { colors } from '@/theme';

import { Icon } from './Icon';
import { Txt } from './Txt';

type Props = { m: Pick<ChatMsg, 'from' | 'kind' | 'text' | 'url' | 'dur' | 'ts'>; botIcon: string };

const clockOf = (ms: number) => {
  const d = new Date(ms + 6 * 3600 * 1000);
  const h = d.getUTCHours();
  return `${h % 12 || 12}:${String(d.getUTCMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

/** One chat message: the customer's on the right in brand blue, support and bot replies on the left with the site icon. */
function ChatBubbleImpl({ m, botIcon }: Props) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const mine = m.from === 'c';
  return (
    <View style={[styles.row, mine && styles.rowMine]}>
      {!mine ? (
        <View style={styles.av}>
          {botIcon ? <Image source={botIcon} style={styles.avImg} contentFit="cover" /> : <Icon name="users" size={16} color={colors.primary} />}
        </View>
      ) : null}
      <View style={[styles.bubble, mine ? styles.mine : styles.theirs, m.kind === 'img' && styles.imgBubble]}>
        {m.kind === 'img' && m.url ? (
          <Pressable onPress={() => m.url && useViewer.getState().open([m.url])} accessibilityRole="imagebutton" accessibilityLabel={t('photo')}>
            <Image source={m.url} style={styles.img} contentFit="cover" />
          </Pressable>
        ) : m.kind === 'aud' && m.url ? (
          <Voice url={m.url} dur={m.dur ?? 0} mine={mine} />
        ) : (
          <Txt size={15} color={mine ? colors.white : colors.text} style={styles.text}>{m.text}</Txt>
        )}
        {m.ts ? <Txt size={10.5} color={mine ? 'rgba(255,255,255,0.75)' : colors.grey} style={styles.time}>{digits(clockOf(m.ts), lang)}</Txt> : null}
      </View>
    </View>
  );
}

function Voice({ url, dur, mine }: { url: string; dur: number; mine: boolean }) {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const player = useAudioPlayer(url);
  const st = useAudioPlayerStatus(player);
  const total = Math.round(st.duration || dur);
  const shown = st.playing ? Math.round(st.currentTime) : total;
  const color = mine ? colors.white : colors.primary;
  const toggle = () => {
    if (st.playing) player.pause();
    else {
      if (st.didJustFinish || (st.duration && st.currentTime >= st.duration - 0.2)) void player.seekTo(0);
      player.play();
    }
  };
  return (
    <Pressable onPress={toggle} style={styles.voice} accessibilityRole="button" accessibilityLabel={`${t('voiceMsg')} ${st.playing ? t('pause') : t('play')}`}>
      <View style={[styles.playBtn, { borderColor: color }]}>
        <Icon name={st.playing ? 'pauseFill' : 'playFill'} size={14} color={color} />
      </View>
      <View style={[styles.track, { backgroundColor: mine ? 'rgba(255,255,255,0.35)' : '#dfe3f1' }]}>
        <View style={[styles.fill, { backgroundColor: color, width: `${total ? Math.min(100, (st.currentTime / total) * 100) : 0}%` }]} />
      </View>
      <Txt size={12} color={mine ? colors.white : colors.grey}>{digits(`${Math.floor(shown / 60)}:${String(shown % 60).padStart(2, '0')}`, lang)}</Txt>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, marginVertical: 4, paddingHorizontal: 12 },
  rowMine: { justifyContent: 'flex-end' },
  av: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#eef0fa', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  avImg: { width: 28, height: 28 },
  bubble: { maxWidth: '78%', borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 },
  mine: { backgroundColor: colors.primary, borderBottomRightRadius: 6 },
  theirs: { backgroundColor: colors.white, borderBottomLeftRadius: 6, borderWidth: 1, borderColor: colors.border },
  imgBubble: { padding: 4 },
  img: { width: 210, height: 210, borderRadius: 14 },
  text: { lineHeight: 21 },
  time: { alignSelf: 'flex-end', marginTop: 2 },
  voice: { flexDirection: 'row', alignItems: 'center', gap: 8, minWidth: 180, minHeight: 36 },
  playBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  track: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  fill: { height: '100%' },
});

export const ChatBubble = memo(ChatBubbleImpl);
