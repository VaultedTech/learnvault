import React, { useState, useEffect } from 'react';

import Collection from './Collection';

const SavedCollections = ({ loggedInUser, userId }) => {
  console.log('SavedCollections.jsx Line 6 userId =', userId);
  const [collections, setCollections] = useState([]);
  const currentCollections = [];
  if (!loggedInUser) {
    window.history.back();
  }
  useEffect(() => {
    // Get all collections for user
    console.log('SavedCollections.jsx Line 14 loggedInUser =', loggedInUser);

    fetch('/api/collections/savedcollections', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('SavedCollections.jsx Line 24 data =', data);
        if (data.length > 0) {
          data.map((id) => fetch(`/api/collections/${id}`)
            .then((res) => res.json())
            .then((result) => {
              currentCollections.push(result);
            }).then(() => {
              setCollections([...currentCollections]);
            }));
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  return (

    <div>

      <h1>Saved Collections</h1>

      {collections[0] !== undefined
        ? (
          collections.map((collection) => (

            <Collection
              key={collection._id}
              id={collection._id}
              title={collection.title}
              description={collection.description}
              author={collection.author}
              loggedInUser={loggedInUser}
            />

          ))) : <li> Loading...</li>}

    </div>

  );
};

export default SavedCollections;
