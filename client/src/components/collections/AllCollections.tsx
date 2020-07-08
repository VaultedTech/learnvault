import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import Collection from './Collection';

type collectionObject = {
  _id: string,
  title: string,
  description: string,
  author: string
};

interface IProps {
  loggedInUser: string;
  userCollections?: boolean;
}

const AllCollections: React.FC<IProps> = ({ loggedInUser, userCollections }) => {
  const [collections, setCollections] = useState<collectionObject[]>([]);
  const { userId } = useParams();

  useEffect(() => {
    // Check if we are trying to get all collections for a specific user
    if (userCollections) {
      fetch(`/api/collections/user/${userId}`)
        .then((res) => res.json())
        .then((result) => {
          setCollections(result);
        });

      return;
    }

    // Otherwise just get all collections
    fetch('/api/collections')
      .then((res) => res.json())
      .then((result) => {
        setCollections(result);
      });
  }, [userId]);

  return (

    <div>

      <h1>{ userCollections ? `${userId}'s Collections` : 'All Collections' }</h1>

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

export default AllCollections;
