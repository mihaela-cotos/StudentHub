import React, { useState, useEffect } from "react";
import imgStudent from "./images/img_student.png";
import axios from "axios";
const BASE_URL = "http://localhost:3000/api/student"; // ajustează dacă e cazul


export default function StudentPortal() {
  const [page, setPage] = useState("cazare");

  // Date cazare
  const [camine, setCamine] = useState([]);
  const [cereriCazare, setCereriCazare] = useState([]);
  const [selectedCamin, setSelectedCamin] = useState("");
  const [loadingCamine, setLoadingCamine] = useState(false);
  const [loadingCereri, setLoadingCereri] = useState(false);
  const [statusMesaj, setStatusMesaj] = useState(null);
  

    const [cursuri, setCursuri] = useState([]);
    const [orar, setOrar] = useState(null);
    const [note, setNote] = useState([]);
    const [media, setMedia] = useState(null);

// Simulare token - în real, ia din localStorage
const token1 = localStorage.getItem("token");

const api = axios.create({
  baseURL: "http://localhost:3000/api/student",
  headers: {
    Authorization: `Bearer ${token1}`,
  },
});

const fetchCursuri = async () => {
    try {
      const res = await fetch(`${BASE_URL}/cursuri`, {
        credentials: "include", // necesar dacă folosești cookie-uri pentru autentificare
      });
      if (!res.ok) throw new Error("Eroare la încărcarea cursurilor");
      const data = await res.json();
      setCursuri(data); // presupunem că ai `useState([])` pentru cursuri
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchOrar = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orar`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Eroare la încărcarea orarului");
      const data = await res.json();
      setOrar(data); // presupunem că ai `useState({})` pentru orar
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchNote = async () => {
    try {
      const res = await fetch(`${BASE_URL}/note`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Eroare la încărcarea notelor");
      const data = await res.json();
      setNote(data); // presupunem că ai `useState([])` pentru note
    } catch (error) {
      console.error(error);
    }
  };
  

  const fetchMedia = async () => {
    try {
      const res = await fetch(`${BASE_URL}/media`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Eroare la încărcarea mediei");
      const data = await res.json();
      setMedia(data); // presupunem că ai `useState(null)` pentru media
    } catch (error) {
      console.error(error);
    }
  };
  


  // Date adeverinta
  const [adeverintaData, setAdeverintaData] = useState({
    tip: "",
    motiv: "",
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Simulare token - in real, ia din localStorage
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (page === "cazare") {
      fetchCamine();
      fetchCereriCazare();
    }
  }, [page]);

  // Fetch camine disponibile (simulare)
  const fetchCamine = async () => {
    setLoadingCamine(true);
    setStatusMesaj(null);

    try {
      // aici in loc de setTimeout faci axios.get(...) cu token
      await new Promise((r) => setTimeout(r, 1000));
      // date exemplu
      const data = [
        { id: 1, nume: "Camin A", locuriDisponibile: 5 },
        { id: 2, nume: "Camin B", locuriDisponibile: 0 },
        { id: 3, nume: "Camin C", locuriDisponibile: 3 },
      ];
      setCamine(data);
    } catch (err) {
      setStatusMesaj("Eroare la încărcarea căminelor.");
    }
    setLoadingCamine(false);
  };

  // Fetch cereri cazare trimise (simulare)
  const fetchCereriCazare = async () => {
    setLoadingCereri(true);
    setStatusMesaj(null);

    try {
      // axios.get(...) in real
      await new Promise((r) => setTimeout(r, 1000));
      // date exemplu
      const cereri = [
        { id: 101, camin: "Camin A", status: "În așteptare" },
        { id: 102, camin: "Camin C", status: "Confirmată" },
      ];
      setCereriCazare(cereri);
    } catch (err) {
      setStatusMesaj("Eroare la încărcarea cererilor de cazare.");
    }
    setLoadingCereri(false);
  };

  // Adaugă cerere cazare
  const adaugaCerereCazare = async () => {
    if (!selectedCamin) return setStatusMesaj("Selectează un cămin!");

    setStatusMesaj("Se trimite cererea...");

    try {
      // axios.post(...) cu token în realitate
      await new Promise((r) => setTimeout(r, 1000));
      // Simulare răspuns
      const newCerere = {
        id: Math.floor(Math.random() * 1000) + 200,
        camin: camine.find((c) => c.id === parseInt(selectedCamin)).nume,
        status: "În așteptare",
      };
      setCereriCazare([...cereriCazare, newCerere]);
      setSelectedCamin("");
      setStatusMesaj("Cererea a fost trimisă cu succes!");
    } catch (err) {
      setStatusMesaj("Eroare la trimiterea cererii.");
    }
  };

  // Șterge cerere cazare
  const stergeCerereCazare = async (id) => {
    setStatusMesaj("Se șterge cererea...");

    try {
      // axios.delete(...) în realitate
      await new Promise((r) => setTimeout(r, 1000));
      setCereriCazare(cereriCazare.filter((c) => c.id !== id));
      setStatusMesaj("Cererea a fost ștearsă.");
    } catch (err) {
      setStatusMesaj("Eroare la ștergerea cererii.");
    }
  };

  // Manipulare adeverinta
  const handleInputChange = (e) => {
    setAdeverintaData({
      ...adeverintaData,
      [e.target.name]: e.target.value,
    });
  };

  const submitAdeverinta = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/adeverinta`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(adeverintaData),
      });
  
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Eroare la trimiterea cererii");
      setSubmitStatus("Cerere trimisă cu succes!");
    } catch (error) {
      console.error(error);
      setSubmitStatus(`Eroare: ${error.message}`);
    }
  };
  

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to right, #2c3e50, #4ca64c)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Sidebar */}
      <nav
        style={{
          width: 300,
          backgroundColor: "#2c3e50",
          color: "white",
          padding: "30px 20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img
          src={imgStudent}
          alt="Student Logo"
          style={{
            maxWidth: "100%",
            borderRadius: 8,
            marginBottom: 20,
            objectFit: "contain",
          }}
        />
        <h2 style={{ color: "#e07238", marginBottom: 30 }}>
          Student Portal
        </h2>

        <button
          onClick={() => setPage("cazare")}
          style={{
            ...linkStyle,
            backgroundColor: page === "cazare" ? "#34495e" : "transparent",
          }}
        >
          Cazare
        </button>
        <button
          onClick={() => setPage("cursuri")}
          style={{
            ...linkStyle,
            backgroundColor: page === "cursuri" ? "#34495e" : "transparent",
          }}
        >
          Cursuri
        </button>
        <button
          onClick={() => setPage("adeverinta")}
          style={{
            ...linkStyle,
            backgroundColor: page === "adeverinta" ? "#34495e" : "transparent",
          }}
        >
          Cereri Adeverință
        </button>
      </nav>

      {/* Content */}
      <main
        style={{
          flexGrow: 1,
          backgroundColor: "#fff",
          padding: 40,
          display: "flex",
          justifyContent: "center",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            border: "3px solid #154c79",
            borderRadius: 10,
            padding: 30,
            background: "#f9f9f9",
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          {/* Pagina Cazare */}
          {page === "cazare" && (
            <>
              <h1
                style={{
                  color: "#e07238",
                  textAlign: "center",
                  marginBottom: 30,
                }}
              >
                Cazare
              </h1>

              <h3>Cămine disponibile:</h3>
              {loadingCamine ? (
                <p>Se încarcă căminele...</p>
              ) : statusMesaj && !camine.length ? (
                <p style={{ color: "red" }}>{statusMesaj}</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {camine.map((c) => (
                    <li
                      key={c.id}
                      style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {c.nume} — Locuri disponibile:{" "}
                        <strong>{c.locuriDisponibile}</strong>
                      </span>
                      <button
                        disabled={c.locuriDisponibile === 0}
                        onClick={() => setSelectedCamin(c.id.toString())}
                        style={{
                          ...buttonStyle,
                          backgroundColor:
                            selectedCamin === c.id.toString()
                              ? "#b76e1e"
                              : "#e07238",
                          cursor:
                            c.locuriDisponibile === 0
                              ? "not-allowed"
                              : "pointer",
                        }}
                      >
                        Selectează
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              <div
                style={{
                  marginTop: 30,
                  display: "flex",
                  gap: 20,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  disabled={!selectedCamin}
                  onClick={adaugaCerereCazare}
                  style={{
                    ...buttonStyle,
                    flexGrow: 1,
                    maxWidth: 200,
                    opacity: !selectedCamin ? 0.6 : 1,
                    cursor: !selectedCamin ? "not-allowed" : "pointer",
                  }}
                >
                  Trimite cererea de cazare
                </button>

                <button
                  onClick={fetchCereriCazare}
                  style={{
                    ...buttonStyle,
                    backgroundColor: "#154c79",
                    flexGrow: 1,
                    maxWidth: 200,
                  }}
                >
                  Reîncarcă cereri cazare
                </button>
              </div>

              <h3 style={{ marginTop: 40 }}>Cereri de cazare trimise:</h3>
              {loadingCereri ? (
                <p>Se încarcă cererile...</p>
              ) : cereriCazare.length === 0 ? (
                <p>Nu ai cereri de cazare.</p>
              ) : (
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {cereriCazare.map((c) => (
                    <li
                      key={c.id}
                      style={{
                        background: "#fff",
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        padding: 12,
                        marginBottom: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span>
                        {c.camin} — Status:{" "}
                        <strong>{c.status}</strong>
                      </span>
                      <button
                        onClick={() => stergeCerereCazare(c.id)}
                        style={{
                          ...deleteButton,
                          backgroundColor: "#e53935",
                        }}
                      >
                        Șterge
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {statusMesaj && (
                <p
                  style={{
                    marginTop: 15,
                    color: statusMesaj.includes("eroare")
                      ? "red"
                      : "green",
                  }}
                >
                  {statusMesaj}
                </p>
              )}
            </>
          )}

          {/* Pagina Cursuri */}
          {page === "cursuri" && (
  <>
    <h1
      style={{
        color: "#e07238",
        textAlign: "center",
        marginBottom: 30,
      }}
    >
      Cursuri și Note
    </h1>

    <button onClick={fetchCursuri} style={buttonStyle}>
      Încarcă Cursuri
    </button>
    <button onClick={fetchOrar} style={{ ...buttonStyle, marginLeft: 10 }}>
      Încarcă Orar
    </button>
    <button onClick={fetchNote} style={{ ...buttonStyle, marginLeft: 10 }}>
      Încarcă Note
    </button>
    <button onClick={fetchMedia} style={{ ...buttonStyle, marginLeft: 10 }}>
      Afișează Media
    </button>

    {/* Cursuri */}
    {cursuri.length > 0 && (
      <>
        <h3 style={{ marginTop: 20 }}>Cursurile tale:</h3>
        <ul>
          {cursuri.map((c) => (
            <li key={c.curs_id}>
              {c.nume} (Prof.: {c.Facultate?.nume})
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Orar */}
    {orar && (
      <>
        <h3 style={{ marginTop: 20 }}>Orar:</h3>
        {Object.keys(orar).map((zi) => (
          <div key={zi}>
            <strong>{zi.toUpperCase()}:</strong>
            <ul>
              {orar[zi].map((entry) => (
                <li key={entry.id}>
                  {entry.ora} - {entry.curs.nume} ({entry.curs.profesor})
                </li>
              ))}
            </ul>
          </div>
        ))}
      </>
    )}

    {/* Note */}
    {note.length > 0 && (
      <>
        <h3 style={{ marginTop: 20 }}>Note:</h3>
        <ul>
          {note.map((n, index) => (
            <li key={index}>
              {n.Curs?.nume}: {n.valoare} (Prof.: {n.Curs?.profesor})
            </li>
          ))}
        </ul>
      </>
    )}

    {/* Media */}
    {media && (
      <div style={{ marginTop: 20 }}>
        <strong>Media generală:</strong> {media.media} (din {media.numar_note} note)
      </div>
    )}
  </>
)} {/* Pagina Adeverinta */}
          {page === "adeverinta" && (
            <>
              <h1
                style={{
                  color: "#e07238",
                  textAlign: "center",
                  marginBottom: 30,
                }}
              >
                Cerere Adeverință
              </h1>

              <form
                onSubmit={submitAdeverinta}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 15,
                  maxWidth: 600,
                  margin: "0 auto",
                }}
              >
                <select
                  name="tip"
                  value={adeverintaData.tip}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                >
                  <option value="">Selectează tipul adeverinței</option>
                  <option value="student">Adeverință Student</option>
                  <option value="medica">Adeverință Medicală</option>
                  <option value="anulare">Adeverință Anulare</option>
                </select>

                <textarea
                  name="motiv"
                  value={adeverintaData.motiv}
                  onChange={handleInputChange}
                  placeholder="Motivul cererii"
                  rows={5}
                  required
                  style={inputStyle}
                />

                <button type="submit" style={buttonStyle}>
                  Trimite Cererea
                </button>
              </form>
              {submitStatus && (
                <p
                  style={{
                    marginTop: 15,
                    textAlign: "center",
                    color: submitStatus.includes("succes")
                      ? "green"
                      : "red",
                  }}
                >
                  {submitStatus}
                </p>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

const linkStyle = {
  display: "block",
  color: "white",
  padding: "12px 20px",
  fontSize: 18,
  textDecoration: "none",
  fontWeight: "600",
  borderRadius: 8,
  width: "100%",
  textAlign: "center",
  marginBottom: 15,
  cursor: "pointer",
  border: "none",
};

const inputStyle = {
  padding: 12,
  borderRadius: 8,
  border: "1px solid #ccc",
  fontSize: 16,
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  resize: "none",
};

const buttonStyle = {
  backgroundColor: "#e07238",
  color: "white",
  border: "none",
  borderRadius: 8,
  padding: "12px 20px",
  fontSize: 18,
  cursor: "pointer",
  fontWeight: "600",
  transition: "background-color 0.3s ease",
};

const deleteButton = {
  ...buttonStyle,
  padding: "10px 14px",
  fontSize: 14,
  fontWeight: "700",
};
