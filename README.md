# BuzzKGP - Reddit-style Platform for IIT KGP

BuzzKGP is a modern, responsive web application built for IIT KGP students to share and discuss ideas through posts and nested comments. Built with Next.js and MongoDB, it features real-time interactions and a clean, intuitive interface.

## Features

### Authentication & User Management
- Secure authentication using Clerk
- User profiles with avatars and display names
- Protected routes and API endpoints

### Posts
- Create rich text posts using TinyMCE editor
- View posts in feed with infinite scrolling
- Sort posts by latest or popularity
- Personal post history view
- Responsive layout for all devices

### Comments & Discussions
- Nested comment system (replies to comments)
- Upvote/downvote functionality
- Sort comments by popularity or latest
- Real-time comment updates
- Rich text formatting in comments

### UI/UX
- Responsive design that works on all devices
- Dark/Light mode support
- Clean and intuitive interface
- Loading states and error handling
- Mobile-first navigation

## Tech Stack

- **Frontend:**
  - Next.js 13+ (App Router)
  - React 18+
  - Chakra UI
  - TinyMCE Editor
  - Clerk Authentication

- **Backend:**
  - Next.js API Routes
  - MongoDB
  - Clerk Auth API

## API Endpoints

### Posts
```
GET /api/posts
- Query params:
  - user_id (optional): Get posts by specific user
  - post_id (optional): Get specific post
- Returns: Array of posts or single post

POST /api/posts/new
- Body: { title, content, user_id }
- Returns: Created post details
```

### Comments
```
GET /api/comments
- Query params:
  - post_id: Get comments for specific post
  - sort: "latest" or "popular"
- Returns: Array of comments

POST /api/comments
- Body: { user_id, body, post_id }
- Returns: Created comment details
```

### Replies
```
GET /api/replies
- Query params:
  - comment_id: Get replies for specific comment
- Returns: Array of replies

POST /api/replies
- Body: { user_id, body, parent_comment_id, post_id }
- Returns: Created reply details
```

### Reactions
```
GET /api/reactions
- Query params:
  - reaction: "upvote" or "downvote"
  - user_id: User performing the reaction
  - type: "post" or "comment"
  - content_id: ID of post/comment
- Returns: Updated reaction status
```

## Page Routes

```
/ - Home page with post feed
/post/new - Create new post
/post/[postId] - Individual post view with comments
/?by=me - User's posts view
```

## Local Development

1. Clone the repository:
```bash
git clone https://github.com/keshaviscool/buzzKGP.git
cd buzzKGP
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
MONGODB_URI=your_mongodb_uri
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
