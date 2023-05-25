const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")
const md5 = require('md5')
const sqlite3 = require('sqlite3')
const { open } = require('sqlite')

const jwt = require("jsonwebtoken");
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
open({
  filename: "./db/test.db",
  driver: sqlite3.Database
}).then((db) => {
   
  app.get('/people/register', async (req, res) => {
    const people = await db.all("SELECT * FROM People")
    res.json(people)
  })
  app.get('/people/login', async (req, res) => {
    const people = await db.all("SELECT * FROM People")
    res.json(people)
  })
  app.get('/profile/team', async (req, res) => {
    const people = await db.all("SELECT * FROM Team")
    res.json(people)
  })


  //.......regist......................
  const authMiddleware = (req, res, next) => {
    const token = req.header.authorization;
    const secretkey = 'tiltxdhaha'
    if (!token) {
      return res.status(401).json({ message:'tokena ne ale'})
    } try {
      const decoded = jwt.verify(token, secretkey)
      req.body = decoded
      next()
    } catch (err) {
      console.error(err)
    }
  }

  app.post('/people/register', async (req, res) => {
    const row = { nickname, email, password } = req.body;
   const token = req.headers.authorization.split(' ')[1];
    const result = await db.all(`SELECT * FROM People WHERE email = "${email}"`)
    // console.log(result)
    if (result.length > 0) {
      return res.status(400).json({ message: 'Пользователь с таким email уже существует' });
    }

    else {
      const userAdd = async (res) => {
        await db.run(`INSERT INTO People (nickname, email, password, token) VALUES ("${nickname}", "${email}", "${md5(password)}", "${token}")`, (err) => {
          console.log({token})
          if (err) {
            return res.status(500).json({ message: 'Ошибка при добавлении пользователя в базу данных' });
          }
          res.json({
            data: "responce"
          });
        }

        )
      }
      userAdd(res)
    }
    return res.json({ nickname, email, password });

  });
  //.......addTeam......................
  app.post('/profile/team', async (req, res) => {
    const row = { teamName, captain, game } = req.body;
    const resultTeamadder = await db.all(`SELECT * FROM Team WHERE teamName="${teamName}"`)
    // console.log(resultTeamadder)
    if (resultTeamadder.length > 0) {
      return res.status(400).json({ message: 'Такая Команда Существует' });
    }

    else {
      // console.log(teamName, captain, game)
      const teamAdd = async (res, req) => {
        await db.run(`INSERT INTO Team (teamName, captain, game ) VALUES ("${teamName}", "${captain}", "${game}")`, (err) => {
          if (err) {
            return res.status(500).json({ message: 'Ошибка при добавлении пользователя в базу данных' });
          }
          res.json({
            data: "responce"
          });
        }

        )
      }
      teamAdd()
    }
    return res.json({ teamName, captain, game });

  });
  //.............................
  //...........login..................
  app.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: "vizit" })
  })
  app.post('/people/login', [authMiddleware], async function (req, res) {
    const payload = {email,role:`user`}
    const logData = { nickname, email, password } = req.body;
    const log = await db.all(`SELECT * FROM People WHERE email = "${email}"`)
    const pass = await db.all(`SELECT * FROM People WHERE email = "${password}"`)
    const nick = await db.all(`SELECT * FROM People WHERE email = "${nickname}"`)
    // console.log(logData)
    if ((log.length > 0) || (logData.email === `${email}`) && (logData.md5(password) === `${md5(password)}`)) {
      return res.json({message: 'pobeda'})
    }
    // console.log(logData.password, `${password}`, logData.email, `${email}`)
    if (pass.length === 0 || log.length === 0) {
      res.json({ message: "Не верная почта или пароль " })
    }
    else {
      res.json({ message: "Пройдите Регистрацию" })
    }
  });

});
//.................................









app.listen(3000, () => {
  console.log("rabotaet" + 3000)
})





// expres nodemon sqlite sqlite3 установить