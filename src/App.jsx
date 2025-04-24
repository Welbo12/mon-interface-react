import React, { useState, useEffect } from 'react';
import './index.css';
import ArticleCard from './ArticleCard';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/products';

function App() {
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Récupérer tous les articles au chargement
  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_URL);
      setArticles(response.data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des articles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!titre || !description) return;

    try {
      const response = await axios.post(API_URL, { 
        titre, 
        description 
      });
      
      setArticles([response.data, ...articles]);
      setTitre("");
      setDescription("");
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'article');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      const updated = articles.filter(article => article._id !== id);
      setArticles(updated);
    } catch (err) {
      setError('Erreur lors de la suppression de l\'article');
      console.error(err);
    }
  };

  const filteredArticles = articles.filter(article =>
    article.titre && article.titre.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h1>Mes Articles</h1>

      {error && <div className="error">{error}</div>}

      {/* Formulaire d'ajout */}
      <div className="form">
        <input
          type="text"
          placeholder="Titre de l'article"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleAdd} disabled={loading}> Ajouter</button>
      </div>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder=" Recherche"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search"
      />

      {/* Liste des articles */}
      <div className="articles">
        {loading ? (
          <p>Chargement...</p>
        ) : filteredArticles.length === 0 ? (
          <p>Aucun article trouvé</p>
        ) : (
          filteredArticles.map(article => (
            <ArticleCard
              key={article._id}
              article={article}
              onDelete={() => handleDelete(article._id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default App;
