import { useState, useEffect } from 'react';
import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'

export default function Water() {
  const userid = localStorage.getItem('userid');
  const navigate = useNavigate();

  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [newDrink, setNewDrink] = useState({
    oz_goal: 0,
    oz_consumed: 0,
    oz_remaining: 0,
    date: ''
  });

  const fetchDrinks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/drinking/${userid}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setDrinks(Array.isArray(data) ? data : [data]);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userid]);

  useEffect(() => {

    if (!userid || userid === -1) {
      navigate('/');
      return;
    }    
    fetchDrinks();
  }, [userid, navigate, fetchDrinks]);


  const handleAddDrink = async (e) => {
    e.preventDefault();
    try {
      newDrink.oz_remaining = newDrink.oz_goal - newDrink.oz_consumed;
      const response = await fetch('http://localhost:8000/drinking/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userid,
          oz_goal: newDrink.oz_goal,
          oz_consumed: newDrink.oz_consumed,
          oz_remaining: newDrink.oz_remaining,
          date: newDrink.date || new Date().toISOString().split('T')[0]
        }),
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const addedDrink = await response.json();
      setDrinks([...drinks, addedDrink]);
      setShowAddForm(false);
      setNewDrink({ oz_goal: '', oz_consumed: '', date: '' });
    } catch (err) {
      console.error("Add drink failed:", err);
      setError(err.message);
    }
  };

  const handleEditDrink = (drink) => {
    setEditingId(drink.id);
    setNewDrink({
      oz_goal: drink.oz_goal,
      oz_consumed: drink.oz_consumed,
      oz_remaining: drink.oz_remaining,
      date: drink.date
    });
  };

  const handleUpdateDrink = async (e) => {
    e.preventDefault();
    try {
      const updatedDrink = {
        ...newDrink,
        oz_remaining: newDrink.oz_goal - newDrink.oz_consumed
      };
      
      const response = await fetch(`http://localhost:8000/drinking/${userid}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userid,
          oz_goal: updatedDrink.oz_goal,
          oz_consumed: updatedDrink.oz_consumed,
          oz_remaining: updatedDrink.oz_remaining,
          date: updatedDrink.date
        }),
      });
      

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const updatedData = await response.json();
      setDrinks(drinks.map(drink => 
        drink.id === editingId ? updatedData : drink
      ));
      setEditingId(null);
      setNewDrink({ oz_goal: '', oz_consumed: '', date: '' });
    } catch (err) {
      console.error("Update failed:", err);
      setError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setNewDrink({ oz_goal: '', oz_consumed: '', date: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDrink({
      ...newDrink,
      [name]: value
    });
  };

  const handleDeleteDrink = async (recordId) => {
    try {
      const response = await fetch(`http://localhost:8000/drinking/${recordId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setDrinks(drinks.filter(drink => drink.id !== recordId));
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={styles.container}>
      <Header />
      <div style={styles.content}>
        <div style={styles.header}>
          <h2 style={styles.pageTitle}>Water Consumption Tracker</h2>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            style={styles.addButton}
          >
            {showAddForm ? 'Cancel' : '+ Add Drink Record'}
          </button>
        </div>

        {showAddForm && (
          <form onSubmit={handleAddDrink} style={styles.form}>
            <h3 style={styles.formTitle}>New Drink Record</h3>
            <div style={styles.formGroup}>
              <label style={styles.label}>Daily Goal (oz)</label>
              <input
                type="number"
                step="0.1"
                name="oz_goal"
                value={newDrink.oz_goal}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Consumed (oz)</label>
              <input
                type="number"
                step="0.1"
                name="oz_consumed"
                value={newDrink.oz_consumed}
                onChange={handleInputChange}
                style={styles.input}
                required
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                name="date"
                value={newDrink.date}
                onChange={handleInputChange}
                style={styles.input}
              />
            </div>
            <div style={styles.formButtons}>
              <button type="submit" style={styles.submitButton}>Submit</button>
              <button 
                type="button" 
                onClick={() => setShowAddForm(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={styles.drinksContainer}>
          {drinks.length > 0 ? (
            drinks.map(drink => (
              <div 
                key={drink.id} 
                style={editingId === drink.id ? styles.editCard : styles.drinkCard}
              >
                {editingId === drink.id ? (
                  <form onSubmit={handleUpdateDrink} style={styles.form}>
                    <h3 style={styles.cardTitle}>Edit Record #{drink.id}</h3>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Daily Goal (oz)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="oz_goal"
                        value={newDrink.oz_goal}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Consumed (oz)</label>
                      <input
                        type="number"
                        step="0.1"
                        name="oz_consumed"
                        value={newDrink.oz_consumed}
                        onChange={handleInputChange}
                        style={styles.input}
                        required
                      />
                    </div>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Date</label>
                      <input
                        type="date"
                        name="date"
                        value={newDrink.date}
                        onChange={handleInputChange}
                        style={styles.input}
                      />
                    </div>
                    <div style={styles.formButtons}>
                      <button type="submit" style={styles.submitButton}>Update</button>
                      <button 
                        type="button" 
                        onClick={handleCancelEdit}
                        style={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div style={styles.cardHeader}>
                      <h3 style={styles.cardTitle}>Record #{drink.id}</h3>
                      <div style={styles.cardDate}>{drink.date}</div>
                    </div>
                    <div style={styles.progressContainer}>
                      <div style={styles.progressBar}>
                        <div 
                          style={{
                            ...styles.progressFill,
                            width: `${Math.min(100, (drink.oz_consumed / drink.oz_goal) * 100)}%`,
                            backgroundColor: (drink.oz_consumed / drink.oz_goal) >= 1 ? '#4CAF50' : '#2196F3'
                          }}
                        ></div>
                      </div>
                      <div style={styles.progressText}>
                        {drink.oz_consumed}oz / {drink.oz_goal}oz
                      </div>
                    </div>
                    <div style={styles.statsGrid}>
                      <div style={styles.statItem}>
                        <div style={styles.statLabel}>Goal</div>
                        <div style={styles.statValue}>{drink.oz_goal} oz</div>
                      </div>
                      <div style={styles.statItem}>
                        <div style={styles.statLabel}>Consumed</div>
                        <div style={styles.statValue}>{drink.oz_consumed} oz</div>
                      </div>
                      <div style={styles.statItem}>
                        <div style={styles.statLabel}>Remaining</div>
                        <div style={{
                          ...styles.statValue,
                          color: drink.oz_remaining <= 0 ? '#4CAF50' : '#F44336'
                        }}>
                          {Math.max(0, drink.oz_remaining)} oz
                        </div>
                      </div>
                    </div>
                    <div style={styles.cardActions}>
                      <button 
                        onClick={() => handleEditDrink(drink)}
                        style={styles.editButton}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteDrink(drink.id)}
                        style={styles.deleteButton}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>No drink records found</p>
              <button 
                onClick={() => setShowAddForm(true)}
                style={styles.addButton}
              >
                + Add Your First Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#f5f7fa',
    minHeight: '100vh',
  },
  content: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
  },
  pageTitle: {
    color: '#2c3e50',
    fontSize: '28px',
    margin: 0,
  },
  addButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background-color 0.3s',
  },
  form: {
    backgroundColor: 'white',
    padding: '25px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginBottom: '30px',
  },
  formTitle: {
    marginTop: 0,
    color: '#2c3e50',
    fontSize: '20px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#7f8c8d',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  formButtons: {
    display: 'flex',
    gap: '10px',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    flex: 1,
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '12px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    flex: 1,
  },
  drinksContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '20px',
  },
  drinkCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  editCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '15px',
  },
  cardTitle: {
    margin: 0,
    color: '#2c3e50',
    fontSize: '18px',
  },
  cardDate: {
    color: '#7f8c8d',
    fontSize: '14px',
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressBar: {
    height: '10px',
    backgroundColor: '#ecf0f1',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '5px',
  },
  progressFill: {
    height: '100%',
    transition: 'width 0.3s',
  },
  progressText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '15px',
    marginBottom: '20px',
  },
  statItem: {
    textAlign: 'center',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '14px',
    marginBottom: '5px',
  },
  statValue: {
    color: '#2c3e50',
    fontSize: '18px',
    fontWeight: '600',
  },
  cardActions: {
    display: 'flex',
    gap: '10px',
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: 1,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 15px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
    flex: 1,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: '40px',
    borderRadius: '10px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    gridColumn: '1 / -1',
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: '18px',
    marginBottom: '20px',
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#7f8c8d',
  },
  errorContainer: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#e74c3c',
  },
};