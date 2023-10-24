import React, { useState } from 'react';
import LoginPage from './LoginPage';
import SignupPage from './SignupPage';
import style from './AuthenticationPage.module.css';

function AuthenticationPage() {
  const [active, setActive] = useState("loginPage")
  const handleChange = () => {
    setActive(active === "loginPage" ? "signupPage" : "loginPage")
  }

  return (
    <div className={style.auth}>
      <div className={style.auth_left}>
        {/* <img
          src="https://newsimg.hankookilbo.com/cms/articlerelease/2021/04/01/57f00c7a-6fb6-49b1-905f-2438e4f7897a.jpg"
          alt="Main Logo"
        /> */}
      </div>
      <div className={style.auth_right}>
        { active === 'loginPage' ? <LoginPage /> : <SignupPage />}
        <div className={style.auth_more}>
          <span>
            { active === 'loginPage' ? (
              <>
                Don't have an account? <button onClick={handleChange}>Sign up</button>
              </>
            ) : (
              <>
                Have an account? <button onClick={handleChange}>Log in</button></>
              )
            }
          </span>
        </div>
      </div>
    </div>
  )
}

export default AuthenticationPage;
