# Project Blueprint

## Overview

This project is a backlog and wishlist organizer for video games. It allows users to create an account, manage their game libraries, and get recommendations. The application is built with React and Firebase.

## Implemented Features

### User Authentication
- **Sign up, sign in, and sign out:** Users can create an account, sign in, and sign out.
- **Steam integration:** Users can link their Steam account to import their game library.

### Game Management
- **Backlog and wishlist:** Users can manage two separate lists of games: a backlog for games they own and a wishlist for games they want to buy.
- **Add and edit games:** Users can manually add games to their lists or edit existing entries.
- **Import from Steam:** Users can import their entire Steam library into their backlog.
- **CSV upload:** Users can upload a CSV file to add games to their backlog or wishlist.
- **Remove games:** Users can remove games from their lists.
- **Move games:** Users can move games from their wishlist to their backlog, and from their backlog to a "recently picked" list.

### Game Discovery
- **Game recommendations:** Users can get a random game recommendation from their backlog.
- **Filtering and sorting:** Users can filter their lists by genre, release year, platform, and estimated playtime. They can also sort their lists by name and release date.

## Code Cleanup Plan

The following changes will be made to improve the quality and maintainability of the codebase:

- **Remove unused variables and imports:** I will identify and remove any declared variables and imported modules that are not being used in the code.
- **Fix linter errors:** I will run the linter and fix any reported errors to ensure the code adheres to the project's coding standards.
- **Improve code readability:** I will review the code and make changes to improve its readability and maintainability. This may include refactoring complex functions, adding comments, and improving variable names.
