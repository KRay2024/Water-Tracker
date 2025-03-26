import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Water() {
  const userid = localStorage.getItem('userid');
  const navigate = useNavigate();

  // Initialize state as an empty array
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userid || userid == -1) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/drinking/${userid}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Wrap the single object in an array
        setDrinks(data);
        console.log("Data received:", data);
        
      } catch (err) {
        console.error("Fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userid, navigate]);

  // Monitor state changes
  useEffect(() => {
    console.log("Drinks array updated:", drinks);
  }, [drinks]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <h2>Water Page</h2>
      <div>
        {drinks.length > 0 ? (
          drinks.map(drink => (
            <div key={drink.record_id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
              <h3>Record ID: {drink.record_id}</h3>
              <p>User ID: {drink.user_id}</p>
              <p>Goal: {drink.oz_goal} oz</p>
              <p>Consumed: {drink.oz_consumed} oz</p>
              <p>Remaining: {drink.oz_remaining} oz</p>
              <p>Date: {drink.date}</p>
            </div>
          ))
        ) : (
          <p>No drinks data available</p>
        )}
      </div>
    </>
  );
}