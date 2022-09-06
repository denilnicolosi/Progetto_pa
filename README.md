# Progetto programmazione avanzata: backend per il gioco scacchi
Progetto per il corso di programmazione avanzata A.A. 2021/2022 presso UNIVPM
<a><img src="images/logo-univpm.png" height='60' align="right"/></a>

## 📄 Specifica e obiettivi del progetto
Si realizzi un sistema che consenta di gestire il gioco di scacchi. In particolare, il sistema deve prevedere la 
possibilità di far interagire due utenti (autenticati mediante JWT) o un utente (sempre autenticato con JWT) 
che gioca contro l’intelligenza artificiale. Ci possono essere più partite attive in un dato momento. Un utente può allo stesso tempo partecipare ad una ed una sola partita.

La specifica completa è consultabile nel seguente [documento](specifiche.pdf)

## 📦 Strumenti per lo sviluppo

- [Node.JS](https://nodejs.org)
- [Express](https://expressjs.com)
- [Sequelize](https://sequelize.org) 
- [MySQL](https://www.mysql.com)
- [Js-chess-engine](https://www.npmjs.com/package/js-chess-engine)
- [Docker](https://www.mysql.com)
- [Postman](https://www.postman.com)
- [JWT](https://jwt.io)

## 👩‍💻 Installazione

### Requisiti 
L'unico requisito per installare l'applicazione è [Docker](https://www.mysql.com).
Per testare l'applicazione invece viene utilizzato il client API [Postman](https://www.postman.com).

### Avvio del progetto

1. Clonare la repository con il comando:
    ```
    git clone https://github.com/denilnicolosi/Progetto_pa
    ```

2. Generare l'immagine docker dell'applicazione con il seguente comando
    ```
    docker-compose build 
    ```

3. Avviare il compose docker costituito dal container dell'applicazione e dal container di MySQL
    ```
    docker-compose up
    ```
4. Aprire postman e caricare la seguente [collection](https://www.getpostman.com/collections/6a44c916b44bfd61ce63)

## 🔧 Configurazione
Per la configurazione dell'applicazione è possibile agire su diverse impostazioni:

### File env
Nel file ```.env``` vengono impostate le variabili d'ambiente che dovrebbero restare segrete. Generalmente questo file non viene condiviso insieme al codice proprio perché potrebbe contenere informazioni sensibili. In questo caso è stato condiviso comunque per agevolare la fase di installazione.
Il file contiene le seguenti informazioni:
```
MYSQL_ROOT_PASSWORD=password
MYSQL_USER=user
MYSQL_PASSWORD=password
MYSQL_DATABASE=chess
MYSQL_ALLOW_EMPTY_PASSWORD=yes

SECRET_KEY=oisjfoviu4nt5549vdfij
DB_NAME=chess
DB_USER=root
DB_PASSWORD=password
DB_HOST=dbmysql
DB_PORT=3306
```
La prima sezione di variabili viene utilizzata dal container mysql per creare gli utenti e il database da utilizzare. La seconda sezione viene utilizzata dal container di nodejs per utilizzare la secret key per la generazione del jwt e le credenziali di accesso al database.


### File docker-compose
Per la configurazione dei container si utilizza il file ```docker-compose.yml``` cosi composto:
```
version: '3.7'

services:
  dbmysql:
    container_name: dbmysql
    image: mysql
    restart: always
    env_file:
      - .env
    ports:
      - '3306:3306'  
    volumes: 
      - ./sqlscript_seed.sql:/docker-entrypoint-initdb.d/script.sql
  app:
    container_name: appnode
    #restart: always
    depends_on:
      - dbmysql 
    build: app/
    env_file:
      - .env   
    ports:
      - 80:3000
    volumes:
      - ./app/src:/home/node/app/src/
```
In questo file si può modificare il mapping delle porte del database (nel caso in cui la porta 3306 sia già impegnata nell'host in utilizzo) o la porta di accesso al servizio API (che in questo caso viene mappata dalla porta 3000 del container alla porta 80 della macchina host)
Inoltre viene specificato il bind dello storage del container alla macchina host, per avere a disposizione il codice sorgente.

### File sqlscript_seed
Nel file ```sqlscript_seed.sql``` viene specificata la struttura del database da creare al primo avvio del container. Vengono anche precaricati dei dati per consentire un utilizzo di prova dell'applicazione, quindi in caso di configurazione possono essere modificati direttamente in questo file. 


## 💻 Utilizzo

Spiegare le varie rotte come utilizzarle

## 📑 Progettazione



### ✈️ Rotte

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
| /endmatch          | PUT    | player           | SI                 |

Tutte le richieste sono in json

### Diagrammi UML


### Pattern utilizzati
- DAO con sequelize per la gestione del modello
- singleton
- mvc/mvp
- middleware
- factory per errori

## ✍️ Autori
#### [Manelli Manuel](mailto:s1102514@studenti.univpm.it) (Matricola 1102514) 
#### [Nicolosi Denil](mailto:s1100331@studenti.univpm.it) (Matricola 1100331)

## 🔒 License
MIT License

Copyright © 2022 Denil Nicolosi & Manuel Manelli