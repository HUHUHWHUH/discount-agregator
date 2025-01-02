create table if not exists students_db(
    id integer not null primary key,
    name varchar(255),
    email varchar(255),
    password varchar(255)
);

-- create table if not exists offers_db(
--     id SERIAL primary key,
--     partner varchar(255),
--     title varchar(255),
--     description text
-- );
--
-- CREATE TABLE student_favorite_offers (
--     student_id INT,
--     offer_id INT,
--     PRIMARY KEY (student_id, offer_id),
--     FOREIGN KEY (student_id) REFERENCES students_db(id) ON DELETE CASCADE,
--     FOREIGN KEY (offer_id) REFERENCES offers_db(id) ON DELETE CASCADE
-- );