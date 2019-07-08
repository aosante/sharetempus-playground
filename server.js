const express = require("express");
const config = require("config");
const ShareTempus = require("sharetempus")(config.get("sharetempusKey"));

const app = express();

app.use(express.json({ extended: false }));

const port = 5000 || process.env.PORT;

app.get("/", (req, res) => {
  res.send("Sharetempus playground");
});
//CATEGORIES
app.get("/categories", (req, res) => {
  ShareTempus.categories
    .retrieve()
    .then(categories => {
      res.json(categories);
    })
    .catch(err => {
      console.log(err);
    });
});

//CUSTOMER
//create a new customer
app.get("/create-customer", (req, res) => {
  //id: cus_6k2Ef2aCyfsEM4tb0gXzyjH4
  const testCustomer = {
    email: "customerjsmith@sharetempus.com",
    legalEntity: {
      type: "individual",
      firstName: "John",
      lastName: "Smith",
      birthdate: 637124400000,
      ssnLast4: "1234",
      address: {
        city: "New York City",
        country: "US",
        line1: "East 169th Street",
        line2: "Apt. 2A Bronx",
        postalCode: "10456",
        state: "New York"
      }
    }
  };

  //id: cus_HIQ3zUp6W15RL8XnoR4Bs8TT
  const testRenter = {
    email: "renterjdoe@sharetempus.com",
    legalEntity: {
      type: "individual",
      firstName: "John",
      lastName: "Doe",
      birthdate: 637124400000,
      ssnLast4: "5678",
      address: {
        city: "Miami",
        country: "US",
        line1: "East 123th Street",
        line2: "Apt. 47A",
        postalCode: "33183",
        state: "Florida"
      }
    }
  };

  ShareTempus.customers
    .create(testRenter)
    .then(customer => {
      res.json(customer);
    })
    .catch(err => {
      console.log(err);
    });
});

//retrieve a customer
app.get("/retrieve-customer", (req, res) => {
  ShareTempus.customers
    .retrieve({ customer: "cus_6k2Ef2aCyfsEM4tb0gXzyjH4" })
    .then(customer => res.json(customer))
    .catch(err => console.log(err));
});

//find customer
app.get("/find-customer", (req, res) => {
  ShareTempus.customers
    .find({ email: "customerjsmith@sharetempus.com" })
    .then(customer => res.json(customer))
    .catch(err => console.log(err));
});

//POLICY
//generate a policy quote
//policy token: tok_TWyJsQyjQei6k7UF9ouSFqDc
//policy quote: 400
app.get("/policy-quote", (req, res) => {
  const today = new Date().getTime();
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.getTime();
  ShareTempus.policies
    .quote({
      customer: "cus_6k2Ef2aCyfsEM4tb0gXzyjH4",
      renter: "cus_HIQ3zUp6W15RL8XnoR4Bs8TT",
      currency: "usd",
      startDate: today,
      endDate: tomorrow,
      //categories and sub-categories would need to be selected and stored in public data when selecting a listing
      product: {
        name: "iPhone 7",
        category: "Electronics",
        subcategory: "Cell Phones and Accessories",
        // manufacturer: "Apple",
        value: 64900
      },
      description: "Policy for iPhone 7",
      metadata: {}
    })
    .then(quote => res.json(quote))
    .catch(err => console.log(err));
});

//create a policy
//policy id: pol_hoTvm1JvO84hqfZXkxJkf9rN
//policy ticket: ticket_4M7WZkoFpWDjRBuiM3Pyuvcv
app.get("/create-policy", (req, res) => {
  ShareTempus.policies
    .create({ token: "tok_TWyJsQyjQei6k7UF9ouSFqDc" })
    .then(policy => res.json(policy))
    .catch(err => console.log(err));
});

//CLAIMS
//create claim
//claim id: clm_sMiZOEi6UC43V3Ia3UnJvuoL
app.get("/create-claim", (req, res) => {
  ShareTempus.claims
    .create({
      subject: "iPhone 7 Damaged",
      type: "damaged",
      content: "My iPhone 7 fell and broke the screen",
      policy: {
        id: "pol_hoTvm1JvO84hqfZXkxJkf9rN",
        ticket: "ticket_4M7WZkoFpWDjRBuiM3Pyuvcv"
      }
    })
    .then(claim => res.json(claim))
    .catch(err => console.log(err));
});

app.listen(port, () => console.log(`Server listening on port ${port}`));
