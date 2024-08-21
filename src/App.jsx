import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// Supabase client setup using environment variables
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [species, setSpecies] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getSpecies();
  }, []);

  async function getSpecies() {
    try {
      // Fetch species with their associated family common name
      const { data, error } = await supabase
        .from("species")
        .select(`
          common_name, 
          scientific_name, 
          family:family_id (family_common_name)
        `);

      if (error) {
        console.error("Error fetching species:", error);
        return;
      }

      console.log("Fetched species data:", data);
      setSpecies(data);
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Measure.blue</h1>
      <h3>Data from the sea</h3>
      <ul>
        {species.map((item, index) => (
          <li key={index}>
            {item.common_name} ({item.scientific_name}), Family: {item.family ? item.family.family_common_name : "N/A"}
          </li>
        ))}
      </ul>
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}
      <p className="read-the-docs">
        "With the sea you never take liberties. You ask her, you don't tell her. You have to remeber always that she's the leader, not you. You and the boat are dancing to her tune" - Michael Morpurgo, Alone Wild at Sea
      </p>
    </>
  );
}

export default App;
