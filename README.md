# Metacognition Log Dashboard

This project is a custom application built to extend the functionality of Airtable. 

I have a series of Airtable bases that I use to manage everything from my time, tasks and thoughts (what I call my
 "metacognition log"), to tracking my health, to tracking the video games I play and the books I read.
 
 I have a monitor dedicated to this dashboard on my desk, where it displays daily progress towards my goals. At any
  point in time I can look over at it and it will tell me how many pomodoros and tasks I've completed so far today, as well as 
  how much water and how much physical activity I've had, and displays a random quote from my large bank of 
   favorite quotes I've collected.
  
 ## Structure
 
 ### Backend
 
 I chose to build the server in Python to allow for maximum flexibility in the libraries I can use and the ease of
  data manipulation. 
  
  It uses CherryPy to host a WebSocket connection, and through that connection it routes requests
   to series of abstractions I've built over various tools and services I use including Airtable, AWS, Github, and YNAB.
   
### Frontend

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). It 
 uses React and Redux, and it communicates within itself and the server through Redux events communicated through
  a custom Redux Middleware that sends requests over the WebSocket.

It displays widgets on a central grid, using React Grid Layout to provide simple grid rearrangement and resizing
 functionality.
 
 ### Data
 
 Wherever possible, actual data and configuration data are both stored in Airtable. This allows for maximum
  configurability without having to go into code to add new widgets or pages. On a daily basis this configuration
   data is then synced with a local DynamoDB instance that acts as a cache to improve performance and limit Airtable
    API requests.
    
## Current and Future State

Right now it's built exclusively around my personal  Airtable bases and is hosted on my local home network.

In the future I may generalize the application so others may use it, and host it in AWS so I can use it outside of my
 home.

I wrote the bulk of the code between July and August 2020.