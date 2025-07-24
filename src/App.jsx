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
import LoadingScreen from './LoadingScreen';
import SteamImportConfirmationModal from './SteamImportConfirmationModal';
import { auth, db, app } from './firebase'; // Import 'app' for functions
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import for Cloud Functions
import Papa from 'papaparse';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import './App.css';

// Initialize Firebase Functions
const functions = getFunctions(app);
const importSteamGamesCallable = httpsCallable(functions, 'importSteamGames');
const processCSVUploadCallable = httpsCallable(functions, 'processCSVUpload');
const saveGameCallable = httpsCallable(functions, 'saveGame'); // New callable function
const moveGameCallable = httpsCallable(functions, 'moveGame'); // New callable function for moving games


function App() {
  const [isRecommendationModalOpen, setIsRecommendationModalOpen] = useState(false);
  const [isAddEditGameModalOpen, setIsAddEditGameModalOpen] = useState(false);
  const [isSteamImportModalOpen, setIsSteamImportModalOpen] = useState(false);
  const [isSteamImportConfirmationModalOpen, setIsSteamImportConfirmationModalOpen] = useState(false);
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
        setLoading(false);
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
      const result = await saveGameCallable({ gameData });
      showNotification('success', result.data.message);
      setIsAddEditGameModalOpen(false);
    } catch (error) {
      console.error("Error saving game: ", error);
      const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
      showNotification('error', `Error saving game: ${errorMessage}`);
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

  const handleMoveToBacklog = async (gameId) => {
    if (!currentUser) {
        showNotification('error', 'You must be logged in to move games.');
        return;
    }
    try {
        const result = await moveGameCallable({
            gameId,
            sourceList: 'wishlist',
            destinationList: 'backlog'
        });
        showNotification('success', result.data.message);
    } catch (error) {
        console.error("Error moving game to backlog: ", error);
        const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
        showNotification('error', `Error moving game: ${errorMessage}`);
    }
  };

  const handleMoveToRecentlyPicked = async (gameId) => {
    if (!currentUser) {
      showNotification('error', 'You must be logged in to move games.');
      return;
    }
    try {
      const result = await moveGameCallable({ gameId, sourceList: 'backlog', destinationList: 'recentlyPicked', playedAt: new Date().toISOString() });
      showNotification('success', result.data.message);
    } catch (error) {
      console.error("Error moving game to recently picked: ", error);
      const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
      showNotification('error', `Error moving game: ${errorMessage}`);
    }
  };

  const handleImportSteam = () => {
    if (!currentUser || !currentUser.steamId) {
      showNotification('error', 'Please link your Steam account first.');
      return;
    }
    setIsSteamImportConfirmationModalOpen(true);
  };

  const confirmImportSteam = async () => {
    setIsSteamImportConfirmationModalOpen(false);
    setIsSteamImportModalOpen(true);

    try {
      const result = await importSteamGamesCallable({ steamId: currentUser.steamId });
      showNotification('success', result.data.message);
    } catch (error) {
      console.error("Error importing Steam games: ", error);
      // Improved error message extraction
      const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
      showNotification('error', `Error importing Steam games: ${errorMessage}`);
    } finally {
      setIsSteamImportModalOpen(false);
    }
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

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      transformHeader: header => header.trim().replace(/ /g, ''),
      complete: async (results) => {
        if (results.errors.length) {
          console.error("CSV Parsing Errors:", results.errors.map(err => err.message).join('; '));
          showNotification('error', `CSV parsing failed: ${results.errors[0].message}`);
          setIsCSVUploadLoadingModalOpen(false);
          return;
        }

        if (results.data.length === 0) {
          showNotification('warning', 'No valid games found in the CSV to upload.');
          setIsCSVUploadLoadingModalOpen(false);
          return;
        }

        try {
          const result = await processCSVUploadCallable({ csvData: results.data, listType });
          showNotification('success', result.data.message);
        } catch (error) {
          console.error("Error importing games from CSV: ", error);
          // Improved error message extraction
          const errorMessage = error.details?.message || error.message || 'An unknown error occurred.';
          showNotification('error', `Error importing games from CSV: ${errorMessage}`);
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

  const handleSignIn = () => {};

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
    setCurrentUser(prevUser => ({
      ...prevUser,
      steamId: steamId,
      hasSteamLinked: true,
    }));
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
          wishlist={wishlist}
          backlog={backlog}
          recentlyPicked={recentlyPicked}
          onMoveToBacklog={handleMoveToBacklog} // Pass new handlers
          onMoveToRecentlyPicked={handleMoveToRecentlyPicked} // Pass new handlers
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
      {isSteamImportConfirmationModalOpen && (
        <SteamImportConfirmationModal
          onConfirm={confirmImportSteam}
          onCancel={() => setIsSteamImportConfirmationModalOpen(false)}
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