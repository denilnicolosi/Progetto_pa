USE `chess`;

CREATE TABLE `users` (  
  `email` varchar(80) NOT NULL,
  `password` varchar(128) NOT NULL,  
  `role` enum('player', 'admin') NOT NULL,
  PRIMARY KEY (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `users_token` (
  `email` varchar(80) NOT NULL,
  `remaining_token` REAL(8,2) NOT NULL,
  PRIMARY KEY (`email`, `remaining_token`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


INSERT INTO `users`(`email`, `password`, `role`)
VALUES (
    'admin@admin.it',
    'password1',
    'admin'
  ),
  (
    'users1@users1.it',
    'password2',
    'player'
  );

INSERT INTO `users_token`(`email`, `remaining_token`)
VALUES 
('admin@admin.it', 5.4),
('users1@users1.it', 8.5);