var express = require('express');
const { openConnect, closeConnection } = require('../db/db.js')
const util = require('util')

const router = express.Router();


router.get('/open', function (req, res) {
  res.send('Trying to open connection')
  openConnect();
})

router.get('/close', async function (req, res) {
  res.send('Trying to open close')
  closeConnection();
})

router.put("/products/:code", async (req, res) => {
  code = req.params['code'];
  try {
    db = await openConnect();
    const body = req.body;
    const query = { code: code };
    const update = { $set: body}
    const options = {};
    const results = await db.collection('offC').updateOne(query, update, options);
    console.log(`The results: ${util.inspect(results)}.`);
    closeConnection();
    res.status(201).send(results);
  } catch (err) {
    console.log(`There was an error ${err}`)
    res.status(501).send(`There was an error.`)
  } finally {
    res.status(500);
  }
})

router.delete("/products/:code", async (req, res) => {
  code = req.params['code'];
  try {
    db = await openConnect();
    const update = { status: "trash"}
    const options = {};
    const results = await db.collection('offC').updateOne(query, update, options);
    console.log(`The results: ${util.inspect(results)}.`);
    closeConnection();
    res.status(201).send(results);
  } catch (err) {
    console.log(`There was an error ${err}`)
    res.status(501).send(`There was an error.`)
  } finally {
    res.status(500);
  }
})

router.get("/products/:code", async (req, res) => {
  try {
    db = await openConnect();
    console.log(code);
    const results = await db.collection('offC').findOne({ code: code });
    console.log(`The results: ${util.inspect(results)}.`);
    closeConnection();
    res.status(201).send(results);
  } catch (err) {
    console.log(`There was an error ${err}`)
    res.status(501).send(`There was an error.`)
  } finally {
    res.status(500);
  }
})

router.get("/products", async (req, res) => {
  try {
    db = await openConnect();
    const results = await db.collection('offC').find({}).limit(10);
    console.log(`The results: ${util.inspect(results)}.`);
    closeConnection();
    res.status(201).send(results);
  } catch (err) {
    console.log(`There was an error ${err}`)
    res.status(501).send(`There was an error.`)
  } finally {
    res.status(500);
  }
})

module.exports = router;
