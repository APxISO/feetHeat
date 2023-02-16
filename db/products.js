const client = require("./index");

const getProducts = async () => {
  const response = await client.query(`
    SELECT * FROM products;
  `);
  return response.rows;
};

const getProductPrice = async ({ productId }) => {
  try {
    const response = await client.query(
      `
      SELECT price FROM products
      WHERE id = $1;
    `,
      [productId]
    );
    return response.rows[0].price;
  } catch (error) {
    throw error;
  }
};

const getProductById = async ({ productId }) => {
  try {
    const response = await client.query(
      `
      SELECT * FROM products
      WHERE id = $1;
    `,
      [productId]
    );
    return response.rows;
  } catch (error) {
    throw error;
  }
};

const createProduct = async ({ title, description, imgurl, stock, price }) => {
  if (!title || typeof title !== "string") {
    throw new Error("title is required and must be a string");
  }
  if (!description || typeof description !== "string") {
    throw new Error("description is required and must be a string");
  }
  if (!imgurl || typeof imgurl !== "string") {
    throw new Error("imgurl is required and must be a string");
  }
  if (typeof stock !== "number") {
    throw new Error("stock is required and must be a number");
  }
  if (typeof price !== "number") {
    throw new Error("price is required and must be a number");
  }

  try {
    const {
      rows: [product],
    } = await client.query(
      `
      INSERT INTO products (title, description, imgurl, stock, price)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *;
    `,
      [title, description, imgurl, stock, price]
    );
    return product;
  } catch (error) {
    throw error;
  }
};

const updateProduct = async ({
  id,
  title,
  description,
  imgurl,
  stock,
  price,
}) => {
  if (typeof id !== "number") {
    throw new Error("id is required and must be a number");
  }

  try {
    if (title) {
      await client.query(
        `
        UPDATE products
        SET "title" = $1
        WHERE id = $2;
      `,
        [title, id]
      );
    }
    if (description) {
      await client.query(
        `
        UPDATE products
        SET description = $1
        WHERE id = $2;
      `,
        [description, id]
      );
    }
    if (stock) {
      await client.query(
        `
        UPDATE products
        SET stock = $1
        WHERE id = $2;
      `,
        [stock, id]
      );
    }
    if (price) {
      await client.query(
        `
        UPDATE products
        SET price = $1 
        WHERE id = $2;
      `,
        [price, id]
      );
    }
    if (imgurl) {
      await client.query(
        `
        UPDATE products
        SET imgurl = $1
        WHERE id = $2;
      `,
        [imgurl, id]
      );
    }

    const response = await client.query(
      `
      SELECT * FROM products
      WHERE id = $1;
    `,
      [id]
    );

    return response;
  } catch (error) {
    throw error;
  }
};

const destroyProduct = async ({ productId }) => {
  try {
    await client.query(
      `
      DELETE FROM products_categories pc
      WHERE pc."productId" = $1;
    `,
      [productId]
    );

    const response = await client.query(
      `
      DELETE FROM products
      WHERE id = $1
      RETURNING *;
    `,
      [productId]
    );

    return response.rows;
  } catch (err) {
    throw err;
  }
};

// getProductsByCategory();

module.exports = {
  getProducts,
  createProduct,
  getProductById,
  updateProduct,
  destroyProduct,
  getProductPrice,
};
