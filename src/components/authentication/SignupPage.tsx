import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './SignupPage.module.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import {auth} from "../firebase";
import { onUpdateData } from 'renderer/app/userSlice';
import { useDispatch } from 'react-redux';


function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    createUserWithEmailAndPassword(auth, email, password).then(
      signInWithEmailAndPassword(auth, email, password).then(
        dispatch(
          onUpdateData({
            email: email,
            isLogin: true,
          })
        ),
      )
    ).catch(err => {
      alert(err);
      dispatch(
        onUpdateData({
          email: 'None',
          isLogin: false,
        })
      )}
    );
    email !== 'None' ? navigate("/mainpage") : navigate("/");
  };

  return (
    <div className={styles.signup}>
      <img
        src="https://www.seekpng.com/png/detail/321-3211332_facebook-black-facebook-logo-on-black.png"
        alt="Deepsage logo"
      />
      <input
        type="email"
        placeholder='Email'
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <input
        type="password"
        placeholder='Password'
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button onClick={handleSignup}>Sign up</button>
    </div>
  )

}

export default Signup
