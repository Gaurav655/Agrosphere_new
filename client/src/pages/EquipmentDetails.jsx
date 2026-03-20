import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEquipmentById, createBooking } from '../api';
import { MapPin, IndianRupee, Tractor, Calendar, CheckCircle } from 'lucide-react';

const EquipmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pay_later');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchEquipmentById(id);
        setEquipment(data);
      } catch (err) {
        console.error("Failed to load equipment", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id]);

  const calculateTotalPrice = () => {
    if (!startDate || !endDate || !equipment) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both days
    return diffDays > 0 ? diffDays * equipment.pricePerDay : 0;
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (user.role !== 'farmer') {
      setError('Only farmers can rent equipment.');
      return;
    }
    
    try {
      await createBooking({
        equipmentId: equipment._id,
        startDate,
        endDate,
        totalPrice: calculateTotalPrice(),
        paymentMethod
      });
      setBookingSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
    }
  };

  if (loading) return <div className="container mt-4"><h2 className="text-center">Loading Data...</h2></div>;
  if (!equipment) return <div className="container mt-4"><h2 className="text-center">Machine Not Found</h2></div>;

  return (
    <div className="container mt-4">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '40px', alignItems: 'start' }}>
        
        {/* Left Side: Details */}
        <div>
          <div style={{ width: '100%', height: '400px', borderRadius: 'var(--border-radius-lg)', backgroundColor: '#e9ecef', backgroundImage: `url(${equipment.imageUrl || 'https://images.unsplash.com/photo-1592982537447-6f233496bc0e?auto=format&fit=crop&q=80&w=1200'})`, backgroundSize: 'cover', backgroundPosition: 'center', marginBottom: '24px' }}></div>
          
          <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>{equipment.name}</h1>
          
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center gap-2" style={{ backgroundColor: 'var(--color-primary-light)', color: 'white', padding: '8px 16px', borderRadius: 'var(--border-radius-lg)', fontWeight: 'bold' }}>
              <Tractor size={20} /> {equipment.category}
            </span>
            <span className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)', fontSize: '1.2rem' }}>
              <MapPin size={24} /> {equipment.location}
            </span>
          </div>

          <p style={{ fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--color-text-main)', marginTop: '24px' }}>
            {equipment.description}
          </p>

          <div className="card mt-4" style={{ padding: '24px', backgroundColor: 'var(--color-background)' }}>
            <h3>Owner Details</h3>
            <p className="mt-2" style={{ fontSize: '1.2rem' }}><strong>Name:</strong> {equipment.owner?.name}</p>
            <p style={{ fontSize: '1.2rem' }}><strong>Phone:</strong> {equipment.owner?.phone || 'Not provided'}</p>
          </div>
        </div>

        {/* Right Side: Booking Box */}
        <div className="card" style={{ padding: '32px', position: 'sticky', top: '100px' }}>
          <h2 style={{ fontSize: '2.5rem', display: 'flex', alignItems: 'center' }}>
            <IndianRupee size={36} /> {equipment.pricePerDay} <span style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', fontWeight: 'normal', marginLeft: '8px' }}>/ day</span>
          </h2>
          
          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />
          
          {bookingSuccess ? (
            <div style={{ textAlign: 'center', color: 'var(--color-primary)' }}>
              <CheckCircle size={64} style={{ margin: '0 auto 16px' }} />
              <h2>Booking Successful!</h2>
              <p className="mt-2 text-muted">The owner has been notified. Check your dashboard for updates.</p>
              <button className="btn btn-primary mt-4" onClick={() => navigate('/dashboard')} style={{ width: '100%' }}>Go to Dashboard</button>
            </div>
          ) : (
            <form onSubmit={handleBooking} className="flex-col gap-2">
              {error && <div style={{ color: 'var(--color-danger)', backgroundColor: '#ffe5e5', padding: '12px', borderRadius: 'var(--border-radius-sm)', marginBottom: '16px' }}>{error}</div>}
              
              <label>When do you need it?</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Start Date</label>
                  <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required min={new Date().toISOString().split('T')[0]} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>End Date</label>
                  <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required min={startDate || new Date().toISOString().split('T')[0]} />
                </div>
              </div>

              {startDate && endDate && (
                <div style={{ backgroundColor: 'var(--color-background)', padding: '16px', borderRadius: 'calc(var(--border-radius-sm) * 2)', marginTop: '16px' }}>
                  <div className="flex justify-between items-center mb-2">
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Total Days</span>
                    <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{calculateTotalPrice() / equipment.pricePerDay || 0}</span>
                  </div>
                  <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--color-border)', paddingTop: '8px', marginBottom: '16px' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>Total Cost</span>
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--color-primary)', display: 'flex', alignItems: 'center' }}>
                      <IndianRupee size={20} /> {calculateTotalPrice()}
                    </span>
                  </div>
                  
                  <label style={{ fontSize: '1rem', color: 'var(--color-text-main)', marginBottom: '8px', display: 'block' }}>Payment Option</label>
                  <div style={{ display: 'flex', gap: '12px', flexDirection: 'column' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', border: paymentMethod === 'pay_now' ? '2px solid var(--color-primary)' : '2px solid var(--color-border)', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'white' }}>
                      <input type="radio" name="payment" value="pay_now" checked={paymentMethod === 'pay_now'} onChange={() => setPaymentMethod('pay_now')} style={{ width: 'auto' }} />
                      Pay Now (Card/UPI)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', padding: '12px', border: paymentMethod === 'pay_later' ? '2px solid var(--color-primary)' : '2px solid var(--color-border)', borderRadius: 'var(--border-radius-sm)', backgroundColor: 'white' }}>
                      <input type="radio" name="payment" value="pay_later" checked={paymentMethod === 'pay_later'} onChange={() => setPaymentMethod('pay_later')} style={{ width: 'auto' }} />
                      Pay Later (Cash on Delivery)
                    </label>
                  </div>
                </div>
              )}

              <button type="submit" className="btn btn-primary mt-4" style={{ width: '100%', fontSize: '1.3rem', padding: '20px' }}>
                { paymentMethod === 'pay_now' ? 'Pay Now & Book' : 'Book Now' }
              </button>
              
              {!user && <p style={{ textAlign: 'center', fontSize: '1rem', color: 'var(--color-text-muted)', marginTop: '16px' }}>You will be asked to login first.</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDetails;
