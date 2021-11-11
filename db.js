const Sequelize = require('sequelize');
const db = new Sequelize(process.env.DATABASE_URL || 'postgres://localhost/acme_people_places_things_db');
const { DataTypes } = Sequelize

const data = {
  people: ["moe", "larry", "lucy", "ethyl"],
  places: ["paris", "nyc", "chicago", "london"],
  things: ["foo", "bar", "bazz", "quq"],
  souvenirs: [
    [2, 1, 3, 5, "09-21-2020"],
    [1, 3, 2, 12, "11-11-2020"],
    [3, 4, 1, 100, "10-01-2020"],
    [4, 2, 4, 34, "03-19-2021"],
    [3, 2, 1, 63, "05-04-2021"],
  ],
};

const Person = db.define('person', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

const Place = db.define('place', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
})

const Thing = db.define("thing", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

const Souvenir = db.define("souvenir", {
  count: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  purchasedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

Souvenir.belongsTo(Person)
Souvenir.belongsTo(Place)
Souvenir.belongsTo(Thing)


const syncAndSeed = async () => {
    try {
        await db.sync({ force: true })
        await Promise.all(
            data.people.map(person => Person.create({ name: person }))
        )

        await Promise.all(
            data.places.map(place => Place.create({ name: place }))
        )

        await Promise.all(
            data.things.map(thing => Thing.create({ name: thing }))
        )

        await Promise.all(
            data.souvenirs.map(souvenirArr => Souvenir.create({
                personId: souvenirArr[0],
                placeId: souvenirArr[1],
                thingId: souvenirArr[2],
                count: souvenirArr[3],
                purchasedOn: souvenirArr[4]
            }))
        )

    } catch (e) {
        console.log(e)
    }
}
 
module.exports = {
    db,
    syncAndSeed,
    models: {
        Person,
        Place,
        Thing,
        Souvenir
    }

}