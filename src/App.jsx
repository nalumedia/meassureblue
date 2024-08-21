import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

// Supabase client setup
// const supabase = createClient("https://webgwzfcvgcepjsdxmva.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYmd3emZjdmdjZXBqc2R4bXZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQxOTE1NDIsImV4cCI6MjAzOTc2NzU0Mn0.Jkqhq3ltrOJghRvR59rtb9VHf9P3aDpm91RvYrMOV1g");
// Supabase client setup using environment variables
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);


function App() {
  const [species, setSpecies] = useState([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getSpecies();
  }, []);

  async function getSpecies() {
    const { data } = await supabase.from("species").select();
    setSpecies(data);
  }

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Measure.blue</h1>
      <ul>
        {species.map((item) => (
          <li key={item.id}>{item.common_name} ({item.scientific_name}) </li>
        ))}
      </ul>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
   
    </>
  );
}

export default App;
