# Custom-AsyncLocalStorageBased-Tenant-Injector

## Objective of the task

Build a **request-scoped context propagation system** in Node.js using **AsyncLocalStorage**, with the goal of ensuring that each incoming request carries a unique reqId that is automatically injected into all logs -- no matter where in the asynchronous flow the log occurs.

This task verifies your understading of Node.js execution context, asynchronous boundaries, and how to maintain logical isolation between concurrent requests.

## Packages use:

1. crypto
2. express
3. winston
4. nodemon
5. typescript
6. @types/node
7. @types/express

## Installing dependencies

run "npm install" in your command prompt

## Running the application

run "npm run dev" in your command prompt

## Port

3000

## RESTful API Routes

http://localhost:3000/simulate/db

## Solution

I created a reusable logger using winston plugin in the utils folder and called the ALS to fetch the reqId so that we will not need to put it on a parameter. I also seperated initializing ALS and put it on the context file for reusablity. I then created a middleware for the ALS so that it can be called and create uniqueID in every requests and called it on the index.ts where "app.use(alsMiddleWare);" is being called. I also simulated a routes and controller for to simulate the promise and async when fetching a database.