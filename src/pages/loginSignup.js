import React, { useState } from "react";

function LoginSignup({ onLogin, onSignup, onSocialAuth }) {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      if (isLogin) {
        onLogin({ email, password });
      } else if (name) {
        onSignup({ name, email, password });
      } else {
        alert("Please fill in all fields.");
      }
    } else {
      alert("Please fill in all fields.");
    }
  };

  const handleSocialAuth = (provider) => {
    // Call the social auth handler with provider name
    onSocialAuth(provider);
  };

  return (
    <div className="login-signup">
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={!isLogin}
            />
          </div>
        )}
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">{isLogin ? "Login" : "Signup"}</button>
      </form>

      <div className="social-auth">
        <p>Or sign up using:</p>
        <button onClick={() => handleSocialAuth("Google")}>Sign up with Google</button>
        <button onClick={() => handleSocialAuth("Apple")}>Sign up with Apple</button>
      </div>

      <p>
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "Signup" : "Login"}
        </button>
      </p>
    </div>
  );
}

export default LoginSignup;