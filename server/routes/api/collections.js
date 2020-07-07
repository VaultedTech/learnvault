const express = require('express');

const router = express.Router();

const Collection = require('../../models/Collection');
const User = require('../../models/userModel');

/* ================== Collection Schema ==================
  author: {},       // The creator of the collection - references user table
  title: {},        // The title of the collection - string
  description: {},  // The description of the collection - string
  hidden: {},      // Whether the collection is hidden(private) or public - boolean
  contributors: [], // Contributors with edit access - array references users table
  text: {},         // The content of the collection - string
  links: [],        // Links in the collection - array of strings
  likes: [],        // Likes on the collection - array of users - references users table
  category: {},     // Category of the collection - String
  tags: [],         // Tags on a collection - Array of Strings
  updated: {}       // The last date the collection was updated - default date.now when saved
  ========================================================
*/

/*
================== Collection Routes ==================
GET '/api/collections'  - Get all collections in database - sorted by date
POST '/api/collections'  - Create a new collection
GET '/api/collections/:id' - Get a collection by ID
PUT '/api/collections/:id' - Edit or update a collection

// PUT - 'api/collections/save/:id' - Save a collection

DELETE - '/api/collections/:id' - Delete a collection
PUT - 'api/collections/like/:id' - Like a collection
PUT - 'api/collections/unlike/:id' - Unlike a collection
PUT -     'api/collections/links/:id' - Add a link to a collection
DELETE - 'api/collections/links/:id' - Delete a link from a collection
PUT - 'api/collections/category/:id' - Update collection category
PUT - 'api/collections/tags/:id' - Update collection tags
PUT - 'api/collections/contributors/:id' - Update contributors on a collection
=======================================================
*/

/*
Save a collection
Get all public collections for a user
Get all private collections for a logged in user
Get all public collections for a logged in user
Get all saved collections
*/

// Schema reference

/*
author: {},
title: {},
description: {},
hidden: {},
contributors: [],
text: {},
links: [],
likes: [],
category: {},
tags: [],
updated: {}
*/

// GET '/api/collections'  - Get all collections in database - sorted by date
// @route   GET api/collections
// @desc    Get all collections
// @access  Public

router.get('/', async (req, res) => {
  try {
    const collections = await Collection.find({ hidden: 'false' }).sort({
      date: -1,
    });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST '/api/collections'  - Create a new collection
// @route   POST api/collections
// @desc    Create a collection
// @access  Private

router.post(
  '/', // Add validation middleware here
  async (req, res) => {
    try {
      // Check for user here and add code to validate logged in user
      // Get username for user from the database
      // Get the user ID

      const {
        author,
        title,
        description,
        hidden,
        contributors,
        text,
        category,
        tags,
        links,
      } = req.body;

      const collectionDetails = {};

      if (author) collectionDetails.author = author;
      if (title) collectionDetails.title = title;
      if (description) collectionDetails.description = description;
      if (hidden) collectionDetails.hidden = hidden;
      if (category) collectionDetails.category = category;
      if (text) collectionDetails.text = text;

      if (contributors) {
        collectionDetails.contributors = contributors
          .split(',')
          .map((contributor) => contributor.trim());
      }

      if (tags) {
        collectionDetails.tags = tags.split(',').map((tag) => tag.trim());
      }

      if (links) {
        collectionDetails.links = links.split(',').map((link) => link.trim());
      }

      const collection = new Collection(collectionDetails);

      await collection.save();

      res.json(collection);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  },
);

// GET '/api/collections/:id' - Get a collection by ID
// @route   GET api/collections/:id
// @desc    Get a collection by ID
// @access  Private

// router.get('/:id', async (req, res) => {
//   console.log('server/routes/api/collections.js Line 150 req.params =', req.params.id);

//   try {
//     // Get user ID
//     const collection = await Collection.findById(req.params.id);
//     console.log('server/routes/api/collections.js Line 155 collection =', collection);

//     // Check if collection is public or private
//     // If collection is private - check if user has access to view collection

//     if (!collection) {
//       return res.status(404).json({ msg: 'Collection not found' });
//     }

//     return res.json(collection);
//   } catch (err) {
//     console.error('Error in server/routes/api/collections.js Line 166', err.message);
//     if (err.kind === 'ObjectId') {
//       return res.status(404).json({ msg: 'Collection not found' });
//     }
//     return res
//       .status(500)
//       .send(
//         'Server Error or Collection not found due to invalid Collection ID',
//       );
//   }
// });

// PUT '/api/collections/:id' - Edit or update a collection
// @route   PUT api/collections/:id
// @desc    Update a collection by ID
// @access  Private

router.put('/:id', async (req, res) => {
  const {
    title,
    description,
    hidden,
    contributors,
    text,
    category,
    tags,
    links,
  } = req.body;

  const collectionDetails = {};

  if (title) collectionDetails.title = title;
  if (description) collectionDetails.description = description;
  if (hidden) collectionDetails.hidden = hidden;
  if (category) collectionDetails.category = category;
  if (text) collectionDetails.text = text;

  if (contributors) {
    collectionDetails.contributors = contributors
      .split(',')
      .map((contributor) => contributor.trim());
  }

  if (tags) {
    collectionDetails.tags = tags.split(',').map((tag) => tag.trim());
  }

  if (links) {
    collectionDetails.links = links.split(',').map((link) => link.trim());
  }

  try {
    const collection = await Collection.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      collectionDetails,
      { new: true, upsert: false },
    );

    if (!collection) {
      return res.status(404).json({ msg: 'Collection not found' });
    }

    return res.json(collection);
  } catch (err) {
    console.error(err.message);

    return res.status(500).json({ msg: 'Server Error' });
  }
});

// DELETE - '/api/collections/:id' - Delete a collection
// @route   DELETE api/collections/:id
// @desc    Delete a collection by ID
// @access  Private

router.delete('/:id', async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res.status(404).json({ msg: ':/id Collection not found' });
    }

    // TO DO: Check if user is authorized to delete post

    await collection.remove();

    return res.json('Collection Deleted');
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// PUT - 'api/collections/like/:id' - Like a collection
// @route   DELETE api/collections/:id
// @desc    Delete a collection by ID
// @access  Private

router.put('/like/:id', async (req, res) => {
  const collection = await Collection.findById((req.body.collectionId));

  try {
    if (collection.likes.filter((like) => like === req.body.id).length > 0) {
      return res.status(400).json({ msg: 'You have already liked this collection' });
    }

    collection.likes.push(req.body.id);

    await collection.save();

    return res.send(collection.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// PUT - 'api/collections/unlike/:id' - Unlike a collection
// @route   DELETE api/collections/:id
// @desc    Delete a collection by ID
// @access  Private

router.put('/unlike/:id', async (req, res) => {
  const collection = await Collection.findById(req.params.id);

  try {
    if ((collection.likes.filter((like) => like.user === req.user.name)).length === 0) {
      return res.status(400).json({ msg: 'You have not liked this collection' });
    }

    const indexToRemove = collection.likes.map(
      (like) => like.user.toString().indexOf(req.user.name),
    );

    collection.likes.splice(indexToRemove, 1);

    await collection.save();

    return res.send(collection.likes);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// PUT - 'api/collections/save/:id' - Save a collection
// @route   PUT api/collections/:id
// @desc    Save a collection by ID
// @access  Private

router.put('/save/:collectionId', async (req, res) => {
  console.log('current user =', req.user);
  // eslint-disable-next-line no-underscore-dangle
  console.log('req.user.id =', req.user._id);
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findById((req.user._id));
  // eslint-disable-next-line no-underscore-dangle
  console.log('user.id =', user);

  try {
    if (!user.savedcollections) user.savedcollections = [];
    if (user.savedcollections.filter((col) => col === req.params.collectionId).length > 0) {
      return res.status(400).json({ msg: 'You have already saved this collection' });
    }

    user.savedcollections.push(req.params.collectionId);

    await user.save();

    return res.send(user.savedcollections);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// GET - 'api/collections/savedcollections' - Get saved collections
// @route   GET api/collections/savedcollections
// @desc    Get saved collections for logged in user
// @access  Private

router.get('/savedcollections', async (req, res) => {
  // const collection = await Collection.findById((req.body.collectionId));
  // const user = await User.findById((req.params.userId));
  // eslint-disable-next-line no-underscore-dangle
  const user = await User.findById((req.user._id));

  try {
    console.log('server savedCollections Line 357 user =', user);
    if (!user.savedcollections) user.savedcollections = [];
    if (user.savedcollections.length === 0) {
      return res.status(400).json({ msg: 'You have not saved any collections' });
    }

    return res.send(user.savedcollections);
  } catch (err) {
    console.error('Error in saved collections', err.message);
    return res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  const collection = await Collection.findById((req.params.id));
  return res.status(200).json(collection);
});

// PUT -     'api/collections/links/:id' - Add a link to a collection
// @route   DELETE api/collections/:id
// @desc    Delete a collection by ID
// @access  Private

// DELETE - 'api/collections/links/:id' - Delete a link from a collection
// @route   DELETE api/collections/:id
// @desc    Delete a collection by ID
// @access  Private

// PUT - 'api/collections/category/:id' - Update collection category
// @route   PUT api/collections/:id
// @desc    Update collection category
// @access  Private

router.put('/category/:id', async (req, res) => {
  const collection = Collection.findById(req.params.id);

  try {
    collection.category = req.category;

    await collection.save();
    res.send(collection.category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT - 'api/collections/tags/:id' - Update collection tags
// @route   PUT api/collections/:id
// @desc    Update tags on a collection
// @access  Private

router.put('/tags/:id', async (req, res) => {
  const collection = Collection.findById(req.params.id);

  try {
    if ((collection.tags.filter((tag) => tag.toString() === req.tag)).length > 0) {
      return res.status(400).json({ msg: 'Tag already exists on collection' });
    }

    collection.tags.push(req.tag);

    await collection.save();

    return res.send(collection.tags);
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// PUT - 'api/collections/contributors/:id' - Update contributors on a collection
// @route   PUT api/collections/:id
// @desc    Update contributors on a collection
// @access  Private

// GET '/api/collections/user/:userId' - Get a collection by userId
// @route   GET '/api/collections/user/:userId'
// @desc    Get a collection by userI
// @access  Public

router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;

  try {
    const collections = await Collection.find({ author: userId }).sort({ date: -1 });
    res.json(collections);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
