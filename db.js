const {Pool}=require("pg");
require("dotenv").config();
const pool = new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl:{rejectUnauthorized:false}
})
module.exports=pool;
async function ech(){
//create a table for products
async function createTableProducts() {
    try{
        const query=`create table if not exists products(
        id serial primary key,
        name varchar(25),
        price int,
        currencyType varchar(25),
        description varchar(70),
        longDescription varchar(255),
        review int,
        quantity int,
        image varchar(255),
        catagory varchar(25)
        
        );`;
        const query2=`create table if not exists buyers(
        id serial primary key,
        fullName varchar(25) not null,
        email varchar(255) not null,
        password varchar(255) not null
        );`
        const query3=`CREATE TABLE IF NOT EXISTS cart_items (
         id SERIAL PRIMARY KEY,
         user_id INT NOT NULL ,FOREIGN KEY(user_id) REFERENCES buyers(id),
         product_id INT NOT NULL,
         FOREIGN KEY(product_id) REFERENCES products(id),
         UNIQUE(user_id,product_id),
         quantity INT NOT NULL DEFAULT 1,
         added_at TIMESTAMP DEFAULT now());
    `;
//   CREATE TABLE orders (
//   id SERIAL PRIMARY KEY,
//   user_id INT NOT NULL,
//   total NUMERIC NOT NULL,
//   status VARCHAR(20) NOT NULL,
//   created_at TIMESTAMP DEFAULT now()
// );

// CREATE TABLE order_items (
//   id SERIAL PRIMARY KEY,
//   order_id INT NOT NULL REFERENCES orders(id),
//   product_id INT NOT NULL,
//   quantity INT NOT NULL,
//   price NUMERIC NOT NULL
// );

        await pool.query(query);
            await pool.query(query2);
            await pool.query(query3);
            // await pool.query(query4)
        console.log("table created");
    //     let Name='wireless Mouse';
    //     let checkQuery=`select * from products where name ilike $1 limit 10 offset 0`;
    //    const select= await pool.query(checkQuery,[`%${Name}%`]);
    //    console.log(select.rows)

    }
    catch(err){
        console.log("can't create table for products",err)}
    }
    //create a table for products
    async function createdataProducts() {
        try{
            const query=`INSERT INTO products
(name, price, currencyType, description, longDescription, review, quantity, image, catagory)
VALUES
('Wireless Mouse', 25, 'USD', 'Ergonomic wireless mouse', 'Comfortable ergonomic wireless mouse with long battery life and adjustable DPI settings.', 4, 120, 'images/mouse.jpg', 'Electronics'),
('Mechanical Keyboard', 79, 'USD', 'RGB mechanical keyboard', 'High-quality mechanical keyboard with customizable RGB lighting and tactile switches.', 5, 60, 'images/keyboard.jpg', 'Electronics'),
('Bluetooth Speaker', 45, 'USD', 'Portable bluetooth speaker', 'Portable Bluetooth speaker with deep bass, waterproof design, and 12-hour battery.', 4, 85, 'images/speaker.jpg', 'Audio'),
('Gaming Headset', 69, 'USD', 'Surround sound headset', 'Premium gaming headset with noise-cancelling microphone and 7.1 surround sound.', 5, 40, 'images/headset.jpg', 'Gaming'),
('Smart Watch', 120, 'USD', 'Bluetooth smart watch', 'Fitness-tracking smartwatch featuring heart-rate monitor, GPS, and message notifications.', 4, 30, 'images/smartwatch.jpg', 'Wearables'),
('USB-C Charger', 18, 'USD', 'Fast USB-C charger', '20W fast-charging USB-C wall charger compatible with most modern smartphones and tablets.', 5, 300, 'images/charger.jpg', 'Accessories'),
('Portable SSD', 99, 'USD', '1TB portable SSD', 'High-speed 1TB portable SSD for secure data storage and fast file transfers.', 5, 50, 'images/ssd.jpg', 'Storage'),
('Laptop Stand', 29, 'USD', 'Adjustable laptop stand', 'Lightweight aluminum laptop stand with adjustable height and improved ventilation.', 4, 100, 'images/laptop-stand.jpg', 'Office'),
('Webcam 1080p', 39, 'USD', 'Full HD webcam', '1080p Full HD webcam ideal for video calls, streaming, and remote work.', 4, 80, 'images/webcam.jpg', 'Electronics'),
('Desk Lamp', 22, 'USD', 'LED desk lamp', 'Bright LED desk lamp with adjustable brightness levels and flexible neck design.', 4, 150, 'images/desk-lamp.jpg', 'Home'),
('Gaming Chair', 150, 'USD', 'Ergonomic gaming chair', 'Ergonomic high-back gaming chair with lumbar support and adjustable armrests.', 5, 20, 'images/gaming-chair.jpg', 'Furniture'),
('4K Monitor', 299, 'USD', '27-inch 4K display', '27-inch 4K Ultra HD monitor with vibrant colors and ultra-thin bezels.', 5, 25, 'images/4k-monitor.jpg', 'Electronics'),
('Noise Cancelling Earbuds', 59, 'USD', 'Wireless ANC earbuds', 'Compact wireless earbuds with active noise cancellation and premium audio quality.', 4, 90, 'images/earbuds.jpg', 'Audio'),
('Smartphone Tripod', 19, 'USD', 'Flexible phone tripod', 'Flexible, lightweight tripod ideal for travel photography and mobile videography.', 4, 140, 'images/tripod.jpg', 'Accessories'),
('Portable Power Bank', 35, 'USD', '10,000mAh power bank', 'High-capacity portable power bank with dual outputs and rapid charging support.', 5, 200, 'images/powerbank.jpg', 'Accessories'),
('Fitness Tracker', 49, 'USD', 'Activity fitness tracker', 'Water-resistant fitness tracker with step counter, sleep tracking, and calorie monitor.', 4, 70, 'images/fitness-tracker.jpg', 'Wearables'),
('HDMI Cable', 10, 'USD', 'High-speed HDMI cable', '6-foot high-speed HDMI cable supporting 4K resolution and HDR compatibility.', 5, 400, 'images/hdmi-cable.jpg', 'Accessories'),
('Wireless Router', 89, 'USD', 'Dual-band WiFi router', 'Fast dual-band wireless router with extended coverage and advanced security.', 4, 35, 'images/router.jpg', 'Electronics'),
('Office Chair', 129, 'USD', 'Comfort office chair', 'Comfortable office chair with breathable mesh back and adjustable height.', 4, 22, 'images/office-chair.jpg', 'Furniture'),
('Wireless Charger', 25, 'USD', 'Fast wireless charger pad', 'Slim wireless charging pad with stable output and wide compatibility for phones.', 4, 120, 'images/wireless-charger.jpg', 'Electronics'),
('Gaming Mouse Lite', 32, 'USD', 'Lightweight gaming mouse', 'Ultra-light gaming mouse offering smooth control and adjustable DPI settings.', 5, 80, 'images/gaming-mouse-lite.jpg', 'Gaming'),
('Mini Bluetooth Speaker', 28, 'USD', 'Compact Bluetooth speaker', 'Portable speaker with powerful audio and long battery life for daily use.', 4, 150, 'images/mini-speaker.jpg', 'Audio'),
('LED Desk Light', 20, 'USD', 'LED desk light adjustable', 'Flexible LED lamp with adjustable brightness for reading and work setups.', 4, 200, 'images/desk-light.jpg', 'Home'),
('USB Hub 4-Port', 15, 'USD', 'High-speed USB hub', 'Compact USB hub offering four ports for keyboards, drives, and accessories.', 5, 400, 'images/usb-hub.jpg', 'Accessories'),
('Phone Stand Compact', 12, 'USD', 'Compact phone holder', 'Durable adjustable phone stand ideal for videos, calls, and desks.', 4, 180, 'images/phone-stand.jpg', 'Accessories'),
('Laptop Sleeve 15', 22, 'USD', 'Soft laptop sleeve 15', 'Padded laptop sleeve that protects devices and resists scratches and drops.', 5, 90, 'images/laptop-sleeve.jpg', 'Office'),
('Smartwatch Fit', 45, 'USD', 'Fitness tracking watch', 'Lightweight fitness smartwatch featuring heart rate tracking and alerts.', 4, 70, 'images/smartwatch-fit.jpg', 'Wearables'),
('Portable SSD 512', 69, 'USD', 'Fast 512GB SSD', 'Portable 512GB SSD with fast transfer speed and durable shock-resistant body.', 5, 40, 'images/ssd-512.jpg', 'Storage'),
('HD Webcam Pro', 39, 'USD', 'HD webcam for calls', '1080p webcam with clear video quality and built-in noise reduction mic.', 4, 60, 'images/hd-webcam.jpg', 'Electronics'),
('Gaming Keyboard TKL', 59, 'USD', 'TKL gaming keyboard', 'Compact TKL mechanical keyboard with high-quality switches and RGB effects.', 5, 45, 'images/tkl-keyboard.jpg', 'Gaming'),
('Bluetooth Earset', 34, 'USD', 'Wireless earset', 'Comfortable wireless earset offering crisp sound and long battery hours.', 4, 110, 'images/earset.jpg', 'Audio'),
('Desk Organizer Mini', 16, 'USD', 'Small desk organizer', 'Compact organizer with sections for pens, notes, and small work tools.', 4, 140, 'images/desk-organizer-mini.jpg', 'Office'),
('LED Strip Basic', 18, 'USD', 'Basic LED strip lights', 'Easy-install LED strip lights offering bright colors for rooms and decor.', 5, 260, 'images/led-strip-basic.jpg', 'Home'),
('Mousepad XL', 14, 'USD', 'Large gaming mousepad', 'Smooth and durable XXL mousepad offering stable control for gaming.', 4, 300, 'images/mousepad-xl.jpg', 'Gaming'),
('Power Bank Mini', 24, 'USD', '5000mAh mini power bank', 'Compact power bank providing reliable backup power for mobile devices.', 4, 170, 'images/powerbank-mini.jpg', 'Accessories'),
('HDMI Cable Pro', 10, 'USD', 'High-speed HDMI cable', 'Durable HDMI cable supporting 4K output for monitors and TVs.', 5, 500, 'images/hdmi-pro.jpg', 'Accessories'),
('WiFi Router Lite', 59, 'USD', 'Basic WiFi router', 'Stable dual-band router offering wide coverage and secure connections.', 4, 50, 'images/router-lite.jpg', 'Electronics'),
('Office Chair Mesh', 95, 'USD', 'Mesh office chair', 'Comfortable office chair with breathable mesh back and adjustable height.', 4, 25, 'images/mesh-chair.jpg', 'Furniture'),
('Keyboard Wrist Pad', 12, 'USD', 'Typing wrist rest pad', 'Soft ergonomic wrist pad designed to reduce stress during long typing.', 5, 210, 'images/wrist-pad.jpg', 'Office'),
('Smart Bulb Color', 14, 'USD', 'Smart RGB bulb', 'WiFi-enabled smart bulb offering full RGB control through mobile apps.', 4, 280, 'images/smart-bulb-color.jpg', 'Home'),
('Electric Kettle Mini', 22, 'USD', 'Mini electric kettle', 'Small electric kettle that boils water fast and includes auto shutoff.', 4, 130, 'images/kettle-mini.jpg', 'Home'),
('Air Purifier Lite', 55, 'USD', 'Small air purifier', 'Compact purifier using HEPA filtration to reduce dust and allergens.', 5, 60, 'images/purifier-lite.jpg', 'Home'),
('Solar Light Set', 26, 'USD', 'Solar garden lights', 'Outdoor solar-powered LED lights ideal for pathways and gardens.', 4, 200, 'images/solar-set.jpg', 'Outdoor'),
('Tool Kit Basic', 29, 'USD', 'Basic tool kit set', 'Starter tool kit including screwdrivers, pliers, and tape measure.', 5, 75, 'images/tool-kit-basic.jpg', 'Tools'),
('USB Desk Fan', 14, 'USD', 'USB cooling fan', 'Portable USB fan with quiet operation and adjustable angle.', 4, 300, 'images/desk-fan.jpg', 'Home'),
('Electric Toothbrush X', 39, 'USD', 'Rechargeable toothbrush', 'Electric toothbrush offering multiple cleaning modes and long runtime.', 5, 95, 'images/toothbrush-x.jpg', 'PersonalCare'),
('Hair Dryer Compact', 27, 'USD', 'Compact hair dryer', 'Lightweight hair dryer with strong airflow and quick-dry tech.', 4, 140, 'images/hair-dryer-compact.jpg', 'PersonalCare'),
('Water Bottle Steel', 17, 'USD', 'Insulated steel bottle', 'Stainless steel bottle keeping drinks cold or hot for long hours.', 5, 240, 'images/steel-bottle.jpg', 'Outdoor'),
('Camping Tent Duo', 89, 'USD', 'Two-person camp tent', 'Easy-setup tent perfect for camping trips with weather-resistant fabric.', 4, 30, 'images/tent-duo.jpg', 'Outdoor'),
('Yoga Mat Soft', 19, 'USD', 'Soft yoga mat', 'Comfortable yoga mat with non-slip surface ideal for workouts.', 5, 220, 'images/yoga-soft.jpg', 'Fitness'),
('Jump Rope Pro', 11, 'USD', 'Speed jump rope', 'Adjustable jump rope built for fast cardio and smooth rotation.', 4, 260, 'images/jump-pro.jpg', 'Fitness'),
('Thermometer Quick', 12, 'USD', 'Fast digital thermometer', 'Accurate digital thermometer ideal for quick temperature checks.', 4, 130, 'images/thermometer-quick.jpg', 'Health'),
('Hair Clipper Lite', 29, 'USD', 'Basic hair clipper', 'Easy-use hair clipper with sharp blades and rechargeable battery.', 4, 160, 'images/clipper-lite.jpg', 'PersonalCare'),
('Travel Bag Mini', 18, 'USD', 'Small travel bag', 'Compact travel bag ideal for essentials and daily carry items.', 5, 140, 'images/travel-bag-mini.jpg', 'Travel'),
('Sunglasses UV', 21, 'USD', 'UV-protect sunglasses', 'Stylish sunglasses offering UV protection for sunny days.', 4, 210, 'images/sunglasses-uv.jpg', 'Fashion'),
('Wallet Slim', 17, 'USD', 'Slim leather wallet', 'Minimalistic wallet with durable material and multiple card slots.', 5, 190, 'images/wallet-slim.jpg', 'Fashion'),
('Running Shoes Air', 65, 'USD', 'Breathable running shoes', 'Lightweight running shoes designed for comfort and stability.', 4, 55, 'images/shoes-air.jpg', 'Footwear'),
('Winter Hat Warm', 12, 'USD', 'Warm winter hat', 'Soft and warm beanie ideal for cold winter weather.', 4, 180, 'images/winter-hat.jpg', 'Fashion'),
('Bluetooth Keyboard M', 31, 'USD', 'Compact BT keyboard', 'Portable Bluetooth keyboard suitable for tablets and laptops.', 5, 85, 'images/bt-keyboard-m.jpg', 'Electronics'),
('Robot Vacuum Mini', 98, 'USD', 'Small cleaning robot', 'Compact robot vacuum offering efficient cleaning for small areas.', 4, 35, 'images/robot-mini.jpg', 'Home'),
('Toaster Basic', 26, 'USD', 'Basic toaster unit', 'Two-slice toaster with browning control for perfect toast.', 4, 75, 'images/toaster-basic.jpg', 'Home'),
('Massage Gun Lite', 59, 'USD', 'Compact massage gun', 'Portable massage tool offering relief for sore muscles.', 5, 70, 'images/massage-lite.jpg', 'Health'),
('Blender Mini', 29, 'USD', 'Mini kitchen blender', 'Compact blender ideal for smoothies and small food prep tasks.', 4, 90, 'images/blender-mini.jpg', 'Kitchen'),
('Memory Pillow Soft', 24, 'USD', 'Soft memory pillow', 'Memory foam pillow offering excellent support for neck and head.', 4, 100, 'images/pillow-soft.jpg', 'Home'),
('Cooling Fan Mini', 20, 'USD', 'Small cooling fan', 'Portable cooling fan with adjustable speeds for personal use.', 4, 200, 'images/cooling-mini.jpg', 'Home'),
('Electric Scooter S', 199, 'USD', 'Light electric scooter', 'Foldable electric scooter offering smooth rides and stable battery.', 5, 18, 'images/scooter-s.jpg', 'Outdoor'),
('Drone Compact', 129, 'USD', 'Compact camera drone', 'Beginner-friendly drone with HD camera and stable flight features.', 4, 40, 'images/drone-compact.jpg', 'Electronics'),
('Drawing Tablet M', 45, 'USD', 'Medium graphics tablet', 'User-friendly drawing tablet ideal for creative beginners.', 4, 60, 'images/tablet-m.jpg', 'Electronics'),
('Mini Fridge Cool', 79, 'USD', 'Portable mini fridge', 'Compact fridge keeping drinks and snacks cool for long hours.', 5, 30, 'images/mini-cool.jpg', 'Home'),
('Electric Blanket S', 49, 'USD', 'Small heated blanket', 'Soft blanket with heat levels to keep you warm and relaxed.', 4, 80, 'images/blanket-s.jpg', 'Home'),
('Cat Toy Feather', 10, 'USD', 'Feather cat toy', 'Interactive cat toy featuring a dangling feather to entertain pets.', 5, 260, 'images/cat-feather.jpg', 'Pets'),
('Dog Collar Fit', 14, 'USD', 'Adjustable dog collar', 'Comfortable and adjustable dog collar made with durable fabric.', 4, 180, 'images/dog-collar.jpg', 'Pets'),
('Air Fryer Mini', 59, 'USD', 'Mini air fryer', 'Compact air fryer perfect for small meals with fast heating tech.', 5, 55, 'images/air-mini.jpg', 'Kitchen'),
('Hand Mixer Lite', 21, 'USD', 'Light hand mixer', 'Easy-use hand mixer with two speeds for baking and cooking tasks.', 4, 140, 'images/mixer-lite.jpg', 'Kitchen'),
('Knife Set Basic', 34, 'USD', 'Basic kitchen knives', 'Sharp and durable knife set suitable for everyday kitchen needs.', 5, 65, 'images/knives-basic.jpg', 'Kitchen'),
('Cookware Set 5', 69, 'USD', '5-piece cookware set', 'Durable cookware set that works with multiple heat sources.', 5, 35, 'images/cookware-5.jpg', 'Kitchen'),
('Suitcase Carry', 59, 'USD', 'Carry-on suitcase', 'Durable suitcase offering smooth wheels and compact design.', 4, 40, 'images/suitcase-carry.jpg', 'Travel'),
('Adapter World', 14, 'USD', 'Universal travel adapter', 'Compact adapter supporting outlets in most regions worldwide.', 4, 230, 'images/adapter-world.jpg', 'Travel'),
('Neck Massager Q', 35, 'USD', 'Quick neck massager', 'Comfortable neck massager with vibration modes to reduce tension.', 5, 75, 'images/neck-q.jpg', 'Health'),
('Groom Kit Set', 32, 'USD', 'Basic grooming kit', 'Compact grooming kit with essential tools for daily personal care.', 4, 90, 'images/groom-set.jpg', 'PersonalCare'),
('Hair Iron Slim', 26, 'USD', 'Slim hair straightener', 'Ceramic hair iron designed for quick and smooth styling.', 4, 140, 'images/hair-iron.jpg', 'PersonalCare'),
('Handbag Classic', 45, 'USD', 'Classic slim handbag', 'Modern and stylish handbag with durable material and soft feel.', 5, 50, 'images/handbag-classic.jpg', 'Fashion'),
('Perfume Fresh', 29, 'USD', 'Fresh perfume set', 'Light fragrance set with a clean and refreshing scent.', 4, 60, 'images/perfume-fresh.jpg', 'Fashion'),
('Gloves Winter', 14, 'USD', 'Warm winter gloves', 'Soft gloves made to provide comfort and warmth in cold seasons.', 5, 200, 'images/gloves-winter.jpg', 'Fashion'),
('Bike Pump Mini', 22, 'USD', 'Mini bike pump', 'Compact air pump ideal for bikes and small inflating tasks.', 4, 100, 'images/bike-pump-mini.jpg', 'Outdoor'),
('Camp Lantern S', 18, 'USD', 'Small LED lantern', 'Portable LED lantern ideal for camping, hiking, and emergencies.', 5, 90, 'images/lantern-s.jpg', 'Outdoor'),
('Seat Cover Fit', 39, 'USD', 'Universal seat cover', 'Comfortable seat cover designed to fit most car models.', 4, 50, 'images/seat-cover-fit.jpg', 'Automotive'),
('Tire Pump Auto', 39, 'USD', 'Auto tire inflator', 'Digital automatic tire inflator with pressure gauge.', 5, 70, 'images/tire-auto.jpg', 'Automotive'),
('Car Charger Duo', 12, 'USD', 'Dual USB car charger', 'Small dual-port car charger offering fast charging for devices.', 4, 250, 'images/car-charger-duo.jpg', 'Automotive'),
('Flashlight Pro', 15, 'USD', 'Strong LED flashlight', 'Bright LED flashlight offering long range and rechargeable battery.', 5, 170, 'images/flashlight-pro.jpg', 'Tools'),
('Tool Set Mini', 26, 'USD', 'Mini tool set', 'Small portable tool set for minor household repairs and fixes.', 4, 120, 'images/tool-set-mini.jpg', 'Tools'),
('Garden Hose Flex', 22, 'USD', 'Flexible garden hose', 'Expandable hose that is easy to store and resistant to tangles.', 4, 150, 'images/hose-flex.jpg', 'Garden'),
('Grow Light Mini', 27, 'USD', 'Mini LED grow light', 'Small grow light suitable for indoor plant growth and seedlings.', 5, 60, 'images/grow-mini.jpg', 'Garden'),
('Pruning Shears M', 16, 'USD', 'Medium pruning shears', 'Sharp pruning shears ideal for trimming plants and branches.', 4, 140, 'images/shears-m.jpg', 'Garden'),
('Pet Bed Soft', 29, 'USD', 'Soft pet bed', 'Comfortable pet bed made with plush material for small animals.', 5, 100, 'images/petbed-soft.jpg', 'Pets'),
('Pet Bowl Steel', 14, 'USD', 'Steel pet bowl', 'Durable stainless pet bowl suitable for food and water.', 4, 200, 'images/petbowl-steel.jpg', 'Pets'),
('Cat Harness Fit', 18, 'USD', 'Adjustable cat harness', 'Light and adjustable harness for safe outdoor walks.', 5, 150, 'images/cat-harness.jpg', 'Pets'),
('Dog Toy Ball', 10, 'USD', 'Durable dog ball', 'Bouncy and durable ball great for active play with pets.', 4, 190, 'images/dog-ball.jpg', 'Pets')
;
`;
            await pool.query(query);

            console.log("data inserted");
        }
        catch(err){
            console.log("can't insert data for products",err)}
        };
 createTableProducts();
 const isTableEmpty=await pool.query(`select * from products where id =1`);
if(isTableEmpty.rowCount==0){
 createdataProducts();
}
//  pool.query(`drop table products`);
}
ech();