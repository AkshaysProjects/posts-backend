# Posts Backend

This is a simple Node.js backend application built with Express.js that provides API endpoints for user authentication and post management. The application allows users to register, log in, and perform CRUD operations on posts.

## Features

- User registration and login with JSON Web Tokens (JWT) for authentication
- CRUD operations for posts
- Protected routes that require a valid JWT

## Getting Started

### Prerequisites

- Node.js installed on your machine
- MongoDB setup locally or remotely

### Installation

1. Clone the repository:

```
git clone https://github.com/AkshaysProjects/posts-backend.git
```

2. Navigate to the cloned repository:

```
cd posts-backend
```

3. Install the required npm packages:

```
npm install
```

4. Rename a .env.example file in the root directory to .env and add your MongoDB URL. Also replace yourJwtSecret, and yourJwtRefreshSecret with your MongoDB database name and desired JWT secrets.

### Running the Application

Run the application using the following command:

```
npm start
```

The server will start running on http://localhost:3000.
You can change the port by exporting the port you want as "PORT" in your environment.

## API Endpoints

### Authentication

- POST /auth/register: Registers a new user with name, username, email, mobile number, and password in the request body.
- POST /auth/login: Authenticates a user with email or username and password in the request body.
- POST /auth/refresh: Refreshes the access token using a refresh token provided in the request body.

### Posts

- GET /posts: Retrieves all posts.
- GET /posts/:id: Retrieves a single post by its ID.
- POST /posts: Creates a new post with userId, title, and body in the request body.
- PUT /posts/:id: Updates an existing post by its ID with userId, title, and body in the request body.
- DELETE /posts/:id: Deletes a post by its ID.

### Protected Posts

- All /protected/posts routes: These routes are the same as the posts routes but require a valid JWT in the Authorization header.

## Contributing

Feel free to fork this repository and submit pull requests for any improvements or fixes.

## License

This project is licensed under the MIT License.
