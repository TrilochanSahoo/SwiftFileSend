"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import bodyParser from 'body-parser'
const qrcode_1 = __importDefault(require("qrcode"));
// import cors from 'cors'
const cors = require('cors');
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/api/v1/generateQrcode', (req, res) => {
    const qrContent = req.body.content;
    console.log(qrContent);
    if (qrContent.length === 0) {
        res.status(500);
        res.send("Empty content found.");
    }
    qrcode_1.default.toDataURL(qrContent, (err, src) => {
        if (err) {
            res.status(404);
            res.send("error occured");
        }
        else {
            res.status(200);
            res.json({
                src: src
            });
        }
    });
});
exports.default = app;
