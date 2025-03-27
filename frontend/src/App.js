import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home'
import About from './pages/About'
//import Content from './pages/Content'
import Login from './pages/login'
import Register from './pages/register'
import Water from './pages/water'

//import { useHistory }  from 'react-router-dom';


export default function App() {
  //let history = useHistory();


  //history.push('/profile');

  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route index element = {<Home/>}/>
          <Route path="/home" element= {<Home/>}/>
          <Route path="/login" element= {<Login/>}/>
          <Route path="/register" element= {<Register/>}/>
          <Route path="/water" element= {<Water/>}/>
          <Route path="/about" element= {<About/>}/>
        </Routes>
      
      </BrowserRouter>
     
          

          
    </div>
  );
}
