const fs = require("fs");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

try {
  const serviceAccount = JSON.parse(process.env.TRACKSTORE_SERVICE_ACCOUNT_KEY);
  initializeApp({ credential: cert(serviceAccount) });

  const db = getFirestore();

  (async () => {
    try {
      const tracksRef = db.collection("tracks").orderBy("d", "desc").limit(25);
      const snapshot = await tracksRef.get();
      const tracks = snapshot.docs.map((doc) => ({ ...doc.data() }));

      const formattedTracks = tracks.map(({ i, n, c, f, t, p }) => ({
        i,
        n,
        c,
        f,
        t,
        p,
      }));

      if (!fs.existsSync("dist")) {
        fs.mkdirSync("dist");
      }
      fs.writeFileSync("dist/latest", JSON.stringify(formattedTracks));
    } catch (err) {
      console.error("Error retrieving or writing tracks:", err);
    }
  })();
} catch (err) {
  console.error("Error initializing Firestore:", err);
}
