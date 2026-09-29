import { useState } from 'react'
import Login from './login_page/login.jsx'
import MainPage from './chatPage/mainpage.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [userId, setUserId] = useState('') 

  return (
    <>
      {isLoggedIn ? <MainPage username={username} userId={userId} /> : <Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setUserId={setUserId} />}
    </>
  )
}

export default App
