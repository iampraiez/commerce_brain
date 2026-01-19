import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";
import "dotenv/config";

const MONGODB_URI = process.env.MONGODB_URI;

async function initDB() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined");
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("ecommerce");

    // Create collections
    await db.createCollection("users").catch(() => {});
    await db.createCollection("products").catch(() => {});
    await db.createCollection("orders").catch(() => {});
    await db.createCollection("cart").catch(() => {});
    await db.createCollection("wishlists").catch(() => {});

    console.log("Collections created");

    // Create indexes
    await db.collection("users").createIndex({ email: 1 }, { unique: true });
    await db.collection("products").createIndex({ category: 1 });
    await db
      .collection("products")
      .createIndex({ name: "text", description: "text" });
    await db.collection("orders").createIndex({ userId: 1 });
    await db.collection("cart").createIndex({ userId: 1 }, { unique: true });
    await db
      .collection("wishlists")
      .createIndex({ userId: 1 }, { unique: true });
    await db.collection("wishlists").createIndex({ productIds: 1 });

    console.log("Indexes created");

    // Seed admin user if not exists
    const adminExists = await db
      .collection("users")
      .findOne({ email: "admin@example.com" });

    if (!adminExists) {
      const adminPassword = await bcrypt.hash("admin123", 10);
      await db.collection("users").insertOne({
        email: "admin@example.com",
        name: "Admin User",
        passwordHash: adminPassword,
        role: "admin",
        createdAt: new Date(),
      });
      console.log("Admin user created");
    }

    // Seed sample products
    const productCount = await db.collection("products").countDocuments();

    if (productCount === 0) {
      const products = [
        {
          name: "Samsung Galaxy S23 Ultra",
          price: 1199.99,
          description:
            "Flagship smartphone with 200MP camera, S Pen and powerful performance",
          category: "Phones & Tablets",
          image:
            "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg",
          stock: 45,
        },
        {
          name: "Apple iPhone 14 Pro Max",
          price: 1099.0,
          description:
            "Premium iPhone with Dynamic Island, 48MP camera and A16 Bionic chip",
          category: "Phones & Tablets",
          image:
            "https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg",
          stock: 32,
        },
        {
          name: "Wireless Noise Cancelling Headphones",
          price: 349.0,
          description:
            "Premium over-ear headphones with industry-leading noise cancellation",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
          stock: 78,
        },
        {
          name: "MacBook Air M2 13-inch",
          price: 999.0,
          description:
            "Ultra-thin and light laptop with stunning Retina display and M2 chip",
          category: "Computing",
          image: "https://images.pexels.com/photos/7974/pexels-photo-7974.jpeg",
          stock: 24,
        },
        {
          name: "Men's Slim Fit Chino Pants",
          price: 49.99,
          description:
            "Comfortable cotton blend chinos perfect for casual and business casual wear",
          category: "Fashion",
          image:
            "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
          stock: 145,
        },
        {
          name: "Anti-Aging Face Cream 50ml",
          price: 79.5,
          description:
            "Luxury hydrating cream with hyaluronic acid and peptides",
          category: "Health & Beauty",
          image:
            "https://images.pexels.com/photos/256301/pexels-photo-256301.jpeg",
          stock: 88,
        },
        {
          name: "Stainless Steel Kitchen Knife Set",
          price: 129.99,
          description: "Professional 6-piece knife set with ergonomic handles",
          category: "Home & Office",
          image:
            "https://images.pexels.com/photos/4202325/pexels-photo-4202325.jpeg",
          stock: 63,
        },
        {
          name: "Organic Avocado Oil 500ml",
          price: 14.99,
          description:
            "Cold-pressed extra virgin avocado oil for cooking and salads",
          category: "Grocery",
          image:
            "https://images.pexels.com/photos/60616/pexels-photo-60616.jpeg",
          stock: 210,
        },
        {
          name: "Garden Solar LED Path Lights - Set of 8",
          price: 39.99,
          description:
            "Weatherproof solar-powered landscape lights for garden pathways",
          category: "Garden & Outdoors",
          image:
            "https://images.pexels.com/photos/109477/pexels-photo-109477.jpeg",
          stock: 112,
        },
        {
          name: "Yoga Mat Non-Slip 6mm",
          price: 34.99,
          description:
            "Eco-friendly TPE yoga mat with excellent grip and cushioning",
          category: "Sporting Goods",
          image:
            "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg",
          stock: 95,
        },
        {
          name: "Gaming Chair Racing Style",
          price: 189.99,
          description:
            "Ergonomic gaming chair with lumbar support and adjustable armrests",
          category: "Gaming",
          image:
            "https://images.pexels.com/photos/275909/pexels-photo-275909.jpeg",
          stock: 41,
        },
        {
          name: "Baby Diapers Size 4 - 80 Pack",
          price: 42.99,
          description:
            "Hypoallergenic diapers with wetness indicator for babies 9-18kg",
          category: "Baby Products",
          image:
            "https://images.pexels.com/photos/1625393/pexels-photo-1625393.jpeg",
          stock: 167,
        },
        {
          name: "Car Phone Mount Air Vent",
          price: 19.99,
          description:
            "360° rotatable phone holder compatible with most smartphones",
          category: "Automobile",
          image:
            "https://images.pexels.com/photos/163543/pexels-photo-163543.jpeg",
          stock: 203,
        },
        {
          name: 'Lenovo IdeaPad 5 15.6"',
          price: 679.0,
          description:
            "Powerful laptop with AMD Ryzen 7, 16GB RAM and 512GB SSD",
          category: "Computing",
          image: "https://images.pexels.com/photos/7974/pexels-photo-7974.jpeg",
          stock: 38,
        },
        {
          name: "Wireless Gaming Mouse RGB",
          price: 59.99,
          description:
            "High-precision 16000 DPI sensor with customizable RGB lighting",
          category: "Gaming",
          image:
            "https://images.pexels.com/photos/2112651/pexels-photo-2112651.jpeg",
          stock: 67,
        },
        {
          name: "Vitamin C Serum 30ml",
          price: 34.99,
          description:
            "Brightening facial serum with 20% vitamin C and hyaluronic acid",
          category: "Health & Beauty",
          image:
            "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
          stock: 104,
        },
        {
          name: "Queen Size Memory Foam Mattress",
          price: 429.0,
          description:
            "10-inch medium-firm memory foam mattress with cooling gel layer",
          category: "Home & Office",
          image:
            "https://images.pexels.com/photos/271715/pexels-photo-271715.jpeg",
          stock: 29,
        },
        {
          name: "Men's Running Shoes",
          price: 89.99,
          description:
            "Lightweight breathable running shoes with responsive cushioning",
          category: "Sporting Goods",
          image:
            "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg",
          stock: 82,
        },
        {
          name: "Organic Quinoa 1kg",
          price: 12.49,
          description: "Premium white quinoa, gluten-free and high in protein",
          category: "Grocery",
          image:
            "https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg",
          stock: 189,
        },
        {
          name: "Portable Blender USB Rechargeable",
          price: 39.99,
          description:
            "Compact personal blender perfect for smoothies and protein shakes",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg",
          stock: 56,
        },
        {
          name: "Dyson V15 Detect Absolute",
          price: 749.99,
          description:
            "Cordless vacuum with laser dust detection and powerful suction",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1558312657-b2dead03d494",
          stock: 42,
        },
        {
          name: "Google Pixel 8 Pro",
          price: 899.0,
          description:
            "Advanced AI smartphone with exceptional camera and clean Android experience",
          category: "Phones & Tablets",
          image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
          stock: 31,
        },
        {
          name: "Women's Oversized Cashmere Sweater",
          price: 129.99,
          description:
            "Luxuriously soft 100% cashmere sweater with relaxed fit",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27",
          stock: 67,
        },
        {
          name: "Philips Sonicare DiamondClean 9000",
          price: 229.99,
          description:
            "Premium electric toothbrush with pressure sensor and 4 brushing modes",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1559591937-4a2a5b9d9248",
          stock: 54,
        },
        {
          name: "Logitech MX Master 3S Mouse",
          price: 99.99,
          description:
            "Ergonomic wireless mouse with ultra-fast scrolling and multi-device flow",
          category: "Computing",
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39d7",
          stock: 89,
        },
        {
          name: "Ninja Foodi 10-in-1 XL Pro Air Fry Oven",
          price: 299.99,
          description:
            "Versatile countertop oven with air fry, roast, bake and dehydrate functions",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1582359646256-1d4d7e6e7e8d",
          stock: 28,
        },
        {
          name: "Sony WH-1000XM5 Headphones",
          price: 399.99,
          description:
            "Industry-leading noise cancelling wireless headphones with superb sound",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          stock: 63,
        },
        {
          name: "Organic Extra Virgin Olive Oil 1L",
          price: 18.99,
          description:
            "Cold-pressed Italian extra virgin olive oil in dark glass bottle",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1475856044411-f9f1d2e6c2f4",
          stock: 178,
        },
        {
          name: "Men's Waterproof Hiking Boots",
          price: 149.99,
          description:
            "Durable leather hiking boots with Gore-Tex waterproof membrane",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1600185365926-3a2c2e8f3d4e",
          stock: 51,
        },
        {
          name: "Anker PowerCore+ 26800mAh Power Bank",
          price: 79.99,
          description:
            "High-capacity portable charger with Power Delivery and fast charging",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1606293459212-0d3e0f7c3a47",
          stock: 94,
        },
        {
          name: "Bamboo Baby Sleep Sack 0-6 Months",
          price: 32.99,
          description:
            "Breathable bamboo viscose wearable blanket with two-way zipper",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1602829961351-1eb698e5d53e",
          stock: 112,
        },
        {
          name: "Ceramic Non-Stick Cookware Set 10-Piece",
          price: 169.99,
          description: "Healthy PFOA-free ceramic coated pots and pans set",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 37,
        },
        {
          name: 'Samsung 55" QLED 4K Smart TV (2024)',
          price: 799.99,
          description:
            "Quantum HDR 4K TV with ultra-slim design and gaming hub",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
          stock: 19,
        },
        {
          name: "Wireless Mechanical Keyboard RGB",
          price: 119.99,
          description:
            "Hot-swappable gasket mount mechanical keyboard with wireless connectivity",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          stock: 46,
        },
        {
          name: "Collagen Peptides Powder 500g",
          price: 39.99,
          description:
            "Unflavored grass-fed bovine collagen for hair, skin & nails",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e",
          stock: 83,
        },
        {
          name: "Portable Camping Hammock",
          price: 44.99,
          description:
            "Lightweight parachute nylon hammock with tree straps and carabiners",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1602536052359-ef94c21c5948",
          stock: 76,
        },
        {
          name: "Car Dash Cam 4K Front & Rear",
          price: 139.99,
          description:
            "Dual channel dash camera with night vision and parking mode",
          category: "Automobile",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
          stock: 58,
        },
        {
          name: "Wireless Earbuds with ANC",
          price: 89.99,
          description:
            "Active noise cancelling true wireless earbuds with 30-hour playtime",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1605640840603-14ac1855827b",
          stock: 103,
        },
        {
          name: "Organic Matcha Green Tea Powder 100g",
          price: 24.99,
          description: "Premium ceremonial grade matcha from Japan",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
          stock: 141,
        },
        {
          name: "Adjustable Standing Desk 60×30",
          price: 349.99,
          description:
            "Electric height adjustable standing desk with memory presets",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1589829545856-d10d6b0a2e4a",
          stock: 22,
        },
        {
          name: "Breville Barista Express Espresso Machine",
          price: 699.95,
          description:
            "Semi-automatic espresso machine with built-in conical burr grinder",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7",
          stock: 18,
        },
        {
          name: "iPad Air 5th Gen 10.9-inch",
          price: 599.0,
          description:
            "Powerful tablet with M1 chip, Liquid Retina display and Center Stage camera",
          category: "Phones & Tablets",
          image: "https://images.unsplash.com/photo-1589739907049-2d5b682b6e6f",
          stock: 27,
        },
        {
          name: "Levi's 501 Original Fit Jeans",
          price: 69.5,
          description:
            "Classic straight-leg men's jeans in original shrink-to-fit denim",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab",
          stock: 134,
        },
        {
          name: "Neutrogena Hydro Boost Water Gel",
          price: 19.99,
          description:
            "Oil-free moisturizer with hyaluronic acid for 24-hour hydration",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1570194066981-617ac1bcr5b5",
          stock: 156,
        },
        {
          name: 'ASUS ROG Strix 32" 1440p 165Hz Gaming Monitor',
          price: 449.99,
          description:
            "Fast IPS gaming monitor with G-SYNC compatible and HDR support",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1588109273901-3106751cc5f0",
          stock: 14,
        },
        {
          name: "Instant Pot Duo Plus 9-in-1",
          price: 129.99,
          description:
            "Multi-use pressure cooker, slow cooker, rice cooker and more",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1582359646256-1d4d7e6e7e8d",
          stock: 53,
        },
        {
          name: "North Face Men's Venture 2 Rain Jacket",
          price: 99.95,
          description: "Lightweight waterproof and breathable rain shell",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1605733513530-2f5b1c3d4f2e",
          stock: 41,
        },
        {
          name: "Kirkland Signature Organic Maple Syrup 1L",
          price: 18.49,
          description: "Pure Canadian Grade A organic maple syrup",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8",
          stock: 198,
        },
        {
          name: "Philips Hue White & Color Ambiance Starter Kit",
          price: 199.99,
          description: "Smart lighting kit with 4 color bulbs and bridge",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1565814636196-2b02c6d0a6e8",
          stock: 36,
        },
        {
          name: "Hatch Rest+ 2nd Gen Baby Sound Machine",
          price: 79.99,
          description:
            "White noise machine, night light and time-to-rise function",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1588880331179-46d541a819de",
          stock: 92,
        },
        {
          name: "Garmin Venu 2 Plus Smartwatch",
          price: 449.99,
          description:
            "Premium GPS smartwatch with mic/speaker and health monitoring",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1617049043593-2a0a2a8d7b9e",
          stock: 29,
        },
        {
          name: "Yeti Roadie 24 Hard Cooler",
          price: 250.0,
          description: "Portable hard cooler with superior ice retention",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1596047036109-0d4d1a5e5a5d",
          stock: 33,
        },
        {
          name: "Bosch 800 Series Dishwasher",
          price: 1099.0,
          description: "Quiet 42 dBA dishwasher with CrystalDry technology",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          stock: 11,
        },
        {
          name: "Ray-Ban Meta Smart Glasses",
          price: 299.0,
          description:
            "Smart glasses with built-in camera, speakers and AI assistant",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
          stock: 48,
        },
        {
          name: "CeraVe Hydrating Facial Cleanser",
          price: 14.99,
          description:
            "Gentle non-foaming cleanser with ceramides and hyaluronic acid",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
          stock: 187,
        },
        {
          name: "Xiaomi Mi Electric Scooter 4 Pro",
          price: 599.0,
          description:
            "Long-range electric scooter with 45km range and 25km/h max speed",
          category: "Automobile",
          image: "https://images.unsplash.com/photo-1617880264853-6a4e7b1e1f1e",
          stock: 19,
        },
        {
          name: "Lego Technic Ford Mustang Shelby GT500",
          price: 169.99,
          description:
            "Detailed 1:12 scale model with V8 engine and working steering",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1581235720704-06d10c6d6e9f",
          stock: 64,
        },
        {
          name: "Moen MotionSense Kitchen Faucet",
          price: 349.99,
          description: "Touchless kitchen faucet with hands-free operation",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          stock: 26,
        },
        {
          name: "Bio-Oil Skincare Oil 60ml",
          price: 15.99,
          description:
            "Multiuse oil for scars, stretch marks and uneven skin tone",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1608248597788-35336b7f6d4e",
          stock: 142,
        },
        {
          name: "Ooni Koda 16 Gas Pizza Oven",
          price: 599.0,
          description: "Portable gas pizza oven reaches 950°F in 15 minutes",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3",
          stock: 21,
        },
        {
          name: "Stanley Quencher H2.0 FlowState 40oz Tumbler",
          price: 45.0,
          description: "Insulated tumbler with handle and straw lid",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
          stock: 168,
        },
        {
          name: "Samsung Galaxy Watch 6 Classic 47mm",
          price: 449.99,
          description:
            "Premium smartwatch with rotating bezel and advanced health tracking",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1617049043593-2a0a2a8d7b9e",
          stock: 39,
        },
        {
          name: "Dr. Bronner's Pure-Castile Liquid Soap Peppermint 32oz",
          price: 18.99,
          description:
            "Versatile organic castile soap in invigorating peppermint scent",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1608248597788-35336b7f6d4e",
          stock: 203,
        },
        {
          name: "Weber Spirit II E-310 Gas Grill",
          price: 599.0,
          description:
            "3-burner propane grill with porcelain-enameled cast iron grates",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 17,
        },
        {
          name: "Anker Nano Power Bank 5000mAh",
          price: 29.99,
          description: "Ultra-compact power bank with built-in USB-C cable",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1606293459212-0d3e0f7c3a47",
          stock: 214,
        },
        {
          name: "Huggies Little Snugglers Diapers Size Newborn - 88 Count",
          price: 34.99,
          description:
            "Soft diapers with gentle waistband and wetness indicator",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1588880331179-46d541a819de",
          stock: 131,
        },
        {
          name: "Patagonia Nano Puff Jacket",
          price: 239.0,
          description:
            "Lightweight synthetic insulated jacket with water-resistant finish",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1605733513530-2f5b1c3d4f2e",
          stock: 58,
        },
        {
          name: "JBL Flip 6 Waterproof Bluetooth Speaker",
          price: 129.95,
          description:
            "Portable waterproof speaker with powerful sound and partyboost",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1605640840603-14ac1855827b",
          stock: 72,
        },
        {
          name: "Taylor of Old Bond Street Sandalwood Shaving Cream",
          price: 29.99,
          description:
            "Luxury triple-milled shaving cream in classic sandalwood scent",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1559591937-4a2a5b9d9248",
          stock: 96,
        },
        {
          name: "Nespresso Vertuo Next Coffee Machine",
          price: 179.0,
          description:
            "Automatic pod coffee machine with Centrifusion brewing technology",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7",
          stock: 34,
        },
        {
          name: "OnePlus 12 256GB",
          price: 799.0,
          description:
            "Flagship Android phone with Hasselblad camera tuning and 120Hz display",
          category: "Phones & Tablets",
          image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
          stock: 23,
        },
        {
          name: "Crocs Classic Clogs",
          price: 49.99,
          description: "Iconic lightweight foam clogs with ventilation ports",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab",
          stock: 189,
        },
        {
          name: 'Lululemon Align High-Rise Pant 25"',
          price: 98.0,
          description: "Ultra-soft yoga pants with buttery-soft Nulu fabric",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
          stock: 47,
        },
        {
          name: "Vitamix Explorian Blender E310",
          price: 349.95,
          description: "Professional-grade blender with 10-year warranty",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1570222094114-d054a8f887b8",
          stock: 19,
        },
        {
          name: "Hydro Flask 32oz Wide Mouth Bottle",
          price: 44.95,
          description:
            "Double-wall vacuum insulated stainless steel water bottle",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
          stock: 165,
        },
        {
          name: "Kindle Paperwhite (11th Gen)",
          price: 139.99,
          description:
            'Waterproof e-reader with 6.8" display and adjustable warm light',
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1592899677977-5c0b6a3e0e1c",
          stock: 82,
        },
        {
          name: "MAM Perfect Pacifier 0-6 Months - 2 Pack",
          price: 8.99,
          description:
            "Orthodontic pacifier with skin-friendly silicone nipple",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1588880331179-46d541a819de",
          stock: 278,
        },
        {
          name: "Carhartt Legacy Standard Work Backpack",
          price: 89.99,
          description: "Durable 1200D polyester backpack with laptop sleeve",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
          stock: 68,
        },
        {
          name: "Keurig K-Mini Single Serve Coffee Maker",
          price: 79.99,
          description: "Compact coffee maker for K-Cup pods",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7",
          stock: 45,
        },
        {
          name: "Laneige Lip Sleeping Mask",
          price: 24.0,
          description:
            "Overnight lip treatment with berry fruit complex and vitamin C",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1570194066981-617ac1bcr5b5",
          stock: 134,
        },
        {
          name: "Eufy RoboVac 11S MAX",
          price: 229.99,
          description: "Ultra-slim robot vacuum with BoostIQ technology",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1561070791-a2c455f5b8b2",
          stock: 31,
        },
        {
          name: "Allbirds Tree Runners",
          price: 95.0,
          description:
            "Breathable sustainable sneakers made from eucalyptus tree fiber",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1605732659567-4d6d0e3f3e3a",
          stock: 76,
        },
        {
          name: "Burt's Bees Beeswax Lip Balm 4-Pack",
          price: 9.99,
          description: "Classic natural lip balm with peppermint oil",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1608248597788-35336b7f6d4e",
          stock: 312,
        },
        {
          name: "Nintendo Switch OLED Model",
          price: 349.99,
          description:
            "Handheld/console hybrid with vibrant 7-inch OLED screen",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1578301978069-45264734cddc",
          stock: 52,
        },
        {
          name: "Coleman Sundome 4-Person Tent",
          price: 79.99,
          description: "Easy setup dome tent with weather protection",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1504851149312-7a075b496cc7",
          stock: 64,
        },
        {
          name: "Meguiar's Ultimate Liquid Wax",
          price: 24.99,
          description: "Synthetic polymer car wax for long-lasting protection",
          category: "Automobile",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
          stock: 93,
        },
        {
          name: "Philips Norelco OneBlade Face + Body",
          price: 49.99,
          description: "Hybrid electric trimmer and shaver for face and body",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1559591937-4a2a5b9d9248",
          stock: 87,
        },
        {
          name: "Bose SoundLink Flex Bluetooth Speaker",
          price: 149.0,
          description:
            "Rugged waterproof portable speaker with surprisingly big sound",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1605640840603-14ac1855827b",
          stock: 61,
        },
        {
          name: "T-fal Ultimate Hard Anodized Nonstick Fry Pan Set",
          price: 79.99,
          description: "2-piece durable hard anodized nonstick fry pan set",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 48,
        },
        {
          name: "Hanes Men's Tagless Cotton Crewneck T-Shirts 6-Pack",
          price: 19.99,
          description: "Soft, breathable 100% cotton t-shirts in multipack",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a",
          stock: 245,
        },
        {
          name: "Delonghi Magnifica S Automatic Espresso Machine",
          price: 499.99,
          description:
            "Fully automatic bean-to-cup machine with adjustable grind and milk frother",
          category: "Home & Office",
          image:
            "https://cdn.mos.cms.futurecdn.net/Kees4go78yN3NRhCjEdrDN-1200-80.png",
          stock: 22,
        },
        {
          name: "Nespresso Vertuo Plus Coffee & Espresso Maker",
          price: 169.0,
          description:
            "Versatile pod machine with automatic capsule recognition and crema",
          category: "Home & Office",
          image:
            "https://media.istockphoto.com/id/1436360977/photo/modern-and-luxury-black-espresso-maker-on-wooden-counter-coffee-cup-and-sunlight-and-leaf.jpg?s=612x612&w=0&k=20&c=QwB_I0WtUvbma7KggnC0HaS_9XxU2n2w8pQu6gQQ6Ik=",
          stock: 47,
        },
        {
          name: "True Wireless Noise Cancelling Earbuds",
          price: 79.99,
          description:
            "Premium in-ear headphones with active noise cancellation and 28-hour battery",
          category: "Electronics",
          image:
            "https://media.istockphoto.com/id/2159165762/photo/wireless-earbuds-case-isolated-on-white-background-with-clipping-path.jpg?s=612x612&w=0&k=20&c=5ay4-a61_imwIdqUh_6HkaiF_7xaRS2Za_QFSZPdJ6E=",
          stock: 89,
        },
        {
          name: "Apple AirPods Pro 2nd Generation",
          price: 249.0,
          description:
            "Adaptive ANC, spatial audio and transparency mode true wireless earbuds",
          category: "Electronics",
          image:
            "https://media.istockphoto.com/id/1350672425/photo/apple-airpods-pro-on-white-background-incuding-clipping-path-wireless-headphones-and-charging.jpg?s=612x612&w=0&k=20&c=fflKbQ_LQfW4DEdtN5OkfnqcLEeX-3gp4z_CBj9w_E0=",
          stock: 38,
        },
        {
          name: "10-Piece Stainless Steel Cookware Set",
          price: 199.99,
          description:
            "Tri-ply stainless steel pots and pans with tempered glass lids",
          category: "Home & Office",
          image:
            "https://media.istockphoto.com/id/1005331184/photo/set-of-stainless-pots-and-pan-with-glass-lids-on-the-white-wooden-background.jpg?s=612x612&w=0&k=20&c=FHcpBvrlpVn6zr_q1wcLrof24er3dFGKXpzsRxN9bBc=",
          stock: 31,
        },
        {
          name: "All-Clad D3 Stainless Steel 10-Piece Set",
          price: 699.95,
          description:
            "Premium bonded cookware set with superior heat distribution",
          category: "Home & Office",
          image:
            "https://www.seriouseats.com/thmb/V3bEfYhjBk15QTlKuc0qS7qFHT0=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/sea-all-clad-d3-3-ply-stainless-steel-cookware-set-10-piece-taylor-murray-01-95ba677a31284f0998cb9089d156b9a8.jpeg",
          stock: 14,
        },
        {
          name: "5-Piece Resistance Bands Set with Handles",
          price: 34.99,
          description:
            "Non-slip fabric bands with different resistance levels for full-body workouts",
          category: "Sporting Goods",
          image:
            "https://s.alicdn.com/@sc02/kf/H78ccab1f32774513b18a82afdb8ea19ar.jpg",
          stock: 112,
        },
        {
          name: "Portable USB Rechargeable Blender 400ml",
          price: 39.99,
          description:
            "Compact personal blender for smoothies, protein shakes and travel",
          category: "Electronics",
          image:
            "https://m.media-amazon.com/images/I/516nPY5GreS._AC_UF894,1000_QL80_.jpg",
          stock: 68,
        },
        {
          name: "Lightweight Compact Baby Stroller",
          price: 149.99,
          description:
            "Foldable umbrella stroller with one-hand operation and canopy",
          category: "Baby Products",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2023/04/strollers-2048px-9139.jpg?auto=webp&quality=75&width=1024",
          stock: 52,
        },
        {
          name: "Genuine Leather Men's Bifold Wallet",
          price: 59.99,
          description:
            "Classic RFID-blocking bifold wallet with multiple card slots",
          category: "Fashion",
          image: "https://i.ebayimg.com/images/g/dXIAAOSwnglf2Waq/s-l400.jpg",
          stock: 145,
        },
        {
          name: "Smart Wi-Fi Mini Plug Outlet",
          price: 19.99,
          description:
            "Voice-controlled smart plug compatible with Alexa and Google Home",
          category: "Electronics",
          image:
            "https://i.pcmag.com/imagery/reviews/00akxbvv34VAoWRfEubAhEl-1..v1678206897.jpg",
          stock: 203,
        },
        {
          name: "Breville Barista Touch Espresso Machine",
          price: 949.95,
          description:
            "Touchscreen automatic machine with built-in grinder and milk frothing",
          category: "Home & Office",
          image:
            "https://media.istockphoto.com/id/1029492062/photo/coffeemaker-with-two-cups.jpg?s=612x612&w=0&k=20&c=lbnY1VjPS3vRm0VPUkf6AD0JzNPIvUD8aaHARmekU70=",
          stock: 19,
        },
        {
          name: "Sony WF-1000XM5 Noise Cancelling Earbuds",
          price: 299.99,
          description:
            "Flagship wireless earbuds with best-in-class ANC and sound quality",
          category: "Electronics",
          image:
            "https://www.shutterstock.com/image-photo/white-wireless-headphones-no-background-600nw-2071692311.jpg",
          stock: 41,
        },
        {
          name: "Made In 10-Piece Stainless Cookware Set",
          price: 599.0,
          description:
            "Professional-grade tri-ply stainless steel cookware with ergonomic handles",
          category: "Home & Office",
          image:
            "https://m.media-amazon.com/images/I/71DKw+61VEL._AC_UF894,1000_QL80_.jpg",
          stock: 27,
        },
        {
          name: "Heavy Duty Loop Resistance Bands Set",
          price: 29.99,
          description:
            "Durable power bands for assisted pull-ups, squats and strength training",
          category: "Sporting Goods",
          image:
            "https://bandsfactory.com/wp-content/uploads/2025/07/custom-therapy-bands.webp",
          stock: 94,
        },
        {
          name: "Cordless Portable Personal Blender",
          price: 45.99,
          description:
            "USB-C rechargeable blender with powerful motor and leak-proof lid",
          category: "Electronics",
          image:
            "https://m.media-amazon.com/images/I/61Ga-aSFtVL._AC_UF894,1000_QL80_.jpg",
          stock: 76,
        },
        {
          name: "Full-Size All-Terrain Baby Stroller",
          price: 329.99,
          description:
            "Durable stroller with large wheels, suspension and reversible seat",
          category: "Baby Products",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2023/04/strollers-2048px-9936-2x1-1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200",
          stock: 33,
        },
        {
          name: "Timberland Premium Leather Bifold Wallet",
          price: 49.99,
          description:
            "Rugged genuine leather wallet with coin pocket and ID window",
          category: "Fashion",
          image: "https://i.ebayimg.com/images/g/lgoAAOSwj~VlEi1F/s-l400.jpg",
          stock: 168,
        },
        {
          name: "TP-Link Kasa Smart Plug Mini",
          price: 24.99,
          description:
            "Compact Wi-Fi outlet with energy monitoring and scheduling",
          category: "Electronics",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2025/06/smart-plug-2048px-2193-3x2-1.jpg?auto=webp&quality=75&crop=4:3,smart&width=1024",
          stock: 119,
        },
        {
          name: "Philips 3200 Series Fully Automatic Espresso",
          price: 599.99,
          description: "One-touch cappuccino machine with LatteGo milk system",
          category: "Home & Office",
          image:
            "https://www.shutterstock.com/image-photo/realistic-photo-modern-espresso-machine-260nw-2661393221.jpg",
          stock: 26,
        },
        {
          name: "Anker Soundcore Liberty 4 NC Earbuds",
          price: 99.99,
          description:
            "Adaptive ANC earbuds with 10mm drivers and 50-hour playtime",
          category: "Electronics",
          image:
            "https://media.istockphoto.com/id/1204039347/photo/apple-airpods-on-a-white-background.jpg?s=612x612&w=0&k=20&c=2__4hfynkvBt7PA0UE7N5JxSTuaGRFVKaXJUuoQlBzk=",
          stock: 63,
        },
        {
          name: "Cuisinart MultiClad Pro 12-Piece Set",
          price: 299.99,
          description:
            "Stainless steel cookware with aluminum core for even heating",
          category: "Home & Office",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2022/11/cookwaresets-2048px-9099-2x1-1.jpg?auto=webp&quality=75&crop=1.91:1&width=1200",
          stock: 39,
        },
        {
          name: "Fabric Covered Resistance Loop Bands",
          price: 24.99,
          description:
            "Comfortable non-roll hip bands for glute and leg exercises",
          category: "Sporting Goods",
          image:
            "https://htsyoga.com/wp-content/uploads/2025/11/Custom-Yoga-Resistance-Band-Manufacturer-1.webp",
          stock: 131,
        },
        {
          name: "USB Portable Blender for Travel",
          price: 35.99,
          description:
            "Compact smoothie maker with 6 blades and one-button operation",
          category: "Electronics",
          image:
            "https://m.media-amazon.com/images/I/61rFC9c0VAL._AC_UF894,1000_QL80_.jpg",
          stock: 84,
        },
        {
          name: "Bugaboo Butterfly Compact Stroller",
          price: 449.0,
          description:
            "Ultra-lightweight foldable stroller for city living and travel",
          category: "Baby Products",
          image:
            "https://images.ctfassets.net/6m9bd13t776q/25013nJav1TG3jMKL1t7AG/926d7ea60348b8c122f9e21bc98738be/bugaboo_butterfly_2_stroller-side_by_side-ashleigh_h.png?fm=webp&q=75",
          stock: 18,
        },
        {
          name: "RFID Blocking Leather Men's Wallet",
          price: 39.99,
          description: "Slim bifold with 10 card slots and cash compartment",
          category: "Fashion",
          image:
            "https://realirish.com/cdn/shop/files/PhotoRoom_005_20231123_163446.jpg?v=1756334450&width=1214",
          stock: 207,
        },
        {
          name: "Matter-Compatible Smart Plug",
          price: 22.99,
          description: "Fast Wi-Fi smart outlet with Apple HomeKit support",
          category: "Electronics",
          image:
            "https://m.media-amazon.com/images/I/51HoIOEO0DL._AC_UF894,1000_QL80_.jpg",
          stock: 96,
        },
        {
          name: "Keurig K-Supreme Plus Coffee Maker",
          price: 169.99,
          description:
            "Single-serve brewer with multi-stream technology and strength control",
          category: "Home & Office",
          image:
            "https://media.istockphoto.com/id/1496662566/photo/coffee-machine-for-making-coffee.jpg?s=612x612&w=0&k=20&c=py1Zggn0XmEvHvuRMExz32jaMgIx9EKrts_5_go5Tog=",
          stock: 53,
        },
        {
          name: "Jabra Elite 10 True Wireless Earbuds",
          price: 279.99,
          description:
            "Advanced ANC earbuds with spatial sound and comfort fit",
          category: "Electronics",
          image:
            "https://content.abt.com/image.php/sony-earbuds-WFC710NB-front-closed-case-view.jpg?image=/images/products/BDP_Images/sony-earbuds-WFC710NB-front-closed-case-view.jpg&canvas=1&width=750&height=550",
          stock: 44,
        },
        {
          name: "Tramontina Gourmet Tri-Ply 8-Piece Set",
          price: 249.99,
          description: "Durable stainless steel cookware made in Brazil",
          category: "Home & Office",
          image:
            "https://assets.wsimgs.com/wsimgs/ab/images/dp/ecm/202340/2626/060/026.jpg",
          stock: 29,
        },
        {
          name: "Pull Up Assistance Resistance Bands Kit",
          price: 42.99,
          description: "Long bands set for strength training and mobility",
          category: "Sporting Goods",
          image:
            "https://bandsfactory.com/wp-content/uploads/2025/07/fitness-equipment-brand-color-palette-design.webp",
          stock: 77,
        },
        {
          name: "Rechargeable Portable Smoothie Blender",
          price: 49.99,
          description:
            "High-capacity personal blender with stainless steel blades",
          category: "Electronics",
          image:
            "https://m.media-amazon.com/images/I/51iumcfPVdL._AC_UF894,1000_QL80_.jpg",
          stock: 65,
        },
        {
          name: "UPPAbaby Vista V2 Full-Size Stroller",
          price: 999.99,
          description: "Modular stroller system with bassinet and toddler seat",
          category: "Baby Products",
          image:
            "https://static.independent.co.uk/2025/08/01/7/32/Best-strollers-IndyBest-review.png?crop=960,720,x60,y0&width=1200&height=900",
          stock: 21,
        },
        {
          name: "Vintage Style Leather Bifold Wallet",
          price: 54.99,
          description:
            "Handcrafted distressed leather wallet with antique hardware",
          category: "Fashion",
          image:
            "https://anvilcustoms.com/cdn/shop/files/anvil-bifold-leather-chain-wallet-brown-5g-wallets-anvil-customs-675050_5000x.jpg?v=1751942489",
          stock: 102,
        },
        {
          name: "Amazon Smart Plug",
          price: 24.99,
          description: "Easy setup Wi-Fi outlet with Alexa routines support",
          category: "Electronics",
          image:
            "https://m.media-amazon.com/images/S/aplus-media-library-service-media/e512285b-bbd0-4cf6-af23-36af32b7db2a.__CR0,0,1200,900_PT0_SX600_V1___.jpg",
          stock: 134,
        },
        {
          name: "Philips Airfryer XXL HD9650/96",
          price: 229.99,
          description:
            "Large capacity digital airfryer with Rapid Air technology for healthier frying",
          category: "Home & Office",
          image:
            "https://images.pexels.com/photos/4199099/pexels-photo-4199099.jpeg",
          stock: 38,
        },
        {
          name: "Xiaomi Mi Band 8 Fitness Tracker",
          price: 49.99,
          description:
            "Advanced activity tracker with AMOLED display, heart rate and sleep monitoring",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
          stock: 142,
        },
        {
          name: "Women's High-Waisted Yoga Leggings",
          price: 34.99,
          description:
            "Soft, stretchy leggings with tummy control and pockets for workouts",
          category: "Fashion",
          image:
            "https://images.pexels.com/photos/4498603/pexels-photo-4498603.jpeg",
          stock: 98,
        },
        {
          name: "CeraVe Moisturizing Cream 454g",
          price: 17.99,
          description:
            "Rich face and body moisturizer with ceramides and hyaluronic acid",
          category: "Health & Beauty",
          image:
            "https://images.pexels.com/photos/4041391/pexels-photo-4041391.jpeg",
          stock: 176,
        },
        {
          name: "Logitech G Pro X Superlight Wireless Mouse",
          price: 129.99,
          description: "Ultra-lightweight gaming mouse with HERO 25K sensor",
          category: "Gaming",
          image:
            "https://images.pexels.com/photos/2112651/pexels-photo-2112651.jpeg",
          stock: 47,
        },
        {
          name: "Baby Monitor with Camera and Night Vision",
          price: 89.99,
          description:
            "Digital video baby monitor with two-way audio and temperature sensor",
          category: "Baby Products",
          image:
            "https://images.pexels.com/photos/1625393/pexels-photo-1625393.jpeg",
          stock: 65,
        },
        {
          name: "Organic Chia Seeds 1kg",
          price: 12.99,
          description:
            "Premium black chia seeds rich in omega-3, fiber and protein",
          category: "Grocery",
          image:
            "https://images.pexels.com/photos/139746/pexels-photo-139746.jpeg",
          stock: 234,
        },
        {
          name: "Gas Grill with Side Burner 4-Burner",
          price: 399.99,
          description:
            "Stainless steel propane grill with porcelain-enameled cast iron grates",
          category: "Garden & Outdoors",
          image:
            "https://images.pexels.com/photos/109477/pexels-photo-109477.jpeg",
          stock: 29,
        },
        {
          name: "Car Jump Starter Power Bank 2000A",
          price: 79.99,
          description:
            "Portable battery booster with LED flashlight and USB charging",
          category: "Automobile",
          image:
            "https://images.pexels.com/photos/163543/pexels-photo-163543.jpeg",
          stock: 81,
        },
        {
          name: "Ergonomic Office Chair with Lumbar Support",
          price: 159.99,
          description:
            "Adjustable mesh chair with breathable back and padded seat",
          category: "Home & Office",
          image:
            "https://images.pexels.com/photos/271715/pexels-photo-271715.jpeg",
          stock: 52,
        },
        {
          name: "Samsung Galaxy Buds 2 Pro",
          price: 229.99,
          description: "Noise cancelling true wireless earbuds with 360 audio",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
          stock: 63,
        },
        {
          name: "Men's Running Jacket Windbreaker",
          price: 59.99,
          description: "Lightweight breathable jacket with reflective details",
          category: "Fashion",
          image:
            "https://images.pexels.com/photos/2529157/pexels-photo-2529157.jpeg",
          stock: 114,
        },
        {
          name: "Electric Kettle Stainless Steel 1.7L",
          price: 39.99,
          description:
            "Fast-boil kettle with auto shut-off and boil-dry protection",
          category: "Home & Office",
          image:
            "https://images.pexels.com/photos/4199099/pexels-photo-4199099.jpeg",
          stock: 87,
        },
        {
          name: "Wireless Charging Pad 15W",
          price: 24.99,
          description:
            "Fast wireless charger compatible with iPhone and Android",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg",
          stock: 156,
        },
        {
          name: "Protein Powder Whey Isolate 2kg",
          price: 59.99,
          description: "Low-carb, high-protein powder for muscle recovery",
          category: "Health & Beauty",
          image:
            "https://images.pexels.com/photos/6527036/pexels-photo-6527036.jpeg",
          stock: 92,
        },
        {
          name: "Mechanical Gaming Keyboard RGB",
          price: 89.99,
          description:
            "Hot-swappable RGB mechanical keyboard with blue switches",
          category: "Gaming",
          image:
            "https://images.pexels.com/photos/275909/pexels-photo-275909.jpeg",
          stock: 41,
        },
        {
          name: "Infant Car Seat with Base",
          price: 199.99,
          description: "Rear-facing infant carrier with easy installation base",
          category: "Baby Products",
          image:
            "https://images.pexels.com/photos/1625393/pexels-photo-1625393.jpeg",
          stock: 33,
        },
        {
          name: "Extra Virgin Coconut Oil 500ml",
          price: 14.99,
          description:
            "Cold-pressed organic coconut oil for cooking and beauty",
          category: "Grocery",
          image:
            "https://images.pexels.com/photos/60616/pexels-photo-60616.jpeg",
          stock: 198,
        },
        {
          name: "Solar Garden Lights Set of 12",
          price: 49.99,
          description: "Waterproof LED stake lights with auto on/off sensor",
          category: "Garden & Outdoors",
          image:
            "https://images.pexels.com/photos/109477/pexels-photo-109477.jpeg",
          stock: 105,
        },
        {
          name: "Tire Pressure Gauge Digital",
          price: 19.99,
          description:
            "Accurate digital gauge with backlight and multiple units",
          category: "Automobile",
          image:
            "https://images.pexels.com/photos/163543/pexels-photo-163543.jpeg",
          stock: 167,
        },
        {
          name: "Standing Desk Converter 32 inch",
          price: 129.99,
          description: "Adjustable sit-stand desk riser with gas spring lift",
          category: "Home & Office",
          image: "https://images.pexels.com/photos/7974/pexels-photo-7974.jpeg",
          stock: 26,
        },
        {
          name: "Bluetooth Portable Speaker IPX7",
          price: 69.99,
          description: "Waterproof wireless speaker with 24-hour playtime",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/1649771/pexels-photo-1649771.jpeg",
          stock: 78,
        },
        {
          name: "Men's Casual Hoodie Fleece",
          price: 44.99,
          description: "Soft cotton blend hoodie with kangaroo pocket",
          category: "Fashion",
          image:
            "https://images.pexels.com/photos/2983464/pexels-photo-2983464.jpeg",
          stock: 123,
        },
        {
          name: "Toaster 4-Slice Wide Slot",
          price: 54.99,
          description:
            "Stainless steel toaster with bagel and defrost settings",
          category: "Home & Office",
          image:
            "https://images.pexels.com/photos/4199099/pexels-photo-4199099.jpeg",
          stock: 59,
        },
        {
          name: "Smart LED Strip Lights 16.4ft",
          price: 29.99,
          description: "Color changing RGB lights with app and voice control",
          category: "Electronics",
          image:
            "https://images.pexels.com/photos/109477/pexels-photo-109477.jpeg",
          stock: 134,
        },
        {
          name: "Multivitamin Gummies Adult",
          price: 19.99,
          description:
            "Delicious fruit-flavored gummies with essential vitamins",
          category: "Health & Beauty",
          image:
            "https://images.pexels.com/photos/337909/pexels-photo-337909.jpeg",
          stock: 188,
        },
        {
          name: "KitchenAid Stand Mixer 5-Quart",
          price: 299.99,
          description:
            "Versatile tilt-head stand mixer with 10 speeds and multiple attachments",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 25,
        },
        {
          name: "Google Nest Mini 2nd Gen",
          price: 49.0,
          description:
            "Compact smart speaker with Google Assistant and improved sound",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1565814636196-2b02c6d0a6e8",
          stock: 120,
        },
        {
          name: "Women's Leather Crossbody Bag",
          price: 89.99,
          description:
            "Genuine leather purse with adjustable strap and multiple compartments",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1566150902887-47cad861f1da",
          stock: 55,
        },
        {
          name: "The Ordinary Niacinamide 10% + Zinc 1% Serum",
          price: 10.5,
          description:
            "High-strength vitamin and mineral formula for blemish-prone skin",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8",
          stock: 180,
        },
        {
          name: "Dell XPS 13 Laptop",
          price: 999.0,
          description:
            "Ultra-portable laptop with InfinityEdge display and Intel Core i7",
          category: "Computing",
          image: "https://images.unsplash.com/photo-1589739907049-2d5b682b6e6f",
          stock: 18,
        },
        {
          name: "Nutribullet Pro 900W Blender",
          price: 99.99,
          description:
            "High-speed personal blender with nutrient extraction blades",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1570222094114-d054a8f887b8",
          stock: 62,
        },
        {
          name: "Adidas Ultraboost 22 Running Shoes",
          price: 180.0,
          description:
            "Energy-returning running shoes with Primeknit upper and BOOST cushioning",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1605732659567-4d6d0e3f3e3a",
          stock: 40,
        },
        {
          name: "Quaker Oats Old Fashioned 2.26kg",
          price: 8.99,
          description: "100% whole grain rolled oats for healthy breakfasts",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8",
          stock: 210,
        },
        {
          name: "Ring Video Doorbell 4",
          price: 199.99,
          description:
            "Wireless video doorbell with improved motion detection and color night vision",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1589829545856-d10d6b0a2e4a",
          stock: 35,
        },
        {
          name: "Pampers Swaddlers Diapers Size 2 - 186 Count",
          price: 49.99,
          description:
            "Soft disposable diapers with heart quilts and wetness indicator",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1602829961351-1eb698e5d53e",
          stock: 95,
        },
        {
          name: "Columbia Men's Watertight II Rain Jacket",
          price: 75.0,
          description: "Packable waterproof jacket with Omni-Tech technology",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1605733513530-2f5b1c3d4f2e",
          stock: 70,
        },
        {
          name: "Traeger Pro 575 Pellet Grill",
          price: 799.99,
          description:
            "WiFi-enabled wood pellet grill with precise temperature control",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3",
          stock: 12,
        },
        {
          name: "LG 4.5 cu. ft. Front Load Washer",
          price: 799.0,
          description:
            "High-efficiency washer with AI DD technology and steam cycle",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          stock: 8,
        },
        {
          name: "Oakley Holbrook Sunglasses",
          price: 143.0,
          description: "Classic sunglasses with Prizm lens technology",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f",
          stock: 85,
        },
        {
          name: "La Roche-Posay Anthelios Melt-in Milk Sunscreen SPF 60",
          price: 35.99,
          description:
            "Broad spectrum sunscreen for face and body with water resistance",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e",
          stock: 110,
        },
        {
          name: "Chemical Guys Car Wash Bucket Kit",
          price: 99.99,
          description:
            "Complete car detailing kit with buckets, mitts and soaps",
          category: "Automobile",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
          stock: 45,
        },
        {
          name: "Razer BlackShark V2 Gaming Headset",
          price: 99.99,
          description:
            "Esports headset with THX Spatial Audio and detachable mic",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
          stock: 50,
        },
        {
          name: "Cuisinart Coffee Maker 12-Cup",
          price: 99.95,
          description: "Programmable coffee brewer with brew strength control",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7",
          stock: 60,
        },
        {
          name: "Paula's Choice Skin Perfecting 2% BHA Liquid Exfoliant",
          price: 32.0,
          description:
            "Salicylic acid exfoliator for unclogging pores and smoothing skin",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1608248597788-35336b7f6d4e",
          stock: 140,
        },
        {
          name: "Black+Decker Dustbuster Handheld Vacuum",
          price: 59.99,
          description: "Cordless lithium handheld vac with cyclonic action",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1558312657-b2dead03d494",
          stock: 75,
        },
        {
          name: "Samsung Galaxy Tab S9",
          price: 799.99,
          description:
            "11-inch Android tablet with S Pen and dynamic AMOLED display",
          category: "Phones & Tablets",
          image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
          stock: 30,
        },
        {
          name: "Tommy Hilfiger Men's Polo Shirt",
          price: 49.5,
          description: "Classic fit cotton polo with embroidered logo",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1521577352947-9bb58764b69a",
          stock: 100,
        },
        {
          name: "Olly Women's Multivitamin Gummies",
          price: 13.99,
          description: "Daily multivitamin gummies with biotin and folic acid",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e",
          stock: 160,
        },
        {
          name: 'HP Envy x360 15.6" 2-in-1 Laptop',
          price: 749.99,
          description: "Convertible laptop with AMD Ryzen 5 and touchscreen",
          category: "Computing",
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39d7",
          stock: 22,
        },
        {
          name: "Instant Vortex Plus 6-Quart Air Fryer",
          price: 119.99,
          description: "7-in-1 air fryer with EvenCrisp technology",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1582359646256-1d4d7e6e7e8d",
          stock: 48,
        },
        {
          name: "Under Armour Men's Tech 2.0 T-Shirt",
          price: 25.0,
          description: "Loose-fit moisture-wicking t-shirt for workouts",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
          stock: 130,
        },
        {
          name: "Heinz Tomato Ketchup 1.25L",
          price: 4.99,
          description: "Classic thick and rich tomato ketchup",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1475856044411-f9f1d2e6c2f4",
          stock: 250,
        },
        {
          name: "Echo Dot 5th Gen",
          price: 49.99,
          description: "Smart speaker with Alexa and motion detection",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1565814636196-2b02c6d0a6e8",
          stock: 90,
        },
        {
          name: "Fisher-Price Laugh & Learn Smart Stages Chair",
          price: 39.99,
          description: "Interactive learning toy chair with songs and phrases",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1588880331179-46d541a819de",
          stock: 70,
        },
        {
          name: "Merrell Moab 3 Hiking Shoes",
          price: 120.0,
          description: "Ventilated mesh hiking shoes with Vibram traction",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1600185365926-3a2c2e8f3d4e",
          stock: 55,
        },
        {
          name: "Solo Stove Bonfire 2.0",
          price: 299.99,
          description: "Smokeless portable fire pit with removable ash pan",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1602536052359-ef94c21c5948",
          stock: 20,
        },
        {
          name: "Whirlpool 1.9 cu. ft. Over-the-Range Microwave",
          price: 349.0,
          description: "Sensor cooking microwave with steam clean option",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 15,
        },
        {
          name: "Beats Studio Buds+",
          price: 169.99,
          description: "True wireless earbuds with ANC and transparency mode",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1605640840603-14ac1855827b",
          stock: 65,
        },
        {
          name: "Cetaphil Gentle Skin Cleanser 473ml",
          price: 12.99,
          description: "Mild, non-irritating cleanser for sensitive skin",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1559591937-4a2a5b9d9248",
          stock: 150,
        },
        {
          name: "Thule Roof Rack System",
          price: 399.95,
          description: "AeroBlade edge roof rack kit for vehicles",
          category: "Automobile",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
          stock: 28,
        },
        {
          name: "Logitech G29 Driving Force Racing Wheel",
          price: 299.99,
          description: "Force feedback racing wheel with pedals for PS5/PC",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          stock: 32,
        },
        {
          name: "Braun Series 9 Electric Shaver",
          price: 299.99,
          description: "Premium electric foil shaver with cleaning station",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1559591937-4a2a5b9d9248",
          stock: 40,
        },
        {
          name: "Roomba i3+ EVO Robot Vacuum",
          price: 549.99,
          description: "Self-emptying robot vacuum with smart mapping",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1561070791-a2c455f5b8b2",
          stock: 25,
        },
        {
          name: "New Balance 574 Sneakers",
          price: 74.99,
          description: "Classic retro sneakers with ENCAP midsole cushioning",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1602293589930-45aad59ba3ab",
          stock: 95,
        },
        {
          name: "Nature Made Fish Oil 1200mg Softgels 200 Count",
          price: 19.99,
          description: "Omega-3 supplement for heart health",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1615397349754-cfa2066a298e",
          stock: 200,
        },
        {
          name: "Microsoft Surface Pro 9",
          price: 999.99,
          description:
            '2-in-1 tablet/laptop with Intel Core i5 and 13" touchscreen',
          category: "Computing",
          image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39d7",
          stock: 20,
        },
        {
          name: "Calphalon Classic Nonstick Fry Pan Set",
          price: 49.99,
          description:
            "8-inch and 10-inch nonstick fry pans with stay-cool handles",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 80,
        },
        {
          name: "CamelBak Eddy+ Water Bottle 25oz",
          price: 15.0,
          description: "BPA-free insulated water bottle with bite valve",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba",
          stock: 140,
        },
        {
          name: "Kellogg's Corn Flakes 1.13kg",
          price: 6.99,
          description: "Classic toasted corn flakes cereal",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8",
          stock: 220,
        },
        {
          name: "Sonos Era 100 Speaker",
          price: 249.0,
          description: "Wireless smart speaker with Trueplay tuning",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1605640840603-14ac1855827b",
          stock: 45,
        },
        {
          name: "BabyBjorn Bouncer Balance Soft",
          price: 199.99,
          description: "Ergonomic baby bouncer with natural rocking motion",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1602829961351-1eb698e5d53e",
          stock: 30,
        },
        {
          name: "Salomon Speedcross 6 Trail Running Shoes",
          price: 140.0,
          description: "Aggressive grip trail runners for off-road adventures",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1605732659567-4d6d0e3f3e3a",
          stock: 50,
        },
        {
          name: "Big Green Egg Large Ceramic Grill",
          price: 999.99,
          description: "Versatile kamado-style ceramic cooker and smoker",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1600028068383-ea11a7a101f3",
          stock: 10,
        },
        {
          name: 'Samsung 30" Electric Cooktop',
          price: 699.0,
          description: "Smooth glass ceramic cooktop with rapid boil elements",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          stock: 15,
        },
        {
          name: "Garmin Forerunner 265 GPS Watch",
          price: 449.99,
          description: "Advanced running smartwatch with AMOLED display",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1617049043593-2a0a2a8d7b9e",
          stock: 35,
        },
        {
          name: "Differin Adapalene Gel 0.1% Acne Treatment",
          price: 14.99,
          description: "Dermatologist-recommended retinoid for acne",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1608248597788-35336b7f6d4e",
          stock: 170,
        },
        {
          name: "Escort MAX 360c Radar Detector",
          price: 649.95,
          description: "Dual-antenna radar/laser detector with app integration",
          category: "Automobile",
          image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70",
          stock: 20,
        },
        {
          name: "Corsair K70 RGB MK.2 Mechanical Keyboard",
          price: 169.99,
          description:
            "Cherry MX switches gaming keyboard with dynamic lighting",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
          stock: 40,
        },
        {
          name: "KitchenAid Food Processor 9-Cup",
          price: 149.99,
          description:
            "Multi-function food processor with one-click bowl assembly",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 55,
        },
        {
          name: "Vaseline Lip Therapy Balm Stick",
          price: 2.99,
          description: "Moisturizing lip balm with petroleum jelly",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1570194066981-617ac1bcr5b5",
          stock: 300,
        },
        {
          name: "Shark Navigator Lift-Away Upright Vacuum",
          price: 199.99,
          description:
            "Anti-allergen vacuum with detachable pod for portable cleaning",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1558312657-b2dead03d494",
          stock: 45,
        },
        {
          name: "Motorola Razr+ (2024)",
          price: 999.99,
          description:
            "Foldable smartphone with external display and AI features",
          category: "Phones & Tablets",
          image: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c",
          stock: 25,
        },
        {
          name: "Calvin Klein Men's Boxer Briefs 3-Pack",
          price: 39.5,
          description: "Cotton stretch boxer briefs with logo waistband",
          category: "Fashion",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
          stock: 150,
        },
        {
          name: "Now Foods Essential Oils Lavender 30ml",
          price: 9.99,
          description: "100% pure lavender oil for aromatherapy",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1571934811356-5cc061b6821f",
          stock: 190,
        },
        {
          name: "Acer Predator Helios 300 Gaming Laptop",
          price: 1199.99,
          description: "Gaming laptop with RTX 3060 GPU and 144Hz display",
          category: "Computing",
          image: "https://images.unsplash.com/photo-1588109273901-3106751cc5f0",
          stock: 15,
        },
        {
          name: "Hamilton Beach Breakfast Sandwich Maker",
          price: 29.99,
          description: "Single sandwich maker with removable nonstick plates",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1556911220-b0b895fafb40",
          stock: 85,
        },
        {
          name: "Wilson Evolution Basketball",
          price: 74.99,
          description:
            "Official size indoor basketball with microfiber composite cover",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438",
          stock: 60,
        },
        {
          name: "Barilla Spaghetti Pasta 500g x 4",
          price: 7.99,
          description:
            "Classic Italian spaghetti made from durum wheat semolina",
          category: "Grocery",
          image: "https://images.unsplash.com/photo-1475856044411-f9f1d2e6c2f4",
          stock: 240,
        },
        {
          name: "Roku Streaming Stick 4K",
          price: 49.99,
          description: "4K HDR streaming device with voice remote",
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1",
          stock: 100,
        },
        {
          name: "Medela Pump In Style Breast Pump",
          price: 199.99,
          description:
            "Double electric breast pump with personal fit flex shields",
          category: "Baby Products",
          image: "https://images.unsplash.com/photo-1588880331179-46d541a819de",
          stock: 35,
        },
        {
          name: "Brooks Ghost 15 Running Shoes",
          price: 140.0,
          description: "Neutral cushioned road running shoes with DNA LOFT v3",
          category: "Sporting Goods",
          image: "https://images.unsplash.com/photo-1605732659567-4d6d0e3f3e3a",
          stock: 50,
        },
        {
          name: "Osprey Atmos AG 65 Backpack",
          price: 340.0,
          description:
            "Anti-gravity suspension hiking backpack for multi-day trips",
          category: "Garden & Outdoors",
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62",
          stock: 25,
        },
        {
          name: "Frigidaire 26 lb. Countertop Ice Maker",
          price: 129.99,
          description: "Portable ice maker produces 26 lbs of ice per day",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
          stock: 40,
        },
        {
          name: "Meta Quest 3 VR Headset 128GB",
          price: 499.99,
          description: "Advanced all-in-one VR headset with mixed reality",
          category: "Gaming",
          image: "https://images.unsplash.com/photo-1578301978069-45264734cddc",
          stock: 30,
        },
        {
          name: "Crest 3D White Whitestrips",
          price: 44.99,
          description:
            "Professional effects teeth whitening kit - 20 treatments",
          category: "Health & Beauty",
          image: "https://images.unsplash.com/photo-1559591937-4a2a5b9d9248",
          stock: 120,
        },
        {
          name: "Honeywell Home RTH9585WF Smart Thermostat",
          price: 169.99,
          description: "Wi-Fi color touchscreen thermostat with voice control",
          category: "Home & Office",
          image: "https://images.unsplash.com/photo-1589829545856-d10d6b0a2e4a",
          stock: 50,
        },
        {
          name: "4-Slice Stainless Steel Toaster",
          price: 49.99,
          description:
            "Modern wide-slot toaster with bagel, defrost and reheat functions",
          category: "Home & Office",
          image:
            "https://media.istockphoto.com/id/2028236550/photo/a-stainless-steel-toaster-with-double-long-slot-and-wide-slot-for-all-types-of-bread-isolated.jpg?s=612x612&w=0&k=20&c=C_ipOHDh5gUSDMd08-KEI9efLxwxfJIhwak2doKx35g=",
          stock: 92,
        },
        {
          name: "True Wireless Bluetooth Earbuds",
          price: 59.99,
          description:
            "Compact in-ear earphones with charging case, touch controls and IPX5 waterproof rating",
          category: "Electronics",
          image:
            "https://media.gettyimages.com/id/1364398522/photo/white-electronic-bluetooth-earphones-and-case-technical-isolated-on-white-background.jpg?s=612x612&w=gi&k=20&c=A3zQujumc5d0xlB9x-_3ffVbJjr_FDEy9rP2ZIb7xCs=",
          stock: 145,
        },
        {
          name: "Genuine Leather Men's Bifold Wallet",
          price: 44.99,
          description:
            "Slim RFID-blocking leather wallet with 8 card slots and bill compartment",
          category: "Fashion",
          image:
            "https://m.media-amazon.com/images/I/61gXxP84dKL.jpg_BO30,255,255,255_UF900,850_SR1910,1000,0,C_QL100_.jpg",
          stock: 168,
        },
        {
          name: "Ceramic Non-Stick 10-Piece Cookware Set",
          price: 149.99,
          description:
            "PFOA-free colorful ceramic coated pots and pans with tempered glass lids",
          category: "Home & Office",
          image:
            "https://m.media-amazon.com/images/I/61sHUQDV14L._AC_UF894,1000_QL80_.jpg",
          stock: 42,
        },
        {
          name: "Eco-Friendly Yoga Mat 6mm",
          price: 32.99,
          description:
            "Non-slip TPE yoga mat with alignment lines and carrying strap",
          category: "Sporting Goods",
          image:
            "https://media.istockphoto.com/id/1324877187/photo/close-up-of-athletic-woman-rolling-up-her-exercise-mat-after-practicing-at-health-club.jpg?s=612x612&w=0&k=20&c=p8aas4SeJ59cnsHbym2WLIhhHT2855XU01IgnhwBIHM=",
          stock: 110,
        },
        {
          name: "Glass Baby Bottle 8oz with Silicone Nipple",
          price: 14.99,
          description:
            "Borosilicate glass bottle with anti-colic silicone nipple and measurement markings",
          category: "Baby Products",
          image:
            "https://thumbs.dreamstime.com/b/minimalist-studio-shot-features-clear-empty-baby-bottle-separate-nipple-its-cap-both-rendered-clean-modern-style-402594177.jpg",
          stock: 135,
        },
        {
          name: "Extra Virgin Olive Oil 750ml Dark Glass Bottle",
          price: 16.99,
          description:
            "Cold-pressed Mediterranean olive oil in UV-protective dark glass",
          category: "Grocery",
          image:
            "https://m.media-amazon.com/images/S/aplus-media-library-service-media/8b9e95e6-b263-4434-9371-929ef111967c.__CR0,2,600,450_PT0_SX600_V1___.jpg",
          stock: 210,
        },
        {
          name: "Portable Folding Camping Chair",
          price: 39.99,
          description:
            "Lightweight aluminum camping chair with padded seat and carry bag",
          category: "Garden & Outdoors",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2024/04/campingchairs-2048px-09862.jpg?auto=webp&quality=75&width=1024",
          stock: 78,
        },
        {
          name: "Magnetic Dashboard Car Phone Mount",
          price: 24.99,
          description:
            "Strong magnet phone holder for car dashboard with 360° rotation",
          category: "Automobile",
          image:
            "https://m.media-amazon.com/images/S/aplus-media-library-service-media/28c680a5-1c15-4d4c-8fab-81713201c464.__CR0,0,600,450_PT0_SX600_V1___.png",
          stock: 195,
        },
        {
          name: "RGB Wireless Gaming Headset",
          price: 79.99,
          description:
            "Over-ear gaming headset with noise-cancelling mic and 40-hour battery",
          category: "Gaming",
          image:
            "https://m.media-amazon.com/images/S/aplus-media-library-service-media/8ae29d93-2513-41e0-bcde-0625def2242f.__CR332,0,800,600_PT0_SX600_V1___.jpg",
          stock: 56,
        },
        {
          name: "Adjustable Dumbbell Set 5-25kg",
          price: 249.99,
          description:
            "Quick-change adjustable dumbbells pair with dial selector system",
          category: "Sporting Goods",
          image:
            "https://media.istockphoto.com/id/1392359093/photo/woman-finishing-up-yoga-practice.jpg?s=612x612&w=0&k=20&c=qVXVZE6bhSRl6jbf3sqN7NWUyoV_ekSfKnU-kvLpBEA=",
          stock: 33,
        },
        {
          name: "Portable Espresso Maker Handheld",
          price: 69.99,
          description: "Manual mini espresso machine for travel and camping",
          category: "Home & Office",
          image:
            "https://thumbs.dreamstime.com/b/shiny-stainless-steel-toaster-perfect-making-toast-kitchen-necessity-quick-breakfast-modern-clean-design-appliance-400323816.jpg",
          stock: 48,
        },
        {
          name: "LED Desk Lamp with USB Port",
          price: 34.99,
          description:
            "Eye-caring LED lamp with touch control, timer and phone charging",
          category: "Home & Office",
          image: "https://thumbs.dreamstime.com/b/toaster-15788996.jpg",
          stock: 89,
        },
        {
          name: "Organic Cotton Baby Onesie 5-Pack",
          price: 29.99,
          description: "Soft 100% organic cotton bodysuits with snap closure",
          category: "Baby Products",
          image:
            "https://static.vecteezy.com/system/resources/thumbnails/067/685/099/small/glass-baby-bottle-with-milk-and-nipple-isolated-on-transparent-background-png.png",
          stock: 160,
        },
        {
          name: "Wireless Mouse Ergonomic Vertical",
          price: 39.99,
          description:
            "Vertical design mouse to reduce wrist strain with adjustable DPI",
          category: "Computing",
          image:
            "https://media.istockphoto.com/id/513983116/photo/olive-oil-and-berries.jpg?s=612x612&w=0&k=20&c=Qb8YNL-iMM6xldjl3VIF30ZmPDwr86MeS2qtKSxJIeI=",
          stock: 105,
        },
        {
          name: "Stainless Steel Water Bottle 1L",
          price: 24.99,
          description:
            "Double-wall insulated bottle keeps drinks cold 24h / hot 12h",
          category: "Sporting Goods",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2024/04/campingchairs-2048px-09847.jpg?auto=webp&quality=75&width=1024",
          stock: 130,
        },
        {
          name: "Noise Cancelling Over-Ear Headphones",
          price: 129.99,
          description: "Wireless ANC headphones with 30-hour battery life",
          category: "Electronics",
          image:
            "https://content.abt.com/image.php/logitech-gaming-headset-981-000863-side.jpg?image=/images/products/BDP_Images/logitech-gaming-headset-981-000863-side.jpg&canvas=1&width=750&height=550",
          stock: 67,
        },
        {
          name: "Silicone Baking Mat Set of 2",
          price: 19.99,
          description:
            "Non-stick reusable baking mats for cookies and pastries",
          category: "Home & Office",
          image:
            "https://cld.accentuate.io/559546466472/1683038262831/GP_Valencia_20cmFrypan_Eggslide_ShotB_04.jpg?v=1683038262831&options=w_870,h_700",
          stock: 185,
        },
        {
          name: "Men's Waterproof Hiking Backpack 40L",
          price: 79.99,
          description:
            "Durable backpack with rain cover and multiple compartments",
          category: "Garden & Outdoors",
          image:
            "https://cdn.thewirecutter.com/wp-content/media/2024/04/campingchairs-2048px-09840.jpg?auto=webp&quality=75&width=1024",
          stock: 38,
        },
        {
          name: "Portable Power Bank 20000mAh",
          price: 44.99,
          description:
            "High-capacity charger with fast charging and LED display",
          category: "Electronics",
          image: "https://m.media-amazon.com/images/I/91kjptE4VHL.jpg",
          stock: 112,
        },
      ];

      await db.collection("products").insertMany(products);
      console.log("Sample products created");
    }

    console.log("Database initialized successfully");
  } finally {
    await client.close();
  }
}

initDB().catch(console.error);
