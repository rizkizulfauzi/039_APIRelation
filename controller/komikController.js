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

async function update(req, res) {
  try {
    const { id } = req.params;
    const {
      judul,
      sinopsis,
      tahun_terbit,
      penulis_id,
      genre_id
    } = req.body;

    const komik = await Komik.findByPk(id);

    if (!komik) {
      return res.status(404).json({
        message: "Komik tidak ditemukan."
      });
    }

    await komik.update({
      judul,
      sinopsis,
      tahun_terbit,
      penulis_id
    });

    if (genre_id) {
      const genres = await Genre.findAll({
        where: {
          id: genre_id
        }
      });
      await komik.setGenres(genres);
    }

    const updatedKomik = await Komik.findByPk(komik.id, {
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

    return res.status(200).json({
      message: "Komik berhasil diperbarui.",
      data: updatedKomik
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

async function remove(req, res) {
  try {
    const { id } = req.params;

    const komik = await Komik.findByPk(id);

    if (!komik) {
      return res.status(404).json({
        message: "Komik tidak ditemukan."
      });
    }

    await komik.destroy();

    return res.status(200).json({
      message: "Komik berhasil dihapus."
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}

module.exports = {
  getAll,
  create,
  update,
  remove
};