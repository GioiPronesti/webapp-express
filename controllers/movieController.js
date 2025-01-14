const connection = require("../data/db");

function index(req, res) {
  // recupero elenco dei film
  let sql = `SELECT 
                  movies.*, AVG(vote) AS avg_vote
              FROM
                  movies
                      JOIN
                  reviews ON movies.id = reviews.movie_id`;

  // BONUS: aggiungere eventuali filtri
  if (req.query.search) {
    sql += ` WHERE title LIKE '%${req.query.search}%' OR director LIKE '%${req.query.search}%' OR abstract LIKE '%${req.query.search}%'`;
  }

  sql += `GROUP BY movies.id`;

  connection.query(sql, (err, movies) => {
    console.log(err);
    if (err) return res.status(500).json({ message: err.message });

    movies.forEach((movie) => {
      movie.image = `${process.env.BE_HOST}/img/movies/${movie.image}`;
    });

    res.json(movies);
  });
}

function show(req, res) {
  console.log("show movie details ");

  // per sapere quale film l'utente vuole ricercare devo:
  // assicurarmi di che tipo di dato si tratta... sql injections
  // uso gli prepared statements per controllare l'input

  // console.log(req.params.id);
  const id = req.params.id;

  // aggiungere controlli di sicurezza lato sever

  //if(isNaN(id))... logica controllo per middleware

  // preparo la query da fornire al DB mettendo un segnaposto

  // 1a query sql = `SELECT * FROM movies WHERE id = ?`

  const sql = `SELECT movies.*, AVG(vote) AS avg_vote
  FROM movies
  JOIN reviews
  ON movies.id = reviews.movie_id
  WHERE movies.id = ?
  GROUP BY movies.id`;

  // Il secondo parametro della funzione query() diventa quindi un array, contenente i valori dei placeholder da controllare.

  connection.query(sql, [id], (err, results) => {
    if (err) return res.status(500).json({ message: err.message });
    if (results.length === 0)
      return res.status(404).json({
        error: "Resource Not Found",
        message: "Movie not found",
      });

    const movie = results[0];
    movie.image = `${process.env.BE_HOST}/img/movies/${movie.image}`;

    const sql = `SELECT * FROM reviews WHERE movie_id = ?`;

    connection.query(sql, [id], (err, results) => {
      if (err) return res.status(500).json({ message: err.message });

      movie.reviews = results;

      // aggiungere voto medio delle recensioni
      res.json(movie);
    });
  });
}

function storeReview(req, res) {
  const id = req.params.id;

  // recuperare i parametri dal body
  const { text, vote, name } = req.body;

  console.log(id, text, vote, name);
  const intVote = parseInt(vote);

  // aggiungo validazione lato server x vote e name

  if (
    !name ||
    !intVote ||
    isNaN(intVote) ||
    intVote < 1 ||
    intVote > 5 ||
    name?.length > 255 ||
    typeof name !== "string"
  ) {
    return res.status(400).json({ message: "The data is invalid" });
  }

  // procedo con inserire la query per creare una nuova recensione
  // query INSERT INTO

  const sql =
    "INSERT INTO reviews (text, name, vote, movie_id) VALUES (?, ?, ?, ?)";

  // controllo esito della query
  // inserisco nel secondo elemento del metodo query, coiè nell' array , rispettando l'ordine  del nome delle tabelle = [1,2,3,4] cioè [text, name, vote, id] Importante!

  connection.query(sql, [text, name, intVote, id], (err, results) => {
    if (err)
      return res.status(500).json({
        message: "Data base query failed",
      });
    console.log(results);
    res.status(201).json({
      massage: "Review added!",
      id: results.insertId,
    });
  });
}

module.exports = { index, show, storeReview };
