const express = require("express");
const app = new express();
const Db = require("./db.js");

app.use(express.json());

app.post("/", async (req, res) => {
  const db = new Db();

  let {
    year,
    resultsPerPage = 5,
    descendingOrder = false,
    sortBy = "id",
  } = req.body;
  let { pageNumber = 1 } = req.body;

  console.log(typeof year);

  const toRet = {
    status: "OK",
    success: true,
    data: [],
  };

  const paginationLimit = Number(resultsPerPage);
  pageNumber = Number(pageNumber);
  const paginationOffset = (pageNumber - 1) * paginationLimit;

  const totalMoviesCountQuery = "SELECT COUNT (*) as count FROM movies";

  const totalMoviesCountResult = await db.get_movies(totalMoviesCountQuery);
  console.log(totalMoviesCountResult[0]);

  if (
    !(
      Array.isArray(totalMoviesCountResult) &&
      totalMoviesCountResult.length &&
      totalMoviesCountResult[0].count
    )
  ) {
    toRet.success = false;
    return res.status(200).send(toRet);
  }

  const totalMoviesCount = totalMoviesCountResult[0].count;

  let fetchMoviesQuery = "SELECT * FROM movies ";

  if (year) {
    sortBy = "Year";
    fetchMoviesQuery += ` WHERE movies.year > ${year} `;
  }
  fetchMoviesQuery +=
    ` ORDER BY ${sortBy} ` + (descendingOrder ? "DESC" : "ASC");
  fetchMoviesQuery += ` LIMIT ${resultsPerPage} OFFSET  ${paginationOffset}`;

  console.log(fetchMoviesQuery);

  const moviesList = await db.get_movies(fetchMoviesQuery);
  if (!(Array.isArray(moviesList) && moviesList.length)) {
    toRet.success = false;
    return res.status(200).send(toRet);
  }

  const lastPageNo = Math.ceil(totalMoviesCount / paginationLimit);
  toRet.isNextPresent = pageNumber < lastPageNo ? true : false;
  toRet.lastPageNo = lastPageNo;
  toRet.currentPageNo = pageNumber;

  toRet.data = moviesList;

  return res.status(200).send(toRet);
});

app.listen(8080, (err) => {
  if (err) console.log(err);
  console.log("server running at port 8080");
});
