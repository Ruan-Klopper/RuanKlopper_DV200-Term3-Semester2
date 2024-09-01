# Term 3 Semester 2 Project - QueryQuorum

### Created by: Ruan Klopper

### Student Number: 231280

---

### Index

1. [Access Demo Video](#access-demo-video)
   - [Quick Link to Demo Video](https://drive.google.com/drive/folders/1EMhbO804rgga6fd0uokKIApfvNjEH-Gi?usp=sharing)
2. [Project Overview](#project-overview)
3. [Project General Info](#project-general-info)
   - [Project Type](#project-type)
   - [Website Inspiration](#website-inspiration)
4. [Website Basic Info](#website-basic-info)
   - [Codebases and Frameworks](#codebases-and-frameworks)
   - [Frontend and Backend Languages](#frontend-and-backend-languages)
   - [Database](#database)
5. [Website Guide](#website-guide)
   - [Accessing the Finished Product](#accessing-the-finished-product)
     - [Home Page](#home-page)
     - [Sign-Up/Log-In](#sign-up-log-in)
     - [Post Page](#post-page)
     - [Group Page](#group-page)
     - [Create Group/Post](#create-grouppost)
6. [Database Overview](#database-overview)
   - [ER Diagram](#er-diagram)
     - [Users Table](#users-table)
     - [Groups Table](#groups-table)
     - [GroupMembers Table](#groupmembers-table)
     - [Posts Table](#posts-table)
     - [Comments Table](#comments-table)
7. [Project Setup](#project-setup)
   - [Backend Setup](#backend-setup)
     - [Place the Project Files](#place-the-project-files)
     - [Start XAMPP Services](#start-xampp-services)
     - [Database Creation](#database-creation)
   - [Frontend Setup](#frontend-setup)
     - [Open the Project in VSCode](#open-the-project-in-vscode)
     - [Launch the Terminal](#launch-the-terminal)
     - [Navigate to the React Application](#navigate-to-the-react-application)
     - [Start the React Development Server](#start-the-react-development-server)
   - [Database Setup](#database-setup)
     - [SQL Script to Create `QueryQuorum` Database and Tables](#sql-script-to-create-queryquorum-database-and-tables)

---

## Access Demo Video

Google Drive folder containing the demo video and the ER diagram can be accessed here: [Demo Video and ER Diagram](https://drive.google.com/drive/folders/1EMhbO804rgga6fd0uokKIApfvNjEH-Gi?usp=sharing)

Or alternatively access it here:
https://drive.google.com/drive/folders/1EMhbO804rgga6fd0uokKIApfvNjEH-Gi?usp=sharing

---

## Project Overview

**QueryQuorum** is a Question and Answer (QnA) website inspired by popular platforms like Reddit and Quora. It follows the waterfall model for project development, ensuring a structured approach with clearly defined phases. This project showcases the integration of a frontend built with React and a backend developed using PHP. The database used is an SQL relational database, ensuring efficient data storage and retrieval.

---

## Project General Info

### Project Type

- **Waterfall Project**: A sequential development process where each phase must be completed before the next begins.

### Website Inspiration

- **Inspiration**: QueryQuorum draws inspiration from platforms like Reddit and Quora, focusing on user-generated content in a QnA format.

---

## Website Basic Info

### Codebases and Frameworks

- **Frontend**: Developed using **React** for a dynamic and responsive user interface.
- **Backend**: Implemented with **PHP** to handle server-side logic and data processing.

### Frontend and Backend Languages

- **Frontend Language**: JavaScript (React)
- **Backend Language**: PHP

### Database

- **Type**: SQL Relational Database
- **Database Structure**: The database is designed with various data types to efficiently manage user information, questions, answers, and interactions.

---

## Website Guide

### Accessing the Finished Product

1. **Home Page**: The entry point to the website, displaying the latest and most popular questions.
2. **Sign-Up/Log-In**: Users can register or log in to access all features, including asking questions and providing answers.
3. **Post Page**: Any user can view posts, but only logged-in users can create and comment on posts.
4. **Group Page**: Any user can view groups, and logged-in users can join groups.
5. **Create Group/Post**: Logged-in users can create groups and posts. Users who have joined a group can create posts within that group.

---

## Database Overview

### ER Diagram

The ER (Entity-Relationship) diagram included in the project files provides a visual representation of the database structure. Below is a summary of the entities and their relationships:

1. **Users Table**:

   - **Primary Key (PK)**: `userID`
   - Stores user details including username, first name, last name, email, and more. Each user can be linked to multiple posts and group memberships.

2. **Groups Table**:

   - **Primary Key (PK)**: `groupID`
   - Contains information about various groups within QueryQuorum. Each group has attributes like name, description, rules, and media (profile and banner pictures).

3. **GroupMembers Table**:

   - **Primary Key (PK)**: `groupMemberID`
   - **Foreign Keys (FK)**: `userID`, `groupID`
   - Manages the relationship between users and groups. It tracks which users belong to which groups, their roles within the group (e.g., admin, member, owner), and the date they joined.

4. **Posts Table**:

   - **Primary Key (PK)**: `postID`
   - **Foreign Keys (FK)**: `groupID`, `userID`, `parentPostID`
   - Stores data about user posts, including the title, description, creation date, associated images, and likes. Posts can belong to groups and can be nested (a post can be a reply to another post).

5. **Comments Table**:
   - **Primary Key (PK)**: `commentID`
   - **Foreign Keys (FK)**: `postID`, `userID`, `parentCommentID`
   - Manages the comments made on posts. It records the comment's text, creation date, likes, and whether it has been deleted. Comments can also be nested, allowing users to reply to other comments.

---

## Project Setup

This **QueryQuorum** setup guide will help you get the project up and running smoothly. Follow the steps below to set up both the backend and frontend environments.

### Backend Setup

1. **Place the Project Files:**

   - Clone the whole `RuanKlopper_DV200-Term3-Semester2` folder and move it to your `HTDOCS` directory, typically located in the `XAMPP` installation path (e.g., `C:\xampp\htdocs\` on Windows). Although not final, IF some API urls doesn't, the API call URLs needs to be changed from: http://localhost/QueryQuorum/react_app/backend/api to: http://RuanKlopper_DV200-Term3-Semester2/backend/api

2. **Start XAMPP Services:**

   - Launch XAMPP and start the essential services by clicking the **Start** buttons for `Apache` and `MySQL`. These services are required to run your PHP scripts and manage the database.

3. **Database Creation:**
   - Open your web browser and navigate to `http://localhost/phpmyadmin`.
   - In `phpMyAdmin`, go to the `SQL` tab where you can execute SQL queries.
   - Copy and paste the SQL script provided in the **Database Setup** section below, then click **Go** to create the `QueryQuorum` database and its associated tables.

### Frontend Setup

1. **Open the Project in VSCode:**

   - Navigate to your `HTDOCS` directory, right-click on the `QueryQuorum` folder, and select **Open with Code** to launch Visual Studio Code with the project files.

2. **Launch the Terminal:**

   - In VSCode, open a new terminal by selecting **Terminal** > **New Terminal** from the top menu.

3. **Navigate to the React Application:**

   - Enter the following commands in the terminal to navigate to the React app directory:
     ```bash
     cd front
     ```

4. **Start the React Development Server:**
   - Run the following command to start the frontend development server:
     ```bash
     npm start
     ```
   - Your default web browser should automatically open and display the QueryQuorum interface. If not, navigate to `http://localhost:3000` in your browser.

### Database Setup

The `QueryQuorum` platform relies on a well-structured SQL database to manage its user data, posts, comments, and group memberships. Follow the steps below to set up the database using the provided SQL script.

#### SQL Script to Create `QueryQuorum` Database and Tables

```sql
-- Create the QueryQuorum database
CREATE DATABASE QueryQuorum;

-- Use the QueryQuorum database
USE QueryQuorum;

-- Create the Users table
CREATE TABLE Users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    userFirstname VARCHAR(255),
    userLastname VARCHAR(255),
    userBio TEXT,
    userEmail VARCHAR(255) UNIQUE NOT NULL,
    userPassword VARCHAR(255) NOT NULL,
    userDatejoined DATETIME DEFAULT CURRENT_TIMESTAMP,
    userProfilePic VARCHAR(255),
    userBannerPic VARCHAR(255),
    userActive BOOLEAN DEFAULT TRUE
);

-- Create the Groups table
CREATE TABLE Groups (
    groupID INT AUTO_INCREMENT PRIMARY KEY,
    groupName VARCHAR(255) UNIQUE NOT NULL,
    groupDescription TEXT,
    groupRules TEXT,
    groupProfilePic VARCHAR(255),
    groupBannerPic VARCHAR(255),
    groupViews INT DEFAULT 0
);

-- Create the GroupMembers table
CREATE TABLE GroupMembers (
    groupMemberID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT,
    groupID INT,
    role ENUM('admin', 'member', 'owner') DEFAULT 'member',
    dateJoined DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (groupID) REFERENCES Groups(groupID)
);

-- Create the Posts table
CREATE TABLE Posts (
    postID INT AUTO_INCREMENT PRIMARY KEY,
    postTitle VARCHAR(255) NOT NULL,
    postDescription TEXT NOT NULL,
    postCreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    postImage VARCHAR(255),
    postLikes INT DEFAULT 0,
    postViews INT DEFAULT 0,
    postSaves INT DEFAULT 0,
    groupID INT,
    userID INT,
    parentPostID INT DEFAULT NULL,
    FOREIGN KEY (groupID) REFERENCES Groups(groupID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (parentPostID) REFERENCES Posts(postID)
);

-- Create the Comments table
CREATE TABLE Comments (
    commentID INT AUTO_INCREMENT PRIMARY KEY,
    postID INT,
    userID INT,
    parentCommentID INT DEFAULT NULL,
    commentText TEXT NOT NULL,
    commentCreationDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    commentLikes INT DEFAULT 0,
    isDeleted BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (postID) REFERENCES Posts(postID),
    FOREIGN KEY (userID) REFERENCES Users(userID),
    FOREIGN KEY (parentCommentID) REFERENCES Comments(commentID)
);
```
