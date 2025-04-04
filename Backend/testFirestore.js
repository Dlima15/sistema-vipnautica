import { db } from "./firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

async function testFirestore() {
  try {
    // Criar um documento de teste
    const docRef = await addDoc(collection(db, "teste"), {
      nome: "VIP Náutica",
      data: new Date()
    });

    console.log("Documento escrito com ID: ", docRef.id);

    // Buscar todos os documentos da coleção "teste"
    const querySnapshot = await getDocs(collection(db, "teste"));
    querySnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
    });

  } catch (error) {
    console.error("Erro ao testar Firestore:", error);
  }
}

testFirestore();
