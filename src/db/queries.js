import supabase from "./supabaseClient";

const db = (() => {
  const createUser = async (userData) => {
    const { error } = await supabase.from("user").insert({ ...userData });
    if (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  return { createUser };
})();

export default db;
