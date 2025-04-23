import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { Button, Typography } from '@mui/material';
import './App.css'
import {BrowserRouter,Routes,Route} from 'react-router-dom'
import Adminlogin from './pages/public/Adminlogin';
import Userlist from './pages/private/admin/Userlist';
import AdminRoute from './routes/AdminRoute';
import BookManagement from './pages/private/admin/BookManagement';
import UserLogin from './pages/public/userLOgin';
import Booklist from './pages/private/user/Booklist';
import userRoute from './routes/userRoute'
import BorrowList from './pages/private/user/Borrowlist';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path='/adminlogin' element={<Adminlogin/>}/>
      <Route path='/' element={<UserLogin/>}/>
      <Route path='/booklist' element={<userRoute><Booklist/></userRoute>}/>

      <Route path='/users' element={<AdminRoute><Userlist/></AdminRoute>}/>
      <Route path='/books' element={<AdminRoute><BookManagement/></AdminRoute>}/>
      <Route path='/borrow-list' element={<AdminRoute><BorrowList/></AdminRoute>}/>



      
     </Routes>
     
    </BrowserRouter>
    </>
  )
}

export default App
