CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('Mike Israetel', 'https://rpstrength.com/blogs/articles/chest-hypertrophy-training-tips', 'Chest Hypertrophy Training Tips');

insert into blogs (author, url, title) values ('Mike Israetel', 'https://rpstrength.com/blogs/articles/triceps-hypertrophy-training-tips', 'Triceps Hypertrophy Training Tips');