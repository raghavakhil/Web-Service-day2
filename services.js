var http = require('http');
var express = require('express');
var exp = express();
var cors = require('cors');
var fs = require('fs');
var parser = require('body-parser');
var MongoClient = require('mongodb').MongoClient
var data2 = require('./demo.json')


exp.use(cors())


exp.get("/rest/api/load", cors(), (req, res) => {
    console.log('Load Invoked');
    res.send({ msg: 'Give some rest to World' });
});

exp.route('/rest/api/get', cors()).get((req, res) => {
    console.log('GET Invoked');
    res.send(data2)


}

);
/*********************Reading and Creating */
exp.use(parser.json());
exp.route('/rest/api/post', cors()).post((req, res) => {
    console.log('POST Invoked');
    console.log(req.body);
    fs.writeFileSync('demo.json', JSON.stringify(req.body));
    res.status(201).send(req.body);
    MongoClient.connect("mongodb://localhost:27017/test", function (err, dbvar) {

        var coll = dbvar.db('test');
        coll.collection('Akhil').insert(req.body, true, function (err, res) {
            if (err) throw err;
            console.log("1 document inserted");
            dbvar.close();
        });
        dbvar.close();
    });
}

);

exp.route('/rest/api/get/:name').get((req, res) => {
    res.send("Hello World" + req.params['name']);
}
);
/*****************Delete Method* ********/
exp.route('/rest/api/del').post((req, res) => {

    var b = req.body;
    console.log(b.name);
    MongoClient.connect("mongodb://localhost:27017/test", function (err, dbvar) {
        if (err) throw err;

        var coll = dbvar.db('test');

        coll.collection("Akhil").remove({ $or: [{ name: b.name }, { age: b.age }] }, function (err, res) {
            if (err) throw err;
            console.log("DELETE Invoked");
            if (res.result.n == 0) {
                console.log("Data not Found");
            } else {
                console.log(res.result.n + " document(s) Deleted");
            } dbvar.close();
        });
        dbvar.close();
    });

}
);
/******************************Updating Details**** */
exp.route('/rest/api/put').post((req, res) => {


    MongoClient.connect("mongodb://localhost:27017/test", function (err, dbvar) {
        if (err) throw err;

        var coll = dbvar.db('test');
        console.log('PUT Invoked');
        var query = { age: 21 };
        var newData = { $set: { name: "Nolan", age: "42" } };
        dbo.collection("Akhil").updateOne(query, newData, function (err, res) {
            if (err) throw err;
            if (res.result.n == 0) {
                console.log("Data not Found");
            } else {
                console.log(res.result.n + " document(s) Updated");
            }
            db.close();
        });
        db.close();
    });

});
exp.use(cors()).listen(3000, () => console.log('RUNNING........'))