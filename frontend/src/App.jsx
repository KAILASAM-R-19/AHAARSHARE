import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  MapPin, 
  Clock, 
  Phone, 
  Utensils, 
  LogOut, 
  Plus, 
  Search, 
  CheckCircle2, 
  User, 
  Building2 
} from 'lucide-react';
import './App.css';

const apiUrl = 'http://localhost:5000/api';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  
  if (!currentUser) {
    return <AuthSection onLogin={setCurrentUser} />;
  }

  return (
    <div className="app-container">
      <header className="header glass-card">
        <div className="header-brand">
          <Heart color="#6366F1" size={32} />
          <h1>AaharShare</h1>
        </div>
        <div className="header-actions">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
            <User size={18} />
            <span>Logged in as <strong>{currentUser.role.toUpperCase()}</strong></span>
          </div>
          <button className="btn-secondary btn-ghost" onClick={() => setCurrentUser(null)} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      {currentUser.role === 'donor' ? (
        <DonorSection userId={currentUser.userId} />
      ) : (
        <NgoSection userId={currentUser.userId} />
      )}
    </div>
  );
}

function AuthSection({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  const [orgName, setOrgName] = useState('');
  const [location, setLocation] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });
    
    if (isLogin) {
      try {
        const response = await fetch(`${apiUrl}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
          onLogin({ userId: data.userId, role: data.role });
        } else {
          setMessage({ text: data.error || 'Login failed', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Server error', type: 'error' });
      }
    } else {
      try {
        const response = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            email, 
            password, 
            role, 
            organizationName: orgName, 
            location,
            phoneNumber
          })
        });
        const data = await response.json();
        
        if (response.ok) {
          setMessage({ text: 'Registration successful. You can now login.', type: 'success' });
          setIsLogin(true);
          setPassword('');
        } else {
          setMessage({ text: data.error || 'Registration failed', type: 'error' });
        }
      } catch (error) {
        setMessage({ text: 'Server error', type: 'error' });
      }
    }
  };

  return (
    <div className="app-container" style={{ justifyContent: 'center' }}>
      <div className="auth-wrapper glass-card">
        <div className="auth-header">
          <Heart color="#6366F1" size={48} style={{ marginBottom: '1rem' }} />
          <h2>{isLogin ? 'Welcome Back' : 'Join AaharShare'}</h2>
          <p>{isLogin ? 'Sign in to your account' : 'Create an account to start sharing'}</p>
        </div>
        
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              placeholder="you@example.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          {!isLogin && (
            <>
              <div className="form-group">
                <label>I am a...</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="donor">Food Donor (Restaurant/Individual)</option>
                  <option value="ngo">NGO / Food Bank</option>
                </select>
              </div>
              <div className="form-group">
                <label>Organization / Full Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. City Food Bank" 
                  value={orgName} 
                  onChange={(e) => setOrgName(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input 
                  type="text" 
                  placeholder="e.g. Downtown, Main St" 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. +1 234 567 890" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)} 
                  required 
                />
              </div>
            </>
          )}
          
          <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button 
            className="btn-ghost"
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage({ text: '', type: '' });
            }} 
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}

function DonorSection({ userId }) {
  const [foodType, setFoodType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [prepTime, setPrepTime] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [message, setMessage] = useState('');
  const [donations, setDonations] = useState([]);

  const fetchMyDonations = async () => {
    try {
      const response = await fetch(`${apiUrl}/donations/donor/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setDonations(data);
      }
    } catch (error) {
      console.error('Fetch error', error);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${apiUrl}/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          donor: userId,
          foodType,
          quantity: parseInt(quantity, 10),
          preparationTime: prepTime,
          location,
          contactPhone
        })
      });
      
      if (response.ok) {
        setMessage('Donation successfully submitted!');
        setFoodType('');
        setQuantity('');
        setPrepTime('');
        setLocation('');
        setContactPhone('');
        fetchMyDonations();
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to submit donation.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div className="dashboard-grid">
      <div className="glass-card">
        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} color="#6366F1" /> Donate Food
        </h3>
        
        {message && <div className="message">{message}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Food Description</label>
            <input type="text" placeholder="e.g. Rice, Lentils, Bread" value={foodType} onChange={e => setFoodType(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Quantity (kg)</label>
            <input type="number" placeholder="e.g. 10" value={quantity} onChange={e => setQuantity(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Preparation Time</label>
            <input type="datetime-local" value={prepTime} onChange={e => setPrepTime(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Pickup Location</label>
            <input type="text" placeholder="Detailed address" value={location} onChange={e => setLocation(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Contact Phone</label>
            <input type="text" placeholder="Phone number for NGO to call" value={contactPhone} onChange={e => setContactPhone(e.target.value)} required />
          </div>
          <button type="submit" style={{ width: '100%', marginTop: '1rem' }}>Submit Donation</button>
        </form>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Utensils size={20} color="#6366F1" /> My Donations
          </h3>
        </div>
        
        {donations.length === 0 ? (
          <div className="empty-state" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Heart size={48} />
            <p>You haven't made any donations yet.<br/>Your active donations will appear here.</p>
          </div>
        ) : (
          <div className="donation-list" style={{ overflowY: 'auto' }}>
            {donations.map(item => (
              <div className="donation-item" key={item._id}>
                <div className="donation-info">
                  <h4>{item.foodType}</h4>
                  <div className="donation-meta">
                    <span className="meta-row"><Utensils size={14}/> {item.quantity} kg</span>
                    <span className="meta-row"><MapPin size={14}/> {item.location}</span>
                    <span className="meta-row"><Clock size={14}/> {new Date(item.preparationTime).toLocaleString()}</span>
                    <span className="meta-row"><Phone size={14}/> {item.contactPhone}</span>
                  </div>
                </div>
                <div className="donation-actions">
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NgoSection({ userId }) {
  const [searchLocation, setSearchLocation] = useState('');
  const [nearbyDonations, setNearbyDonations] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchNearby = async () => {
    setLoading(true);
    try {
      let url = `${apiUrl}/donations/nearby`;
      if (searchLocation) {
        url += `?location=${encodeURIComponent(searchLocation)}`;
      }
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setNearbyDonations(data);
      }
    } catch (error) {
      console.error('Fetch error');
    }
    setLoading(false);
  };

  useEffect(() => {
    searchNearby();
  }, []);

  const claimDonation = async (donationId) => {
    try {
      const response = await fetch(`${apiUrl}/donations/${donationId}/claim`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ngoId: userId })
      });
      if (response.ok) {
        searchNearby();
      } else {
        alert('Claim failed');
      }
    } catch (error) {
      alert('Claim error');
    }
  };

  return (
    <div className="glass-card" style={{ minHeight: '600px' }}>
      <div className="section-header">
        <h3 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Building2 size={24} color="#6366F1" /> Find Available Food
        </h3>
        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search by area (e.g. Downtown)" 
            value={searchLocation} 
            onChange={e => setSearchLocation(e.target.value)} 
            onKeyDown={e => e.key === 'Enter' && searchNearby()}
          />
          <button onClick={searchNearby}>
            <Search size={18} /> Search
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="empty-state">
          <p>Loading donations...</p>
        </div>
      ) : nearbyDonations.length === 0 ? (
        <div className="empty-state">
          <Search size={48} />
          <p>No available donations found in this area.<br/>Try broadening your search.</p>
        </div>
      ) : (
        <div className="donation-list" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
          {nearbyDonations.map(item => (
            <div className="donation-item" key={item._id} style={{ flexDirection: 'column', gap: '1.5rem' }}>
              <div className="donation-info" style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <h4 style={{ fontSize: '1.25rem' }}>{item.foodType}</h4>
                  <span className={`badge ${item.status}`}>{item.status}</span>
                </div>
                
                <div className="donation-meta" style={{ gap: '0.75rem' }}>
                  <span className="meta-row"><Utensils size={16} color="#94A3B8"/> <strong>{item.quantity} kg</strong></span>
                  <span className="meta-row"><MapPin size={16} color="#94A3B8"/> {item.location}</span>
                  <span className="meta-row"><Clock size={16} color="#94A3B8"/> Pick up after: {new Date(item.preparationTime).toLocaleString()}</span>
                  <span className="meta-row"><Phone size={16} color="#94A3B8"/> {item.contactPhone}</span>
                </div>
              </div>
              
              {item.status === 'available' ? (
                <button 
                  onClick={() => claimDonation(item._id)} 
                  style={{ width: '100%', background: '#10B981' }}
                >
                  <CheckCircle2 size={18} /> Claim Donation
                </button>
              ) : (
                <div style={{ width: '100%', padding: '0.75rem', textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', color: 'var(--text-muted)' }}>
                  Already Claimed
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
