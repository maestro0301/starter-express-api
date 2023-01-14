let express = require("express");
let cors = require("cors");
const { connection } = require("./src/common/database");

let app = express();
app.use(cors());
app.use(express.json());

app.post("/create", (req, resp) => {
  console.log(req.body);
  connection.query(
    `insert into contact (fullName, email, phone, website) values ('${req.body.fullName}', '${req.body.email}', '${req.body.phone}', '${req.body.website}')`,
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
        let contactId = result.insertId;
        connection.query(
          `select * from contact where id = ${contactId}`,
          (err, result) => {
            resp.send(result[0]);
          }
        );
      }
    }
  );
});

app.post("/update", (req, resp) => {
  console.log(req.body);
  let id = req.body.id;

  connection.query(
    `update contact set phone='${req.body.phone}', email='${req.body.email}', fullName='${req.body.fullName}', website='${req.body.website}' where id=${id} `,
    (err, result) => {
      if (err) {
        console.log(err);
        resp.status(501).send({ error: err });
      } else {
        console.log(result);
        resp.sendStatus(201);
      }
    }
  );
});

app.get("/contact", (req, resp) => {
  let sql = `select * from contact`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.get("/contact/:id", (req, resp) => {
  let sql = `select * from contact where id = ${req.params.id}`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    if (result.length > 0) return resp.send(result[0]);
    resp.send([]);
  });
});

app.get("/contact/search/:keyword", (req, resp) => {
  let sql = `select * from contact where fullName like '%${req.params.keyword}%'`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.delete("/contact", (req, resp) => {
  let sql = `delete from contact where id in (${req.body.ids.join(", ")})`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.sendStatus(201);
  });
});

app.get("/label", (req, resp) => {
  let sql = `select * from label`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.post("/label", (req, resp) => {
  let sql = `insert into label (title) values('${req.body.title}')`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.patch("/label", (req, resp) => {
  let sql = `update label set title='${req.body.title}' where id=${req.body.id}`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.delete("/label/:id", (req, resp) => {
  let sql = `delete from label where id = ${req.params.id}`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.get("/contact-labels/:contactId", (req, resp) => {
  let sql = `select * from contact_label left join  label on contact_label.labelId=label.id where contactId=${req.params.contactId}`;

  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.post("/contact-labels", (req, resp) => {
  let contactId = req.body.contactId;
  let labelId = req.body.labelId;
  let sql = `insert into contact_label (contactId, labelId) values(${contactId}, ${labelId})`;
  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.delete("/contact-labels", (req, resp) => {
  let contactId = req.body.contactId;
  let labelId = req.body.labelId;
  let sql = `delete from contact_label where contactId  =${contactId} and labelId= ${labelId}`;
  connection.query(sql, (err, result) => {
    if (err) {
      return resp.status(503).json({ error: err });
    }

    resp.send(result);
  });
});

app.listen(3400, () => {
  console.log("App is running on http://localhost:3400");
});
