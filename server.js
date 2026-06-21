const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from 'public' folder
app.use(express.static('public'));

// ============================================
// IMPORTANT: Catch-all route for SPA routing
// ============================================
// This sends ALL requests to index.html
// So client-side routing (JavaScript) can handle them
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log('⚖️ DebateMate server running!');
    console.log(`📍 http://localhost:${PORT}`);
    console.log('📝 Press Ctrl+C to stop');
});