--Drop table if exists
DROP TABLE restaurants_sanantonio_clean;
-------------------------------------------------------------
CREATE TABLE restaurants_sanantonio_clean (
    id INTEGER, --restaurantList
    position VARCHAR,
    name VARCHAR, --restaurant
    score FLOAT,
    ratings FLOAT,
    category VARCHAR,
    price_range VARCHAR, --priceRange
    lat FLOAT,
    lng FLOAT,
    address VARCHAR,
    city VARCHAR,
    state VARCHAR,
    zip_code VARCHAR
);
