# Exercises

You will create a basic chatbox using

- KOA server (provided)
- Frontend framework of your choice (examples provided in React and Angular)
- Library `socket.io`, see https://socket.io/docs/

The sent messages will be stored in the client, meaning all chat history is gone after a reconnect. This also means most of the logic of this application will reside in the frontend. You will use the server mostly for routing calls.

Check out this repo for an example: https://github.com/nathanbreuring/socket-chat

##### 1. Basic functionality

You'll start out small with a chat displaying messages of connected users. You will need:

1. A login screen where a user can pick it's username and proceed to chatbox

After choosing a username, the user enters the chatbox. Here you need:

2. A large, scrollable field displaying the chatHistory
3. An input field for defining user messages
4. A button for sending the user message and a listener on the input field so you can send a message by pressing enter, after which the user message is reset

##### 2. Advanced functionality

Once you got that figured out, you'll add some functionality:

1. Global messages (ie. User X has entered chat)
2. Userpane displaying a list of all currently connected users
3. Private messaging (User X messages User Y)

## Hands on

#### 1. Basics: barebones chatbox

##### Setup

- `cd` in the server directory
- `npm install` and `npm run start:watch`
- the server hotreloads your changes while developing
  &nbsp;
- `cd` in the client directory
- generate your frontend project in either React of Angular
- React: `npx create-react-app $project-name` add `--typescript` parameter if you'd like
- Angular: `ng new $project-name`
- `npm install` and run `npm start` (React) or `ng serve` (Angular) in two different terminals (ie. on ports 3000 and 3001)
- this will start the client twice for testing your chat functionality while developing

##### Guidelines

File: `server/src/server.ts`

- In server/server.ts you will find predefined events, each corresponds to the functionality as outlined above
- You will start by implementing the `message` event, for now put in a console.log() so you know you triggered it
- `npm install socket.io-client`

Folder: freshly generated frontend project

- Open your freshly generated frontend project and create a generic `.ts` or `.js` file named something like `handlers` in the `src` folder
- In this file you will create a function (React) or a service with a nested function (Angular) named `socketHandler` which

  1. initiates socket.io
  2. sends out Socket.io events to the server
  3. (later) listens to specific Socket.io events coming from the server

- `import Socketio from "socket.io-client"`
- `const socket = Socketio.connect("http://localhost:3100")`
- Now that you have the socket.io client at your disposal, you can easily broadcast an event to the server. Implement the function at the next bullet inside the `socketHandler` function. Don't forget to return the function. This way we will have it available at later stages.
- `const message = () => { socket.emit("message")}`
- This function will be our `initial outgoing event`
- It's the first event (1) in a small lifecycle of (4) events

File: toplevel component (probably App) of your project

- Call and assign the `socketHandler` function inside your toplevel component
- This will be the component that encapsulates the rests of your components, in most cases the component: `App`
- Use the instance you created to directly call the nested function `message()`
- You should see the `console.log()` in the server terminal as defined earlier in the `server/src/server.ts` file.

File: `server/src/server.ts`

- Now that we received this `message` event from a client, we have to let all connected clients know we received a message. You will do this inside the SERVER.
- The `client.on("message", function(payload) {}` will be our hook. As you see this listener function contains a callback. This will be called whenever a `message` event is received. This is the second event (2) of our lifecycle.
- To let all connected clients know a message was sent, simply call `client.on("message", function(payload) { io.emit("message", payload); });
- This will emit another `message` event back to all connected clients.
- This was the third event (3) in our lifecycle.
- All that is left to do, is let the clients listen to it this event and update their state accordingly.

File: `client/src/handlers.ts`

- We will add the listener inside the previously defined `socketHandler` function
- Inside the `socketHandler` function, create a listener function with a callback
- `socket.on("message", function(){})`
- With this final event (4) our lifecycle of the `message` event is completed
- You can use the callback to alter the state of our client, the callback function can be given a parameter to pass the payload from client to server, back to all clients.
- `socket.on("message", function(payload){ // do something with payload - ie. update state in your frontend components})`
- When adding a parameter you should make sure you also include it in the events you defined earlier:

1. The initial outgoing event from client to server
2. The server listener - directly followed by:
3. The outgoing event from server back to the client

- Basically you now have all the tools to create a basic chatbox as outlined in the functionality above
- I'll leave it to you to figure out the details of connecting the final event to your frontend component
  &nbsp;
  A few tips:
- Make an empty list called `chatHistory` to which you can push an object containg the userMessage and the userName.
- You can use `chatHistory` to map out entries and display all sent lines, you can use the socket.io listener event in the `handlers` file to add entries
- Hook up your outgoing `message` event to an <input> and a <button>Button</button> component
  &nbsp;
  Remember:
- socket's `.on()` function is a listener
- socket's `.emit()` function is an outgoing event or `broadcasting`

#### 2. Advanced functionality

In the basic exercise the message was broadcasted to all connected clients. You will build some features now which require you to broadcast to specific clients. To do so, we need to keep track of which clients are connected.

##### Guidelines

###### Keeping state in the backend

- In `server/server.ts` you will need to keep state of which clients connected to the server
- Create an array of objects, each containing a userName and clientId
- When a user has entered their username, you will emit an `enter` event with socket.io from the client
- In `server/server.ts` we are listening to this event in the predefined function `enter`
- You will use this event to map the username - specified in the frontend, to a clientId - specified in the backend by creating a listener in the server
  &nbsp;
- The `username` will be accessible by using a parameter in the `enter` event - sent from the frontend since it is user-defined
- The `clientId` can be retrieved by calling `client.id` inside the callback of this `io.on("connection", function(client) {}` listener in `server/server.ts`
  &nbsp;
- Create 2 helper functions for adding and removing clients to the array
- Hookup the `enter` event to your frontend flow by calling `emit` when you see fit
  &nbsp;
- Whenever a client refreshes/closes the browser, socket.io will automatically emit a `disconnect` event. Use this hook to remove the client from the `connectedClients`

###### Keeping state in the frontend

- In the frontend you don't have a `clientId` at your disposal
- We will create a listener to retrieve this clientId from the server, once it is done processing
- In `server/server.ts` add an `emit` event with type `updateUser` to the `enter` listener
- It's really important you send this event ONLY to the client who is now entering the chatbox
- You can use this event, to update a `user` object in your frontend, in which you map clientId to userName
- You will have to create a listener in your frontend. You can use this hook to alter the state in your frontend
  &nbsp;
- You can send a event to a specific user by calling `.to( )` like:
  `io.to(clientId).emit(key, payload)`
- In this case the key will be `updateUser` and the payload will be `{id, userName}`

###### Displaying global messages

Displaying a message about users entering/leaving the chat should be easy by now. Use your creativity and define events to track this, use listeners in the frontend to update the state.

###### Displaying connected users

The steps described in `keeping state in the ...` should make this functionality relatively quick to implement.

- The server keeps track of all connected clients
- Whenever this list is updated, you will `emit` a message to all connected clients.
- In the frontend you `listen` to this event and update state accordingly
  &nbsp;
- In this case, keeping a copy of the list in your frontend is advisable
- Though be sure to let the backend handle the updating (removing/adding) of this list, so you never have 2 different versions of `connectedClients`
  &nbsp;
- Create a section displaying all connected users
- In preparation of creating private chat functionality, make sure each displayed userName is wrapped inside a button

###### Creating private chat functionality

By now you have all the components at your disposal to implement this feature.

- Because you keep a list of connectedClients you can easily emit a `privateMessage` event, ONLY to the involved users (sender, receiver)
- The sender will be the `user` you kept in state. The recipient `selectedUser` will be who ever the sender clicks in the section displaying all connected users.
- You can emit to multiple clients by calling `io.to(user.id).to(selectedUser.id).emit(key, payload)`
- Once the `selectedUser` is clicked, you update state and open a private chatbox section
- To keep track of multiple privateChats between different connectedClients, I suggest keeping a list of objects. Each object containing a `userPair` containing information about `user1` and `user2`. In this object also keep track of their `chatHistory`. This would be another list with objects, similar to the one you coded earlier while builing the `barebones chatbox`
  &nbsp;
- You will need to implement logic for pushing a new item to the `privateChats` list when initiating a chat.
- You will need to implement logic for finding an existing `privateChat` between a `userPair`, and pushing a new message to their `chatHistory`
