import {
  createPost,
  createUser,
  getAllPosts,
  getAllUsers,
  getUserById,
  handleSupabaseError,
  searchPosts,
  signInUser,
  signUpUser,
  subscribeToPosts,
} from "../db/queries.js";

// ===== EXAMPLE USAGE =====

// Example 1: User Management
export const userExamples = async () => {
  try {
    // Create a new user
    const newUser = await createUser({
      name: "John Doe",
      email: "john@example.com",
      age: 30,
    });
    console.log("Created user:", newUser);

    // Get all users
    const users = await getAllUsers();
    console.log("All users:", users);

    // Get specific user
    const user = await getUserById(newUser.id);
    console.log("User details:", user);
  } catch (error) {
    console.error("User operation failed:", handleSupabaseError(error));
  }
};

// Example 2: Post Management
export const postExamples = async () => {
  try {
    // Create a new post
    const newPost = await createPost({
      title: "My First Post",
      content: "This is the content of my first post",
      user_id: "some-user-id", // Replace with actual user ID
    });
    console.log("Created post:", newPost);

    // Get all posts with user information
    const posts = await getAllPosts();
    console.log("All posts:", posts);
  } catch (error) {
    console.error("Post operation failed:", handleSupabaseError(error));
  }
};

// Example 3: Authentication
export const authExamples = async () => {
  try {
    // Sign up a new user
    const signUpResult = await signUpUser(
      "newuser@example.com",
      "password123",
      { name: "New User" }
    );
    console.log("Sign up result:", signUpResult);

    // Sign in user
    const signInResult = await signInUser("newuser@example.com", "password123");
    console.log("Sign in result:", signInResult);
  } catch (error) {
    console.error("Auth operation failed:", handleSupabaseError(error));
  }
};

// Example 4: Search and Pagination
export const searchExamples = async () => {
  try {
    // Search posts
    const searchResults = await searchPosts("first");
    console.log("Search results:", searchResults);
  } catch (error) {
    console.error("Search operation failed:", handleSupabaseError(error));
  }
};

// Example 5: Real-time subscriptions
export const realtimeExamples = () => {
  // Subscribe to new posts
  const subscription = subscribeToPosts((payload) => {
    console.log("New post created:", payload.new);
  });

  // Later, unsubscribe when needed
  // subscription.unsubscribe();
};

// Example 6: Express.js route handlers
export const expressRouteExamples = {
  // GET /api/users
  getUsers: async (req, res) => {
    try {
      const users = await getAllUsers();
      res.json(users);
    } catch (error) {
      const { error: errorMessage } = handleSupabaseError(error);
      res.status(500).json({ error: errorMessage });
    }
  },

  // POST /api/users
  createUser: async (req, res) => {
    try {
      const user = await createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      const { error: errorMessage } = handleSupabaseError(error);
      res.status(400).json({ error: errorMessage });
    }
  },

  // GET /api/posts
  getPosts: async (req, res) => {
    try {
      const posts = await getAllPosts();
      res.json(posts);
    } catch (error) {
      const { error: errorMessage } = handleSupabaseError(error);
      res.status(500).json({ error: errorMessage });
    }
  },
};

// Example 7: React component usage
export const reactComponentExample = `
import { useState, useEffect } from 'react';
import { getAllPosts, createPost } from '../db/queries.js';

function PostsComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const postsData = await getAllPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (postData) => {
    try {
      const newPost = await createPost(postData);
      setPosts(prev => [newPost, ...prev]);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
`;
