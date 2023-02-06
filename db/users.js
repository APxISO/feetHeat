const bcrypt = require("bcrypt");
const client = require("./index");

const createUser = async ({ username, password, isAdmin = false }) => {
  try {
    const hashPassword = await bcrypt.hash(password, 10);

    const response = await client.query(
      `
        INSERT INTO users (username, password, "isAdmin") VALUES ($1, $2, $3)
        RETURNING *;
        `,
      [username, hashPassword, isAdmin]
    );

    delete response.rows[0].password;

    return response.rows[0];
  } catch (err) {
    if (err.code === "23505") {
      throw { name: "signupError", message: "User already exists" };
    } else {
      throw err;
    }
  }
};

const getUserById = async (userId) => {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
        SELECT id, username, "isAdmin"
        FROM users
        WHERE id = $1
      `,
      [userId]
    );
    return user;
  } catch (error) {
    throw error;
  }
};

const getUser = async ({ username, password }) => {
  try {
    const user = await client.query(
      `
        SELECT * FROM users
        WHERE username = $1;
    `,
      [username]
    );
    if (!user.rows.length) {
      return { name: "noUser", message: "User does not exists" };
    } else {
      const hashPassword = user.rows[0].password;
      const passwordsMatch = await bcrypt.compare(password, hashPassword);
      if (passwordsMatch) {
        delete user.rows[0].password;
        return user.rows[0];
      } else {
        return { name: "loginError", message: "Incorrect credentials" };
      }
    }
  } catch (error) {
    throw error;
  }
};

const getUserByUsername = async (username) => {
  try {
    const user = await client.query(`SELECT * FROM users WHERE username = $1`, [
      username,
    ]);

    return user.rows[0];
  } catch (error) {
    throw error;
  }
};

const getallUsers = async () => {
  try {
    const user = await client.query(`SELECT id,username FROM users;`);

    return user.rows;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUsername,
  getallUsers,
};
