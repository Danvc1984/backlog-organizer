import React, { useState } from 'react';
import Header from './Header';
import Tabs from './Tabs';
import RecommendationModal from './RecommendationModal';
import AddEditGameModal from './AddEditGameModal';
import SteamImportLoadingModal from './SteamImportLoadingModal';
import CSVUploadLoadingModal from './CSVUploadLoadingModal';
import CSVUploadModal from './CSVUploadModal';
import NotificationMessage from './NotificationMessage';
import AuthModal from './AuthModal';
import WelcomePage from './WelcomePage';
import LinkSteamModal from './LinkSteamModal';
import './/App.css';

function App() {
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [isAddEditGameModalOpen, setIsAddEditGameModalOpen] = useState(false);
  const [isSteamImportModalOpen, setIsSteamImportModalOpen] = useState(false);
  const [isCSVUploadLoadingModalOpen, setIsCSVUploadLoadingModalOpen] = useState(false);
  const [isCSVUploadFormModalOpen, setIsCSVUploadFormModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLinkSteamModalOpen, setIsLinkSteamModalOpen] = useState(false); // New state for Link Steam Modal
  const [gameToEdit, setGameToEdit] = useState(null);
  const [notification, setNotification] = useState(null); // { message: '', type: 'success' }
  const [currentUser, setCurrentUser] = useState(null); // Initialize as null

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const handleAddGame = () => {
    setGameToEdit(null); // Clear any game from previous edits
    setIsAddEditGameModalOpen(true);
  };

  const handleEditGame = (game) => {
    setGameToEdit(game);
    setIsAddEditGameModalOpen(true);
  };

  const handleSaveGame = (game) => {
    console.log('Saving game:', game);
    // Here you would typically update your game list state or send to a backend
    // For now, just close the modal.
    setIsAddEditGameModalOpen(false);
    showNotification('Game saved successfully!', 'success');
  };

  const handleImportSteam = () => {
    setIsSteamImportModalOpen(true);
    // Simulate an API call delay
    setTimeout(() => {
      setIsSteamImportModalOpen(false);
      // In a real app, you'd update game lists here after successful import
      showNotification('Steam Import Complete! Your games have been imported from Steam.', 'success');
    }, 3000); // 3 seconds delay for demonstration
  };

  const openCSVUploadModal = () => {
    setIsCSVUploadFormModalOpen(true);
  };

  const handleCSVFileUpload = (file) => {
    console.log('Selected CSV file:', file.name);
    // For now, we just open the loading modal
    setIsCSVUploadLoadingModalOpen(true);
    // Simulate an API call delay for CSV upload and processing
    setTimeout(() => {
      setIsCSVUploadLoadingModalOpen(false);
      showNotification('CSV Import Complete! Your games have been imported from the CSV file.', 'success');
    }, 3000); // 3 seconds delay for demonstration
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleSignIn = (user) => {
    setCurrentUser({ ...user, hasSteamLinked: false }); // Set hasSteamLinked to false on sign-in
    showNotification(`Welcome, ${user.name}! You are now signed in.`, 'success');
  };

  const handleSignOut = () => {
    setCurrentUser(null); // Mock sign out
    showNotification('You have been signed out.', 'success');
  };

  const handleLinkSteam = (steamId) => {
    console.log('Linking Steam ID:', steamId);
    // Simulate backend call and update user state
    setCurrentUser(prevUser => ({
      ...prevUser,
      hasSteamLinked: true,
    }));
    setIsLinkSteamModalOpen(false);
    showNotification(`Steam account ${steamId} linked successfully!`, 'success');
  };

  const openLinkSteamModal = () => {
    setIsLinkSteamModalOpen(true);
  };

  const handleRecommendClick = () => {
    if (currentUser) {
      setIsRecommendationModalOpen(true);
    } else {
      openAuthModal();
    }
  };

  return (
    <div className="background-dark">
      <Header
        onRecommendClick={handleRecommendClick}
        onUserAvatarClick={openAuthModal}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onLinkSteamClick={openLinkSteamModal} // Pass to Header
      />
      {currentUser ? (
        <Tabs
          onAddGame={handleAddGame}
          onEditGame={handleEditGame}
          onImportSteam={handleImportSteam}
          onUploadCSV={openCSVUploadModal}
        />
      ) : (
        <WelcomePage onSignInClick={openAuthModal} />
      )}

      {isRecommendationModalOpen && <RecommendationModal onClose={() => setIsRecommendationModalOpen(false)} />}
      {isAddEditGameModalOpen && (
        <AddEditGameModal
          gameToEdit={gameToEdit}
          onClose={() => setIsAddEditGameModalOpen(false)}
          onSave={handleSaveGame}
        />
      )}
      {isSteamImportModalOpen && <SteamImportLoadingModal onClose={() => setIsSteamImportModalOpen(false)} />}
      {isCSVUploadLoadingModalOpen && <CSVUploadLoadingModal onClose={() => setIsCSVUploadLoadingModalOpen(false)} />}
      {isCSVUploadFormModalOpen && <CSVUploadModal onClose={() => setIsCSVUploadFormModalOpen(false)} onUpload={handleCSVFileUpload} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onSignIn={handleSignIn} />}
      {isLinkSteamModalOpen && <LinkSteamModal onClose={() => setIsLinkSteamModalOpen(false)} onLinkSteam={handleLinkSteam} />}
      {notification && (
        <NotificationMessage
          message={notification.message}
          type={notification.type}
          onDismiss={dismissNotification}
        />
      )}
    </div>
  );
}

export default App;
