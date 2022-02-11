const { async } = require("@firebase/util");
const { Client, Intents } = require("discord.js");
const firebase = require("firebase/app");
const fbStore = require("firebase/firestore");

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const firebaseConfig = {
  firebaseConfig,
};

const app = firebase.initializeApp(firebaseConfig);
const db = fbStore.getFirestore(app);

client.on("messageCreate", async (msg) => {
  if (msg.content === "Botardo, dame mi kit por favor") {
    if (msg.author === client.user) return;
    try {
      const datos = await fbStore.getDocs(
        fbStore.collection(db, "codigosIcePokeFire")
      );

      let data = [];
      let ids = [];
      datos.forEach((doc) => {
        data.push(doc.data());
        ids.push(doc.id);
      });

      let codigoEntregado = false,
        yaTieneCodigo = false;

      for (let i = 0; i < data.length; i++) {
        if (data[i].Propietario == msg.author.username) {
          yaTieneCodigo = true;
          msg.author.send(
            "Ya tienes cofre, tu codigo es " +
              data[i].Codigo +
              " y  tu cofre es el numero " +
              data[i].Cofre
          );
          break;
        }
      }

      try {
        if (!yaTieneCodigo) {
          for (let i = 0; i < data.length; i++) {
            if (data[i].Estado === "Libre") {
              msg.author.send(
                "Este es el codigo para tu cofre de kit de inicio " +
                  data[i].Codigo +
                  " y  tu cofre es el numero " +
                  data[i].Cofre
              );

              let newDoc = {
                Cofre: data[i].Cofre,
                Estado: "Opupado",
                Propietario: msg.author.username,
                Codigo: data[i].Codigo,
              };

              await fbStore.updateDoc(
                fbStore.doc(db, "codigosIcePokeFire", ids[i]),
                newDoc
              );

              codigoEntregado = true;
              break;
            }
          }
        }
      } catch (error) {
        msg.author.send("Lo siento, no te puedo mandar mensaje :C");
      }

      if (!codigoEntregado && !yaTieneCodigo) {
        msg.reply({
          content: "Lo siento, ya no hay cofres de kit libres",
        });
      }
    } catch (error) {
      console.log(error);
    }

    /* msg.author.send("Hey"); */
  }
});

async function getCode() {
  return data;
}

client.login("token");
