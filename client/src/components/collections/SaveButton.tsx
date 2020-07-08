import React from 'react';

interface IProps {
  id: string;
  loggedInUser: string;
}

const SaveButton: React.FC<IProps> = ({ id, loggedInUser }) => {
  function likeButtonClick(eventId: string, userId: string) {
    const payload = { id: userId, collectionId: id };

    fetch(`/api/collections/save/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  return (
    <button onClick={() => likeButtonClick(id, loggedInUser)} type="button" className="button-like">
      <i className="far fa-star" />
    &nbsp; Save Collection
    </button>
  );
};

export default SaveButton;
