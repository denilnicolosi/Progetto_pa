USE `chess`;

CREATE TABLE `users` (  
  `email` varchar(80) NOT NULL,
  `password` varchar(128) NOT NULL,  
  `role` enum('player', 'admin') NOT NULL,
  `token` REAL(8,2) NOT NULL,  
  PRIMARY KEY (`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;


INSERT INTO `users`(`email`, `password`, `role`, `token`)
VALUES (
    'admin@admin.it',
    'password1',
    'admin',
    8.3
    
  ),
  (
    'users1@users1.it',
    'password2',
    'player',
    5.7
  ),
  (
    'users2@users2.it',
    'password2',
    'player',
    8
  ),
  (
    'users3@users3.it',
    'password2',
    'player',
    9.3
  );

CREATE TABLE `matches` (  
  `matchid` INT AUTO_INCREMENT  NOT NULL,
  `player1` varchar(80) NOT NULL,  
  `player2` varchar(80),   
  `start_date` DATE NOT NULL,
  `timestamp` varchar(80) NOT NULL,
  `status` enum('open', 'close', 'close_request_player1', 'close_request_player2') NOT NULL,  
  `winner` varchar(80),  
  PRIMARY KEY (`matchid`),
  FOREIGN KEY (`player1`) REFERENCES `users`(`email`),
  FOREIGN KEY (`player2`) REFERENCES `users`(`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

CREATE TABLE `moves` (  
  `moveid` INT AUTO_INCREMENT  NOT NULL,
  `matchid` INT NOT NULL,
  `from` CHAR(2),
  `to` CHAR(2),
  `boardConfiguration` TEXT NOT NULL,
  PRIMARY KEY (`moveid`),
  FOREIGN KEY (`matchid`) REFERENCES `matches`(`matchid`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;
