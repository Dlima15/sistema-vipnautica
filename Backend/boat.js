import express from 'express';
import { db } from './firebaseConfig.js';
import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const router = express.Router();
const boatsCollection = collection(db, 'Embarcacoes');

// Criar uma nova embarcação
router.post('/boats', async (req, res) => {
    try {
        const newBoat = req.body;
        const docRef = await addDoc(boatsCollection, newBoat);
        res.status(201).json({ id: docRef.id, ...newBoat });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar embarcação', details: error.message });
    }
});

// Listar todas as embarcações
router.get('/boats', async (req, res) => {
    try {
        const snapshot = await getDocs(boatsCollection);
        const boats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json(boats);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao listar embarcações', details: error.message });
    }
});

// Obter uma embarcação específica
router.get('/boats/:id', async (req, res) => {
    try {
        const boatRef = doc(db, 'Embarcacoes', req.params.id);
        const boatSnap = await getDoc(boatRef);
        if (!boatSnap.exists()) {
            return res.status(404).json({ error: 'Embarcação não encontrada' });
        }
        res.status(200).json({ id: boatSnap.id, ...boatSnap.data() });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar embarcação', details: error.message });
    }
});

// Atualizar uma embarcação
router.put('/boats/:id', async (req, res) => {
    try {
        const boatRef = doc(db, 'Embarcacoes', req.params.id);
        await updateDoc(boatRef, req.body);
        res.status(200).json({ message: 'Embarcação atualizada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar embarcação', details: error.message });
    }
});

// Deletar uma embarcação
router.delete('/boats/:id', async (req, res) => {
    try {
        const boatRef = doc(db, 'Embarcacoes', req.params.id);
        await deleteDoc(boatRef);
        res.status(200).json({ message: 'Embarcação deletada com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar embarcação', details: error.message });
    }
});

export default router;
