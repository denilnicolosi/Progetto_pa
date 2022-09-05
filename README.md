# Progetto_pa
Progetto per il corso di programmazione avanzata A.A. 2021/2022 presso UNIVPM


# Rotte

| Rotta              | Metodo | Ruolo utente     | Autenticazione JWT |
| ------------------ | ------ | ---------------- | ------------------ |
| /login             | POST   | player/admin     | NO                 |
| /newgame           | POST   | player           | SI                 |
| /move              | POST   | player           | SI                 |
| /playedmatch       | GET    | player           | SI                 |
| /statusmatch       | GET    | player           | SI                 |
| /historymoves      | GET    | player           | SI                 |
| /playersrank       | GET    | guest            | NO                 |
| /chargetoken       | PUT    | admin            | SI                 |

Tutte le richieste sono in json

Patter utilizzati:
DAO con sequelize per la gestione del modello
singleton
mvc/mvp
middleware
factory per errori