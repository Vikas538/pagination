const express = require("express");
const app = new express();
const doRequest = require("D:/Lrnjs/projects/assignment/doRequest.js");
const Db = require("./db.js");
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    let db = new Db();

    // let movies = await db.get_movies();
    // // res.send(movies)
    // console.log(movies[0]);
    // res.send("" + movies.length);

    const { pageSize: resultsPerPage = 5, descendingOrder = false } = req.body;
    let { pageNumber = null, hubCodes = [], sortBy = "id" } = req.body;

    const toRet = {
      status: "OK",
      success: true,
      data: [],
    };
    console.log(resultsPerPage);
    const paginationLimit = Number(resultsPerPage);
    pageNumber = Number(pageNumber || 1);
    const paginationOffset = (pageNumber - 1) * paginationLimit;

    let fetchQuery = "SELECT * FROM movies";

    // let totalMoviesCountQuery = 'SELECT COUNT(id) AS movies_count FROM movies';

    // console.log(typeof movies[0].Year);

    // check if there are any filters
    console.log(req.body.year);
    if (req.body.year) {
      fetchQuery += ` WHERE movies.year > ${req.body.year} `;
    }

    fetchQuery += ` ORDER BY ${sortBy} ` + (descendingOrder ? "DESC" : "ASC");


    let movies = await db.get_movies(fetchQuery);

    let totalMoviesCount = movies.length;

    const lastPageNo = Math.ceil(totalMoviesCount / paginationLimit);
    toRet.isNextPresent = pageNumber < lastPageNo ? true : false;
    toRet.lastPageNo = lastPageNo;
    toRet.currentPageNo = pageNumber;
    console.log((pageNumber - 1) * resultsPerPage, resultsPerPage * pageNumber);
    toRet.data = movies.slice(
      (pageNumber - 1) * resultsPerPage,
      resultsPerPage * pageNumber
    );

    res.send(toRet);
  } catch (err) {
    console.log(err);
  }
});

app.listen(8080, (err) => {
  if (err) console.log(err);

  console.log("server running at port 8080");
});
