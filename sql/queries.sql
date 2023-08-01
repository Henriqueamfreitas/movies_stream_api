-- Criação de movies
INSERT INTO movies (name, category, duration, price)
VALUES ('teste', 'teste', 120, 45);

-- Listagem de todos os movies
SELECT * FROM movies;

-- Listagem de um movie filtrando pelo id
SELECT * FROM movies
WHERE id = 1;

-- Deleção de um movie através do id
DELETE FROM movies 
WHERE id=4;