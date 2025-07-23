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
import LoadingScreen from './LoadingScreen'; // Import the new component
import { auth, db } from './firebase'; // Import auth and db
import { onAuthStateChanged, signOut } from 'firebase/auth';
import Papa from 'papaparse'; // Import PapaParse
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';
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
  const [listTypeForNewGame, setListTypeForNewGame] = useState('backlog');
  const [notification, setNotification] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [backlog, setBacklog] = useState([]);
  const [recentlyPicked, setRecentlyPicked] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCriterion, setFilterCriterion] = useState('All');
  const [sortCriterion, setSortCriterion] = useState('name-asc');
  const [closeAllDetails, setCloseAllDetails] = useState(false); // New state variable

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setLoading(true);
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setCurrentUser({
            name: userData.username || user.displayName || user.email,
            uid: user.uid,
            steamId: userData.steamId || null,
            hasSteamLinked: userData.hasSteamLinked || false,
          });
        } else {
          // Create user doc if it doesn't exist
          const newUser = {
            uid: user.uid,
            username: user.displayName || user.email,
            email: user.email,
            steamId: null,
            hasSteamLinked: false,
          };
          await setDoc(userDocRef, newUser);
          setCurrentUser(newUser);
        }
      } else {
        setCurrentUser(null);
        setWishlist([]);
        setBacklog([]);
        setRecentlyPicked([]);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const setupFirestoreListeners = () => {
      const qWishlist = query(collection(db, "wishlist"), where("userId", "==", currentUser.uid));
      const unsubscribeWishlist = onSnapshot(qWishlist, (querySnapshot) => {
        const games = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setWishlist(games);
      }, (error) => console.error("Wishlist listener error:", error));

      const qBacklog = query(collection(db, "backlog"), where("userId", "==", currentUser.uid));
      const unsubscribeBacklog = onSnapshot(qBacklog, (querySnapshot) => {
        const games = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBacklog(games);
        setLoading(false); // Set loading to false after backlog is fetched
      }, (error) => {
        console.error("Backlog listener error:", error);
        setLoading(false);
      });

      const qRecentlyPicked = query(collection(db, "recentlyPicked"), where("userId", "==", currentUser.uid));
      const unsubscribeRecentlyPicked = onSnapshot(qRecentlyPicked, (querySnapshot) => {
        const games = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setRecentlyPicked(games);
      }, (error) => console.error("Recently Picked listener error:", error));

      return () => {
        unsubscribeWishlist();
        unsubscribeBacklog();
        unsubscribeRecentlyPicked();
      };
    };

    const unsubscribe = setupFirestoreListeners();
    return () => unsubscribe();
  }, [currentUser]);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const dismissNotification = () => {
    setNotification(null);
  };

  const handleAddGame = (listType = 'backlog') => {
    setGameToEdit(null);
    setListTypeForNewGame(listType);
    setIsAddEditGameModalOpen(true);
  };

  const handleEditGame = (game) => {
    setGameToEdit(game);
    setIsAddEditGameModalOpen(true);
  };

  const handleSaveGame = async (game) => {
    if (!currentUser) {
      showNotification('error', 'You must be logged in to save games.');
      return;
    }
  
    const gameData = { ...game, userId: currentUser.uid };
  
    try {
      if (gameData.id) {
        const gameRef = doc(db, gameData.list, gameData.id);
        await updateDoc(gameRef, gameData);
        showNotification('success', 'Game updated successfully!');
      } else {
        await addDoc(collection(db, gameData.list), gameData);
        showNotification('success', 'Game added successfully!');
      }
      setIsAddEditGameModalOpen(false);
    } catch (error) {
      console.error("Error saving game: ", error);
      showNotification('error', `Error saving game: ${error.message}`);
    }
  };
  
  const handleRemoveGame = async (gameId, list) => {
    if (!currentUser) {
      showNotification('error', 'You must be logged in to remove games.');
      return;
    }
    try {
      await deleteDoc(doc(db, list, gameId));
      showNotification('success', 'Game removed successfully!');
    } catch (error) {
      console.error("Error removing game: ", error);
      showNotification('error', `Error removing game: ${error.message}`);
    }
  };

  const handleImportSteam = () => {
    setIsSteamImportModalOpen(true);
    setTimeout(() => {
      setIsSteamImportModalOpen(false);
      showNotification('success', 'Steam Import Complete! Your games have been imported from Steam.');
    }, 3000);
  };

  const openCSVUploadModal = (listType) => {
    setListTypeForNewGame(listType);
    setIsCSVUploadFormModalOpen(true);
  };

  const handleCSVFileUpload = (file, listType) => {
    if (!currentUser) {
      showNotification('error', 'You must be logged in to upload games.');
      setIsCSVUploadLoadingModalOpen(false);
      return;
    }

    setIsCSVUploadLoadingModalOpen(true);
    const gamesToAdd = [];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim().replace(/ /g, ''), // Normalize headers
      complete: async (results) => {
        if (results.errors.length) {
          console.error("CSV Parsing Errors:", results.errors.map(err => err.message).join('; ')); // Log messages
          showNotification('error', `CSV parsing failed: ${results.errors[0].message}`);
          setIsCSVUploadLoadingModalOpen(false);
          return;
        }

        const batch = writeBatch(db);
        let gamesCount = 0;

        results.data.forEach(row => {
          // Map CSV headers to your game object fields
          const gameData = {
            name: row.name || '',
            platform: row.platform || '',
            genre: row.genre || '',
            estimatedPlaytime: row.estimatedPlaytime || '',
            releaseDate: row.releaseDate || '',
            imageUrl: row.imageUrl || '',
            userId: currentUser.uid,
            list: listType,
          };

          // Only add games with a name
          if (gameData.name) {
            const newDocRef = doc(collection(db, listType));
            batch.set(newDocRef, gameData);
            gamesCount++;
          }
        });

        if (gamesCount === 0) {
          showNotification('warning', 'No valid games found in the CSV to upload.');
          setIsCSVUploadLoadingModalOpen(false);
          return;
        }

        try {
          await batch.commit();
          showNotification('success', `${gamesCount} games imported successfully into ${listType} from CSV!`);
        } catch (error) {
          console.error("Error batch adding documents: ", error);
          showNotification('error', `Error importing games: ${error.message}`);
        } finally {
          setIsCSVUploadLoadingModalOpen(false);
        }
      },
      error: (err) => {
        console.error("PapaParse error:", err);
        showNotification('error', `CSV parsing error: ${err.message}`);
        setIsCSVUploadLoadingModalOpen(false);
      }
    });
  };

  const openAuthModal = () => {
    setIsAuthModalOpen(true);
  };

  const handleSignIn = (user) => {};

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      showNotification('success', 'You have been signed out.');
    } catch (error) {
      console.error("Error signing out:", error);
      showNotification('error', 'Failed to sign out.');
    }
  };

  const handleLinkSteam = (steamId) => {
    setIsLinkSteamModalOpen(false);
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
    if (!games) return [];
    let filteredGames = games;

    if (filterCriterion !== 'All') {
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

  if (loading) {
    return <LoadingScreen />;
  }
  
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
          recentlyPicked={recentlyPicked}
          filterCriterion={filterCriterion}
          setFilterCriterion={setFilterCriterion}
          sortCriterion={sortCriterion}
          setSortCriterion={setSortCriterion}
          closeAllDetails={closeAllDetails}
          setCloseAllDetails={setCloseAllDetails}
        />
      ) : (
        <WelcomePage onSignInClick={openAuthModal} />
      )}

      {isRecommendationModalOpen && <RecommendationModal onClose={() => setIsRecommendationModalOpen(false)} backlog={backlog} />}
      {isAddEditGameModalOpen && (
        <AddEditGameModal
          gameToEdit={gameToEdit}
          onClose={() => setIsAddEditGameModalOpen(false)}
          onSave={handleSaveGame}
          listType={listTypeForNewGame}
        />
      )}
      {isSteamImportModalOpen && <SteamImportLoadingModal onClose={() => setIsSteamImportModalOpen(false)} />}
      {isCSVUploadLoadingModalOpen && <CSVUploadLoadingModal onClose={() => setIsCSVUploadLoadingModalOpen(false)} />}
      {isCSVUploadFormModalOpen && <CSVUploadModal onClose={() => setIsCSVUploadFormModalOpen(false)} onUpload={handleCSVFileUpload} listType={listTypeForNewGame} />}
      {isAuthModalOpen && <AuthModal onClose={() => setIsAuthModalOpen(false)} onSignIn={handleSignIn} showNotification={showNotification} />}
      {isLinkSteamModalOpen && <LinkSteamModal onClose={() => setIsLinkSteamModalOpen(false)} onLinkSteam={handleLinkSteam} currentUser={currentUser} showNotification={showNotification} />}
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
