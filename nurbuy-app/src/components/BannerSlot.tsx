import * as Clipboard from 'expo-clipboard';
import { memo, useMemo } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { SITE_BASE } from '@/config';
import type { Placement } from '@/lib/banners';
import { openAppLink } from '@/lib/links';
import { NBBS_SOURCE } from '@/lib/bsRenderer';
import { useDelivery } from '@/lib/delivery';
import { isObj, isStr } from '@/lib/guards';
import { useBanners } from '@/lib/useBanners';
import { useIndex } from '@/lib/useIndex';
import { useCatalog } from '@/store/catalog';
import { liteOn, useLite } from '@/store/lite';
import { useT } from '@/store/i18n';
import { toast } from '@/store/toast';
import { radius } from '@/theme';

type Props = { placements: Placement[]; style?: StyleProp<ViewStyle>; rounded?: boolean };

/**
 * Banner Studio banners for one spot, drawn by the website's own renderer inside a WebView, so text, fonts,
 * animations and countdowns look exactly like minutes.nurbuy.com. Several banners rotate, each for its "show" time (default 3 s).
 * Renders nothing when no banner is live for the spot.
 */
function BannerSlotImpl({ placements, style, rounded = true }: Props) {
  const t = useT();
  const products = useCatalog((s) => s.catalog?.products);
  const skew = useCatalog((s) => s.skew);
  const idx = useIndex();
  const { eta } = useDelivery();
  const { list, bs } = useBanners(placements);
  // weak phones get still banners (no animation), like the website's lite mode
  const lite = useLite(liteOn);
  const sig = list.map((b) => b.id).join(',');

  const html = useMemo(() => {
    if (!list.length) return '';
    const prods: Record<string, { n: string; bn: string; pr: number; old: number; img: string }> = {};
    (products ?? []).forEach((p) => (prods[p.id] = { n: p.n, bn: p.bn, pr: p.pr, old: p.old, img: p.img }));
    const data = {
      items: list.map((b) => ({ d: b.d })),
      ends: list.map((b) => bs.banners.find((x) => x.id === b.id)?.e ?? 0),
      fonts: bs.fonts,
      skew,
      eta,
      prods,
      lite,
    };
    return page(JSON.stringify(data).replace(/</g, '\\u003c'));
    // rebuilt only when the banners, delivery minutes or clock offset change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sig, eta, skew, products, lite]);

  if (!list.length || !html) return null;
  const first = list[0]!;

  const onMessage = (e: WebViewMessageEvent) => {
    let m: unknown;
    try {
      m = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (!isObj(m) || !isStr(m.v)) return;
    if (m.t === 'link') openAppLink(m.v, idx);
    if (m.t === 'copy') {
      void Clipboard.setStringAsync(m.v);
      toast(t('codeCopied') + m.v);
    }
  };

  return (
    <View style={[styles.box, rounded && styles.round, { aspectRatio: first.w / first.h }, style]}>
      <WebView
        source={{ html, baseUrl: SITE_BASE }}
        originWhitelist={['*']}
        onMessage={onMessage}
        scrollEnabled={false}
        bounces={false}
        overScrollMode="never"
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        setSupportMultipleWindows={false}
        mediaPlaybackRequiresUserAction
        style={styles.web}
      />
    </View>
  );
}

function page(data: string): string {
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>html,body{margin:0;padding:0;overflow:hidden;background:transparent;height:100%}
#r{position:relative;width:100%;height:100%}
.sl{position:absolute;inset:0;opacity:0;transition:opacity .45s;container-type:inline-size;pointer-events:none}
.sl.on{opacity:1;pointer-events:auto}
.sl>.bss{width:100%;height:100%}
.dots{position:absolute;bottom:6px;left:0;right:0;display:flex;justify-content:center;gap:5px;z-index:50}
.dots i{width:6px;height:6px;border-radius:3px;background:#fff;opacity:.55;box-shadow:0 0 2px rgba(0,0,0,.4)}
.dots i.on{opacity:1;width:16px}</style></head><body><div id="r"></div>
<script>${NBBS_SOURCE}</script>
<script>
(function(){
var D=${data},r=document.getElementById('r'),n=D.items.length,c=0,t0=0;
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
NBBS.addFonts(D.fonts||[]);NBBS.skew=D.skew||0;NBBS.vars.eta=D.eta||59;NBBS.onCopy=function(v){post({t:'copy',v:v})};
function prod(id){return D.prods[String(id)]||null}
var sl=D.items.map(function(){var e=document.createElement('div');e.className='sl';r.appendChild(e);return e});
var dots=null;if(n>1){dots=document.createElement('div');dots.className='dots';for(var i=0;i<n;i++)dots.appendChild(document.createElement('i'));r.appendChild(dots)}
function ms(i){var d=D.items[i].d;return +d.show>0?Math.max(1000,Math.min(60000,+d.show)):3000}
function show(i){c=(i+n)%n;t0=Date.now();sl.forEach(function(x,k){x.classList.toggle('on',k==c);if(dots)dots.children[k].classList.toggle('on',k==c)});
NBBS.mount(sl[c],D.items[c].d,{dev:'mobile',prod:prod,end:D.ends[c]||0,now:Math.floor((Date.now()+NBBS.skew)/1000),static:!!D.lite,once:!!D.lite})}
show(0);if(n>1)setInterval(function(){if(Date.now()-t0>=ms(c))show(c+1)},500);
document.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('[data-link]');if(!a)return;e.preventDefault();post({t:'link',v:a.getAttribute('data-link')})});
})();
</script></body></html>`;
}

const styles = StyleSheet.create({
  box: { width: '100%', overflow: 'hidden', backgroundColor: 'transparent' },
  round: { borderRadius: radius.lg },
  web: { flex: 1, backgroundColor: 'transparent' },
});

export const BannerSlot = memo(BannerSlotImpl);
