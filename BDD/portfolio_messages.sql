CREATE TABLE IF NOT EXISTS `portfolio_messages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `nom` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `objet` VARCHAR(150) NOT NULL,
  `message` TEXT NOT NULL,
  `date_envoi` DATETIME NOT NULL,
  INDEX (`email`) -- Optimise les futures recherches par email si besoin
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
