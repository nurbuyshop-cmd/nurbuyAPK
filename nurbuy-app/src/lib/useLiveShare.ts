import { useQuery, useQueryClient } from '@tanstack/react-query';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';

import { getLive, sendLive } from '@/api/orders';

/**
 * Customer live-location sharing for an active order (POST /orders/{id}/live).
 * While on and this screen is open, the phone sends its position when it moves (at most every 15 s); off tells the server to stop.
 */
export function useLiveShare(orderId: string, active: boolean) {
  const qc = useQueryClient();
  const key = ['live', orderId];
  const server = useQuery({ queryKey: key, queryFn: () => getLive(orderId), enabled: active });
  const [want, setWant] = useState<boolean | null>(null);
  const on = active && (want ?? !!server.data);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!on) return;
    let sub: Location.LocationSubscription | null = null;
    let stop = false;
    (async () => {
      const perm = await Location.requestForegroundPermissionsAsync();
      if (stop) return;
      if (perm.status !== 'granted') {
        setDenied(true);
        setWant(false);
        return;
      }
      sub = await Location.watchPositionAsync({ accuracy: Location.Accuracy.High, timeInterval: 15000, distanceInterval: 15 }, (p) => {
        sendLive(orderId, { lat: p.coords.latitude, lng: p.coords.longitude, acc: Math.round(p.coords.accuracy ?? 0) }).catch(() => {
          // the next position update tries again
        });
      });
      if (stop) sub.remove();
    })();
    return () => {
      stop = true;
      sub?.remove();
    };
  }, [on, orderId]);

  const toggle = (next: boolean) => {
    setDenied(false);
    setWant(next);
    if (!next) {
      sendLive(orderId, { off: true })
        .then((v) => qc.setQueryData(key, v))
        .catch(() => {});
    }
  };

  return { on, toggle, denied };
}
