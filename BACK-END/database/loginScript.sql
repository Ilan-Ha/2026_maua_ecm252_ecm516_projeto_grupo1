CREATE TABLE tb_login(
    LoginID INT AUTO_INCREMENT PRIMARY KEY,
    Username VARCHAR(50) NOT NULL UNIQUE,
    Email VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tb_login
(Username,Email,PasswordHash)
VALUES
("teste","teste@teste","teste");

SELECT * 
FROM tb_login 
WHERE Email = 'teste@teste' 
  AND PasswordHash = 'teste';

SELECT * FROM tb_login;