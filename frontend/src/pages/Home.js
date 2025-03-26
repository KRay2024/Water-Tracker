import Header from '../components/Header';
import { useState, useEffect } from 'react';

export default function Home() {
    useEffect(() => {
        // Your useEffect logic here
    }, []);

    return (
        <>
            <Header />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(20vh - 0px)',
                textAlign: 'center',
               
                padding: '20px'
            }}>
                <h2>Home Page</h2>
                <h3>Start Drinking Today!</h3>
            </div>
        </>
    );
}