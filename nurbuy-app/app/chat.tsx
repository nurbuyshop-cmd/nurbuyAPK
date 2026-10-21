import { RecordingPresets, requestRecordingPermissionsAsync, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from 'expo-audio';
import * as ImagePicker from 'expo-image-picker';
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { chatUpload } from '@/api/chat';
import { ChatBubble } from '@/components/ChatBubble';
import { Icon } from '@/components/Icon';
import { TopBar } from '@/components/TopBar';
import { Txt, useInputFont } from '@/components/Txt';
import { errorText } from '@/lib/errors';
import { useCatalog } from '@/store/catalog';
import { useChat } from '@/store/chat';
import { digits, useI18n, useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { colors, TOUCH } from '@/theme';

/** Support chat: the first message is only the welcome text; the customer's first message opens a conversation for an agent. */
export default function ChatScreen() {
  const t = useT();
  const lang = useI18n((s) => s.lang);
  const insets = useSafeAreaInsets();
  const font = useInputFont();
  const msgs = useChat((s) => s.msgs);
  const botIcon = useCatalog((s) => s.catalog?.settings.favicon ?? '');
  const list = useRef<FlatList>(null);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const rec = useAudioRecorderState(recorder);

  useEffect(() => {
    useChat.getState().setOpen(true);
    return () => useChat.getState().setOpen(false);
  }, []);

  const welcome = { from: 'b', kind: 't', text: t('chatWelcome'), url: null, dur: null, ts: 0 };
  const data = [{ key: 'welcome', m: welcome }, ...msgs.map((m) => ({ key: String(m.id), m }))];

  const run = async (fn: () => Promise<void>) => {
    setBusy(true);
    try {
      await fn();
    } catch (e) {
      toast(errorText(e, t) || t('sendFailed'));
    } finally {
      setBusy(false);
    }
  };

  const sendText = () => {
    const v = text.trim();
    if (!v) return;
    setText('');
    void run(() => useChat.getState().send({ kind: 't', text: v }));
  };

  const sendPhoto = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 1 });
    const asset = r.canceled ? null : r.assets[0];
    if (!asset) return;
    void run(async () => {
      // photos are shrunk before upload (max 1600 px, like the website)
      const big = Math.max(asset.width, asset.height) > 1600;
      const base = ImageManipulator.manipulate(asset.uri);
      const ctx = big ? base.resize(asset.width >= asset.height ? { width: 1600 } : { height: 1600 }) : base;
      const out = await (await ctx.renderAsync()).saveAsync({ format: SaveFormat.JPEG, compress: 0.82 });
      const url = await chatUpload(out.uri, 'img');
      await useChat.getState().send({ kind: 'img', url });
    });
  };

  const toggleRecord = async () => {
    if (rec.isRecording) {
      const secs = Math.round(rec.durationMillis / 1000);
      await recorder.stop();
      const uri = recorder.uri;
      if (!uri || secs < 1) return;
      void run(async () => {
        const url = await chatUpload(uri, 'aud');
        await useChat.getState().send({ kind: 'aud', url, dur: secs });
      });
      return;
    }
    const perm = await requestRecordingPermissionsAsync();
    if (!perm.granted) return toast(t('micDenied'));
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
  };

  const cancelRecord = async () => {
    await recorder.stop();
  };

  const secs = Math.floor(rec.durationMillis / 1000);

  return (
    <KeyboardAvoidingView style={styles.page} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <TopBar title={t('chatTitle')} sub={t('chatSub')} />
      <FlatList
        ref={list}
        data={data}
        keyExtractor={(x) => x.key}
        renderItem={({ item }) => <ChatBubble m={item.m} botIcon={botIcon} />}
        contentContainerStyle={styles.list}
        onContentSizeChange={() => list.current?.scrollToEnd({ animated: true })}
        keyboardShouldPersistTaps="handled"
      />
      <View style={[styles.composer, { paddingBottom: insets.bottom + 8 }]}>
        {rec.isRecording ? (
          <>
            <Pressable onPress={() => void cancelRecord()} style={styles.iconBtn} accessibilityRole="button" accessibilityLabel={t('cancelRec')}>
              <Icon name="x" size={22} color={colors.danger} />
            </Pressable>
            <View style={styles.recBox}>
              <View style={styles.dot} />
              <Txt weight="semibold" size={14} color={colors.danger}>{digits(`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, lang)}</Txt>
              <Txt size={13} color={colors.grey} numberOfLines={1} style={styles.flex}>{t('recording')}</Txt>
            </View>
          </>
        ) : (
          <>
            <Pressable onPress={() => void sendPhoto()} style={styles.iconBtn} disabled={busy} accessibilityRole="button" accessibilityLabel={t('photo')}>
              <Icon name="image" size={24} color={colors.primary} />
            </Pressable>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={t('typeMsg')}
              placeholderTextColor="#9aa1b8"
              multiline
              maxLength={4000}
              style={[styles.input, { fontFamily: font }]}
            />
          </>
        )}
        {busy ? (
          <ActivityIndicator color={colors.primary} style={styles.iconBtn} />
        ) : text.trim() && !rec.isRecording ? (
          <Pressable onPress={sendText} style={[styles.iconBtn, styles.sendBtn]} accessibilityRole="button" accessibilityLabel={t('sendMsg')}>
            <Icon name="send" size={20} color={colors.white} />
          </Pressable>
        ) : (
          <Pressable
            onPress={() => void toggleRecord()}
            style={[styles.iconBtn, rec.isRecording ? styles.sendBtn : null]}
            accessibilityRole="button"
            accessibilityLabel={rec.isRecording ? t('sendMsg') : t('voiceMsg')}
          >
            <Icon name={rec.isRecording ? 'send' : 'mic'} size={rec.isRecording ? 20 : 24} color={rec.isRecording ? colors.white : colors.primary} />
          </Pressable>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: colors.bg },
  flex: { flex: 1 },
  list: { paddingVertical: 12 },
  composer: { flexDirection: 'row', alignItems: 'flex-end', gap: 6, backgroundColor: colors.white, paddingHorizontal: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: colors.border },
  iconBtn: { width: TOUCH, height: TOUCH, borderRadius: TOUCH / 2, alignItems: 'center', justifyContent: 'center' },
  sendBtn: { backgroundColor: colors.primary },
  input: { flex: 1, minHeight: TOUCH, maxHeight: 120, borderRadius: 22, backgroundColor: '#f1f3f9', paddingHorizontal: 14, paddingTop: 11, paddingBottom: 11, fontSize: 15, color: colors.text },
  recBox: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: TOUCH, paddingHorizontal: 8 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.danger },
});
