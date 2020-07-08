import React from 'react';
import { Link } from 'react-router-dom';
import LikeButton from './LikeButton';
import SaveButton from './SaveButton';
import './Collection.css';

interface IProps {
  id: string;
  title: string; 
  description: string; 
  author: string; 
  loggedInUser: string;
}

const Collection: React.FC<IProps> = ({
  id, 
  title, 
  description, 
  author, 
  loggedInUser
}) => (
  <div key={id} className="collection">
    <h1 className="collection__title">
      {title}
    </h1>
    <h3>
      {description}
    </h3>

    <div className="creator">
      <div className="creator__label">Creator:</div>
      <div className="creator__author">{author}</div>
    </div>
    <div>
      <Link to={`/collections/${id}`} className="collection__button">View Collection</Link>
    </div>
    {loggedInUser ? (
      <div>
        <br />
        <LikeButton loggedInUser={loggedInUser} id={id} />
        <SaveButton loggedInUser={loggedInUser} id={id} />
      </div>
    ) : (
      <div>
        <br />
        <Link to="/register">Register</Link>
          &nbsp;or&nbsp;
        <Link to="/login">Login</Link>
          &nbsp;to save this collection
      </div>
    )}
  </div>

);

export default Collection;
