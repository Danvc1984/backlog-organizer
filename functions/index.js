const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

const RAWG_API_KEY = functions.config().rawg.key;
const STEAM_API_KEY = functions.config().steam.key;

exports.importSteamGames = functions.runWith({ enforceAppCheck: false, timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { steamId } = data;
  const userId = context.auth.uid;

  if (!steamId) {
    throw new functions.https.HttpsError("invalid-argument", "Steam ID is required.");
  }

  try {
    // Fetch owned games from Steam API
    const steamResponse = await fetch(
      `http://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${STEAM_API_KEY}&steamid=${steamId}&format=json&include_appinfo=1`
    );

    if (!steamResponse.ok) {
      const errorText = await steamResponse.text();
      throw new functions.https.HttpsError("internal", `Steam API request failed: ${steamResponse.status} - ${errorText}`);
    }
    const steamData = await steamResponse.json();

    if (!steamData.response || !steamData.response.games || steamData.response.games.length === 0) {
      return { message: "No games found on your Steam account or your profile is private.", gamesImported: 0 };
    }

    const games = steamData.response.games;
    const rawgPromises = [];
    const gamesToProcess = [];

    for (const game of games) {
      let gameData = {
        name: game.name,
        platform: "PC",
        genre: "",
        estimatedPlaytime: (game.playtime_forever / 60).toFixed(2) + " hours",
        releaseDate: "",
        imageUrl: `https://media.steampowered.com/steamcommunity/public/images/apps/${game.appid}/${game.img_icon_url}.jpg`,
        userId: userId,
        list: "backlog",
      };
      gamesToProcess.push(gameData);

      // Add RAWG fetch promise to the array
      rawgPromises.push(
        fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(game.name)}&key=${RAWG_API_KEY}`)
          .then(res => res.json())
          .then(rawgSearchData => {
            if (rawgSearchData.results && rawgSearchData.results.length > 0) {
              const topResult = rawgSearchData.results[0];
              return fetch(`https://api.rawg.io/api/games/${topResult.id}?key=${RAWG_API_KEY}`);
            } else {
              return null; // No RAWG match found
            }
          })
          .then(res => (res ? res.json() : null))
          .catch(rawgError => {
            console.error("Error fetching game data from RAWG for", game.name, rawgError);
            return null; // Return null on error so Promise.allSettled doesn't fail
          })
      );
    }

    const rawgResults = await Promise.allSettled(rawgPromises);
    const batch = db.batch();
    let gamesCount = 0;

    for (let i = 0; i < gamesToProcess.length; i++) {
      let gameData = gamesToProcess[i];
      const rawgResult = rawgResults[i];

      if (rawgResult.status === 'fulfilled' && rawgResult.value) {
        const gameDetails = rawgResult.value;
        gameData = {
          ...gameData,
          name: gameDetails.name || gameData.name,
          platform: gameDetails.platforms?.map(p => p.platform.name).join(', ') || gameData.platform,
          genre: gameDetails.genres?.map(g => g.name).join(', ') || gameData.genre,
          estimatedPlaytime: (gameDetails.playtime ? `${gameDetails.playtime} hours` : 'N/A') || gameData.estimatedPlaytime,
          releaseDate: gameDetails.released || gameData.releaseDate,
          imageUrl: gameDetails.background_image || gameData.imageUrl,
        };
      }

      const newDocRef = db.collection("backlog").doc();
      batch.set(newDocRef, gameData);
      gamesCount++;
    }

    await batch.commit();
    return { message: `${gamesCount} games imported successfully from Steam!`, gamesImported: gamesCount };
  } catch (error) {
    console.error("Error importing Steam games: ", error);
    throw new functions.https.HttpsError("internal", `Error importing Steam games: ${error.message}`);
  }
});

exports.processCSVUpload = functions.runWith({ enforceAppCheck: false, timeoutSeconds: 540 }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { csvData, listType } = data;
  const userId = context.auth.uid;

  if (!csvData || !Array.isArray(csvData) || !listType) {
    throw new functions.https.HttpsError("invalid-argument", "CSV data and list type are required.");
  }

  const rawgPromises = [];
  const gamesToProcess = [];

  for (const row of csvData) {
    let gameData = {
      name: row.name || "",
      platform: row.platform || "",
      genre: row.genre || "",
      estimatedPlaytime: row.estimatedPlaytime || "",
      releaseDate: row.releaseDate || "",
      imageUrl: row.imageUrl || "",
      userId: userId,
      list: listType,
    };

    if (gameData.name) {
      gamesToProcess.push(gameData);
      rawgPromises.push(
        fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameData.name)}&key=${RAWG_API_KEY}`)
          .then(res => res.json())
          .then(rawgSearchData => {
            if (rawgSearchData.results && rawgSearchData.results.length > 0) {
              const topResult = rawgSearchData.results[0];
              return fetch(`https://api.rawg.io/api/games/${topResult.id}?key=${RAWG_API_KEY}`);
            } else {
              return null;
            }
          })
          .then(res => (res ? res.json() : null))
          .catch(rawgError => {
            console.error("Error fetching game data from RAWG for", gameData.name, rawgError);
            return null;
          })
      );
    }
  }

  if (gamesToProcess.length === 0) {
    return { message: "No valid games found in the CSV to upload.", gamesImported: 0 };
  }

  const rawgResults = await Promise.allSettled(rawgPromises);
  const batch = db.batch();
  let gamesCount = 0;

  for (let i = 0; i < gamesToProcess.length; i++) {
    let gameData = gamesToProcess[i];
    const rawgResult = rawgResults[i];

    if (rawgResult.status === 'fulfilled' && rawgResult.value) {
      const gameDetails = rawgResult.value;
      gameData = {
        ...gameData,
        platform: gameDetails.platforms?.map(p => p.platform.name).join(', ') || gameData.platform,
        genre: gameDetails.genres?.map(g => g.name).join(', ') || gameData.genre,
        estimatedPlaytime: (gameDetails.playtime ? `${gameDetails.playtime} hours` : 'N/A') || gameData.estimatedPlaytime,
        releaseDate: gameDetails.released || gameData.releaseDate,
        imageUrl: gameDetails.background_image || gameData.imageUrl,
      };
    }
    const newDocRef = db.collection(listType).doc();
    batch.set(newDocRef, gameData);
    gamesCount++;
  }

  try {
    await batch.commit();
    return { message: `${gamesCount} games imported successfully into ${listType} from CSV!`, gamesImported: gamesCount };
  } catch (error) {
    console.error("Error batch adding documents: ", error);
    throw new functions.https.HttpsError("internal", `Error importing games: ${error.message}`);
  }
});

exports.resolveSteamId = functions.runWith({ enforceAppCheck: false }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { steamInput } = data;
  const userId = context.auth.uid;

  if (!steamInput) {
    throw new functions.https.HttpsError("invalid-argument", "Steam input is required.");
  }

  let steam64Id = steamInput;

  // Check if the input is already a 64-bit Steam ID (purely numeric, 17 digits)
  if (!/^7656119[0-9]{10}$/.test(steamInput)) {
    // Assume it's a vanity URL or full profile URL
    const vanityUrlMatch = steamInput.match(/(?:https?:\/\/steamcommunity\.com\/(?:id|profiles)\/)?([a-zA-Z0-9_]+)/i);
    const vanityUrl = vanityUrlMatch ? vanityUrlMatch[1] : steamInput;

    if (vanityUrl === 'https' || vanityUrl === 'http') {
      throw new functions.https.HttpsError("invalid-argument", 'Invalid Steam URL or ID provided.');
    }

    try {
      const response = await fetch(`http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${STEAM_API_KEY}&vanityurl=${vanityUrl}`);
      const data = await response.json();

      if (data.response.success === 1) {
        steam64Id = data.response.steamid;
      } else {
        throw new functions.https.HttpsError("not-found", data.response.message || 'Could not resolve Steam ID from the provided input.');
      }
    } catch (err) {
      console.error("Error resolving Steam ID:", err);
      throw new functions.https.HttpsError("internal", `Failed to resolve Steam ID: ${err.message}`);
    }
  }

  // Update user document in Firestore
  const userRef = db.collection("users").doc(userId);
  await userRef.update({
    steamId: steam64Id,
    hasSteamLinked: true,
  });

  return { steamId: steam64Id, message: 'Steam account linked successfully!' };
});

exports.saveGame = functions.runWith({ enforceAppCheck: false }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { gameData } = data;
  const userId = context.auth.uid;

  if (!gameData || !gameData.list) {
    throw new functions.https.HttpsError("invalid-argument", "Game data and list type are required.");
  }

  try {
    const fullGameData = { ...gameData, userId: userId };

    if (fullGameData.id) {
      const gameRef = db.collection(fullGameData.list).doc(fullGameData.id);
      await gameRef.update(fullGameData);
      return { message: 'Game updated successfully!' };
    } else {
      await db.collection(fullGameData.list).add(fullGameData);
      return { message: 'Game added successfully!' };
    }
  } catch (error) {
    console.error("Error saving game: ", error);
    throw new functions.https.HttpsError("internal", `Error saving game: ${error.message}`);
  }
});

exports.fetchGameDetails = functions.runWith({ enforceAppCheck: false }).https.onCall(async (data, context) => {
  // No authentication required for public game data fetching

  const { gameName } = data;

  if (!gameName) {
    throw new functions.https.HttpsError("invalid-argument", "Game name is required.");
  }

  try {
    const rawgSearchResponse = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(gameName)}&key=${RAWG_API_KEY}`);
    const rawgSearchData = await rawgSearchResponse.json();

    if (rawgSearchData.results && rawgSearchData.results.length > 0) {
      const topResult = rawgSearchData.results[0];
      const gameDetailsResponse = await fetch(`https://api.rawg.io/api/games/${topResult.id}?key=${RAWG_API_KEY}`);
      const gameDetails = await gameDetailsResponse.json();

      const fetchedGame = {
        name: gameDetails.name,
        imageUrl: gameDetails.background_image,
        platform: gameDetails.platforms?.map(p => p.platform.name).join(', '),
        genre: gameDetails.genres?.map(g => g.name).join(', '),
        estimatedPlaytime: gameDetails.playtime ? `${gameDetails.playtime} hours` : 'N/A',
        releaseDate: gameDetails.released,
      };
      return { success: true, gameDetails: fetchedGame };
    } else {
      return { success: false, message: "No game details found for the provided name." };
    }
  } catch (error) {
    console.error("Error fetching game details from RAWG: ", error);
    throw new functions.https.HttpsError("internal", `Failed to fetch game details: ${error.message}`);
  }
});

exports.moveGame = functions.runWith({ enforceAppCheck: false }).https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "User must be authenticated.");
  }

  const { gameId, sourceList, destinationList, playedAt } = data;
  const userId = context.auth.uid;

  if (!gameId || !sourceList || !destinationList) {
    throw new functions.https.HttpsError("invalid-argument", "Game ID, source list, and destination list are required.");
  }

  // Validate list types to prevent arbitrary writes
  const allowedLists = ['wishlist', 'backlog', 'recentlyPicked'];
  if (!allowedLists.includes(sourceList) || !allowedLists.includes(destinationList)) {
    throw new functions.https.HttpsError("invalid-argument", "Invalid source or destination list.");
  }

  const transaction = db.runTransaction(async (t) => {
    const sourceRef = db.collection(sourceList).doc(gameId);
    const sourceDoc = await t.get(sourceRef);

    if (!sourceDoc.exists) {
      throw new functions.https.HttpsError("not-found", "Game not found in the source list.");
    }

    if (sourceDoc.data().userId !== userId) {
      throw new functions.https.HttpsError("permission-denied", "You do not have permission to move this game.");
    }

    const gameToMove = { ...sourceDoc.data() };
    delete gameToMove.id; // Remove the old ID for the new document
    gameToMove.list = destinationList; // Update the list property

    if (destinationList === 'recentlyPicked') {
      gameToMove.playedAt = playedAt || admin.firestore.FieldValue.serverTimestamp();
    }

    const newDocRef = db.collection(destinationList).doc(); // Auto-generate new ID

    t.set(newDocRef, gameToMove);
    t.delete(sourceRef);

    return { message: `Game moved from ${sourceList} to ${destinationList} successfully!` };
  });

  try {
    const result = await transaction;
    return result;
  } catch (error) {
    console.error("Error moving game: ", error);
    throw new functions.https.HttpsError("internal", `Failed to move game: ${error.message}`);
  }
});
