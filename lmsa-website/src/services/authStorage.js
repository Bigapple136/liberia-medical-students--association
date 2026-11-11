// Storage policy for the Supabase session, so the sign-in form's "Remember me"
// checkbox means something.
//
// Supabase's client is created once, with one storage adapter, so persistence
// cannot be switched per sign-in. This adapter decides where to write at write
// time instead: ticked (or never set, which is how existing sessions were
// created) keeps the session in localStorage and it survives a browser restart;
// unticked keeps it in sessionStorage, so it survives a reload but dies with the
// tab or browser.
//
// The preference itself is a tiny flag, kept in localStorage so the adapter can
// read it synchronously on the next page load — before any session write.

const REMEMBER_KEY = 'lmsa.remember-session';

const localStorageSafe = () => {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
};

const sessionStorageSafe = () => {
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
};

/** Records the choice made on the sign-in form. */
export const setRememberSession = (remember) => {
  try {
    localStorageSafe()?.setItem(REMEMBER_KEY, remember ? '1' : '0');
  } catch {
    // A blocked storage API just means the default (remembered) applies.
  }
};

/** Defaults to remembered when the flag is absent or storage is unusable. */
const shouldPersist = () => {
  try {
    return localStorageSafe()?.getItem(REMEMBER_KEY) !== '0';
  } catch {
    return true;
  }
};

export const authStorage = {
  getItem(key) {
    try {
      const local = localStorageSafe()?.getItem(key) ?? null;
      const session = sessionStorageSafe()?.getItem(key) ?? null;
      return shouldPersist() ? (local ?? session) : (session ?? local);
    } catch {
      return null;
    }
  },

  setItem(key, value) {
    try {
      if (shouldPersist()) {
        localStorageSafe()?.setItem(key, value);
        sessionStorageSafe()?.removeItem(key);
      } else {
        sessionStorageSafe()?.setItem(key, value);
        localStorageSafe()?.removeItem(key);
      }
    } catch {
      // Nothing to do: the in-memory session still works for this page.
    }
  },

  removeItem(key) {
    try {
      localStorageSafe()?.removeItem(key);
    } catch {
      // ignore
    }
    try {
      sessionStorageSafe()?.removeItem(key);
    } catch {
      // ignore
    }
  },
};
