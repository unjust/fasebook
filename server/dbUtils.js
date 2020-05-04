const nano = require('nano')('http://admin:couchdb!@localhost:5984');
const DB_NAME = 'fasebook';

const seedUsers = function(db_name) {
  const db = nano.use(db_name);
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

let dbInstance;
async function initDatabase() {
  let response;
  try {
    response = await nano.db.list();
  } catch(e) {
    console.log('nano db list failed', e);
  }

  if (response.indexOf(DB_NAME) === -1) {
    const success = await nano.db.create(DB_NAME).catch((e) => {
      console.log('create db error', e);
    });
    console.log('created db', success);
    seedUsers(DB_NAME);
    dbInstance = nano.use(DB_NAME);
  } else {
    dbInstance = nano.use(DB_NAME);
  }
}
initDatabase();


function getDatabase() {
  return dbInstance;
};


const findDoc = function(q){
  console.log("yo db dins", dbInstance.find);
  return dbInstance.find(q)
    .then((res) => res.docs)
    .catch((err) => console.log(err));
};

const updateDoc = function(q) {
  const doc = findDoc(q); // hope its just one
};

module.exports = {
  getDatabase,
  findDoc,
  updateDoc
};
