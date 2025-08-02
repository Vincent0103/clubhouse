import supabase from "./supabaseClient";

// ===== USER QUERIES =====

// Get all users
export const getAllUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");

  if (error) throw error;
  return data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) throw error;
  return data;
};

// Create new user
export const createUser = async (userData) => {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select();

  if (error) throw error;
  return data[0];
};

// Update user
export const updateUser = async (userId, updates) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", userId)
    .select();

  if (error) throw error;
  return data[0];
};

// Delete user
export const deleteUser = async (userId) => {
  const { error } = await supabase.from("users").delete().eq("id", userId);

  if (error) throw error;
  return true;
};
