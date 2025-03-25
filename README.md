# Type Defender Backend API

An Express.js-based API for user authentication and management with JWT support.

## Base URL

- local : http://localhost:3000
- heroku : https://type-defender-699bdc11f4d9.herokuapp.com/users

## Endpoint

- [GET `/`](#get-)
- [GET `/users`](#get-users)
- [GET `/users/:userId`](#get-usersuserid)
- [POST `/login`](#post-login)
- [POST `/users`](#post-users)
- [PUT `/users`](#put-users-token-required)
- [DELETE `/users`](#delete-users-token-required)
- [Setup the Server Locally](#setup-the-server-locally)

## Error Example

If anything goes wrong, most of them will response will an error like this

```json
{
  "success": false,
  "data": {},
  "message": "Something went wrong or invalid input"
}
```

## GET `/`

Serves the static `index.html` file, currently for testing purpose.

## GET `/scores`

### Purpose

Fetch all scores in the system. Can use search query to get different data. Query is optional.

### Query
- userId
- level
- difficulty
- speed
- language
- order (default 'DESC')
- count (number of scores, default return all)

### Example Request

- GET /scores
- GET /scores?limit=10
- GET /scores?limit=10&language=javascript

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 7,
      "userId": 1,
      "point": 1000,
      "level": "2",
      "difficulty": "3",
      "language": "JavaScript",
      "data": ""
    },
    {
      "id": 279,
      "userId": 6,
      "point": 1000,
      "level": "1",
      "difficulty": "3",
      "language": "Python",
      "data": ""
    }
  ],
  "message": "Successfully get all users"
}
```

## GET `/users`

### Purpose

Fetch all users in the system. Returns an array of user objects, excluding passwords.

### Example Request

GET /users

### Example Response

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "user1",
      "email": "user1@gmail.com",
      "role": "user",
      "data": "{}"
    },
    {
      "id": 2,
      "name": "user2",
      "email": "user2@gmail.com",
      "role": "user",
      "data": "{}"
    },
    {
      "id": 3,
      "name": "user3",
      "email": "user3@gmail.com",
      "role": "user",
      "data": "{}"
    }
  ],
  "message": "Successfully get all users"
}
```

## GET `/users/:userId`

### Purpose

Fetch a single user by their ID. Returns user info excluding password.

### Parameters

Sent as URL path parameter:

- `userId` (required)

### Example Request

GET /users/2

### Example Response

```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "user2",
    "email": "user2@gmail.com",
    "role": "user",
    "data": "{}"
  },
  "message": "Successfully get user"
}
```

## POST `/login`

### Purpose

Authenticate a user and return a JWT token for accessing protected routes.

### Parameters

Sent as `x-www-form-urlencoded`:

- `email` (required)
- `password` (required)

### Example Request

POST /login

```
email : user1@gmail.com
password: password1
```

### Example Response

```json
{
  "success": true,
  "data": "<JWT_TOKEN_STRING>",
  "message": "Successfully login, return JWT token"
}
```

## POST `/users`

### Purpose

Register a new user.

### Parameters

Sent as `x-www-form-urlencoded` in the request body:

- `name` (required)
- `email` (required)
- `password` (required)

### Example Request

POST /users

```
name : user123
email : user123@gmail.com
password : password
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "user123",
    "email": "user123@gmail.com",
    "role": "user",
    "data": "{}"
  },
  "message": "Successfully create user"
}
```

## PUT `/users` (Token Required)

### Purpose

Update a user's name or data. Requires JWT authentication.

- Regular users can only update their own profile.
- Admins can update any user.

You can change a user's:

- name
- data (string)

### Headers

- `Authorization: Bearer <JWT_TOKEN>`

### Parameters

Sent as `x-www-form-urlencoded` in the request body:

- `userId` (target user, required)
- `name` (change name, optional)
- `data` (change data, optional)

### Example Request

PUT /users

```
userId: 3
name : pete (change to pete)
data : {coin: 100} (change data)
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": 3,
    "name": "pete",
    "email": "user3@gmail.com",
    "role": "user",
    "data": "{coin:100}"
  },
  "message": "Successfully updated user"
}
```

## DELETE `/users` (Token Required)

### Purpose

Delete a user by ID. Requires JWT authentication.

- Regular users can only delete their own account.
- Admins can delete any user **except themselves (admin ID = 1)**.

### Headers

- `Authorization: Bearer <JWT_TOKEN>`

### Parameters

Sent as `x-www-form-urlencoded` in the request body:

- `userId` (target user, required)

### Example Request

DELETE /users

```
userId: 3
```

### Example Response

```json
{
  "success": true,
  "data": {},
  "message": "Successfully delete user with id: 3"
}
```

<br>

# Setup the Server Locally

### 1. Install Dependencies

```bash
npm -i
```

### 2. Set Up Your Local SQL Database

Setup your local SQL database, and config your database info in the `config/config.json` file.

### 3. Run Database Migrations

```
npm run db-migrate
```

or if you want to undo migration

```
npm run db-migrate-undo
```

### 4. Seed the Database

```
npm run db-seed
```

### 5. Run the Development Server

```
npm run dev
```

Your application should now be running at: http://localhost:3000
