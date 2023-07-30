# Angular App with Node.js, Express, and MySQL

## Description

This is an Angular web application with a Node.js, Express, and MySQL backend. The frontend is built using Angular and ngx-bootstrap for enhanced UI components. The backend is powered by Node.js and Express, while the data is stored in a MySQL database.

## Getting Started

To run the application, follow the steps below:

### Prerequisites

- Node.js and npm (Node Package Manager) should be installed on your system.
- MySQL server should be installed and running.

### Installation

Clone this repository to your local machine:

```bash
git clone https://github.com/dd44it/calendar_range.git
cd calendar_range
npm install
```

### Configure the Backend
Create a .env file in the server folder of the project.

Add the necessary configuration data in the .env file to connect to your MySQL database. The file should look something like this:

```bash
DB_HOST=your_mysql_host
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=your_mysql_database_name
```
Replace your_mysql_host, your_mysql_username, your_mysql_password, and your_mysql_database_name with your actual MySQL database connection details.

## Import Data to MySQL Database
Use the provided SQL file (e.g., data.sql) to import the necessary data into your MySQL database. This file contains the data required for the application to function correctly.

##  Running the Application
Start the backend server by running the following command from the server directory:
```bash
npm start
```

This will connect the backend to your MySQL database using the configuration provided in the .env file.

Now, start the frontend development server from the project's root folder:
```bash
ng serve -o
```
The -o flag will automatically open the application in your default web browser.
The application should now be up and running! You can access it by navigating to http://localhost:4200 in your web browser.
