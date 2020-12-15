import express from 'express';
import puppeteer from 'puppeteer'
import cookies from './cookieRetriver'

const app = express()

app.get('/token', async(req, res) => {

  const browser = await puppeteer.launch({args:['--no-sandbox']})
  const page = await browser.newPage();

  try{
    let cookieResponse = await cookies(page,req.query.url,req.query.email,req.query.password,req.query.filter || '')
    await browser.close()
    res.json({
      request: req.query,
      cookies: cookieResponse
    })
  } catch(error) {
    await browser.close()
    console.error(error)
    res.json({
      request: req.query,
      response: error.message || "Unable to retrive cookies."
    })
  }
})



app.listen(process.env.PORT, async() => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`)
})