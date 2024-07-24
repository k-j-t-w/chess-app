import React from "react"
import '../styles/Tile.css'

interface Props {
  image?: string;
  number: number;
}

const Tile = ({ number, image }: Props) => {
  if (number % 2 === 0) {
    return <div className='tile white-tile'>
      <img src={image} />
    </div>
  } else {
    return <div className='tile black-tile'>
      <img src={image} />
    </div>
  }

};

export default Tile;