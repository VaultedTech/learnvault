import React from 'react';

interface IProps {
  loggedInUser: string;
}

const Profile: React.FC<IProps> = ({ loggedInUser }) => {
  console.log('loggedInUser =', loggedInUser);
  let formatUsername = '';

  if (loggedInUser) {
    const userName = loggedInUser.split('@')[0];
    formatUsername = userName[0].toUpperCase() + userName.slice(1);
  } else {
    formatUsername = '';
  }
  return (
    <h1 className="profile">
      Hello
      {' '}
      {formatUsername}
    </h1>
  );
};

export default Profile;
