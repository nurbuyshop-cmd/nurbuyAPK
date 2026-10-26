import { create } from 'zustand';

import { fetchPrivateFile } from '@/api/api';
import { filePath } from '@/api/rider';

import { useAuth } from './auth';

type State = {
  /** the rider's own photo as a data URL (it is a private file that needs the login) */
  uri: string | null;
  busy: boolean;
  /** Loads the photo once; force=true after a new photo was uploaded. */
  load: (force?: boolean) => Promise<void>;
};

export const usePhoto = create<State>((set, get) => ({
  uri: null,
  busy: false,
  load: async (force) => {
    const r = useAuth.getState().rider;
    if (!r?.has_photo || get().busy || (get().uri && !force)) return;
    set({ busy: true });
    try {
      const f = await fetchPrivateFile(filePath('photo'));
      if (useAuth.getState().token) set({ uri: f.dataUrl });
    } catch {
      // the initials stay; the next screen visit tries again
    }
    set({ busy: false });
  },
}));

useAuth.subscribe((s, p) => {
  if (s.token !== p.token) usePhoto.setState({ uri: null, busy: false });
  else if (s.rider?.has_photo && !p.rider?.has_photo) void usePhoto.getState().load(true);
});
