const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Create an Express application
const app = express();
// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Specify the origin explicitly
    credentials: true // Allow credentials (cookies)
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// MySQL database connection
const db = mysql.createPool({
    host: 'localhost',      // Your MySQL host
    user: 'root',           // Your MySQL username
    password: '',   // Your MySQL password
    database: 'dailydelight' // Your MySQL database name
});

// User signup route
app.post('/signup', async (req, res) => {
    const { user_id, username, email_id, password, gender = '', bio = '', profile_picture = '' } = req.body;

    // Validate input
    if (!user_id || !username || !email_id || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Check if user ID already exists
        const checkUserQuery = 'SELECT * FROM users WHERE user_id = ?';
        db.query(checkUserQuery, [user_id], async (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            if (results.length > 0) {
                return res.status(400).json({ message: 'User ID already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
            const insertQuery = 'INSERT INTO users (user_id, username, email_id, password, gender, bio, profile_picture) VALUES (?, ?, ?, ?, ?, ?, ?)';

            db.query(insertQuery, [user_id, username, email_id, hashedPassword, gender, bio, profile_picture], (err) => {
                if (err) return res.status(500).json({ error: err.message });
                res.json({ message: 'User registered successfully' });
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// User login route
app.post('/login', (req, res) => {
    console.log("getting hit");
    
    const { user_id, password } = req.body;

    if (!user_id || !password) {
        return res.status(400).json({ message: 'Invalid input' });
    }

    const query = 'SELECT * FROM users WHERE user_id = ?';
    db.query(query, [user_id], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'User does not exist' });

        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Password incorrect' });

        const token = jwt.sign({ user_id: user.user_id }, 'your-secret-key', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.cookie('user_data', user.user_id, { httpOnly: true });
        res.json({ message: 'Login successful',Success:true, user_id: user.user_id });
    });
});

// Fetch user profile route
app.get('/profile', (req, res) => {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, 'your-secret-key');
        const query = 'SELECT * FROM User WHERE user_id = ?';
        db.query(query, [decoded.user_id], (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            res.json({ data: results[0] });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
app.get('/feed_posts', (req, res) => {
    const query = 'SELECT * FROM posts ORDER BY RAND() LIMIT 10'; // Assuming your posts table is named 'posts'

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({
                Message: 'Posts fetched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'Posts not found',
                Success: false,
                data: []
            });
        }
    });
});
app.get('/user/', (req, res) => {
    // Retrieve user_id from cookies
    const user_id = req.cookies.user_data;
    console.log("this is user_id from cookies : ",user_id);
    
    if (!user_id) {
        return res.status(401).json({ message: 'Please log in first', success: false });
    }

    const query = 'SELECT * FROM users WHERE user_id = ?';

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({
                message: 'An error occurred while fetching user data',
                success: false,
                error: err.message
            });
        }

        if (results.length > 0) {
            return res.json({
                message: 'User fetched successfully',
                success: true,
                data: results
            });
        } else {
            return res.json({
                message: 'User not found',
                success: false,
                data: []
            });
        }
    });
});

app.get('/all_users', (req, res) => {
    const query = 'SELECT friends_id, request_sent_id, request_received_id, user_id, username, email_id FROM users ORDER BY RAND() LIMIT 7';

    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        console.log(results);
        
        if (results.length > 0) {
            return res.json({
                Message: 'users fetched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'users not found',
                Success: false,
                data: []
            });
        }
    });
});


app.get('/search_user', (req, res) => {
    const search = req.query.search || '';

    const query = `
        SELECT * FROM users 
        WHERE user_id LIKE ? OR username LIKE ? 
        ORDER BY RAND() 
        LIMIT 10
    `;

    db.query(query, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({
                Message: 'users Searched successfully',
                Success: true,
                data: results
            });
        } else {
            return res.json({
                Message: 'Cannot Search',
                Success: false,
                data: []
            });
        }
    });
});


app.get('/user/posts', (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) return res.status(400).json({ message: 'user_id is required' });

    const query = 'SELECT * FROM Posts WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ data: results });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/like', (req, res) => {
    let is_liked=false;
 
    const user_id = req.cookies.user_data;
    if (!user_id) {
        return res.status(400).json({ message: 'User ID not found in cookies', Success: false });
    }

    const { post_id } = req.body; 
    if (!post_id) {
        return res.status(400).json({ message: 'Post ID is required', Success: false });
    }

    
    const query = 'SELECT * FROM posts WHERE post_id = ?'; 
    db.query(query, [post_id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Post not found', Success: false });

        const post = results[0]; 
        console.log(post); 

        
        let likedUsers = post.like_user_id;

   
        const userIndex = likedUsers.indexOf(user_id);
        if (userIndex > -1) {
           
            likedUsers.splice(userIndex, 1); 
            is_liked=false;
        } else {
           
            likedUsers.push(user_id);
            is_liked=true 
        }

        const updateQuery = 'UPDATE posts SET like_user_id = ? WHERE post_id = ?';
        db.query(updateQuery, [JSON.stringify(likedUsers), post_id], (updateErr) => {
            if (updateErr) return res.status(500).json({ error: updateErr.message });


            return res.json({
                message: 'Post like status updated successfully',
                Success: is_liked,
                post: {
                    post_id: post.post_id,
                }
            });
        });
    });
});
app.post('/send_follow', (req, res) => {
    const { user_id: currentUserId } = req.body; 
    const targetUserId = req.cookies.user_data; 

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

  
    const query = 'UPDATE users SET request_sent_id = JSON_ARRAY_APPEND(request_sent_id, "$", ?) WHERE user_id = ?';

    db.query(query, [targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Follow request sent successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});
app.post('/unfollow', (req, res) => {
    const { user_id: currentUserId } = req.body; 
    const targetUserId = req.cookies.user_data;

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

   
    const query = 'UPDATE users SET friends_id = JSON_REMOVE(friends_id, JSON_UNQUOTE(JSON_SEARCH(friends_id, "one", ?))) WHERE user_id = ?';

    db.query(query, [targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Unfollowed user successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});
app.post('/remove_follow_request', (req, res) => {
    const { user_id: currentUserId } = req.body; // The user ID to remove the follow request for
    const targetUserId = req.cookies.user_data; // Current user's ID from cookies

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

   
    const query = 'UPDATE users SET request_sent_id = JSON_REMOVE(request_sent_id, JSON_UNQUOTE(JSON_SEARCH(request_sent_id, "one", ?))) WHERE user_id = ?';

    db.query(query, [targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Removed follow request successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});

app.post('/accept_follow_request', (req, res) => {
    const { user_id: currentUserId } = req.body; 
    const targetUserId = req.cookies.user_data;

    if (!currentUserId) {
        return res.status(400).json({ error: 'current user_id is required' });
    }

    
    const query = `
        UPDATE users 
        SET friends_id = JSON_ARRAY_APPEND(friends_id, "$", ?), 
            request_received_id = JSON_REMOVE(request_received_id, JSON_UNQUOTE(JSON_SEARCH(request_received_id, "one", ?))) 
        WHERE user_id = ? 
    `;

    db.query(query, [targetUserId, targetUserId, currentUserId], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        return res.json({
            Message: 'Follow request accepted successfully',
            Success: true,
            data: { currentUserId }
        });
    });
});
