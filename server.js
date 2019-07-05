const express = require('express');
const config = require('config');
const ShareTempus = require('sharetempus')(config.get('sharetempusKey'));

const app = express();

app.use(express.json({ extended: false }));

const port = 5000 || process.env.PORT;

console.log(ShareTempus);

app.get('/', (req, res) => {
    res.send('Sharetempus playground');
})
//CATEGORIES
app.get('/categories', (req, res) => {
    ShareTempus.categories.retrieve().then((categories) => {
        res.json(categories);
    }).catch(err => {
        console.log(err);
    })
})

//CUSTOMER
//create a new customer
app.get('/create-customer', (req, res) => {
    const testCustomer = {
        email: 'customerjsmith@sharetempus.com',
        legalEntity: {
            type: 'individual',
            firstName: 'John',
            lastName: 'Smith',
            birthdate: 637124400000,
            ssnLast4: '1234',
            address: {
                city: 'New York City',
                country: 'US',
                line1: 'East 169th Street',
                line2: 'Apt. 2A Bronx',
                postalCode: '10456',
                state: 'New York'
            }
        }
    }
    ShareTempus.customers.create(testCustomer).then(customer => {
        res.json(customer);
    }).catch(err => {
        console.log(err);
    })
})


app.listen(port, () => console.log(`Server listening on port ${port}`));

