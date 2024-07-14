const express = require('express');
const puppeteer = require('puppeteer')
const ejs = require('ejs');
const path = require('path');
const cors = require('cors');
const process = require('process')
const dotenv = require('dotenv');
dotenv.config();
const app = express();
app.use(cors(process.env.CORS));
app.use(express.json());

app.post('/api/v1/generate-pdf', async (req, res) => {

    try {
        // Render the EJS template to HTML string
        console.log({ body: req.body })
        const data = req.body

        const html = await ejs.renderFile(path.join(__dirname, 'views', 'index.ejs'), { data: data?.data?.data, name: data.name });

        // Launch Puppeteer and generate PDF
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4' });

        await browser.close();

        // Send the PDF buffer as a response
        res.type('application/pdf');
        res.send(pdfBuffer);
    } catch (err) {
        console.error('Error generating PDF:', err);
        res.status(500).send('Error generating PDF');
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
