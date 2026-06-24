import { 
  supabase as sharedSupabase, 
  isSupabaseConfigured as sharedIsSupabaseConfigured, 
  updateSupabaseClient as sharedUpdateSupabaseClient,
  fetchSupabaseConfigFromServer as sharedFetchSupabaseConfigFromServer
} from "./supabase";

// Export the same configuration state from the central client definition
export { sharedIsSupabaseConfigured as isSupabaseConfigured };
export { sharedUpdateSupabaseClient as updateSupabaseClient };
export { sharedFetchSupabaseConfigFromServer as fetchSupabaseConfigFromServer };

// Map the client name expected by files importing from here
export { sharedSupabase as supabaseClient };

/**
 * Sync evaluation check. Refreshes the client and returns whether the client is ready for queries.
 */
export const isClientReady = (): boolean => {
  sharedUpdateSupabaseClient();
  const ready = sharedIsSupabaseConfigured && sharedSupabase !== null;
  return ready;
};
