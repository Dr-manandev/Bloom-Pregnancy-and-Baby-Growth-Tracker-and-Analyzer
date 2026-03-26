import { db } from './firebase';
import { doc, setDoc, getDoc, collection, getDocs, writeBatch } from 'firebase/firestore';

// The keys that are specific to a profile (matching App.tsx)
export const PROFILE_SPECIFIC_KEYS = [
  'bloom_kicks',
  'bloom_contractions',
  'bloom_milestones',
  'bloom_weight_logs',
  'bloom_pp_weight_logs',
  'bloom_bp_logs',
  'bloom_pp_bp_logs',
  'bloom_glucose_logs',
  'bloom_pp_glucose_logs',
  'bloom_baby_growth',
  'bloom_tsh_logs', 'bloom_pp_tsh_logs',
  'bloom_hb_logs', 'bloom_pp_hb_logs',
  'bloom_hba1c_logs', 'bloom_pp_hba1c_logs',
  'bloom_medicines', 'bloom_pp_medicines'
];

/**
 * Saves data to both LocalStorage (for instant UI updates) and Firestore (for cloud sync).
 */
export const syncData = async (userId: string | null, profileId: string | null, key: string, data: any) => {
  // 1. Instant Local Update
  localStorage.setItem(key, JSON.stringify(data));

  // 2. Background Cloud Sync
  if (!userId || !profileId) return; // If not logged in or no active profile, just keep it local

  try {
    if (key === 'bloom_settings') {
      // Save profile settings
      await setDoc(doc(db, `users/${userId}/profiles/${profileId}`), { settings: data }, { merge: true });
    } else if (key === 'bloom_all_profiles') {
      // Save global profiles list
      await setDoc(doc(db, `users/${userId}/global_settings/meta`), { profiles: data }, { merge: true });
    } else {
      // Save specific log (kicks, weight, etc.)
      await setDoc(doc(db, `users/${userId}/profiles/${profileId}/logs/${key}`), { data }, { merge: true });
    }
  } catch (error) {
    console.error(`Error syncing ${key} to cloud:`, error);
  }
};

/**
 * Loads all data from Firestore and hydrates LocalStorage.
 * Runs when a user logs in on a new device.
 */
export const loadCloudData = async (userId: string) => {
  try {
    // 1. Load Global Profiles
    const metaDoc = await getDoc(doc(db, `users/${userId}/global_settings/meta`));
    if (metaDoc.exists() && metaDoc.data().profiles) {
      const profiles = metaDoc.data().profiles;
      localStorage.setItem('bloom_all_profiles', JSON.stringify(profiles));

      // Find active profile (usually the first one or a specific flag)
      const activeProfile = profiles[0]; // Simplified for now
      if (activeProfile) {
        // 2. Load Active Profile Settings
        const profileDoc = await getDoc(doc(db, `users/${userId}/profiles/${activeProfile.id}`));
        if (profileDoc.exists() && profileDoc.data().settings) {
          localStorage.setItem('bloom_settings', JSON.stringify(profileDoc.data().settings));
        }

        // 3. Load Active Profile Logs
        const logsSnapshot = await getDocs(collection(db, `users/${userId}/profiles/${activeProfile.id}/logs`));
        logsSnapshot.forEach((docSnap) => {
          localStorage.setItem(docSnap.id, JSON.stringify(docSnap.data().data));
        });
      }
    }
  } catch (error) {
    console.error("Error loading cloud data:", error);
  }
};

/**
 * Migrates existing LocalStorage data to Firestore on first login.
 */
export const migrateLegacyData = async (userId: string) => {
  try {
    // Check if migration already happened
    const metaDoc = await getDoc(doc(db, `users/${userId}/global_settings/meta`));
    if (metaDoc.exists() && metaDoc.data().migrated) {
      return; // Already migrated
    }

    const batch = writeBatch(db);
    let hasDataToMigrate = false;

    // 1. Migrate Global Profiles
    const allProfilesRaw = localStorage.getItem('bloom_all_profiles');
    if (allProfilesRaw) {
      const profiles = JSON.parse(allProfilesRaw);
      batch.set(doc(db, `users/${userId}/global_settings/meta`), { profiles, migrated: true }, { merge: true });
      hasDataToMigrate = true;

      // 2. Migrate Active Settings
      const activeSettingsRaw = localStorage.getItem('bloom_settings');
      let activeProfileId = null;
      if (activeSettingsRaw) {
        const activeSettings = JSON.parse(activeSettingsRaw);
        activeProfileId = activeSettings.id;
        batch.set(doc(db, `users/${userId}/profiles/${activeSettings.id}`), { settings: activeSettings }, { merge: true });
        
        // Migrate Active Logs
        PROFILE_SPECIFIC_KEYS.forEach(key => {
          const logDataRaw = localStorage.getItem(key);
          if (logDataRaw) {
            batch.set(doc(db, `users/${userId}/profiles/${activeSettings.id}/logs/${key}`), { data: JSON.parse(logDataRaw) }, { merge: true });
          }
        });
      }

      // 3. Migrate Inactive Profiles (stored as bloom_settings_{id} and {key}_{id})
      profiles.forEach((profile: any) => {
        // Skip active profile as it's already handled
        if (activeProfileId === profile.id) return;

        const inactiveSettingsRaw = localStorage.getItem(`bloom_settings_${profile.id}`);
        if (inactiveSettingsRaw) {
          batch.set(doc(db, `users/${userId}/profiles/${profile.id}`), { settings: JSON.parse(inactiveSettingsRaw) }, { merge: true });
        }

        PROFILE_SPECIFIC_KEYS.forEach(key => {
          const inactiveLogDataRaw = localStorage.getItem(`${key}_${profile.id}`);
          if (inactiveLogDataRaw) {
            batch.set(doc(db, `users/${userId}/profiles/${profile.id}/logs/${key}`), { data: JSON.parse(inactiveLogDataRaw) }, { merge: true });
          }
        });
      });
    }

    if (hasDataToMigrate) {
      await batch.commit();
      console.log("Legacy data successfully migrated to Firebase!");
    } else {
      // Mark as migrated even if empty, so we don't check again
      await setDoc(doc(db, `users/${userId}/global_settings/meta`), { migrated: true }, { merge: true });
    }
  } catch (error) {
    console.error("Error migrating legacy data:", error);
  }
};
