import React, {useState, useEffect} from 'react';


const GET_DECK_URL =
  `https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1`
const GET_CARD_BASE_URL =
`https://deckofcardsapi.com/api/deck/`
/**
 * CardDeck requests a deck from API and renders a button. Contains logic to
 * render a card when button is clicked.
 *
 * Props:
 * -None
 *
 * State:
 * -cardDeck -> {cardDeckId, cardsRemaining, isLoading}
 * -cards -> {cards, isLoading}
 *
 * App -> CardDeck
 */

function CardDeck () {
  const [cardDeck, setCardDeck] = useState({data: null, isLoading: true});
  const [cards, setCards] = useState([]);
  console.log("CardDeck", cardDeck, cards)
  /** useEffect takes a callback that is a wrapped function of an ajax request
   * that will get the card deck info after the FIRST render and ONLY after the
   * first render.
   */
  useEffect(function fetchCardDeck() {
    async function getCardDeck() {
      console.log("getCardDeck", cardDeck)
      const response = await fetch(GET_DECK_URL);
      const cardDeckData = await response.json();
      setCardDeck(currDeck => {
        return {data: cardDeckData, isLoading: false}
      });
    }
    getCardDeck();
  }, [])

 /** fetchCard makes an ajax request to pull a card image and updates the
  * cardDeck and cards state.
  */
  async function fetchCard() {
    console.log("fetchCard", cardDeck);
    const response = await fetch(
      `${GET_CARD_BASE_URL}${cardDeck.data.deck_id}/draw/?count=1`
    );
    const cardData = await response.json();
    setCards(currCards => currCards.map(cardData.cards[0].image));
    setCardDeck(currCardDeck => currCardDeck.data.remaining = cardData.remaining);
  }

  if(cardDeck.isLoading) return <div>Loading...</div>;

  if(cardDeck.data?.remaining === 0) return <div>Error: no cards remaining!</div>

  return (
    <div>
      <button onClick={fetchCard}>Gimme A Card</button>
      {cards.map(image => (<img src={image}></img>))}
    </div>
  )
}

export default CardDeck;