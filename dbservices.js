const fs = require("firebase-admin");

const serviceAccount = require("./urlassistant-firebase-adminsdk-xn4fj-8fe17d69d5.json");

fs.initializeApp({
  credential: fs.credential.cert(serviceAccount),
});
const db = fs.firestore();

async function savePageUrl(pageId) {
  let count = 0;
  const docRef = await db.collection("pages").doc(pageId).get();
  if (!docRef.exists) {
    db.collection("pages")
      .doc(pageId)
      .set({
        pageId: pageId,
        pageUrl: Buffer.from(pageId, "base64").toString("ascii"),
        saveDate: new Date(),
        saveCount: 1,
      });
    count = 1;
  } else {
    let fCount = docRef.data().saveCount + 1;

    docRef.ref.update({
      saveCount: fCount,
      saveDate: new Date(),
    });
    count = fCount;
  }

  //= await docRef.get().data().saveCount;
  return { status: "success", pid: pageId, saveCount: count };
}

async function getSavedPageCountById(pageId) {
  const docsRef = await db.collection("pages").doc(pageId).get();
  let count = !docsRef.exists ? 0 : docsRef.data().saveCount;
  return { saveCount: count };
}

async function getAllSavedPages() {
  const docsRef = await db.collection("pages").get();
  let arr = [];
  if (docsRef.empty) {
    console.log("No matching documents.");
    return;
  }

  docsRef.forEach((doc) => {
    let item = {
      pageId: doc.data().pageId,
      pageUrl: doc.data().pageUrl,
      saveDate: doc.data().saveDate.toDate(),
      domain: new URL(doc.data().pageUrl).hostname,
      saveCount: doc.data().saveCount,
    };
    arr.push(item);
  });
  return arr;
}
module.exports.savePageUrl = savePageUrl;
module.exports.getSavedPageCountById = getSavedPageCountById;
module.exports.getAllSavedPages = getAllSavedPages;
