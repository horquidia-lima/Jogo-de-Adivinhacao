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
    const [shake, setShake] = useState(false)                                  
    function handleRestartGame(){
        const isConfirmed = window.confirm("Deseja realmente reiniciar o jogo?")

        if(isConfirmed){
            startGame()

            setTimeout(() => {
                setShake(false)
            }, 300)
        }
    }

    function startGame(){
        console.log("🚀 Iniciando jogo...")

        const index = Math.floor(Math.random() * WORDS.length)
        const randomWord = WORDS[index]

        console.log("🎲 Palavra sorteada:", randomWord)
    
        setChallenge(randomWord)

         console.log("✅ Challenge definido!", challenge)

        setScore(0)
        setLetter("")
        setLettersUsed([])
    }

    function handleConfirm(){
        if(!challenge){
            return
        }

        if(!letter.trim()){
            return alert("Informe uma letra")
        }
        
        const value = letter.toUpperCase()
        const exists = lettersUsed.find(
            (used) => used.value.toUpperCase() === value
        )

        if(exists){
            setLetter("")
            return alert("Voce já utilizou a letra: " + value)
        }

        
        const hits = challenge.word
            .toUpperCase()
            .split("")
            .filter((char) => char === value).length
        
        const correct = hits > 0
        const currentScore = score + hits

        setLettersUsed((prevState) => [...prevState, {value, correct}])
        setScore(currentScore)
        setLetter("")

        if(!correct){
            setShake(true)
        }
    }

    function endGame(message: string){
        alert(message)
        startGame()
    }

    useEffect(() => {
        startGame()
    }, [])

    useEffect(() => {
       if(!challenge){
        return
       }

       setTimeout(() => {
           if(score === challenge.word.length){
               return endGame("Parabéns, você descobriu a palavra!")
           }

           const attemptLimit = challenge.word.length + ATTEMPTS_MARGIN
           if(lettersUsed.length === attemptLimit){
               return endGame("Que pena, voce usou todas as tentativas!")
           }
       }, 200)
    }, [score, lettersUsed.length])

    if(!challenge){
        return
    }

    return (
        <div className={styles.container}>
            <main>
                <Header current={lettersUsed.length} max={challenge.word.length + ATTEMPTS_MARGIN} onRestart={handleRestartGame}/>
                <Tip tip={challenge.tip}/>

                <div className={`${styles.word} ${ shake && styles.shake}`}>
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