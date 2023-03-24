const express = require('express');
const mysql = require('mysql');

const bodyParser = require('body-parser');
const urlEncodedParser = bodyParser.urlencoded({extended:false});

const app = express();

app.set('view engine', 'ejs');

app.listen(8080, () => {
    console.log('Server 8080 portunda dinlemede.');
});

const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nodedb'
});

con.connect((err) => {
    if(err){
        console.error('MySQL veritabanına baglanirken hata olustu: '+ err.stack);
        return;
    }

    console.log('MySQL veritabanına bağlanıldı. ID: ' + con.threadId);
});

app.get('/userlist', (req,res) => {

    con.query('SELECT * FROM user', (err, results, fields) => {
        if(err) throw err;

        res.json(results);
    });


});

app.get('/kayit', (req,res) => {

    res.render('form');

});

app.post('/kayit/user',urlEncodedParser, (req,res) => {

    const {username, password} = req.body;

    con.query('INSERT INTO user SET ?', {username,password}, (err,result,fields) => {

        if(err) throw err;

        res.json({message: 'Kullanici kaydı başarılı.'});
        

    });

});

app.get('/sil', (req,res) => {

    res.render('form_delete');

});

app.post('/sil/user', urlEncodedParser, (req,res) => {

    const data = req.body;

    console.log(data);

    con.query('SELECT * FROM user WHERE username=? AND password=?',[data.username,data.password], (err,results,fields) => {
        if (err) throw err;

        if(results.length > 0){

            console.log(results);

            const id = results[0].id_num;

            con.query('DELETE FROM user WHERE id_num=?', id, (err,results,fields) => {
                res.json({message: 'Silme islemi gerceklesti.'});
            })

        }else{
            res.json({message: 'Kullanci adi ve sifre eslesmedi.'});
        }
    });
});

