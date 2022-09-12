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
  `dati` text NOT NULL,  
  `data_` DATE NOT NULL,
  `timestamp` varchar(80) NOT NULL,
  `history` TEXT,
  `stato` enum('open', 'close') NOT NULL,  
  `winner` varchar(80),  
  PRIMARY KEY (`matchid`),
  FOREIGN KEY (`player1`) REFERENCES `users`(`email`),
  FOREIGN KEY (`player2`) REFERENCES `users`(`email`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8;

INSERT INTO `matches` (`player1`, `player2`, `dati`, `timestamp`, `stato`)
VALUES ('users1@users1.it', 'users2@users2.it', '{"moves":{"B1":["C3","A3"],"G1":["H3","F3"],"A2":["A3","A4"],"B2":["B3","B4"],"C2":["C3","C4"],"D2":["D3","D4"],"E2":["E3","E4"],"F2":["F3","F4"],"G2":["G3","G4"],"H2":["H3","H4"]},"pieces":{"E1":"K","D1":"Q","A1":"R","H1":"R","C1":"B","F1":"B","B1":"N","G1":"N","A2":"P","B2":"P","C2":"P","D2":"P","E2":"P","F2":"P","G2":"P","H2":"P","E8":"k","D8":"q","A8":"r","H8":"r","C8":"b","F8":"b","B8":"n","G8":"n","A7":"p","B7":"p","C7":"p","D7":"p","E7":"p","F7":"p","G7":"p","H7":"p"},"turn":"white","isFinished":false,"check":false,"checkMate":false,"castling":{"whiteShort":true,"blackShort":true,"whiteLong":true,"blackLong":true},"enPassant":null,"halfMove":0,"fullMove":1}', '1662625620877','open'),
       ('users3@users3.it', NULL, '{"moves":{"B1":["C3","A3"],"G1":["H3","F3"],"A2":["A3","A4"],"B2":["B3","B4"],"C2":["C3","C4"],"D2":["D3","D4"],"E2":["E3","E4"],"F2":["F3","F4"],"G2":["G3","G4"],"H2":["H3","H4"]},"pieces":{"E1":"K","D1":"Q","A1":"R","H1":"R","C1":"B","F1":"B","B1":"N","G1":"N","A2":"P","B2":"P","C2":"P","D2":"P","E2":"P","F2":"P","G2":"P","H2":"P","E8":"k","D8":"q","A8":"r","H8":"r","C8":"b","F8":"b","B8":"n","G8":"n","A7":"p","B7":"p","C7":"p","D7":"p","E7":"p","F7":"p","G7":"p","H7":"p"},"turn":"white","isFinished":false,"check":false,"checkMate":false,"castling":{"whiteShort":true,"blackShort":true,"whiteLong":true,"blackLong":true},"enPassant":null,"halfMove":0,"fullMove":1}', '1662626703792','open')
