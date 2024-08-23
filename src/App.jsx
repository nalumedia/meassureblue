import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInstagram, faTiktok, faPinterest, faTwitter } from '@fortawesome/free-brands-svg-icons';
import measureLogo from './assets/measure_blue.png';
import './App.css';

// Supabase client setup using environment variables
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

function App() {
  const [species, setSpecies] = useState([]);

  useEffect(() => {
    getSpecies();
  }, []);

  async function getSpecies() {
    try {
      // Fetch species with their associated family common name and ID
      const { data, error } = await supabase
        .from("species")
        .select(`
          common_name, 
          scientific_name, 
          family:family_id (
            id,
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
    <Router>
      <div>
        {/* Header Section */}
        <header className="header">
        <div className="logo-container">
          <Link to="/">
            <img src={measureLogo} className="logo" alt="Measure.blue logo" />
          </Link>
          <h1 className="site-title">Measure.blue</h1>
        </div>
      </header>

        {/* Main Content */}
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home species={species} />} />
            <Route path="/family/:id" element={<Family />} />
          </Routes>
        </main>

        {/* Footer Section */}
        <footer className="footer">
          <div className="social-icons">
            <a href="https://www.instagram.com/measureblue" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faInstagram} size="2x" />
            </a>
            <a href="https://www.tiktok.com/@measureblue" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTiktok} size="2x" />
            </a>
            <a href="https://www.pinterest.com/measureblue" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faPinterest} size="2x" />
            </a>
            <a href="https://www.twitter.com/measureblue" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faTwitter} size="2x" />
            </a>
          </div>
          <p>v 0.1</p>
        </footer>
      </div>
    </Router>
  );
}

function Home({ species }) {
  return (
    <>
      <section id="about">
        <p className="read-the-docs">
          "With the sea you never take liberties. You ask her, you don't tell her. You have to remember always that she's the leader, not you. You and the boat are dancing to her tune" - <em>Michael Morpurgo, Alone Wild at Sea</em>
        </p>
        <p className="homepage">
          Our mission is to make it easy for you to listen to the sea by making ocean health data and resources open and available. We invite you to tune in, to listen, to learn, and to understand our oceans better so that you can make informed decisions that help heal the blue planet.
        </p>
      </section>

      <section id="species">
        <h3>🐟 Species of interest:</h3>
        <ul>
          {species.map((item, index) => (
            <li key={index}>
              {item.family ? item.family.family_common_name : "N/A"} <em>
                (
                  <Link to={`/family/${item.family.id}`}>
                    {item.family ? item.family.family_scientific_name : "N/A"}
                  </Link>
                )
              </em> - {item.common_name} <em>({item.scientific_name})</em>
            </li>
          ))}
        </ul>
      </section>

      <section id="objectives">
        <h3>🎯 Objectives:</h3>
        <ul>
          <li>🟢 In Progress: Aggregate mercury testing data for species of interest in order to understand how pollution, feed, and other factors impact mercury concentration in wild caught and farmed fish so that we can educate fishermen and sea farmers about best practices for providing clean fish for us to eat and the world about the impact pollution is having on global food supply.</li>
        </ul>
      </section>
    </>
  );
}

function Family() {
  const { id } = useParams();
  const [family, setFamily] = useState(null);
  const [species, setSpecies] = useState([]);

  useEffect(() => {
    async function fetchFamilyAndSpecies() {
      console.log("Fetching family data for ID:", id);

      // Fetch family details
      const { data: familyData, error: familyError } = await supabase
        .from('family')
        .select('*')
        .eq('id', id)
        .single();

      if (familyError) {
        console.error("Error fetching family data:", familyError);
        return;
      }

      console.log("Fetched family data:", familyData);
      setFamily(familyData);

      // Fetch species within the family
      const { data: speciesData, error: speciesError } = await supabase
        .from('species')
        .select('common_name, scientific_name')
        .eq('family_id', id);

      if (speciesError) {
        console.error("Error fetching species data:", speciesError);
        return;
      }

      console.log("Fetched species data:", speciesData);
      setSpecies(speciesData);
    }

    fetchFamilyAndSpecies();
  }, [id]);

  return (
    <div>
      {family ? (
        <div>
          <h2>{family.family_common_name} (<em>{family.family_scientific_name}</em>)</h2>
          <p>Description: {family.family_description}</p>

          <h3>Species in this Family:</h3>
          <ul>
            {species.length > 0 ? (
              species.map((item, index) => (
                <li key={index}>
                  {item.common_name} <em>({item.scientific_name})</em>
                </li>
              ))
            ) : (
              <p>No species found in this family.</p>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
