const express = require('express')
const axios = require('axios')
var bodyParser = require('body-parser');

const app = express()

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))

app.post('/api/isSadPost', (req, res) => {
    if (req.body.text) {
        isSadPost(req.body.text).then((result) => {
            res.send({
                data: {
                    result: result
                }
            })
        })
    } else {
        res.send({error: 'text parameter > NOT FOUND '})
    }
})

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'))

const isSadPost = (input) => {
    const promise = new Promise((resolve, reject) => {
        axios
            .post('https://tone-analyzer-demo.mybluemix.net/api/tone', {
            text: input,
            language: 'en'
        })
            .then(response => {
                const tones = response.data.document_tone.tones
                resolve(isSad(tones))
            })
            .catch(error => reject(error));

        const isSad = tones => tones
            .filter(tone => tone.tone_id === 'sadness')
            .length > 0;
    });

    return promise
}