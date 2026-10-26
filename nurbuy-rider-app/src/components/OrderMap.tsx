import { useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { mapsConfig } from '@/api/rider';
import { RIDER_SITE } from '@/config';
import { isObj } from '@/lib/guards';
import { useT } from '@/store/i18n';
import { colors } from '@/theme';

import { Txt } from './Txt';
import { Spinner } from './ui';

export type MapPoint = { id: string; kind: 'pick' | 'drop' | 'live'; lat: number; lng: number; label: string };

let cfg: Promise<{ key: string; mapId: string }> | null = null;
/** The Google key is read once per app start (GET /public/maps, the same key the website uses). */
function loadCfg() {
  if (!cfg) {
    cfg = mapsConfig().catch(() => ({ key: '', mapId: '' }));
    void cfg.then((c) => {
      if (!c.key) cfg = null;
    });
  }
  return cfg;
}

/**
 * Read-only map with the shop pickups (orange), the customer's pin (blue) and the customer's live location (green),
 * like the website's NBMap.viewer(). Google Maps runs as rider.nurbuy.com so the website's key works; when Google cannot
 * load, OpenStreetMap is used. New points move the markers without redrawing the map. One finger scrolls the page,
 * two fingers move the map (Google 'cooperative', like the website).
 */
export function OrderMap({ points, lang }: { points: MapPoint[]; lang: 'en' | 'bn' }) {
  const t = useT();
  const web = useRef<WebView>(null);
  const [key, setKey] = useState<{ key: string; mapId: string } | null>(null);
  const [osm, setOsm] = useState(false);
  const [dead, setDead] = useState(false);
  const loaded = useRef(false);
  // the page is built once with the first points; later changes go in through nbUpdate

  useEffect(() => {
    let live = true;
    void loadCfg().then((c) => {
      if (!live) return;
      setKey(c);
      if (!c.key) setOsm(true);
    });
    return () => {
      live = false;
    };
  }, []);

  const [first] = useState(points);
  const html = useMemo(() => (key ? (osm ? osmHtml(first) : googleHtml(key.key, key.mapId, first, lang)) : ''), [key, osm, lang, first]);

  const json = JSON.stringify(points);
  useEffect(() => {
    if (loaded.current) web.current?.injectJavaScript(`window.nbUpdate && window.nbUpdate(${json}, false); true;`);
  }, [json]);

  const fail = () => {
    loaded.current = false;
    if (!osm) setOsm(true);
    else setDead(true);
  };

  const onMessage = (e: WebViewMessageEvent) => {
    let m: unknown;
    try {
      m = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (!isObj(m)) return;
    if (m.t === 'err') fail();
    if (m.t === 'ok') {
      loaded.current = true;
      web.current?.injectJavaScript(`window.nbUpdate && window.nbUpdate(${JSON.stringify(points)}, false); true;`);
    }
  };

  if (dead)
    return (
      <View style={[styles.wrap, styles.center]}>
        <Txt size={14} color={colors.grey} style={styles.msg}>{t('mapFailed')}</Txt>
      </View>
    );
  if (!key) return <View style={[styles.wrap, styles.center]}><Spinner /></View>;
  return (
    <View style={styles.wrap}>
      <WebView
        key={osm ? 'osm' : 'g'}
        ref={web}
        source={{ html, baseUrl: RIDER_SITE }}
        originWhitelist={['*']}
        onMessage={onMessage}
        javaScriptEnabled
        geolocationEnabled={false}
        onError={fail}
        onHttpError={(e) => e.nativeEvent.statusCode >= 400 && /maps\.googleapis|unpkg/.test(e.nativeEvent.url) && fail()}
        setSupportMultipleWindows={false}
        nestedScrollEnabled
        style={styles.web}
      />
    </View>
  );
}

function svgIcon(fill: string, inner: string): string {
  const s = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="52" viewBox="0 0 36 48"><path d="M18 1C9 1 2 8 2 17c0 12 16 29 16 29s16-17 16-29C34 8 27 1 18 1z" fill="${fill}" stroke="#fff" stroke-width="2"/>${inner}</svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(s)}`;
}

// marker art copied from the website's NBMap
const ICONS = {
  pick: svgIcon('#ff6a00', '<path d="M10 14h16l-1.6 9H11.6z M13 14l1-4h8l1 4" fill="#fff"/>'),
  drop: svgIcon('#1d2fe0', '<path d="M18 9l7 6v8h-4.500v-5h-5v5H11v-8z" fill="#fff"/>'),
  live: svgIcon('#16a34a', '<circle cx="18" cy="17" r="6" fill="#fff"/><circle cx="18" cy="17" r="3" fill="#16a34a"/>'),
};

const CSS = 'html,body,#m{margin:0;padding:0;height:100%;width:100%;background:#e9edf5}';

function googleHtml(key: string, mapId: string, pts: MapPoint[], lang: string): string {
  const data = JSON.stringify({ mapId, pts, icons: ICONS });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>${CSS}</style></head><body><div id="m"></div>
<script>
var D=${data};
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
window.gm_authFailure=function(){post({t:'err'})};
var map,ms={};
window.nbUpdate=function(pts,fit){if(!map)return;var g=google.maps,seen={},b=new g.LatLngBounds(),n=0;
(pts||[]).forEach(function(p){seen[p.id]=1;n++;var pos={lat:+p.lat,lng:+p.lng};
if(ms[p.id]){ms[p.id].setPosition(pos)}else{ms[p.id]=new g.Marker({map:map,position:pos,title:p.label||'',icon:{url:D.icons[p.kind],scaledSize:new g.Size(34,44),anchor:new g.Point(17,44)},optimized:false})}
b.extend(pos)});
Object.keys(ms).forEach(function(k){if(!seen[k]){ms[k].setMap(null);delete ms[k]}});
if(fit!==false&&n){if(n===1){map.setCenter(b.getCenter());map.setZoom(16)}else map.fitBounds(b,48)}};
function init(){map=new google.maps.Map(document.getElementById('m'),{center:{lat:23.8103,lng:90.4125},zoom:12,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,clickableIcons:false,gestureHandling:'cooperative',mapId:D.mapId||undefined});
window.nbUpdate(D.pts,true);post({t:'ok'})}
setTimeout(function(){if(!map)post({t:'err'})},15000);
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=init&language=${lang}&region=BD" onerror="post({t:'err'})"></script>
</body></html>`;
}

function osmHtml(pts: MapPoint[]): string {
  const data = JSON.stringify({ pts, icons: ICONS });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>${CSS}</style></head><body><div id="m"></div>
<script>
var D=${data};
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
var map,ms={};
window.nbUpdate=function(pts,fit){if(!map)return;var seen={},ll=[];
(pts||[]).forEach(function(p){seen[p.id]=1;var pos=[+p.lat,+p.lng];ll.push(pos);
if(ms[p.id]){ms[p.id].setLatLng(pos)}else{ms[p.id]=L.marker(pos,{title:p.label||'',icon:L.icon({iconUrl:D.icons[p.kind],iconSize:[34,44],iconAnchor:[17,44]})}).addTo(map)}});
Object.keys(ms).forEach(function(k){if(!seen[k]){map.removeLayer(ms[k]);delete ms[k]}});
if(fit!==false&&ll.length){if(ll.length===1)map.setView(ll[0],16);else map.fitBounds(ll,{padding:[48,48]})}};
function init(){if(!window.L){post({t:'err'});return}
map=L.map('m',{zoomControl:true,dragging:!L.Browser.mobile,touchZoom:true}).setView([23.8103,90.4125],12);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
window.nbUpdate(D.pts,true);post({t:'ok'})}
</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onload="init()" onerror="post({t:'err'})"></script>
</body></html>`;
}

const styles = StyleSheet.create({
  wrap: { height: 300, borderRadius: 12, overflow: 'hidden', marginTop: 10, backgroundColor: '#e9edf5' },
  center: { alignItems: 'center', justifyContent: 'center' },
  msg: { textAlign: 'center', padding: 18 },
  web: { flex: 1, backgroundColor: '#e9edf5' },
});
