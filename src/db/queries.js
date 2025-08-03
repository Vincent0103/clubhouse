/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import supabase from "./supabaseClient";

const db = (() => {
  const createUser = async (userData) => {
    const {
      firstName: first_name,
      lastName: last_name,
      username,
      email,
      password: unhashedPassword,
    } = userData;

    const password = await bcrypt.hash(unhashedPassword, 10);

    const { error } = await supabase
      .from("USER")
      .insert({ first_name, last_name, username, email, password });

    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const getUserByUsername = async (username) => {
    const { data, error } = await supabase
      .from("USER")
      .select()
      .eq("username", username);

    if (error) {
      console.error(`Error fetching user by username "${username}":`, error);
      throw error;
    }

    return data[0];
  };

  const getUserById = async (id) => {
    const { data, error } = await supabase.from("USER").select().eq("id", id);

    if (error) {
      console.error(`Error fetching user by id "${id}":`, error);
      throw error;
    }

    return data[0];
  };

  const grantClubMemberUser = async (id) => {
    const { error } = await supabase
      .from("USER")
      .update({ is_member: true })
      .eq("id", id);

    if (error) {
      console.error(
        `Error updating user of id ${id} could not grant them member of the club:`,
        error,
      );
      throw error;
    }
  };

  return { createUser, getUserByUsername, getUserById, grantClubMemberUser };
})();

export default db;
