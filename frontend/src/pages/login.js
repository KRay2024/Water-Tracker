import Header from '../components/Header'
import { useState, useEffect } from 'react';



export default function Login() {

  return (
    
    <div>
      <Header/>
      <h2>Login</h2>
      <form>
        
        <input type="text" placeholder="Username" />
        <input type="password" placeholder="Password" />
        <button type="submit" className="button-63">Login</button>
      </form>
    </div>
  );
}
