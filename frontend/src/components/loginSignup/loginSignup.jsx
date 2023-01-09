import React, { useState, useEffect } from "react";
import "./loginSignup.css";
import axios from "axios";
import Home from "../home/home";

const LoginSignup = () => {
  const [auth, setAuth] = useState(false);
  const [login, setLogin] = useState(true);
  const [values, setValues] = useState({
    title: "",
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setValues({
      ...values,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    if (login) {
      doLogin();
    } else {
      doRegister();
    }
  };

  const doLogin = async () => {
    try {
      let login = await axios.post(`http://localhost:3001/login`, values);
      if (login.status === 200) {
        localStorage.setItem("jwtoken", JSON.stringify(login.data.token.token));
        setAuth(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const doRegister = async () => {
    try {
      let register = await axios.post(`http://localhost:3001/register`, values);
      if (register.status === 201) {
        setLogin(true);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoginSignup = (event) => {
    event.preventDefault();
    login ? setLogin(false) : setLogin(true);
  };

  useEffect(() => {
    let token = localStorage.getItem("jwtoken");
    if (token) {
      setAuth(true);
    }
  }, []);

  if (auth) {
    return <Home setAuth={setAuth} />;
  } else {
    if (login) {
      return (
        <>
          <div className="loginPageCover">
            <div className="background">
              <div className="shape"></div>
              <div className="shape"></div>
            </div>

            <form className="userform">
              <h3>Login</h3>
              <label className="loginLabel">Email</label>
              <input
                className="userInput"
                type="email"
                placeholder="Email"
                id="email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />

              <label className="loginLabel">Password</label>
              <input
                className="userInput"
                type="password"
                placeholder="Password"
                id="password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <div className="buttoncover">
                <button
                  className="buttonStyle_1"
                  onClick={(event) => handleFormSubmit(event)}
                >
                  Submit
                </button>
                <button
                  className="buttonStyle"
                  onClick={(event) => handleLoginSignup(event)}
                >
                  Sign Up ?
                </button>
              </div>
            </form>
          </div>
        </>
      );
    }
    return (
      <>
        <div className="loginPageCover">
          <div className="background">
            <div className="shape"></div>
            <div className="shape"></div>
          </div>

          <form className="userform">
            <h3>Sign Up</h3>
            <label className="loginLabel">Title</label>
            <input
              className="userInput"
              type="text"
              placeholder="Mr / Mrs / Miss"
              id="title"
              name="title"
              value={values.title}
              onChange={handleChange}
            />

            <label className="loginLabel">Name</label>
            <input
              className="userInput"
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              value={values.name}
              onChange={handleChange}
            />

            <label className="loginLabel">Phone</label>
            <input
              className="userInput"
              type="phone"
              placeholder="Phone"
              id="phone"
              name="phone"
              value={values.phone}
              onChange={handleChange}
            />

            <label className="loginLabel">Email</label>
            <input
              className="userInput"
              type="email"
              placeholder="Email"
              id="email"
              name="email"
              value={values.email}
              onChange={handleChange}
            />

            <label className="loginLabel">Password</label>
            <input
              className="userInput"
              type="password"
              placeholder="Password"
              id="password"
              name="password"
              value={values.password}
              onChange={handleChange}
            />

            <div className="buttoncover">
              <button
                className="buttonStyle_1"
                onClick={(event) => handleFormSubmit(event)}
              >
                Submit
              </button>
              <button
                className="buttonStyle"
                onClick={(event) => handleLoginSignup(event)}
              >
                Login ?
              </button>
            </div>
          </form>
        </div>
      </>
    );
  }
};

export default LoginSignup;

// rafce
