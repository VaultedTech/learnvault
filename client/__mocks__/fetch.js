export function fetchUser() {
  return Promise.resolve({
    json: () => Promise.resolve({
      savedcollections: [
      ],
      _id: '5efaa8afe7eaba371d0d08d5',
      user_id: 'auth0|5efa9413a15b7b001361b436',
      __v: 0,
      login: 'jpascas@gmail.com',
    }),

  });
}

export function fetchCollection() {
  return Promise.resolve({
    json: () => Promise.resolve([{
      _id: {
        $oid: '5eee6f98c3431e50d549d80d',
      },
      contributors: [],
      links: [
        'https://redux.js.org/introduction/getting-started',
        'https://redux.js.org/introduction/learning-resources',
        'https://www.valentinog.com/blog/redux/',
        'https://learnredux.com/',
        'https://www.youtube.com/watch?v=CVpUuw9XSjY',
        'https://www.youtube.com/watch?v=poQXNp9ItL4',
      ],
      likes: [],
      tags: [
        'javascript',
        'books',
      ],
      author: 'Rob',
      title: 'Top 10 resources for learning Redux',
      description: 'Redux is hard, understand how to use Redux with these resources',
      hidden: false,
      category: 'javascript',
      text: 'https://redux.js.org/introduction/getting-started, https://redux.js.org/introduction/learning-resources, https://www.valentinog.com/blog/redux/, https://learnredux.com/, https://www.youtube.com/watch?v=CVpUuw9XSjY, https://www.youtube.com/watch?v=poQXNp9ItL4',
      updated: {
        $date: '2020-06-20T20:20:40.560Z',
      },
      __v: 0,
    }]),

  });
}

// export { fetchUser, fetchCollection };
