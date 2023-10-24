import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import styles from './LoginPage.module.css';
import {onUpdateData} from '../../app/userSlice';


function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // navigate("/mainpage"),

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password).then(
      dispatch(
        onUpdateData({
          email: email,
          isLogin: true,
        })
      ),
    ).catch(() => {
      alert("not match password");
      dispatch(
        onUpdateData({
          email: 'None',
          isLogin: false,
        })
      )
    });
    email !== 'None' ? navigate("/mainpage") : navigate("/");
  };

  return (
    <div className={styles.loginPage}>
      <img
        src="https://www.seekpng.com/png/detail/321-3211332_facebook-black-facebook-logo-on-black.png"
        alt="Deepsafe Logo"
      />
      <input
        type="email"
        placeholder='Email'
        onChange={e => setEmail(e.target.value)}
        value={email? email : ''}
      />
      <input
        type="password"
        placeholder='Password'
        onChange={e => setPassword(e.target.value)}
        value={password? password : ''}
      />
      <button onClick={handleLogin}>Log in</button>
    </div>
  )
}

export default LoginPage;
