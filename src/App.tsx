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
    const ATTEMPTS_MARGIN = 5

    const [score, setScore] = useState(0)
    const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([])
    const [letter, setLetter] = useState("")
    const [challenge, setChallenge] = useState<Challenge | null>(null)
    function handleRestartGame(){
        alert("Recomeçar o jogo")
    }

    function startGame(){
        const index = Math.floor(Math.random() * WORDS.length)
        const randomWord = WORDS[index]
        setChallenge(randomWord)

        setScore(0)
        setLetter("")
        setLettersUsed([])
    }

    function handleConfirm(){
        if(!challenge){
            return
        }

        if(!letter.trim()){
            alert("Informe uma letra")
        }
        
        const value = letter.toLowerCase()
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
        setLetter("")
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
                <Header current={lettersUsed.length} max={challenge.word.length + ATTEMPTS_MARGIN} onRestart={handleRestartGame}/>
                <Tip tip={challenge.tip}/>

                <div className={styles.word}>
                    {challenge.word.split("").map((letter,index)=> {
                        const letterUsed = lettersUsed.find(
                            (used) => used.value.toUpperCase() === letter.toUpperCase()
                        )
                        return <Letter key={index} value={letterUsed?.value} color={letterUsed?.correct ? "correct" : "default"}/>
                    })}
                </div>
                <h4>Palpite</h4>
                <div className={styles.guess}>
                    <Input autoFocus maxLength={1} placeholder="?" onChange={e => setLetter(e.target.value)} value={letter}/>
                    <Button title="Confirmar" onClick={handleConfirm}/>
                </div>

                <LetterUsed data={lettersUsed}/>
            </main>  
        </div>
    )
}