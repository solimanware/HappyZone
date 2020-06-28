const express = require('express')
const cors = require('cors')
const axios = require('axios')
const bodyParser = require('body-parser');
const requireParams = require('require-params')
const app = express()
const fetch = require('node-fetch')

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//test
app.get('/', (req, res) => res.send('Hello World!'))
app.get('/api/isSadPost', (req, res) => res.send('post something as a text parameter to me'))

//logic
app.post('/api/isSadPost', (req, res) => {
    const body = req.body;
    isSadPost(body.text).then((result) => {
        res.send({
            data: {
                result: result,
                bonus: "you'r doing great"
            }
        })
    })
})

app.listen(process.env.PORT || 3000, () => console.log('Server running on port 3000'))

async function isSadPost(input) {
    if (!input) { return Error('no input found') }
    let response = await fetch("https://tone-analyzer-demo.ng.bluemix.net/api/tone", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9,ar;q=0.8",
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "x-requested-with": "XMLHttpRequest"
        },
        "referrer": "https://tone-analyzer-demo.ng.bluemix.net/",
        "referrerPolicy": "no-referrer-when-downgrade",
        "body": `toneInput%5Btext%5D=${input}&contentLanguage=en`,
        "method": "POST",
        "mode": "cors"
    })

    const isSad = tones => tones
        .filter(tone => tone.tone_id === 'sadness' && tone.score >= 0.7)
        .length > 0;

    let data = await response.json();
    return isSad(data.document_tone.tones);
}