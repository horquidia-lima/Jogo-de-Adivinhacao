import styles from "./app.module.css"
import { Button } from "./components/Button"
import { Header } from "./components/Header"
import { Input } from "./components/Input"
import { Letter } from "./components/Letter"
import { LetterUsed } from "./components/LettersUsed"
import type { LetterUsedProps } from "./components/LettersUsed"
import { Tip } from "./components/Tip"

import {WORDS} from "./utils/words"
import type { Challenge } from "./utils/words"
import { useState, useEffect } from "react"

export default function App() {
    const [score, setScore] = useState(0)
    const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([])
    const [letters, setLetters] = useState("")
    const [challenge, setChallenge] = useState<Challenge | null>(null)
    function handleRestartGame(){
        alert("Recomeçar o jogo")
    }

    function startGame(){
        const index = Math.floor(Math.random() * WORDS.length)
        const randomWord = WORDS[index]
        setChallenge(randomWord)

        setScore(0)
        setLetters("")
        setLettersUsed([])
    }

    function handleConfirm(){
        if(!challenge){
            return
        }

        if(!letters.trim()){
            alert("Informe uma letra")
        }
        
        const value = letters.toLowerCase()
        const exists = lettersUsed.find((used) => used.value.toUpperCase() === value)

        if(exists){
            return alert("Voce já utilizou a letra: " + value)
        }

        const hits = challenge.word
            .toLowerCase()
            .split("")
            .filter((char) => char === value).length

        const correct = hits > 0
        const currentScore = score + hits

        setLettersUsed((prevState) => [...prevState, {value, correct}])
        setScore(currentScore)
        setLetters("")
    }

    useEffect(() => {
        startGame()
    }, [])

    if(!challenge){
        return
    }

    return (
        <div className={styles.container}>
            <main>
                <Header current={score} max={10} onRestart={handleRestartGame}/>
                <Tip tip={challenge.tip}/>
                <div className={styles.word}>
                    {challenge.word.split("").map((index)=> {
                        const letterUsed = lettersUsed.find((used) => used.value.toUpperCase() === letters.toUpperCase())
                       return <Letter key={index} value={letterUsed?.value} color={letterUsed?.correct ? "correct" : "default"}/>
                    })}
                </div>
                <h4>Palpite</h4>
                <div className={styles.guess}>
                    <Input autoFocus maxLength={1} placeholder="?" onChange={e => setLetters(e.target.value)} value={letters}/>
                    <Button title="Confirmar" onClick={handleConfirm}/>
                </div>

                <LetterUsed data={lettersUsed}/>
            </main>  
        </div>
    )
}