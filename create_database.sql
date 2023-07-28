-- Database: Restaurants_SanAntonio

--DROP DATABASE IF EXISTS "Restaurants_SanAntonio";

CREATE DATABASE "Restaurants_SanAntonio"
    WITH
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'English_United States.1252'
    LC_CTYPE = 'English_United States.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    IS_TEMPLATE = False;
-------------------------------------------------------------
CREATE TABLE restaurants_sanantonio (
    id INTEGER, --restaurantList
    position VARCHAR,
    name VARCHAR, --restaurant
    score FLOAT,
    ratings INTEGER,
    category VARCHAR,
    price_range VARCHAR, --priceRange
    lat FLOAT,
    lng FLOAT,
    address VARCHAR,
    city VARCHAR,
    state VARCHAR,
    zip_code VARCHAR
);
