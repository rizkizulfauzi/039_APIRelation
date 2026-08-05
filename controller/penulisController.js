const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Penulis = db.Penulis;

async function register(req, res) {
  try {
    const { nama, email, password } = req.body;

    if (!nama || !email || !password) {
      return res.status(400).json({
        message: "Nama, email, dan password wajib diisi."
      });
    }

    const existingPenulis = await Penulis.findOne({
      where: { email }
    });

    if (existingPenulis) {
      return res.status(400).json({
        message: "Email sudah terdaftar."
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const penulis = await Penulis.create({
      nama,
      email,
      password: hashedPassword
    });

    return res.status(201).json({
      message: "Registrasi berhasil.",
      data: {
        id: penulis.id,
        nama: penulis.nama,
        email: penulis.email
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
}
