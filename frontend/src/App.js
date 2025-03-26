import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [drinkingRecords, setDrinkingRecords] = useState([]);
  const [newUser, setNewUser] = useState({ name: "", email: "" });
  const [newDrink, setNewDrink] = useState({ user_id: "", oz_goal: "", oz_consumed: "" });
  const [editingRecord, setEditingRecord] = useState(null); 

  useEffect(() => {
    fetchUsers();
    fetchDrinks();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://172.0.0.1:8000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDrinks = async () => {
    try {
      const response = await axios.get("http://172.0.0.1:8000/drinking/");
      setDrinkingRecords(response.data);
    } catch (error) {
      console.error("Error fetching drinking records:", error);
    }
  };

  const addUser = async () => {
    try {
      await axios.post("http://172.0.0.1:8000/users/", newUser);
      fetchUsers();
      setNewUser({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    }
  };

  const addDrink = async () => {
    try {
      await axios.post("http://172.0.0.1:8000/drinking/", {
        ...newDrink,
        oz_remaining: newDrink.oz_goal - newDrink.oz_consumed,
        date: new Date().toISOString().split("T")[0], 
      });
      fetchDrinks();
      setNewDrink({ user_id: "", oz_goal: "", oz_consumed: "" });
    } catch (error) {
      console.error("Error adding drink:", error);
    }
  };

  const startEditing = (record) => {
    setEditingRecord(record);
    setNewDrink({
      user_id: record.user_id,
      oz_goal: record.oz_goal,
      oz_consumed: record.oz_consumed,
    });
  };

  const updateDrink = async () => {
    try {
      if (!editingRecord) return;
      const { id, user_id } = editingRecord;

      await axios.put(`http://172.0.0.1:8000/drinking/${user_id}/${id}`, {
        ...newDrink,
        oz_remaining: newDrink.oz_goal - newDrink.oz_consumed,
        date: new Date().toISOString().split("T")[0],
      });

      fetchDrinks();
      setEditingRecord(null);
      setNewDrink({ user_id: "", oz_goal: "", oz_consumed: "" });
    } catch (error) {
      console.error("Error updating drink record:", error);
    }
  };

  return (
    <div>
      <h1>Hydration Tracker</h1>

      <h2>Add User</h2>
      <input
        type="text"
        placeholder="Name"
        value={newUser.name}
        onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
      />
      <button onClick={addUser}>Add User</button>

      <h2>{editingRecord ? "Update Water Intake" : "Log Water Intake"}</h2>
      <input
        type="number"
        placeholder="User ID"
        value={newDrink.user_id}
        onChange={(e) => setNewDrink({ ...newDrink, user_id: e.target.value })}
        disabled={editingRecord} 
      />
      <input
        type="number"
        placeholder="Goal (oz)"
        value={newDrink.oz_goal}
        onChange={(e) => setNewDrink({ ...newDrink, oz_goal: e.target.value })}
      />
      <input
        type="number"
        placeholder="Consumed (oz)"
        value={newDrink.oz_consumed}
        onChange={(e) => setNewDrink({ ...newDrink, oz_consumed: e.target.value })}
      />
      {editingRecord ? (
        <button onClick={updateDrink}>Update Record</button>
      ) : (
        <button onClick={addDrink}>Log Water Intake</button>
      )}

      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} ({user.email})
          </li>
        ))}
      </ul>

      <h2>Water Intake Records</h2>
      <ul>
        {drinkingRecords.map((record) => (
          <li key={record.id}>
            User {record.user_id} - Goal: {record.oz_goal} oz, Consumed: {record.oz_consumed} oz, Remaining: {record.oz_remaining} oz
            <button onClick={() => startEditing(record)}>Edit</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;


