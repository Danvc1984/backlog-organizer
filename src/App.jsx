import React, { useState, useEffect } from 'react';
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
import './App.css';

function App() {
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [isAddEditGameModalOpen, setIsAddEditGameModalOpen] = useState(false);
  const [isSteamImportModalOpen, setIsSteamImportModalOpen] = useState(false);
  const [isCSVUploadLoadingModalOpen, setIsCSVUploadLoadingModalOpen] = useState(false);
  const [isCSVUploadFormModalOpen, setIsCSVUploadFormModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLinkSteamModalOpen, setIsLinkSteamModalOpen] = useState(false);
  const [gameToEdit, setGameToEdit] = useState(null);
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Dummy data for wishlist and backlog
  const [wishlist, setWishlist] = useState([
    { id: 'w1', name: 'Cyberpunk 2077', platform: 'PC', genre: 'RPG', estimatedPlaytime: '60h', releaseDate: '2020-12-10', imageUrl: 'https://via.placeholder.com/150/FF0000/FFFFFF?text=CP2077', discount: 10 },
    { id: 'w2', name: 'The Witcher 3', platform: 'PC', genre: 'RPG', estimatedPlaytime: '100h', releaseDate: '2015-05-19', imageUrl: 'https://via.placeholder.com/150/0000FF/FFFFFF?text=Witcher3', discount: 0 },
    { id: 'w3', name: 'Elden Ring', platform: 'PC', genre: 'Action RPG', estimatedPlaytime: '80h', releaseDate: '2022-02-25', imageUrl: 'https://via.placeholder.com/150/008000/FFFFFF?text=EldenRing', discount: 20 },
  ]);

  const [backlog, setBacklog] = useState([
    { id: 'b1', name: 'Red Dead Redemption 2', platform: 'PC', genre: 'Action-adventure', estimatedPlaytime: '70h', releaseDate: '2018-10-26', imageUrl: 'https://via.placeholder.com/150/FFFF00/000000?text=RDR2', pickedTimestamp: '2023-01-15' },
    { id: 'b2', name: 'God of War (2018)', platform: 'PC', genre: 'Action-adventure', estimatedPlaytime: '35h', releaseDate: '2022-01-14', imageUrl: 'https://via.placeholder.com/150/FFA500/FFFFFF?text=GoW', pickedTimestamp: '2023-03-01' },
    { id: 'b3', name: 'Horizon Zero Dawn', platform: 'PC', genre: 'Action RPG', estimatedPlaytime: '50h', releaseDate: '2020-08-07', imageUrl: 'https://via.placeholder.com/150/800080/FFFFFF?text=HZD', pickedTimestamp: '2023-02-10' },
  ]);
  const [filterCriterion, setFilterCriterion] = useState('All')
  const [sortCriterion, setSortCriterion] = useState('name-asc');

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const handleAddGame = () => {
    setGameToEdit(null);
    setIsAddEditGameModalOpen(true);
  };

  const handleEditGame = (game) => {
    setGameToEdit(game);
    setIsAddEditGameModalOpen(true);
  };

  const handleSaveGame = (game) => {
    console.log('Saving game:', game);
    setIsAddEditGameModalOpen(false);
    showNotification('Game saved successfully!', 'success');
    if (game.id) {
      setWishlist(prev => prev.map(g => (g.id === game.id ? game : g)));
      setBacklog(prev => prev.map(g => (g.id === game.id ? game : g)));
    } else {
      const newGame = { ...game, id: `w${Date.now()}` };
      setWishlist(prev => [...prev, newGame]);
    }
  };

  const handleRemoveGame = (gameId) => {
    setWishlist(prev => prev.filter(game => game.id !== gameId));
    setBacklog(prev => prev.filter(game => game.id !== gameId));
    showNotification('Game removed successfully!', 'success');
  };

  const handleImportSteam = () => {
    setIsSteamImportModalOpen(true);
    setTimeout(() => {
      setIsSteamImportModalOpen(false);
      showNotification('Steam Import Complete! Your games have been imported from Steam.', 'success');
    }, 3000);
  };

  const openCSVUploadModal = () => {
    setIsCSVUploadFormModalOpen(true);
  };

  const handleCSVFileUpload = (file) => {
    console.log('Selected CSV file:', file.name);
    setIsCSVUploadLoadingModalOpen(true);
    setTimeout(() => {
      setIsCSVUploadLoadingModalOpen(false);
      showNotification('CSV Import Complete! Your games have been imported from the CSV file.', 'success');
    }, 3000);
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleSignIn = (user) => {
    setCurrentUser({ ...user, hasSteamLinked: false });
    showNotification(`Welcome, ${user.name}! You are now signed in.`, 'success');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showNotification('You have been signed out.', 'success');
  };

  const handleLinkSteam = (steamId) => {
    console.log('Linking Steam ID:', steamId);
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

  const getFilteredAndSortedGames = (games) => {
    let filteredGames = games;

    if (filterCriterion !== 'All'){
      filteredGames = games.filter(game => game.genre === filterCriterion);
    }

    const sortedGames = [...filteredGames].sort((a, b) => {
      if (sortCriterion === 'name-asc') {
        return a.name.localeCompare(b.name);
      } else if (sortCriterion === 'name-desc') {
        return b.name.localeCompare(a.name);
      } else if (sortCriterion === 'release-date-asc') {
        return new Date(a.releaseDate) - new Date(b.releaseDate);
      } else if (sortCriterion === 'release-date-desc') {
        return new Date(b.releaseDate) - new Date(a.releaseDate);
      }
      return 0;
    });
    return sortedGames;
  };

  const filteredAndSortedWishlist = getFilteredAndSortedGames(wishlist);
  const filteredAndSortedBacklog = getFilteredAndSortedGames(backlog);

  return (
    <div className="background-dark">
      <Header
        onRecommendClick={handleRecommendClick}
        onUserAvatarClick={openAuthModal}
        currentUser={currentUser}
        onSignOut={handleSignOut}
        onLinkSteamClick={openLinkSteamModal}
      />
      {currentUser ? (
        <Tabs
          onAddGame={handleAddGame}
          onEditGame={handleEditGame}
          onRemoveGame={handleRemoveGame}
          onImportSteam={handleImportSteam}
          onUploadCSV={openCSVUploadModal}
          wishlist={filteredAndSortedWishlist}
          backlog={filteredAndSortedBacklog}
          filterCriterion={filterCriterion}
          setFilterCriterion={setFilterCriterion}
          sortCriterion={sortCriterion}
          setSortCriterion={setSortCriterion}
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
