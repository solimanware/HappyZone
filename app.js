const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser');
const requireParams = require('require-params')
const app = express()

app.use(cors())
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/isSadPost', (req, res) => res.send('post something as a text parameter to me'))

app.post('/api/isSadPost', (req, res) => {
    const body = req.body;
    requireParams({
        req,
        res
    }, [
        'text', 'bonus'
    ], true)

    console.log('I passed the function');

    isSadPost(body.text).then((result) => {
        console.log('I entered isSadPost');
        res.send({
            data: {
                result: result,
                bonus: "you'r doing great"
            }
        })
    })

})

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'))

function isSadPost(input) {
    if (!input) 
        return Error('no input found')
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
            .filter(tone => tone.tone_id === 'sadness' && tone.score >= 0.7)
            .length > 0;
    });

    return promise
}