import { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import { SELLER_SITE } from '@/config';
import { isNum, isObj, isStr } from '@/lib/guards';

export type ShopMapHandle = { goTo: (lat: number, lng: number) => void };

type Props = {
  /** Google Maps key from /public/maps ('' = use OpenStreetMap at once) */
  apiKey: string;
  mapId: string;
  lat: number | null;
  lng: number | null;
  lang: 'en' | 'bn';
  searchPh: string;
  /** the map stopped moving: the pin's place (and Google's address for it when known) */
  onPin: (p: { lat: number; lng: number; full?: string }) => void;
  /** neither Google nor OpenStreetMap could load */
  onFail: () => void;
};

/**
 * The shop pin: the pin stays in the middle and the map moves under it. Uses Google Maps with the website's key
 * (the page runs as seller.nurbuy.com so a key limited to the website works); if Google fails it switches to
 * OpenStreetMap like the website. The first position is never reported, so an unset shop does not get a pin by itself.
 */
export const ShopMap = forwardRef<ShopMapHandle, Props>(function ShopMap({ apiKey, mapId, lat, lng, lang, searchPh, onPin, onFail }, ref) {
  const web = useRef<WebView>(null);
  const [osm, setOsm] = useState(!apiKey);

  useImperativeHandle(ref, () => ({
    goTo: (a, b) => web.current?.injectJavaScript(`window.nbGo && window.nbGo(${Number(a)}, ${Number(b)}); true;`),
  }));

  const c = lat !== null && lng !== null ? { lat, lng, zoom: 17 } : { lat: 23.8103, lng: 90.4125, zoom: 12 };
  // built once per map kind; later moves go through goTo
  const html = useMemo(
    () => (osm ? osmHtml(c) : googleHtml(apiKey, mapId, c, lang, searchPh)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [osm, apiKey],
  );

  const fail = () => {
    if (!osm) setOsm(true);
    else onFail();
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
    if (m.t === 'pin' && isNum(m.lat) && isNum(m.lng)) onPin({ lat: m.lat, lng: m.lng, full: isStr(m.full) && m.full ? m.full : undefined });
  };

  return (
    <View style={styles.wrap}>
      <WebView
        key={osm ? 'osm' : 'g'}
        ref={web}
        source={{ html, baseUrl: SELLER_SITE }}
        originWhitelist={['*']}
        onMessage={onMessage}
        javaScriptEnabled
        geolocationEnabled={false}
        onError={fail}
        onHttpError={(e) => e.nativeEvent.statusCode >= 400 && /maps\.googleapis|unpkg|cdnjs/.test(e.nativeEvent.url) && fail()}
        setSupportMultipleWindows={false}
        nestedScrollEnabled
        style={styles.web}
      />
    </View>
  );
});

const PIN = `<svg id="pin" viewBox="0 0 36 46"><path d="M18 45s15-14.5 15-27A15 15 0 0 0 3 18c0 12.5 15 27 15 27z" fill="#1d2fe0"/><circle cx="18" cy="18" r="6" fill="#fff"/></svg>`;
const CSS = `html,body,#m{margin:0;padding:0;height:100%;width:100%;font-family:sans-serif}
#pin{position:absolute;left:50%;top:50%;width:36px;height:46px;margin:-46px 0 0 -18px;pointer-events:none;z-index:500}
#q{position:absolute;top:10px;left:10px;right:10px;z-index:600;box-sizing:border-box;height:44px;border:0;border-radius:22px;padding:0 16px;font-size:15px;box-shadow:0 2px 10px rgba(0,0,0,.18);outline:0}
.pac-container{z-index:1000}`;

function googleHtml(key: string, mapId: string, c: { lat: number; lng: number; zoom: number }, lang: string, ph: string): string {
  const data = JSON.stringify({ mapId, c, ph });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"><style>${CSS}</style></head><body>
<input id="q" type="text" autocomplete="off"><div id="m"></div>${PIN}
<script>
var D=${data};
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
document.getElementById('q').placeholder=D.ph;
window.gm_authFailure=function(){post({t:'err'})};
var map,geo,tm,first=true;
function report(){var p=map.getCenter(),lat=+p.lat().toFixed(7),lng=+p.lng().toFixed(7);
geo.geocode({location:{lat:lat,lng:lng}},function(r,s){var o={t:'pin',lat:lat,lng:lng};if(s==='OK'&&r&&r[0])o.full=r[0].formatted_address;post(o)})}
window.nbGo=function(lat,lng){if(!map)return;map.panTo({lat:lat,lng:lng});if(map.getZoom()<17)map.setZoom(17)};
function init(){map=new google.maps.Map(document.getElementById('m'),{center:{lat:D.c.lat,lng:D.c.lng},zoom:D.c.zoom,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,clickableIcons:false,gestureHandling:'greedy',zoomControl:true,mapId:D.mapId||undefined});
geo=new google.maps.Geocoder();
map.addListener('idle',function(){if(first){first=false;return}clearTimeout(tm);tm=setTimeout(report,350)});
try{var ac=new google.maps.places.Autocomplete(document.getElementById('q'),{componentRestrictions:{country:['bd','ae']},fields:['geometry']});
ac.addListener('place_changed',function(){var pl=ac.getPlace();if(pl&&pl.geometry&&pl.geometry.location){map.panTo(pl.geometry.location);map.setZoom(17)}})}catch(e){}}
setTimeout(function(){if(!map)post({t:'err'})},15000);
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&libraries=places,geocoding&callback=init&language=${lang}&region=BD" onerror="post({t:'err'})"></script>
</body></html>`;
}

function osmHtml(c: { lat: number; lng: number; zoom: number }): string {
  const data = JSON.stringify({ c });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"><style>${CSS}</style></head><body>
<div id="m"></div>${PIN}
<script>
var D=${data};
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
var map,first=true;
window.nbGo=function(lat,lng){if(map)map.setView([lat,lng],Math.max(map.getZoom(),17))};
function init(){if(!window.L){post({t:'err'});return}
map=L.map('m',{zoomControl:true}).setView([D.c.lat,D.c.lng],D.c.zoom);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
map.on('moveend',function(){if(first){first=false;return}var p=map.getCenter();post({t:'pin',lat:+p.lat.toFixed(7),lng:+p.lng.toFixed(7)})});
setTimeout(function(){first=false},1500)}
</script>
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" onload="init()" onerror="post({t:'err'})"></script>
</body></html>`;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden', borderRadius: 14 },
  web: { flex: 1, backgroundColor: '#e8eaf0' },
});
