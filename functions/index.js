const functions = require("firebase-functions");
const admin = require("firebase-admin");
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

// 📧 Postavi SendGrid API ključ
sgMail.setApiKey("YOUR_SENDGRID_API_KEY");

exports.posaljiMejlSendgrid = functions.firestore
  .document("rezervacije/{id}")
  .onCreate(async (snap, context) => {
    const data = snap.data();

    const msg = {
      to: data.email,
      from: {
        email: "tvojemail@domena.com", // najbolje da bude verifikovan na SendGridu, može i privremeno tvoj Gmail
        name: "Privatni časovi",
      },
      subject: "Potvrda o zakazanom času",
      text: `Zdravo ${data.ime},\n\nUspešno ste zakazali čas sa profesorom.\nDatum: ${data.datum}\nVreme: ${data.vreme}\n\nHvala što koristite našu aplikaciju!`,
    };

    try {
      await sgMail.send(msg);
      console.log("✅ Mejl poslat:", data.email);
    } catch (err) {
      console.error("❌ Greška:", err);
    }
  });
