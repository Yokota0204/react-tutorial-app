import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// class Square extends React.Component {
//   render() {
//     return (
//       <button
//         className="square"
//         onClick={ () => this.props.onClick() }
//       >
//         { this.props.value }
//       </button>
//     );
//   }
// }

let highlights = [];

function Square( props ) {
  return (
    <button className={ `square ${ props.isHighlight ? "is-highlight" : "" }` } onClick={ props.onClick } >
      { props.value }
    </button>
  );
}

class Row extends React.Component {
  renderSquare( i ) {
    return (
      <Square
        value={ this.props.squares[ i ] }
        onClick={ () => this.props.onClick( i ) }
        key={ i + "-square" }
        isHighlight={ highlights.indexOf( i ) > -1 }
      />
    );
  }

  render() {
    const cols = Array( 3 ).fill( null );
    let squares = cols.map( ( col, i_cols ) => {
      const index = ( this.props.rowIndex * cols.length ) + Number( i_cols );;
      return this.renderSquare( index );
    } );
    return (
      <div className='board-row'>
        { squares }
      </div>
    );
  }
}

class Board extends React.Component {
  render() {
    const rows = Array( 3 ).fill( null );
    let board = rows.map( ( row, i_rows ) => {
      return (
        <Row
          key={ i_rows + "-board" }
          squares={ this.props.squares }
          rowIndex={ i_rows }
          onClick={ ( i ) => this.props.onClick( i ) }
        />
      )
    } );
    return (
      <div>
        { board }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      history: [
        { squares: Array( 9 ).fill( null ), },
      ],
      xIsNext: true,
      stepNumber: 0,
      movesIsAsc: true,
    };
  }

  handleClick( i ) {
    const history = this.state.history.slice( 0, this.state.stepNumber + 1 );
    const current = history[ history.length - 1 ];
    const squares = current.squares.slice();
    if ( calculateWinner( squares ) || squares[ i ] ) {
      return;
    }
    squares[ i ] = this.state.xIsNext ? "X" : "O";
    this.setState( {
      history: history.concat([{
        squares: squares,
      }]),
      squares: squares,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    } );
  }

  jumpTo( step ) {
    this.setState( {
      stepNumber: step,
      xIsNext: ( step % 2 ) === 0,
    } );
  }

  toggleOrder() {
    this.setState( {
      movesIsAsc: !this.state.movesIsAsc,
    } );
  }

  isFilled( squares ) {
    for ( let i_squares = 0; i_squares < squares.length; i_squares++ ) {
      const square = squares[ i_squares ];
      if ( !square ) {
        return false;
      }
    }
    return true;
  }

  render() {
    const history = this.state.history;
    const current = history[ this.state.stepNumber ];
    const winner = calculateWinner( current.squares );
    const moves = history.map( ( step, move ) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={ move } className={ this.state.stepNumber === move ? "is-active" : "" }>
          <button onClick={ () => this.jumpTo( move ) }>{ desc }</button>
        </li>
      );
    } );
    let status;
    if ( winner ) {
      status = "Winner: " + winner;
    } else if ( this.isFilled( current.squares ) ) {
      status = "This game is draw.";
    } else {
      status = 'Next player: ' + ( this.state.xIsNext ? "X" : "O" );
    }
    const toggle = <button type='button' onClick={ () => this.toggleOrder() }>Toggle order</button>
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={ current.squares }
            onClick={ ( i ) => this.handleClick( i ) }
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <div>{ toggle }</div>
          <ol reversed={ !this.state.movesIsAsc }>{ this.state.movesIsAsc ? moves : moves.reverse() }</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      highlights = lines[ i ];
      return squares[a];
    }
  }
  return null;
}