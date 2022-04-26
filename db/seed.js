require("dotenv").config();
const client = require("./");
const { createUser, getUser, getUserById, getUserByEmail } = require("./users");
const { createProduct, getProducts, getProductById } = require("./products");
const {
  getAllCategories,
  createCategory,
  updateCategory,
} = require("./categories");
const { createOrder } = require("./orders");

const seedDB = async () => {
  await dropTables();
  await createTables();
  await createInitialUsers();
  await createInitialProducts();
  await createInitialCategories();
  await createInitialOrders();
};

const dropTables = async () => {
  console.log("Starting to drop tables");
  await client.query(`
  
    DROP TABLE IF EXISTS products_categories;
    DROP TABLE IF EXISTS order_items;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS categories;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS users;

  `);
  console.log("Tables dropped...");
};

const createTables = async () => {
  console.log("Starting to create tables");
  await client.query(`

    CREATE TABLE users(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      "isAdmin" boolean DEFAULT false
    );

    CREATE TABLE products(
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) UNIQUE NOT NULL,
      description TEXT NOT NULL,
      imgurl TEXT NOT NULL,
      stock INTEGER NOT NULL,
      price INTEGER NOT NULL
    );

    CREATE TABLE categories(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL
    );

    CREATE TABLE products_categories(
      id SERIAL PRIMARY KEY,
      "productId" INTEGER REFERENCES products(id),
      "categoryId" INTEGER REFERENCES categories(id)
    );

    CREATE TABLE orders(
      id SERIAL PRIMARY KEY,
      "creatorId" INTEGER REFERENCES users(id),
      "isPurchased" BOOLEAN DEFAULT false
    );

    CREATE TABLE order_items(
      id SERIAL PRIMARY KEY,
      "orderId" INTEGER REFERENCES orders(id),
      "productId" INTEGER REFERENCES products(id),
      UNIQUE ("productId", "orderId"),
      price INTEGER NOT NULL,
      quantity INTEGER NOT NULL
    );
  `);

  console.log("Tables created...");
};

async function createInitialUsers() {
  console.log("Starting to create users...");
  try {
    const usersToCreate = [
      { email: "admin@gmail.com", password: "admin1234", isAdmin: true },
      { email: "albert@gmail.com", password: "bertie99" },
      { email: "sandra@gmail.com", password: "sandra123" },
      { email: "glamgal@hotmail.com", password: "glamgal123" },
    ];
    const users = await Promise.all(usersToCreate.map(createUser));

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function createInitialProducts() {
  console.log("Starting to add products...");
  try {
    const productsToAdd = [
      {
        title: "NIKE AIR JORDAN 4 RETRO",
        description:
          "The Air Jordan IV was MJ's first signature model to take flight. Complete with never before seen “Wings” acting as lace locks and an unforgettable color scheme, the silhouette now returns in its truest form. Nodding to its 1989 debut, the new Air Jordan IV features iconic Nike Air branding on both the heel and outsole.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/020/806/444/original/507844_00.png.png",
        stock: 25,
        price: 250,
      },
      {
        title: "PUMA SUEDE CLASSIC XXI",
        description:
          "The Suede hit the scene in 1968 and has been changing the game ever since. It's been worn by the icons of every generation and it's",
        imgurl:
          "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y",
        stock: 100,
        price: 75,
      },
      {
        title: "VANS SK8-HI",
        description:
          "The Sk8-Hi was introduced in 1978 as Style 38, and showcased the now-iconic Vans Sidestripe on a new, innovative high top silhouette. As only the second model featuring the recognizable marker formerly known as the “jazz stripe,” the Sk8-Hi brought a whole new look to the Vans family.  Honoring that first legendary high top, the Sk8-Hi is made with sturdy suede and canvas uppers in a variety of classic and unexpected colorways. This lace-up shoe also includes re-enforced toe caps, supportive padded collars, and signature rubber waffle outsoles.",
        imgurl:
          "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y",
        stock: 150,
        price: 80,
      },
      {
        title: "TIMBERLAND® PREMIUM 6-INCH WATERPROOF BOOTS",
        description:
          "Inspired by our original waterproof boot, this all-season style gives you tireless waterproof performance and instantly recognizable work-boot styling. Other essential features include 400 grams of warm, down-free PrimaLoft® insulation, a padded collar for a comfortable fit around the ankle, a rubber lug outsole for traction, and materials sourced with respect for the planet.",
        imgurl:
          "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y",
        stock: 55,
        price: 200,
      },
      {
        title: "Yeezy Boost 700",
        description:
          "The 5th Yeezy to drop since November 2017 — Yeezy Boost 350 V2 &#39;Semi Frozen Yellow&#39; and ‘Beluga 2.0,’ Yeezy Powerphase Calabasas, and the Yeezy 500 ‘Desert Rat’ — the Yeezy Boost 350 V2 &#39;Blue Tint&#39; was dropped on December 16th, 2017. The sneaker features a neutral white and grey upper with a red ‘SPLY-350’ text on the side in reverse. The shoe also comes with a heel tab, blue tint inner lining, and paste blue laces.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/021/147/972/original/504187_00.png.png",
        stock: 47,
        price: 135,
      },
      {
        title: "Pharrell x Billionaire Boys Club x NMD Human Race Trail",
        description:
          "From pistol squats to burpees, there's no shortage of moves to take your workout to the next level. Reach for these men's Reebok shoes to stay confident in or out of the gym. They have a Flexweave® woven upper that's breathable and durable, with integrated support for stable movement in every direction. The rubber outsole with a strategic lug pattern gives you secure traction.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/021/545/467/original/512006_00.png.png",
        stock: 21,
        price: 200,
      },
      {
        title: "Yeezy Boost 350 V2 'Zebra'",
        description:
          "Released on February 25, 2017, the Yeezy Boost 350 V2 ‘Zebra’ combines a white/core black Primeknit upper with red SPLY 350 branding and a translucent white midsole housing full-length Boost. Sold exclusively at adidas.com, Yeezy Supply, and select adidas flagship stores, the ‘Zebra’ sold out instantly but was restocked on June 24th, 2017. Another restock of the ‘Zebra’ arrived November 16, 2018, with more pairs hitting the marketplace and delivering on Kanye’s promise of Yeezy’s being more accessible to anyone that wanted them",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/014/979/033/original/105568_00.png.png",
        stock: 47,
        price: 135,
      },
      {
        title: "CONVERSE CHUCK TAYLOR ALLSTARS HI",
        description:
          "You need a style to rely on. The Chuck Taylor All-Star is a staple: the high-top and low-top silhouettes stay simply classic, while the white laces and star ankle patch give a nod to the legacy of the Chuck. This is the go-with-everything go-to that you won’t get sick of going to. Stock up.",
        imgurl:
          "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y",
        stock: 150,
        price: 75,
      },
      {
        title: "SPEEDO SURF KNIT PRO",
        description:
          "Step into the water sporting the aquatic Speedo® Surf Knit Pro slip-on water shoes.Surf Knit upper engineered for ultimate support and breathability.Pull tabs in front and back allows easy on and off.Hydrophobic rubber EVA insole. STRAC outsole is designed to disperse water and provide improved performance and traction.",
        imgurl:
          "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y",
        stock: 25,
        price: 75,
      },
      {
        title: "REEBOK NANO X2 TRAINING SHOES",
        description:
          "From pistol squats to burpees, there's no shortage of moves to take your workout to the next level. Reach for these men's Reebok shoes to stay confident in or out of the gym. They have a Flexweave® woven upper that's breathable and durable, with integrated support for stable movement in every direction. The rubber outsole with a strategic lug pattern gives you secure traction.",
        imgurl:
          "https://i.picsum.photos/id/1025/4951/3301.jpg?hmac=_aGh5AtoOChip_iaMo8ZvvytfEojcgqbCH7dzaz-H8Y",
        stock: 47,
        price: 135,
      },

      {
        title: "Air Jordan 1 Retro High OG 'Shadow' 2018",
        description:
          "This Nike Air Jordan 1 Retro High OG Shadow; 2018 is a retro re-release of an original 1985 colorway. The shoe features a black and medium grey leather upper with a white midsole and black outsole. It also features OG Nike Air branding on the tongue and the Wings logo on the ankle collar. It was last retroed in 2013, and a low-top version dropped in 2015.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/011/119/994/original/218099_00.png.png",
        stock: 47,
        price: 160,
      },
      {
        title: "Air Jordan 11 Retro 'Space Jam' 2016",
        description:
          "The Air Jordan 11 Retro Space Jam 2016 commemorates the 20th anniversary of the movie Space Jam. Worn by Michael Jordan as a Player Exclusive (PE) in both the movie and the 1995 NBA Playoffs, the 2016 retro ended up being Nikes largest and most successful shoe launch ever. This 2016 sneaker is a more faithful reproduction of the original PE than the 2000 and 2009 retros. The sneaker also swaps the traditional #23 for MJs comeback #45 on the heel, a first for an Air Jordan 11 retail release.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/008/654/900/original/52015_00.png.png",

        stock: 10,
        price: 550,
      },
      {
        title: "Air Jordan 6 Retro 'Infrared' 2019",
        description:
          "The 2019 edition of the Air Jordan 6 Retro Infrared is true to the original colorway, which Michael Jordan wore when he captured his first NBA title. Dressed primarily in black nubuck with a reflective 3M layer underneath, the mid-top features Infrared accents on the midsole, heel tab and lace lock. Nike Air branding adorns the heel and sockliner, an OG detail last seen on the 2000 retro.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/018/675/311/original/464372_00.png.png",
        stock: 23,
        price: 625,
      },
      {
        title: "Yeezy Boost 350",
        description:
          "The adidas Yeezy Boost 350 V2 lives up to its cult appeal through evolved design elements and advanced technology. Released June 2019, this ‘Black Non-Reflective&#39; edition&#39;s re-engineered Primeknit bootie sees futuristic updates including a translucent side stripe and bold stitching on the heel pull. Integrated lacing customizes the fit while a translucent black Boost-equipped midsole complements the covert feel.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/020/624/696/original/FU9013.png.png",
        stock: 47,
        price: 135,
      },
      {
        title: "OFF-WHITE x Air Jordan 1 Retro High OG 'UNC'",
        description:
          "Inspired by Michael Jordan’s alma mater, the Off-White x Air Jordan 1 Retro High OG ‘UNC’ carries a classic two-tone composition, filtered through Virgil Abloh’s unique design prism. The process involves taking a white leather base with dark powder blue overlays and adding embellishments that convey an expressive, handmade quality. They include detached Wings, a floating Swoosh, and lines of text on the medial-side quarter panel delineating the taxonomy of the shoe.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/012/219/518/original/335047_00.png.png",
        stock: 23,
        price: 1200,
      },
      {
        title: "CHAMPION RALLY PRO",
        description:
          "The Champion Rally Pro sneaker packages street style in a sleek, basketball-inspired silhouette with heritage Champion detailing throughout. This ‘Black’ version is styled for growing kids’ feet and features a one-piece bootie construction made from woven mesh and elastic textile with suede trim on the sidewall and heel. It offers a snug, sock-like fit that’s reinforced with tabs at the tongue and heel for easy on and off. A textured chenille ‘C’ logo on the sidewall and branded elastic strap across the forefoot complement the design.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/015/567/335/original/CM100018M.png.png",
        stock: 33,
        price: 125,
      },
      {
        title: "CONVERSE GOLF-WANG ROSE-BOWL",
        description:
          "Tyler, the Creator teamed up with Foot Locker on the ‘Artist Series’ edition of the Converse Chuck 70, featuring an off-white canvas upper printed with original artwork from Wyatt Navarro. The heightened foxing that’s a signature design element of the silhouette is adorned with contrasting stripes in blue and orange. A gum rubber outsole delivers traction underfoot.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/018/552/840/original/476518_00.png.png",
        stock: 30,
        price: 150,
      },
      {
        title: "CONVERSE COMME-DES-GARCONS",
        description:
          "This Comme des Garçons x Chuck Taylor All Star Hi features an off-white canvas upper, red CDG heart logo on the side panels, black contrast stripe on the heel, white toe cap, and a vulcanized rubber midsole. Released in June 2017, the sneaker also dropped in a black colorway.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/015/298/767/original/77243_00.png.png",
        stock: 47,
        price: 135,
      },
      {
        title: "GUCCI PURSUIT",
        description:
          "The Gucci Pursuit ‘72 Rubber Slide in ‘Black’ sneaker pays homage to the fashion house&#39;s roots with the iconic Web stripe—first developed by Gucci in the 1950s—taking the stage. The minimal, open-toe silhouette features a thick black rubber sole with a rounded shape. The top portion of the slide is a rubber strap displaying the Gucci Web green and red striped motif, and the design is finished with a Gucci logo embossed on the outer midsole.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/009/249/006/original/259509_00.png.png",
        stock: 23,
        price: 550,
      },
      {
        title: "RFEAR OF GOD AIR RAID",
        description:
          "Nike and frequent collaborator Fear Of God designer, Jerry Lorenzo, joined forces once again for the Air Fear Of God Raid &#39;Black&#39; sneaker. Released in May 2019, the uniquely designed silhouette is inspired by one of Lorenzo’s favorite Nike designs, the Air Raid. Outfitted with a cross strap suede and textile upper above; below, its equipped with a double stacked Zoom Air unit in heel for a retro, yet futuristic finish.",
        imgurl:
          "https://image.goat.com/375/attachments/product_template_pictures/images/021/545/549/original/489359_00.png.png",
        stock: 47,
        price: 135,
      },
    ];

    const shoes = await Promise.all(productsToAdd.map(createProduct));

    console.log("Finished adding the products...");
  } catch (error) {
    throw error;
  }
}

async function createInitialCategories() {
  console.log("Starting to add categories...");
  try {
    const categoriesToAdd = [
      {
        name: "Basketball",
      },
      {
        name: "Running",
      },
      {
        name: "Hiking",
      },
      {
        name: "Swimming",
      },
      {
        name: "Casual",
      },
      {
        name: "Cross Training",
      },
    ];
    const categories = await Promise.all(categoriesToAdd.map(createCategory));
    console.log("Finished adding the categories...");
  } catch (err) {
    throw err;
  }
}

async function createInitialOrders() {
  try {
    console.log("Starting to create orders...");

    const ordersToCreate = [
      {
        creatorId: 1,
      },
      {
        creatorId: 2,
      },
      {
        creatorId: 3,
      },
    ];

    const orders = await Promise.all(ordersToCreate.map(createOrder));
    console.log("Finished to create orders");
  } catch (error) {
    console.error("Error creating orders");
    throw error;
  }
}

seedDB();
