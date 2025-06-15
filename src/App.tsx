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
    const [lettersUsed, setLettersUsed] = useState<LetterUsedProps[]>([])
    const [atempts, setAttempts] = useState(0)
    const [letters, setLetters] = useState("")
    const [challenge, setChallenge] = useState<Challenge | null>(null)
    function handleRestartGame(){
        alert("Recomeçar o jogo")
    }

    function startGame(){
        const index = Math.floor(Math.random() * WORDS.length)
        const randomWord = WORDS[index]
        setChallenge(randomWord)

        setAttempts(0)
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
                <Header current={atempts} max={10} onRestart={handleRestartGame}/>
                <Tip tip="Biblioteca para criar interfaces Web com Javascript."/>
                <div className={styles.word}>
                    {challenge.word.split("").map(()=> (
                        <Letter value=""/>
                    ))}
                </div>
                <h4>Palpite</h4>
                <div className={styles.guess}>
                    <Input autoFocus maxLength={1} placeholder="?"/>
                    <Button title="Confirmar"/>
                </div>

                <LetterUsed data={lettersUsed}/>
            </main>  
        </div>
    )
}