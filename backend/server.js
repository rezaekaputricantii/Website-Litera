/**
 * LITERA E-Commerce Backend REST API Server
 * Built with Node.js & Express.js
 */

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Mock Database Cloud RDS / MySQL Integration
let booksDatabase = [
    { id: 1, title: "Akuntansi Keuangan Menengah", author: "Dwi Martani", category: "Akademik", grade: "Grade A (Mulus)", price: 50000, stock: 1, status: "Published" },
    { id: 2, title: "Laut Bercerita", author: "Leila S. Chudori", category: "Fiksi", grade: "Grade A (Mulus)", price: 65000, stock: 1, status: "Published" },
    { id: 3, title: "Risalah Kebangkitan", author: "Badiuzzaman Said Nursi", category: "Agama", grade: "Grade B (Layak)", price: 35000, stock: 1, status: "Published" }
];

let ordersDatabase = [];

// API ENDPOINTS

// 1. GET: Ambil Semua Katalog Buku (Frontend Sync)
app.get('/api/books', (req, res) => {
    res.json({ success: true, data: booksDatabase });
});

// 2. POST: Tambah Buku / Titip Jual Baru (C2C & B2C)
app.post('/api/books', (req, res) => {
    const { title, author, category, grade, price } = req.body;
    const newBook = {
        id: booksDatabase.length + 1,
        title,
        author: author || "Penitip Individu",
        category,
        grade: grade || "Grade B (Layak)",
        price: parseInt(price),
        stock: 1,
        status: "Published"
    };
    booksDatabase.push(newBook);
    res.status(201).json({ success: true, message: "Buku berhasil ditambahkan ke katalog!", data: newBook });
});

// 3. POST: Process Order & Midtrans Payment Gateway Webhook Simulation
app.post('/api/checkout', (req, res) => {
    const { customerName, region, courier, paymentMethod, items, totalAmount } = req.body;
    
    const newOrder = {
        invoiceId: `INV/LITERA/${Date.now()}`,
        awb: `JT${Math.floor(1000000000 + Math.random() * 9000000008)}`,
        customerName,
        region,
        courier,
        paymentMethod,
        totalAmount,
        status: "PAID_AND_PROCESSING",
        createdAt: new Date().toISOString()
    };

    ordersDatabase.push(newOrder);
    res.json({
        success: true,
        message: "Pembayaran terverifikasi via Midtrans QRIS!",
        order: newOrder
    });
});

// 4. GET: AWB Order Tracking API
app.get('/api/orders/:invoiceId', (req, res) => {
    const order = ordersDatabase.find(o => o.invoiceId === req.params.invoiceId);
    if (!order) {
        return res.status(404).json({ success: false, message: "Pesanan tidak ditemukan" });
    }
    res.json({ success: true, data: order });
});

// Start Server
app.listen(PORT, () => {
    console.log(`================================================`);
    console.log(`LITERA Backend API Server Running on port ${PORT}`);
    console.log(`Endpoint: http://localhost:${PORT}/api/books`);
    console.log(`================================================`);
});