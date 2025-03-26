import Header from '../components/Header'
import { useState, useEffect } from 'react';


export default function Home() {

    useEffect(() => {
        localStorage.setItem('userid', 1);
        

      }, []);


    return(
        <>
            <Header/>
                <h2>
                    Home Page

                </h2>
        
        </>

    )

}