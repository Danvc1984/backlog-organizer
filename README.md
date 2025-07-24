# Backlog Organizer

Backlog Organizer is a web application designed to help users manage their game backlog and wishlist, providing personalized game recommendations. Our goal is to provide a user-friendly experience that encourages engagement with their existing game library and helps them discover new titles.

## Goals

- Enable users to organize their purchased games (backlog) and desired games (wishlist).
- Provide intelligent recommendations from the backlog and occasionally from the wishlist.
- Offer a gamified experience for selecting recommended games.
- Track historical recommendations.

## Features

- **User Authentication:** Sign up, sign in, and sign out with email and password.
- **Steam Integration:** Link your Steam account to import your game library.
- **Game Management:**
    - Manage two separate lists: a backlog for games you own and a wishlist for games you want to buy.
    - Manually add and edit games.
    - Import your entire Steam library into your backlog.
    - Upload a CSV file to add games to your backlog or wishlist.
    - Remove games from your lists.
    - Move games from your wishlist to your backlog, and from your backlog to a "recently picked" list.
- **Game Discovery:**
    - Get a random game recommendation from your backlog.
    - Filter your lists by genre, release year, platform, and estimated playtime.
    - Sort your lists by name and release date.

## Technologies Used

- React
- Vite
- Firebase (Authentication, Firestore, Cloud Functions)
- Papaparse (for CSV parsing)
