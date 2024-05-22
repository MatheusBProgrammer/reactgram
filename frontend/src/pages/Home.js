import React, { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
function Home() {
  const { auth } = useAuth();
  useEffect(() => {}, [auth]);
  return (
    <div>
      <button
        onClick={() => {
          localStorage.removeItem("user");
        }}
      >
        Clique
      </button>
    </div>
  );
}

export default Home;
