# Exercises

We will create a basic chatbox using

- KOA server (provided)
- Frontend framework of your choice (examples provided in React and Angular)
- Library `socket.io`, see https://socket.io/docs/

The sent messages will be stored in the client, meaning all chat history is gone after a reconnect. This also means most of the logic of this application will reside in the frontend. We will use the server mostly for routing calls.

Check out this repo for an example: https://github.com/nathanbreuring/socket-chat

##### 1. Basic functionality

We'll start out small with a chat displaying messages of connected users. We will need:

1. A login screen where a user can pick it's username and proceed to chatbox

After choosing a username, the user enters the chatbox. Here we need:

2. A large, scrollable field displaying the chatHistory
3. An input field for defining user messages
4. A button for sending the user message and a listener on the input field so we can send a message by pressing enter, after which the user message is reset

##### 2. Advanced functionality

Once we got that figured out, we'll add some functionality:

1. Global messages (ie. User X has entered chat)
2. Userpane displaying a list of all currently connected users
3. Private messaging (User X messages User Y)

## Hands on

##### 1. Basics: barebones chatbox

###### Setup

- `cd` in the server directory
- `npm install` and `npm run start:watch`
- the server hotreloads your changes while developing
  &nbsp;
- `cd` in the client directory
- `create-react-app` or NG equivalent to setup your frontend project
- `npm install` and run `npm start` in two different terminals (ie. on ports 3000 and 3001)
- this will start the client twice for testing your chat functionality while developing

###### Guidelines

- In server/server.ts you will find predefined events, each corresponds to the functionality as outlined above
- We will start by implementing the `message` event, for now put in a console.log() so we know we triggered it
- Open your freshly generated frontend project and create a generic `.ts` or `.js` file named something like `handlers` in the `src` folder
- `npm install socket.io-client`
- In this file we will create a function which initiates socket.io
- `import Socketio from "socket.io-client"`
- `const socket = Socketio.connect("http://localhost:3100")`
- Now that we have the socket.io client at our disposal, we can easily broadcast an event to the server
- `const message = () => { socket.emit("message")}`
- Go ahead and instantiate the function in the toplevel component of your project
- Use it to call the function `message()`
- You should see the `console.log()` in the terminal as defined earlier in the `server/server.ts` file
- Now it's time to broadcast the message back to all connected clients
- In the `client/src/handlers.ts` we will create a listener function with a callback
- `socket.on("message", function(){})`
- We can use the callback to alter the state of our client, the callback function can be given an parameter to pass the payload from client to server, back to all clients. Make sure you include the parameter in the outgoing event, the server listener and/or the client listener!
- Basically you now have all the tools to create a basic chatbox as outlined in the functionality above
- I'll leave it to you to figure out how to connect it to your frontend
  &nbsp;
  A few tips:
- To keep things simple, make an empty list called `chatHistory` to which you can push an object containg the userMessage and the userName.
- You can use `chatHistory` to map out entries and display all sent lines, you can use the socket.io listener event in the `handlers` file to add entries
- Hook up your outgoing `message` event to an <input> and a <button>Button</button> component
  &nbsp;
  Remember:
- socket's `.on()` function is a listener
- socket's `.emit()` function is an outgoing event or `broadcasting`
