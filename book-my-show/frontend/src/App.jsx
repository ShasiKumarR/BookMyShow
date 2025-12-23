// frontend/src/App.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import SeatLayout from './components/SeatLayout';
import './App.css';

function App() {
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [seats, setSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:3000/api';

  // Fetch all shows
  useEffect(() => {
    const fetchShows = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/shows`);
        setShows(response.data);
        if (response.data.length > 0) {
          setSelectedShow(response.data[0].id);
        }
      } catch (err) {
        console.error('Error fetching shows:', err);
        setError('Failed to load shows. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  // Fetch seats when show is selected
  useEffect(() => {
    if (!selectedShow) return;

    const fetchSeats = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/shows/${selectedShow}/seats`
        );
        setSeats(response.data);
      } catch (err) {
        console.error('Error fetching seats:', err);
        setError('Failed to load seat data. Please try again.');
      }
    };

    fetchSeats();
  }, [selectedShow]);

  const handleSeatSelect = async (seatId) => {
    try {
      await axios.post(
        `${API_BASE_URL}/shows/${selectedShow}/seats/${seatId}/hold`,
        { userId: 'user123' }
      );
      setSelectedSeats([...selectedSeats, seatId]);
    } catch (err) {
      console.error('Error selecting seat:', err);
      alert('Failed to select seat. It may have been booked by someone else.');
    }
  };

  const handleBookSeats = async () => {
    if (selectedSeats.length === 0) return;

    try {
      await Promise.all(
        selectedSeats.map(seatId =>
          axios.post(
            `${API_BASE_URL}/shows/${selectedShow}/seats/${seatId}/book`,
            { userId: 'user123' }
          )
        )
      );
      setSelectedSeats([]);
      alert('Seats booked successfully!');
    } catch (err) {
      console.error('Error booking seats:', err);
      alert('Failed to book seats. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading shows...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎭 BookMyShow</h1>
        <div className="show-selector">
          <label htmlFor="show-select">Select Show: </label>
          <select
            id="show-select"
            value={selectedShow || ''}
            onChange={(e) => setSelectedShow(parseInt(e.target.value))}
            disabled={shows.length === 0}
          >
            {shows.map(show => (
              <option key={show.id} value={show.id}>
                {show.name} - {new Date(show.start_time).toLocaleString()}
              </option>
            ))}
          </select>
        </div>
      </header>

      <main className="app-content">
        {selectedShow ? (
          <>
            <SeatLayout
              showId={selectedShow}
              seats={seats}
              selectedSeats={selectedSeats}
              onSelect={handleSeatSelect}
            />
            {selectedSeats.length > 0 && (
              <div className="booking-actions">
                <p>Selected Seats: {selectedSeats.join(', ')}</p>
                <button onClick={handleBookSeats} className="book-button">
                  Book Selected Seats
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="no-shows">
            No shows available. Please check back later.
          </div>
        )}
      </main>
    </div>
  );
}

export default App;