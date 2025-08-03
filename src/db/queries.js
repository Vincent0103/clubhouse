/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import supabase from "./supabaseClient";

const db = (() => {
  const createUser = async (userData) => {
    const {
      firstName: first_name,
      lastName: last_name,
      username,
      mail: email,
      pwd: unhashedPassword,
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

  return { createUser };
})();

export default db;
