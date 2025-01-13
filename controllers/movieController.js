const connection = require("../data/db");

function index(req, res) {
  // recupero elenco dei film
  let sql = `SELECT 
                  movies.*, AVG(vote) AS avg_vote
              FROM
                  movies
                      JOIN
                  reviews ON movies.id = reviews.movie_id
              GROUP BY movies.id`;

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

module.exports = { index, show };
