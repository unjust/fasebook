if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}
const DB_URL = process.env.DB_URL;
const nano = require('nano')(DB_URL);

class db {
  constructor(db_name) {
    if (!!db.instance) {
      return db.instance;
    }

    this.db_name = db_name;
    db.instance = this.initDatabase(this.db_name);
    return this;
  }

  initDatabase(db_name) {
    nano.db.list()
      .then((dbList) => {
        if (dbList.indexOf(db_name) > -1) {
          this.setInstance();
        } else {
          nano.db.create(db_name).then(() => {
            this.setInstance();
            seedUsers(db_name);
          })
          .catch((err) => console.log('db create failed', err));
        }
      })
      .catch((e) => console.log('nano db list failed', e));
  }

  setInstance() {
    db.instance = nano.db.use(this.db_name);
    // console.log('db instance is now with', this.db_name);
  }

  getInstance() {
    // console.log('calling get an returning');
    return db.instance;
  }
}

const DB_NAME = 'fasebook';
const facebookDB = new db(DB_NAME);

const seedUsers = function(dbName) {
  const db = nano.use(dbName);
  const users = [
    {
      username: 'ivy',
      password: 'ivy'
    },
    {
      username: 'ladyGaga',
      password: 'lab'
    }
  ];
  db.bulk( { docs: users }).then((body) => {
    console.log('users added to db', body);
  });
}

// async function initDatabase() {
//   let response;
//   try {
//     response = await nano.db.list();
//   } catch(e) {
//     console.log('nano db list failed', e);
//   }

//   if (response.indexOf(DB_NAME) === -1) {
//     try {
//       await nano.db.create(DB_NAME);
//       seedUsers(DB_NAME);
//       setDatabaseInstance()
//     } catch(e) {
//       console.log('db create failed', e);
//     }
//   } else {
//     setDatabaseInstance();
//   }
// }
// initDatabase();


const findDocs = function(q) {
  const db = facebookDB.getInstance();
  console.log('find with q', q, db);
  return db.find(q)
    .then((res) => res.docs)
    .catch((err) => {
      console.log(err);
      return [];
    });
};

const updateDoc = async function(q, update) {
  const db = facebookDB.getInstance();
  const doc = await findDocs(q); // hope its just one
  const updatedDoc = Object.assign(doc[0], update);
  db.insert(updatedDoc)
    .then((res) => {
      console.log('return from updated doc', res)
      return res;
    })
    .catch((err) => {
      console.log(err);
      return { error: 'a problem happened with updating'};
    });
};

module.exports = {
  findDocs,
  updateDoc,
  getDatabaseInstance: facebookDB.getInstance
};
