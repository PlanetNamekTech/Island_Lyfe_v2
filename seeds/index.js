const mon = require('mongoose');
const islands = require('./islands');
const { places, descriptors } = require('./seedHelpers');
const Island = require('../models/island');

mon.connect('mongodb://localhost:27017/island-lyfe');

const db = mon.connection;
db.on('error', console.error.bind(console, "Connection Error"));
db.once("open", () => {
  console.log("Database Connected");
});

const sample = (array) => array[Math.floor(Math.random()*array.length)];

const seedDB = async() => {
  await Island.deleteMany({});
  for(let i = 0; i < 25; i++){
    const rand1000 = Math.floor(Math.random()*1000);
    const rand2 = Math.floor(Math.random()*2);
    const hemis = ['Northern', 'Southern'];
    const island = new Island ({
      author: '62859a652fbde3c4449a20f0', // Sam for setting up author (Authorization)
      location: `${islands[rand1000].city}, ${islands[rand1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusantium ab labore aliquam iste, dolorum culpa fugiat similique laborum repudiandae dolore?',
      hemisphere: `${hemis[rand2]}`,
      geometry: {
        type: "Point",
        coordinates: [
          islands[rand1000].longitude,
          islands[rand1000].latitude
        ]
      },
      images: [
        {
          url: 'https://res.cloudinary.com/siracha/image/upload/v1654036170/IslandLyfe/rnslg9z7ettwdqlkfmbn.jpg',
          filename: 'IslandLyfe/rnslg9z7ettwdqlkfmbn.jpg'
        },
        {
          url: 'https://res.cloudinary.com/siracha/image/upload/v1654036945/IslandLyfe/jratgrhhgxfpu6nvdezb.jpg',
          filename: 'IslandLyfe/jratgrhhgxfpu6nvdezb'
        }
      ]
    })
    await island.save();
  }

}

seedDB().then(() =>{
  mon.connection.close();
})