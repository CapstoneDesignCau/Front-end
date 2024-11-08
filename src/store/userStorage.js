import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set) => ({
      accessToken: null,
      role: null,
      profileImageUrl: null,
      setAccessToken: (token) => set({ accessToken: token }),
      setRole: (role) => set({ role }),
      setProfileImageUrl: (url) => set({ profileImageUrl: url }),
      clearUser: () =>
        set({ accessToken: null, role: null, profileImageUrl: null }),
    }),
    {
      name: "user-storage",
      getStorage: () => localStorage,
    }
  )
);

export default useUserStore;
