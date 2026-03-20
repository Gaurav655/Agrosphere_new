import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchEquipment } from '../api';
import { Search, MapPin, IndianRupee } from 'lucide-react';

const HomePage = () => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEquipment();
        setEquipment(data);
      } catch (err) {
        console.error("Failed to load equipment", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '60px 20px', textAlign: 'center' }}>
        <div className="container">
          <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '20px' }}>Rent Farm Machines Easily</h1>
          <p style={{ color: '#e0e0e0', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 30px' }}>
            Find honest owners. Book tractors, harvesters, and more near your location for fair prices.
          </p>
          
          <div style={{ display: 'flex', justifyContent: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', width: '100%', backgroundColor: 'white', borderRadius: 'var(--border-radius-md)', padding: '8px', boxShadow: 'var(--shadow-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px', color: 'var(--color-text-muted)' }}>
                <Search size={24} />
              </div>
              <input 
                type="text" 
                placeholder="What machine do you need? (e.g. Tractor)" 
                style={{ border: 'none', boxShadow: 'none', padding: '16px', fontSize: '1.1rem', backgroundColor: 'transparent' }}
              />
              <button className="btn btn-primary" style={{ padding: '0 32px' }}>Search</button>
            </div>
          </div>
        </div>
      </section>

      {/* Available Equipment */}
      <section className="container mt-4">
        <h2 className="mb-4 text-center">Available Machines Near You</h2>
        
        {loading ? (
          <p className="text-center" style={{ fontSize: '1.5rem', marginTop: '40px' }}>Loading machines...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {equipment.length === 0 && <p>No machines available right now.</p>}
            
            {equipment.map(item => (
              <div key={item._id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', backgroundColor: '#e9ecef', backgroundImage: `url(${item.imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f233496bc0e?auto=format&fit=crop&q=80&w=800'})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.6rem', marginBottom: '8px' }}>{item.name}</h3>
                  <p style={{ color: 'var(--color-text-muted)', marginBottom: '16px', flex: 1 }}>{item.description.substring(0, 80)}...</p>
                  
                  <div className="flex items-center gap-2 mb-2" style={{ color: 'var(--color-text-main)' }}>
                    <MapPin size={20} color="var(--color-primary)" />
                    <span style={{ fontSize: '1.1rem' }}>{item.location}</span>
                  </div>
                  
                  <div className="flex justify-between items-center" style={{ marginTop: 'auto', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', color: 'var(--color-text-main)', fontWeight: 'bold', fontSize: '1.4rem' }}>
                      <IndianRupee size={24} />
                      {item.pricePerDay} <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 'normal' }}>/ day</span>
                    </div>
                    
                    <Link to={`/equipment/${item._id}`} className="btn btn-primary" style={{ padding: '12px 24px' }}>
                      Rent Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
