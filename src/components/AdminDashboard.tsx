import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // Correct import path based on project structure

interface AdminProfile {
  id: string;
  name: string;
  email: string;
  is_owner: boolean;
}

export default function AdminDashboard() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [adminProfile, setAdminProfile] = useState<AdminProfile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check active session on load
    const session = supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
        fetchAdminProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        setUser(session.user);
        fetchAdminProfile(session.user.id);
      } else {
        setUser(null);
        setAdminProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchAdminProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('admin')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setAdminProfile(data);
    } catch (err: any) {
      console.error('Error fetching profile:', err.message);
    }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Authenticate with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned from authentication.");

      const authUser = authData.user;

      // 2. Fetch the corresponding admin profile
      let { data: profile, error: profileError } = await supabase
        .from('admin')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // 3. Verify administrative properties (With Explicit Email Bypass Override)
      // CHANGE THIS EMAIL to your actual admin login email
      const allowedEmails = ['your-email@domain.com', 'admin@aionlinebusiness.org'];
      const isExplicitlyWhitelisted = allowedEmails.includes(authUser.email?.trim().toLowerCase() || '');

      if (isExplicitlyWhitelisted) {
        if (!profile) {
          profile = {
            id: authUser.id,
            name: authUser.email?.split("@")[0] || "Administrator",
            email: authUser.email?.trim().toLowerCase() || '',
            is_owner: true
          };
        } else {
          profile.is_owner = true;
        }
      }

      if (!profile || profile.is_owner !== true) {
        await supabase.auth.signOut();
        throw new Error("Access Denied: You do not carry authorized administrator properties.");
      }

      setUser(authUser);
      setAdminProfile(profile);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // Render Login Panel if not authenticated or missing permissions
  if (!user || !adminProfile || !adminProfile.is_owner) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
        <form onSubmit={handleAdminLogin} style={{ width: '320px', padding: '2rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h2>Admin Portal Login</h2>
          
          {error && <div style={{ color: 'red', marginBottom: '1rem', fontSize: '14px' }}>{error}</div>}
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            {loading ? 'Verifying...' : 'Sign In'}
          </button>
        </form>
      </div>
    );
  }

  // Render Secured Dashboard Layout once bypassed/authenticated Successfully
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
        <div>
          <h1>Admin Master Dashboard</h1>
          <p>Welcome back, <strong>{adminProfile.name}</strong> ({adminProfile.email})</p>
        </div>
        <button onClick={handleLogout} style={{ padding: '0.5rem 1rem', background: '#ff0000', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginLeft: 'auto' }}>
          Disconnect Session
        </button>
      </header>
      
      <main style={{ marginTop: '2rem' }}>
        <h3>Administrative Controls</h3>
        <p>Your session now carries verified root permissions over the application infrastructure loop.</p>
      </main>
    </div>
  );
}