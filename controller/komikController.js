const db = require("../models");

const Komik = db.Komik;
const Penulis = db.Penulis;
const Genre = db.Genre;

async function getAll(req, res) {
  try {
    const komiks = await Komik.findAll({
      include: [
        {
          model: Penulis,
          as: "penulis",
          attributes: ["id", "nama", "email"]
        },
        {
          model: Genre,
          as: "genres",
          attributes: ["id", "nama"]
        }
      ]
    });

    return res.status(200).json(komiks);
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function create(req, res) {
  try {
    const {
      judul,
      sinopsis,
      tahun_terbit,
      penulis_id,
      genre_id
    } = req.body;

    const penulis = await Penulis.findByPk(penulis_id);
    if (!penulis) {
      return res.status(404).json({
        message: "Penulis tidak ditemukan."
      });
    }

    const komik = await Komik.create({
      judul,
      sinopsis,
      tahun_terbit,
      penulis_id
    });

    if (genre_id && genre_id.length > 0) {
      const genres = await Genre.findAll({
        where: {
          id: genre_id
        }
      });
      await komik.setGenres(genres);
    }

    const createdKomik = await Komik.findByPk(komik.id, {
      include: [
        {
          model: Penulis,
          as: "penulis"
        },
        {
          model: Genre,
          as: "genres"
        }
      ]
    });

    return res.status(201).json({
      message: "Komik berhasil ditambahkan.",
      data: createdKomik
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}