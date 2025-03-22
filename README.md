# Type Defender Backend API

An Express.js-based API for user authentication and management with JWT support.

## Base URL

- local : http://localhost:3000
- heroku : (TBD)

## Endpoint

- [GET `/`](#get-)
- [GET `/users`](#get-users)
- [GET `/users/:userId`](#get-usersuserid)
- [POST `/login`](#post-login)
- [POST `/users`](#post-users)
- [PUT `/users`](#put-users-token-required)
- [DELETE `/users`](#delete-users-token-required)

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
