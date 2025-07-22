# Project Blueprint

## Overview

This project is a web-based strategy game with a marine life theme that recommends games to the user. The application will have a clean and intuitive design with clear navigation and visual feedback. It will be responsive to various screen sizes and follow a defined color palette.

## Features Implemented

- Initial UI structure with Header and Tab Navigation.
- Full-screen UI layout with components.
- Full viewport width with padding.
- Application name changed to Backlog Odyssey.
- **Wishlist Discount Indicator:** For games in the wishlist that are currently discounted, a clear visual indicator (e.g., an icon, a colored badge, or distinct text styling) is displayed next to the game's title.
- **Recommendation Modal Overlay Close:** The recommendation modal now closes when the user clicks outside its content area.

## Plan for Current Change: Recommendation Modal Overlay Close

1.  **Modify `src/RecommendationModal.jsx`:**
    *   Add a `handleOverlayClick` function to the component.
    *   Attach the `handleOverlayClick` function to the `modalOverlay` div's `onClick` event.
    *   Ensure that the `onClose` function is called only when the click originates directly from the overlay, not from within the modal content.
2.  **Update `blueprint.md`:** Document the new feature and the changes made.
