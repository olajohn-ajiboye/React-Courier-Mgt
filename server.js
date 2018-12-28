const express = require('express');
const app = express();
const port = 8070;
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const cors = require('cors');

const bodyParser = require('body-parser')
const adapter = new FileSync('db.json');
const db = low(adapter);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    let abc = db.get('login')
        .find({ role: "biker" })
        .value()
    res.send(abc)
})


app.post('/login', (req, res) => {
    let data = db.get('login')
        .find({ role: req.body.role, email: req.body.email })
        .value()
        console.log(data);
    if (data) {
        res.status(200);
        res.send({ message: 'Successfull', data });
    }
    else {
        res.status(400);
        res.send({ error: "Invalid Username And Password" });
    }
});

app.get('/bikers', (req, res) => {
    let biker = db.get('bikers');
    if (biker) {
        res.status(200);
        res.send({ message: 'Successfull', biker: biker });
    }
    else {
        res.status(400);
        res.send({ error: "Error! Something went wrong" });
    }
})

app.get('/parcels', (req, res) => {
    let order = db.get('parcels');
    if (order) {
        res.status(200);
        res.send({ message: 'Successfull', order: order });
    }
    else {
        res.status(400);
        res.send({ error: "Error! Something went wrong" });
    }
})

app.put('/parcels', (req, res) => {
    let obj = { assignee: req.body.biker_id };
    if (req.body.status) {
        obj['status'] = req.body.status
    }
    let order = db.get('parcels')
        .find({ order_id: req.body.order_id })
        .assign(obj)
        .write();
    ;
    if (order) {
        res.status(200);
        res.send({ message: 'Successfull', order: order });
    }
    else {
        res.status(400);
        res.send({ error: "Error! Something went wrong" });
    }
});

app.post('/myData', (req, res) => {
    let data = db.get('parcels')
    .filter(val => val.assignee === (req.body.id).toString())
    .value()
    console.log(data)
    if(req.body.id && req.body.email){
        res.status(200);
        res.send({ message: 'Successfull', data: data });
    }
    else {
        res.status(400);
        res.send({ error: "Error! Something went wrong" });
    }
})

app.put('/myData', (req, res) => {
    let obj = { status: req.body.status, timeStamp: req.body.timeStamp };
    let order = db.get('parcels')
        .find({ order_id: req.body.order_id })
        .assign(obj)
        .write();
    if (order) {
        res.status(200);
        res.send({ message: 'Successfull', order: order });
    }
    else {
        res.status(400);
        res.send({ error: "Error! Something went wrong" });
    }
});

app.listen(port, () => console.log(`Listening on port ${port}!`))