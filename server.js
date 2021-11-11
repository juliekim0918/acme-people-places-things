const {
  syncAndSeed,
  db,
  models: { Person, Place, Thing, Souvenir }
} = require("./db");
const express = require('express');
const app = express();
app.use(require('method-override')('_method'))
app.use(express.urlencoded({extended: false}))

app.post('/', async (req, res, next) => {
    try {
        const personId = req.body.personId
        const placeId = req.body.placeId
        const thingId = req.body.thingId
        //[Object: null prototype] { personId: '3', placeId: '3', thingId: '1' }
        await Souvenir.create({
            personId,
            placeId,
            thingId
        })
        res.redirect('/')
    } catch (e) {
        console.log(e)
    }
})

app.delete('/:id', async (req, res, next) => {
    try {
        const souvenirId = req.params.id
        const souvenirWeWantToDelete = await Souvenir.findByPk(souvenirId);
        await souvenirWeWantToDelete.destroy();
        res.redirect('/')
    } catch (e) {
        next(e)
    }

})

app.get('/', async (req, res, next) => {
    try {
        const people = await Person.findAll();
        const places = await Place.findAll();
        const things = await Thing.findAll();
        const souvenirs = await Souvenir.findAll({
            include: [ Person, Place, Thing]
        })
        const HTML = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <h1>Acme People, Places, and Things</h1>
                <form action="/" method="POST">
                    <select name="personId" id="">
                        ${people
                          .map(
                            (person) => `
                            <option value=${person.id}> ${person.name} </option>
                        `
                          )
                          .join("")}
                    </select>
                    <select name="thingId" id="">
                        ${things
                          .map(
                            (thing) => `
                            <option value=${thing.id}> ${thing.name} </option>
                        `
                          )
                          .join("")}
                    </select>
                    <select name="placeId" id="">
                        ${places
                          .map(
                            (place) => `
                            <option value=${place.id}> ${place.name} </option>
                        `
                          )
                          .join("")}
                    </select>
                    <button> Create souvenir </button>
                </form>
                <h3>People</h3>
                <ul>
                    ${people
                      .map(
                        (person) => `
                        <li>
                            ${person.name}
                        </li>
                    `
                      )
                      .join("")}
                </ul>

                <h3>Places</h3>
                <ul>
                    ${places
                      .map(
                        (place) => `
                        <li>
                            ${place.name}
                        </li>
                    `
                      )
                      .join("")}
                </ul>

                <h3>Things</h3>
                <ul>
                    ${things
                      .map(
                        (thing) => `
                        <li>
                            ${thing.name}
                        </li>
                    `
                      )
                      .join("")}
                </ul>

                <h3>Souvenirs</h3>
                <ul>
                    ${souvenirs
                .map(
                    (souvenir) => `
                        <li>
                            ${souvenir.person.name} purchased ${souvenir.count} 
                            ${souvenir.count > 1 ? `${ souvenir.thing.name }s` : `${souvenir.thing.name}` } in ${souvenir.place.name} on  ${souvenir.purchasedOn}
                            <form action="/${souvenir.id}/?_method=DELETE" method="POST">
                                <button> X </button>
                            </form>
                        </li>
                    `
                      )
                      .join("")}
                </ul>
            </body>
            </html>
        `;

        res.send(HTML)
    } catch (e) {
        next(e)
    }

})

const init = async () => {
    try {
        await syncAndSeed();
        const port = process.env.PORT || 3000;
        app.listen(port, () => {`listening in port ${port}`})
    }
    catch (e) {
        console.log(e)
    }

}

init();