import { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
  {"src" : "img/Iron_3_Rank.png", matched: false},
  {"src" : "img/Bronze_3_Rank.png", matched: false},
  {"src" : "img/Silver_3_Rank.png", matched: false},
  {"src" : "img/Gold_3_Rank.png", matched: false},
  {"src" : "img/Platinum_3_Rank.png", matched: false},
  {"src" : "img/Diamond_3_Rank.png", matched: false},
  {"src" : "img/Ascendant_3_Rank.png", matched: false},
  {"src" : "img/Immortal_3_Rank.png", matched: false}
]

function App() {
  const [cards, setCards] = useState([])
  const [turns, setTurns] = useState(0)
  const [choiceOne, setChoiceOne] = useState(null)
  const [choiceTwo, setChoiceTwo] = useState(null)
  const [disabled, setDisabled] = useState(false)
  const [gameOver, setGameOver] = useState(false)

  const playSound = (src) => {
    const audio = new Audio(src)
    audio.play();
  };

  const shuffleCards = () => {
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({...card, id: Math.random()}))
    
    setChoiceOne(null)
    setChoiceTwo(null)
    setCards(shuffledCards)
    setTurns(0)
    setGameOver(false)
  }

  const handleChoice = (card) => {
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
  }

  useEffect(() => {
    if(choiceOne && choiceTwo){
      setDisabled(true)
      if(choiceOne.src === choiceTwo.src){
        setCards(prevCards => {
          return prevCards.map(card => {
            if(card.src === choiceOne.src){
              playSound('/sound/success_bell-6776.mp3')
              return {...card, matched: true}
            } else {
              return card
            }
          })
        })
        resetTurn()
      } else{
        setTimeout(() => resetTurn(), 1000)
      }
    }
  }, [choiceOne, choiceTwo])

  const resetTurn = () => {
    setChoiceOne(null)
    setChoiceTwo(null)
    setTurns(prevTurns => prevTurns + 1)
    setDisabled(false)
  }

  useEffect(() => {
    if(cards.every(card => card.matched)){
      setGameOver(true)
      playSound('/sound/tada-military-2-183973.mp3')
    }
  }, [cards])

  useEffect(() => {
    shuffleCards()
  }, [])

  return (
    <div className="App">
      <h1>Card Memory</h1>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map(card => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <h3>Turns: {turns}</h3>
      {gameOver && <h2>Congratulations! Finished in {turns} turns!</h2>}
    </div>
  );
}

export default App;