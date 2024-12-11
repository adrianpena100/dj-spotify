import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateProvider } from "../utils/StateProvider";
import { reducerCases } from "../utils/Constants";
import "../styles/Callback.css";

export default function Callback() {
  const [, dispatch] = useStateProvider();
  const navigate = useNavigate();

  useEffect(() => {
    const hash = window.location.hash;
    let token = null;

    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      token = params.get("access_token");
      if (token) {
        dispatch({ type: reducerCases.SET_TOKEN, token });
        window.localStorage.setItem('spotify_token', token); // Store token in localStorage
        navigate("/"); // Redirect to the main dashboard after setting the token
      } else {
        navigate("/login"); // Redirect to login if token isn't found
      }
    } else {
      navigate("/login"); // Redirect to login if hash isn't present
    }
  }, [dispatch, navigate]);

  return (
    <div className="callback-container">
      <p>Loading...</p>
    </div>
  );
}
