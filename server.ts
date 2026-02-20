import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("mada_annuaire.db");
const JWT_SECRET = process.env.JWT_SECRET || "mada-secret-key-2026";

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- 'user', 'pro', 'admin'
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT
  );

  CREATE TABLE IF NOT EXISTS regions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL
  );

  CREATE TABLE IF NOT EXISTS cities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    region_id INTEGER,
    FOREIGN KEY (region_id) REFERENCES regions(id)
  );

  CREATE TABLE IF NOT EXISTS listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    category_id INTEGER,
    city_id INTEGER,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    address TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    website TEXT,
    logo TEXT,
    images TEXT, -- JSON array
    hours TEXT, -- JSON object
    is_featured BOOLEAN DEFAULT 0,
    is_verified BOOLEAN DEFAULT 0,
    status TEXT DEFAULT 'pending', -- 'pending', 'published', 'rejected'
    views INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (city_id) REFERENCES cities(id)
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    listing_id INTEGER,
    user_id INTEGER,
    rating INTEGER CHECK(rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (listing_id) REFERENCES listings(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial data if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };

if (categoryCount.count === 0 || userCount.count === 0) {
  // Clear if partial
  if (categoryCount.count === 0) {
    const categories = [
      ['Hôtels & Hébergement', 'hotels-hebergement', 'Hotel'],
      ['Restaurants & Cafés', 'restaurants-cafes', 'Utensils'],
      ['Santé & Médical', 'sante-medical', 'Stethoscope'],
      ['Automobile & Transport', 'automobile-transport', 'Car'],
      ['Services Professionnels', 'services-professionnels', 'Briefcase'],
      ['Shopping & Commerces', 'shopping-commerces', 'ShoppingBag'],
      ['Art & Culture', 'art-culture', 'Palette'],
      ['Technologie & Informatique', 'technologie-informatique', 'Laptop']
    ];
    const insertCat = db.prepare("INSERT INTO categories (name, slug, icon) VALUES (?, ?, ?)");
    categories.forEach(cat => insertCat.run(cat));

    const regions = ['Analamanga', 'Vakinankaratra', 'Atsinanana', 'Diana', 'Boeny', 'Sava', 'Anosy', 'Menabe'];
    const insertRegion = db.prepare("INSERT INTO regions (name) VALUES (?)");
    regions.forEach(r => insertRegion.run(r));

    const cities = [
      ['Antananarivo', 1], ['Antsirabe', 2], ['Toamasina', 3], ['Antsiranana', 4], ['Mahajanga', 5], ['Sambava', 6], ['Fort-Dauphin', 7], ['Morondava', 8]
    ];
    const insertCity = db.prepare("INSERT INTO cities (name, region_id) VALUES (?, ?)");
    cities.forEach(c => insertCity.run(c));
  }

  if (userCount.count === 0) {
    // Seed Accounts
    const hashedPassword = bcrypt.hashSync("password123", 10);
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Admin Mada", "admin@mada.mg", hashedPassword, "admin");
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Jean Pro", "pro@mada.mg", hashedPassword, "pro");
    db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run("Client Lambda", "user@mada.mg", hashedPassword, "user");

    // Seed Listings
    const listings = [
      [2, 1, 1, 'Hôtel Carlton', 'hotel-carlton', 'Hôtel 5 étoiles au coeur d\'Antananarivo avec vue panoramique.', 'Anosy, Antananarivo', '+261 20 22 260 60', '+261 34 00 000 01', 'contact@carlton.mg', 'https://carlton.mg', 1, 1, 'published'],
      [2, 2, 1, 'Le Jardin d\'Antanimena', 'le-jardin-antanimena', 'Cuisine raffinée dans un cadre verdoyant et calme.', 'Antanimena, Antananarivo', '+261 20 22 333 44', null, 'info@lejardin.mg', null, 0, 1, 'published'],
      [2, 3, 1, 'Clinique et Maternité d\'Ankadifotsy', 'clinique-ankadifotsy', 'Soins médicaux de qualité et urgences 24h/24.', 'Ankadifotsy, Antananarivo', '+261 20 22 235 55', null, null, null, 0, 1, 'published'],
      [2, 1, 3, 'Hôtel de l\'Avenue Toamasina', 'hotel-avenue-toamasina', 'Confort et proximité du port pour vos séjours d\'affaires.', 'Boulevard Joffre, Toamasina', '+261 20 53 321 00', null, 'resa@hotelavenue.mg', null, 1, 0, 'published'],
      [2, 6, 5, 'Baobab Mall Mahajanga', 'baobab-mall', 'Le plus grand centre commercial de la ville avec boutiques et food court.', 'Bord de mer, Mahajanga', null, null, null, null, 0, 0, 'published']
    ];
    const insertListing = db.prepare(`
      INSERT INTO listings (user_id, category_id, city_id, title, slug, description, address, phone, whatsapp, email, website, is_featured, is_verified, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    listings.forEach(l => insertListing.run(l));

    // Seed Reviews
    db.prepare("INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES (?, ?, ?, ?)").run(1, 3, 5, "Excellent service et vue imprenable !");
    db.prepare("INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES (?, ?, ?, ?)").run(1, 2, 4, "Très bon séjour, personnel accueillant.");
    db.prepare("INSERT INTO reviews (listing_id, user_id, rating, comment) VALUES (?, ?, ?, ?)").run(2, 3, 5, "Le meilleur canard laqué de Tana.");
  }
}

async function startServer() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());

  // Auth Middleware
  const authenticate = (req: any, res: any, next: any) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Unauthorized" });
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      res.status(401).json({ error: "Invalid token" });
    }
  };

  // --- API Routes ---

  // Auth
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const result = db.prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)").run(name, email, hashedPassword, role || 'user');
      const token = jwt.sign({ id: result.lastInsertRowid, email, role: role || 'user' }, JWT_SECRET);
      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
      res.json({ id: result.lastInsertRowid, name, email, role: role || 'user' });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.json({ id: user.id, name: user.name, email: user.email, role: user.role });
  });

  app.post("/api/auth/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ success: true });
  });

  app.get("/api/auth/me", authenticate, (req: any, res) => {
    const user = db.prepare("SELECT id, name, email, role FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // Categories & Locations
  app.get("/api/categories", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories").all();
    res.json(categories);
  });

  app.get("/api/regions", (req, res) => {
    const regions = db.prepare("SELECT * FROM regions").all();
    res.json(regions);
  });

  app.get("/api/cities", (req, res) => {
    const cities = db.prepare(`
      SELECT cities.*, regions.name as region_name 
      FROM cities 
      JOIN regions ON cities.region_id = regions.id
    `).all();
    res.json(cities);
  });

  // Listings
  app.get("/api/listings", (req, res) => {
    const { category, city, search, featured } = req.query;
    let query = `
      SELECT listings.*, categories.name as category_name, cities.name as city_name 
      FROM listings 
      JOIN categories ON listings.category_id = categories.id
      JOIN cities ON listings.city_id = cities.id
      WHERE listings.status = 'published'
    `;
    const params: any[] = [];

    if (category) {
      query += " AND categories.slug = ?";
      params.push(category);
    }
    if (city) {
      query += " AND cities.id = ?";
      params.push(city);
    }
    if (search) {
      query += " AND (listings.title LIKE ? OR listings.description LIKE ?)";
      params.push(`%${search}%`, `%${search}%`);
    }
    if (featured === 'true') {
      query += " AND listings.is_featured = 1";
    }

    query += " ORDER BY listings.created_at DESC";
    const listings = db.prepare(query).all(...params);
    res.json(listings);
  });

  app.get("/api/listings/:slug", (req, res) => {
    const listing = db.prepare(`
      SELECT listings.*, categories.name as category_name, cities.name as city_name, users.name as owner_name
      FROM listings 
      JOIN categories ON listings.category_id = categories.id
      JOIN cities ON listings.city_id = cities.id
      JOIN users ON listings.user_id = users.id
      WHERE listings.slug = ?
    `).get(req.params.slug) as any;

    if (!listing) return res.status(404).json({ error: "Not found" });

    // Increment views
    db.prepare("UPDATE listings SET views = views + 1 WHERE id = ?").run(listing.id);

    const reviews = db.prepare(`
      SELECT reviews.*, users.name as user_name 
      FROM reviews 
      JOIN users ON reviews.user_id = users.id
      WHERE reviews.listing_id = ?
      ORDER BY reviews.created_at DESC
    `).all(listing.id);

    res.json({ ...listing, reviews });
  });

  // User Dashboard
  app.get("/api/my-listings", authenticate, (req: any, res) => {
    const listings = db.prepare("SELECT * FROM listings WHERE user_id = ?").all(req.user.id);
    res.json(listings);
  });

  app.post("/api/listings", authenticate, (req: any, res) => {
    const { title, category_id, city_id, description, address, phone, whatsapp, email, website } = req.body;
    const slug = title.toLowerCase().replace(/ /g, '-') + '-' + Date.now();
    try {
      const result = db.prepare(`
        INSERT INTO listings (user_id, category_id, city_id, title, slug, description, address, phone, whatsapp, email, website)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(req.user.id, category_id, city_id, title, slug, description, address, phone, whatsapp, email, website);
      res.json({ id: result.lastInsertRowid, slug });
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  });

  // Admin
  app.get("/api/admin/stats", authenticate, (req: any, res) => {
    if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
    const stats = {
      users: db.prepare("SELECT COUNT(*) as count FROM users").get(),
      listings: db.prepare("SELECT COUNT(*) as count FROM listings").get(),
      pending: db.prepare("SELECT COUNT(*) as count FROM listings WHERE status = 'pending'").get(),
      views: db.prepare("SELECT SUM(views) as count FROM listings").get()
    };
    res.json(stats);
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
