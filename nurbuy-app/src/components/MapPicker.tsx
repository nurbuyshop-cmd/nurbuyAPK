import { forwardRef, useImperativeHandle, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

import type { Zone } from '@/api/geo';
import { SITE_BASE } from '@/config';
import { isNum, isObj, isStr } from '@/lib/guards';
import type { Pin } from '@/store/location';

export type MapPickerHandle = { goTo: (lat: number, lng: number) => void };

type Props = {
  apiKey: string;
  mapId: string;
  center: { lat: number; lng: number; zoom: number };
  zones: Zone[];
  lang: 'en' | 'bn';
  searchPh: string;
  /** called when the map stops moving, with the address Google found for the centre */
  onPin: (p: Pin) => void;
  onError: () => void;
};

/**
 * Google map in a WebView: the pin stays in the middle and the map moves under it (like the website).
 * The key comes from /public/maps at run time; the page uses the website's address as its origin so a key limited to the website works.
 */
export const MapPicker = forwardRef<MapPickerHandle, Props>(function MapPicker({ apiKey, mapId, center, zones, lang, searchPh, onPin, onError }, ref) {
  const web = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    goTo: (lat, lng) => web.current?.injectJavaScript(`window.nbGo && window.nbGo(${Number(lat)}, ${Number(lng)}); true;`),
  }));

  // the page is built once; later moves go through goTo
  const html = useMemo(
    () => buildHtml(apiKey, mapId, center, zones, lang, searchPh),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [apiKey],
  );

  const onMessage = (e: WebViewMessageEvent) => {
    let m: unknown;
    try {
      m = JSON.parse(e.nativeEvent.data);
    } catch {
      return;
    }
    if (!isObj(m)) return;
    if (m.t === 'err') onError();
    if (m.t === 'pin' && isNum(m.lat) && isNum(m.lng)) {
      const p: Pin = { lat: m.lat, lng: m.lng };
      for (const k of ['full', 'area', 'city', 'district', 'postcode', 'country', 'place_id'] as const) if (isStr(m[k]) && m[k]) p[k] = m[k];
      onPin(p);
    }
  };

  return (
    <View style={styles.wrap}>
      <WebView
        ref={web}
        source={{ html, baseUrl: SITE_BASE }}
        originWhitelist={['*']}
        onMessage={onMessage}
        javaScriptEnabled
        geolocationEnabled={false}
        // a map that never starts (blocked key, no internet) is reported instead of staying grey
        onError={onError}
        onHttpError={(e) => e.nativeEvent.statusCode >= 400 && e.nativeEvent.url.includes('maps.googleapis') && onError()}
        setSupportMultipleWindows={false}
        style={styles.web}
      />
    </View>
  );
});

function buildHtml(key: string, mapId: string, c: { lat: number; lng: number; zoom: number }, zones: Zone[], lang: string, ph: string): string {
  const data = JSON.stringify({ key, mapId, c, zones: zones.map((z) => ({ color: z.color, poly: z.poly })), lang, ph });
  return `<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<style>
html,body,#m{margin:0;padding:0;height:100%;width:100%;font-family:sans-serif}
#pin{position:absolute;left:50%;top:50%;width:36px;height:46px;margin:-46px 0 0 -18px;pointer-events:none;z-index:5}
#q{position:absolute;top:10px;left:10px;right:10px;z-index:6;box-sizing:border-box;height:44px;border:0;border-radius:22px;padding:0 16px;font-size:15px;box-shadow:0 2px 10px rgba(0,0,0,.18);outline:0}
.pac-container{z-index:10}
</style></head><body>
<input id="q" type="text" autocomplete="off">
<div id="m"></div>
<svg id="pin" viewBox="0 0 36 46"><path d="M18 45s15-14.5 15-27A15 15 0 0 0 3 18c0 12.5 15 27 15 27z" fill="#1d2fe0"/><circle cx="18" cy="18" r="6" fill="#fff"/></svg>
<script>
var D=${data};
function post(o){window.ReactNativeWebView.postMessage(JSON.stringify(o))}
document.getElementById('q').placeholder=D.ph;
window.gm_authFailure=function(){post({t:'err'})};
var map,geo,tm;
function pick(type,res){for(var i=0;i<res.address_components.length;i++){var c=res.address_components[i];if(c.types.indexOf(type)>-1)return c.long_name}return ''}
function short(type,res){for(var i=0;i<res.address_components.length;i++){var c=res.address_components[i];if(c.types.indexOf(type)>-1)return c.short_name}return ''}
function report(){var p=map.getCenter(),lat=+p.lat().toFixed(7),lng=+p.lng().toFixed(7);
geo.geocode({location:{lat:lat,lng:lng}},function(r,s){var o={t:'pin',lat:lat,lng:lng};if(s==='OK'&&r&&r[0]){var a=r[0];o.full=a.formatted_address;o.place_id=a.place_id;
o.area=pick('sublocality_level_1',a)||pick('sublocality',a)||pick('neighborhood',a);o.city=pick('locality',a);o.district=pick('administrative_area_level_2',a);o.postcode=pick('postal_code',a);o.country=short('country',a).toLowerCase()}post(o)})}
window.nbGo=function(lat,lng){if(!map)return;map.panTo({lat:lat,lng:lng});if(map.getZoom()<17)map.setZoom(17)};
function init(){map=new google.maps.Map(document.getElementById('m'),{center:{lat:D.c.lat,lng:D.c.lng},zoom:D.c.zoom,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,clickableIcons:false,gestureHandling:'greedy',zoomControl:true,mapId:D.mapId||undefined});
geo=new google.maps.Geocoder();
D.zones.forEach(function(z){if(z.poly.length<3)return;new google.maps.Polygon({map:map,paths:z.poly.map(function(p){return{lat:p[0],lng:p[1]}}),strokeColor:z.color,strokeOpacity:.85,strokeWeight:2,fillColor:z.color,fillOpacity:.09,clickable:false})});
map.addListener('idle',function(){clearTimeout(tm);tm=setTimeout(report,350)});
try{var ac=new google.maps.places.Autocomplete(document.getElementById('q'),{componentRestrictions:{country:['bd','ae']},fields:['geometry']});
ac.addListener('place_changed',function(){var pl=ac.getPlace();if(pl&&pl.geometry&&pl.geometry.location){map.panTo(pl.geometry.location);map.setZoom(17)}})}catch(e){}}
</script>
<script async src="https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&libraries=places,geocoding&callback=init&language=${lang}&region=BD" onerror="post({t:'err'})"></script>
</body></html>`;
}

const styles = StyleSheet.create({
  wrap: { flex: 1, overflow: 'hidden' },
  web: { flex: 1, backgroundColor: '#e8eaf0' },
});
