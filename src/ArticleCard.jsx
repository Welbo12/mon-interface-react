import React from 'react';
import './index.css';

function ArticleCard({ article, onDelete }) {
  return (
    <div className="card">
      <h3>{article.titre}</h3>
      <p>{article.description}</p>
      <button className="delete" onClick={onDelete}> Supprimer</button>
    </div>
  );
}

export default ArticleCard;
