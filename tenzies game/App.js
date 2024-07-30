import React, { useState, useEffect } from "react";
import Die from "./Die";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";

export default function App() {
    const [dice, setDice] = useState(allNewDice());
    const [tenzies, setTenzies] = useState(false);
    const [rolls, setRolls] = useState(0); // Track the number of rolls
    const [startTime, setStartTime] = useState(null); // Track the start time
    const [elapsedTime, setElapsedTime] = useState(null); // Track the elapsed time
    const [bestTime, setBestTime] = useState(() => {
        return localStorage.getItem("bestTime") || null; // Retrieve the best time from local storage
    });

    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld);
        const firstValue = dice[0].value;
        const allSameValue = dice.every(die => die.value === firstValue);
        if (allHeld && allSameValue) {
            setTenzies(true);
            const endTime = Date.now();
            const timeTaken = ((endTime - startTime) / 1000).toFixed(2);
            setElapsedTime(timeTaken);

            if (!bestTime || timeTaken < bestTime) {
                setBestTime(timeTaken);
                localStorage.setItem("bestTime", timeTaken);
            }
        }
    }, [dice]);

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        };
    }

    function allNewDice() {
        const newDice = [];
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie());
        }
        return newDice;
    }

    function rollDice() {
        if (!tenzies) {
            setRolls(prevRolls => prevRolls + 1); // Increment rolls count
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? die : generateNewDie();
            }));
            if (rolls === 0) {
                setStartTime(Date.now()); // Start timer on first roll
            }
        } else {
            setTenzies(false);
            setDice(allNewDice());
            setRolls(0); // Reset rolls count
            setElapsedTime(null); // Reset elapsed time
            setStartTime(null); // Reset start time
        }
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? { ...die, isHeld: !die.isHeld } : die;
        }));
    }

    const diceElements = dice.map(die => (
        <Die
            key={die.id}
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ));

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same.
                Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button
                className="roll-dice"
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="stats">
                <p>Rolls: {rolls}</p>
                {elapsedTime && <p>Time: {elapsedTime}s</p>}
                {bestTime && <p>Best Time: {bestTime}s</p>}
            </div>
        </main>
    );
}
