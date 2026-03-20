import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserBookings, fetchEquipment, updateBookingStatus } from '../api';
import api from '../api'; // Need raw api for posting equipment
import { CheckCircle, Clock, IndianRupee } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [myEquipment, setMyEquipment] = useState([]);
  
  // New Equipment Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEq, setNewEq] = useState({ name: '', description: '', pricePerDay: '', category: 'Tractor', location: '' });

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      navigate('/login');
      return;
    }
    
    const loggedInUser = JSON.parse(userStr);
    setUser(loggedInUser);

    const loadDashboardData = async () => {
      try {
        const bookingsData = await fetchUserBookings();
        setBookings(bookingsData);
        
        if (loggedInUser.role === 'owner') {
          // fetch my equipment (simplified logic just getting all and filtering for now due to time constraints)
          const allEq = await fetchEquipment();
          setMyEquipment(allEq.filter(e => e.owner._id === loggedInUser.id || e.owner === loggedInUser.id));
        }
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      }
    };
    
    loadDashboardData();
  }, [navigate]);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(b => b._id === bookingId ? { ...b, status: newStatus } : b));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleAddEquipment = async (e) => {
    e.preventDefault();
    try {
      await api.post('/equipment', newEq);
      setShowAddForm(false);
      window.location.reload(); // simple refresh
    } catch (err) {
      alert("Failed to add equipment");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="container mt-4">
      <div className="flex justify-between items-center mb-4">
        <h1>Welcome, {user.name}</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>Logout</button>
      </div>

      {user.role === 'farmer' ? (
        <div>
          <h2>My Rentals</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            {bookings.length === 0 ? <p>You have no rentals yet.</p> : null}
            
            {bookings.map(b => (
              <div key={b._id} className="card" style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '8px' }}>{b.equipment?.name || "Equipment deleted"}</h3>
                  <p style={{ color: 'var(--color-text-muted)' }}>
                    From: {new Date(b.startDate).toLocaleDateString()} &nbsp; | &nbsp; To: {new Date(b.endDate).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex gap-4 items-center">
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}><IndianRupee size={16}/> {b.totalPrice}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>{b.paymentMethod === 'pay_now' ? 'Paid Online' : 'Pay Later'}</span>
                  </div>
                  <div style={{ 
                    padding: '8px 16px', 
                    borderRadius: 'var(--border-radius-lg)', 
                    backgroundColor: b.status === 'confirmed' ? '#d4edda' : (b.status === 'rejected' ? '#f8d7da' : '#fff3cd'),
                    color: b.status === 'confirmed' ? '#155724' : (b.status === 'rejected' ? '#721c24' : '#856404'),
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {b.status === 'confirmed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                    {b.status.toUpperCase()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          {/* Owner Dashboard */}
          <div className="flex justify-between items-center mt-4 mb-4">
            <h2>My Machines List</h2>
            <button className="btn btn-primary" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? 'Cancel' : 'Add New Machine'}
            </button>
          </div>

          {showAddForm && (
            <div className="card mb-4" style={{ padding: '32px', backgroundColor: 'var(--color-background)' }}>
              <h3>List a New Machine</h3>
              <form onSubmit={handleAddEquipment} className="mt-4 flex-col gap-2">
                <label>Machine Name</label>
                <input type="text" placeholder="e.g. John Deere Harvester" value={newEq.name} onChange={(e) => setNewEq({...newEq, name: e.target.value})} required />
                
                <label className="mt-2">Description</label>
                <textarea rows="3" placeholder="Describe the condition and power of the machine..." value={newEq.description} onChange={(e) => setNewEq({...newEq, description: e.target.value})} required></textarea>
                
                <div style={{ display: 'flex', gap: '16px' }} className="mt-2">
                  <div style={{ flex: 1 }}>
                    <label>Category</label>
                    <select value={newEq.category} onChange={(e) => setNewEq({...newEq, category: e.target.value})}>
                      <option>Tractor</option>
                      <option>Harvester</option>
                      <option>Seeder</option>
                      <option>Plow</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Price Per Day (₹)</label>
                    <input type="number" placeholder="500" value={newEq.pricePerDay} onChange={(e) => setNewEq({...newEq, pricePerDay: e.target.value})} required />
                  </div>
                </div>

                <label className="mt-2">Location/Village</label>
                <input type="text" placeholder="e.g. Rampur Village" value={newEq.location} onChange={(e) => setNewEq({...newEq, location: e.target.value})} required />

                <button type="submit" className="btn btn-primary mt-4" style={{ padding: '16px', fontSize: '1.2rem' }}>List Machine</button>
              </form>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
            {myEquipment.length === 0 ? <p>You haven't listed any machines.</p> : null}
            
            {myEquipment.map(item => (
              <div key={item._id} className="card" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.5rem' }}>{item.name}</h3>
                  <span style={{ fontWeight: 'bold', color: 'var(--color-primary)' }}>₹{item.pricePerDay}/day</span>
                </div>
                <p style={{ color: 'var(--color-text-muted)' }}>{item.location}</p>
              </div>
            ))}
          </div>
          
          <h2 className="mt-4 mt-4">Rental Requests For Your Machines</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '24px' }}>
            {bookings.length === 0 ? <p>No rental requests right now.</p> : null}
            
            {bookings.map(b => (
               <div key={b._id} className="card" style={{ padding: '24px' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <div>
                     <h3 style={{ fontSize: '1.3rem' }}>{b.equipment?.name}</h3>
                     <p>Rented by: <strong>{b.farmer?.name}</strong> ({b.farmer?.phone})</p>
                     <p style={{ color: 'var(--color-text-muted)' }}>Dates: {new Date(b.startDate).toLocaleDateString()} to {new Date(b.endDate).toLocaleDateString()}</p>
                     <p style={{ color: 'var(--color-text-muted)' }}>Payment: {b.paymentMethod === 'pay_now' ? 'Paid Online' : 'Pay Later (Cash)'}</p>
                   </div>
                   <div style={{ textAlign: 'right' }}>
                     <p style={{ fontWeight: 'bold', fontSize: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}><IndianRupee size={20} />{b.totalPrice}</p>
                     
                     {b.status === 'pending' ? (
                        <div style={{ marginTop: '12px', display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button onClick={() => handleStatusChange(b._id, 'confirmed')} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '1rem', backgroundColor: 'var(--color-success)' }}>Accept</button>
                          <button onClick={() => handleStatusChange(b._id, 'rejected')} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '1rem', borderColor: 'var(--color-danger)', color: 'var(--color-danger)' }}>Reject</button>
                        </div>
                     ) : (
                        <span style={{ display: 'inline-block', padding: '4px 12px', borderRadius: '16px', backgroundColor: '#e9ecef', marginTop: '8px', textTransform: 'capitalize' }}>Status: {b.status}</span>
                     )}
                   </div>
                 </div>
               </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Dashboard;
