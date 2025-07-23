# Blueprint

## Purpose and Capabilities

This application is a game management tool that allows users to organize their video game library into a wishlist, backlog, and recently played lists. It integrates with Firebase for user authentication and data storage, provides features for adding, editing, and removing games, importing games from Steam, and uploading game lists via CSV. The application also includes a game recommendation feature and various modals for user interaction.

## Project Outline

The project is structured as a React application, likely initialized with Vite, using functional components and hooks for state management.

### Key Features:
- User Authentication (Login/Logout) using Firebase.
- Game management (Add, Edit, Remove) across different lists (Wishlist, Backlog, Recently Played).
- Steam integration for importing games.
- CSV upload functionality for bulk game imports.
- Game recommendation system.
- Notification system for user feedback.
- Filtering and sorting of game lists.
- Responsive design with a focus on modern UI/UX.
- Modals for various interactions (Authentication, Add/Edit Game, Recommendation, Steam Import, CSV Upload, Link Steam).
- Loading screens for better user experience.

### Styling:
The application uses a combination of global CSS (`App.css`, `index.css`) and CSS Modules for component-specific styling (e.g., `AddEditGameModal.module.css`).

### State Management:
Primarily uses React's `useState` and `useEffect` hooks for component-level and global state management. Firebase Firestore is used for persistent data storage.

### Routing:
(Currently, routing is not explicitly set up with `react-router-dom`, but the structure suggests it's a single-page application with conditional rendering based on user authentication.)

### Component Structure:
- `App.jsx`: Main application component, handles global state, authentication, and renders different sections based on user login status.
- `Header.jsx`: Navigation and user actions (recommendation, login/logout, link Steam).
- `Tabs.jsx`: Manages different game lists (Wishlist, Backlog) and their respective game cards.
- `GameCard.jsx`: Displays individual game details and actions.
- `WelcomePage.jsx`: Initial landing page for unauthenticated users.
- `RecommendationModal.jsx`, `AddEditGameModal.jsx`, `AuthModal.jsx`, `SteamImportLoadingModal.jsx`, `CSVUploadLoadingModal.jsx`, `CSVUploadModal.jsx`, `LinkSteamModal.jsx`: Various modal components for specific functionalities.
- `NotificationMessage.jsx`: Displays transient notifications.
- `LoadingScreen.jsx`: Displays while data is being loaded.
- `FilterSortControls.jsx`: Component for filtering and sorting game lists.
- `RecentlyPickedGameCard.jsx`: Displays recently picked games.
- `RecommendationCard.jsx`: Displays individual game recommendations.

## Plan for Current Change: Move "Close All Details" Toggle Button and Implement Conditional Visibility

### Overview:
To improve user experience and interface clarity, the "Close All Details" button will be moved from the `Header` to the `Tabs` component, specifically within the filter and sort controls area. This button will only be visible when at least one game card's details are open, providing a contextual action.

### Steps:
1.  **Modify `src/App.jsx`**:
    *   Remove the `onCloseAllDetails` prop from the `Header` component as it will no longer be responsible for this action.
    *   The `closeAllDetails` state and its setter `setCloseAllDetails` will continue to be passed to the `Tabs` component.
2.  **Modify `src/Header.jsx`**:
    *   Remove the "Close All Details" button and its `onCloseAllDetails` prop from the `Header` component.
3.  **Modify `src/Tabs.jsx`**:
    *   Introduce a new state variable, `openGameCardIds`, using `useState` to keep track of the IDs of game cards whose details are currently open.
    *   Pass `closeAllDetails`, `setCloseAllDetails`, and a new callback function, `onGameCardToggle`, to the `GameCard` component. The `onGameCardToggle` function will be responsible for updating `openGameCardIds` when a `GameCard` is expanded or collapsed.
    *   Conditionally render the "Close All Details" button within the `renderTabContent` function, in the desired area. The button will only appear if `openGameCardIds.length > 0`.
    *   When the "Close All Details" button is clicked, it will set `closeAllDetails` to `true` in `App.jsx` (which will propagate down to `GameCard`s via props) and then clear the `openGameCardIds` array in `Tabs.jsx`.
4.  **Modify `src/GameCard.jsx`**:
    *   Accept `closeAllDetails`, `setCloseAllDetails`, and `onGameCardToggle` as props.
    *   In the `onClick` handler for the game card header, after toggling its own `isOpen` state, call `onGameCardToggle` with the `game.id` and the new `isOpen` state. This will update the `openGameCardIds` state in the `Tabs` component.
    *   Modify the `useEffect` that listens for changes in `closeAllDetails`. When `closeAllDetails` becomes `true`, set `isOpen` to `false` and then immediately reset `setCloseAllDetails(false)`. This sequence ensures that the `onGameCardToggle` is called with the correct `isOpen` state for each card, which helps `Tabs` keep its `openGameCardIds` state accurate. This also prepares `closeAllDetails` for the next trigger. 
