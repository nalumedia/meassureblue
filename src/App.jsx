import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import reactLogo from './assets/react.svg';
import measureLogo from './assets/measure_blue.png';
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
          family:family_id (
            family_common_name,
            family_scientific_name
          )
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
          <img src={measureLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Measure.blue</h1>
      <p className="read-the-docs">
        "With the sea you never take liberties. You ask her, you don't tell her. You have to remember always that she's the leader, not you. You and the boat are dancing to her tune" - <em>Michael Morpurgo, Alone Wild at Sea</em>
      </p>
      <p className="homepage">
        Our mission is to make it easy for you to listen to the sea by making ocean health data and resources open and available. We invite you to tune in, to listen, to learn, and to understand our oceans better so that you can make informed decisions that help heal the blue planet.
      </p>
      <h3>🐟 Species of interest:</h3>
      <ul>
        {species.map((item, index) => (
          <li key={index}>
            {item.family ? item.family.family_common_name : "N/A"} <em>({item.family ? item.family.family_scientific_name : "N/A"}) </em>- {item.common_name} <em>({item.scientific_name})</em>
          </li>
        ))}
      </ul>
      <h3>🎯 Objectives:</h3>
      <ul>
        <li>🟢 In Progress: Aggregate mercury testing data for species of interest in order to understand how pollution, feed, and other factors impact mercury concentration in wild caught and farmed fish so that we can educate fishermen and sea farmers about best practices for providing clean fish for us to eat and the world about the impact pollution is having on globalfood supply.</li>
        </ul>

      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div> */}
    
    </>
  );
}

export default App;
