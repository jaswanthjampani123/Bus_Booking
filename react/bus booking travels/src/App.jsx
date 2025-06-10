import React, { useState } from 'react'
import {Routes, Route} from 'react-router-dom'
// import RegisterForm from './Components/RegisterForm'
// import LoginForm from './Components/LoginForm'
// import BusList from './Components/BusList'
// import BusSeats from './Components/BusSeats'
// import UserBookings from './Components/UserBookings'
import Wrapper from './DeepComponents/Wrapper'
import RegisterForm from './DeepComponents/RegisterForm'
import LoginForm from './DeepComponents/LoginForm.JSX'
import BusList from './DeepComponents/BusList'
import BusSeats from './DeepComponents/BusSeats'
import UserBookings from './DeepComponents/UserBookings'
import PaymentPage from './DeepComponents/PaymentPage'
import PaymentError from './DeepComponents/PaymentError'


const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [userId, setUserId] = useState(localStorage.getItem('userId'))

  const handleLogin = (token, userId)=>{
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    setToken(token)
    setUserId(userId)
  }
  const handleLogout = ()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    setToken(null)
    setUserId(null)
    // setSelectedBusId(null)
  }
  return (
    <div>
      <Wrapper handleLogout = {handleLogout} token ={token} userId={userId}>
      <Routes>
        <Route path = '/' element={<BusList/>} />
        {/* <Route path='/register' element={<RegisterForm/>}/> */}
        {/* <Route path='/login' element={<LoginForm onLogin = {handleLogin}/>}/> */}
         <Route path='/register' element={<RegisterForm/>}/>
          <Route path='/login' element={<LoginForm onLogin = {handleLogin}/>}/>
        <Route path='/bus/:busId' element={<BusSeats token={token}/>}/>
        <Route path='/my-bookings' element={<UserBookings token={token} userId={userId}/>} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment-error" element={<PaymentError />} />
      </Routes>
      </Wrapper>
    </div>
  )
}

export default App
