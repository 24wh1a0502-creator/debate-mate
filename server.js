// ============================================
// DEBATEMATE - Express Server
// ============================================

const express = require('express');
const path = require('path');

// Create Express app
const app = express();

// Set port
const PORT = process.env.PORT || 3000;

// ============================================
// MIDDLEWARE
// ============================================

// Serve static files from 'public' folder
app.use(express.static('public'));

// ============================================
// ROUTES
// ============================================

// Home page - serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle all other routes - send index.html (for client-side routing)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, () => {
    console.log('═══════════════════════════════════════');
    console.log('⚖️  DEBATEMATE SERVER RUNNING');
    console.log('═══════════════════════════════════════');
    console.log(`📍 Local:    http://localhost:${PORT}`);
    console.log(`📍 Network:  http://0.0.0.0:${PORT}`);
    console.log('📝 Press Ctrl+C to stop');
    console.log('═══════════════════════════════════════');
});