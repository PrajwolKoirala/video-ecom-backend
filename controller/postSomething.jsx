const Post = require('../models/postSomething'); // Assuming this is the correct path to your model

// Controller to create a new post
exports.createPost = async (req, res) => {
    const { title, description, content, images, created_by } = req.body;

    try {
        const newPost = await Post.create({
            title,
            description,
            content,
            images,
            created_by
        });

        res.status(201).json({ success: true, message: 'Post created successfully', data: newPost });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
