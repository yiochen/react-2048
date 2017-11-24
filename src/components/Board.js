import React, { PureComponent } from 'react';
import range from 'lodash/range';
import random from 'lodash/random';
import some from 'lodash/some';
import chunk from 'lodash/chunk';
import flatten from 'lodash/flatten';
import zip from 'lodash/zip';
import isEqual from 'lodash/isEqual';
import Tile from './Tile';

let globalScore = 0;

function isFull(board) {
  return !some(board, value => value === 0);
}

function newSeed(board, ammount = 1) {
  let remaining = ammount;
  while (remaining > 0) {
    if (isFull(board)) {
      throw new Error('board is full, cannot add new seed');
    }
    let pos = random(16);
    let current = 0;
    while (true) {
      if (board[current] === 0) {
        pos--;
      }
      if (pos >= 0) {
        current = (current + 1) % 16;
      } else {
        break;
      }
    }
    board[current] = Math.random() > 0.5 ? 2 : 4;
    remaining--;
  }
  return board;
}

function generateBoard() {
  return newSeed(range(0, 16, 0), 2);
}

function shiftHead(row) {
  let startPair = false;
  let lastValue = 0;
  const result = [];
  row.forEach(value => {
    if (value > 0) {
      if (startPair && lastValue === value) {
        result.push(value * 2);
        globalScore += value * 2;
        startPair = false;
        return;
      }
      if (startPair && lastValue !== value) {
        result.push(lastValue);
        lastValue = value;
        return;
      }
      if (!startPair) {
        lastValue = value;
        startPair = true;
        return;
      }
    }
  });

  if (startPair) {
    result.push(lastValue);
  }

  result.push(0, 0, 0, 0);

  return result.slice(0, 4);
}

function shiftTail(row) {
  return shiftHead(row.slice().reverse()).reverse();
}

function moveLeft(board) {
  return flatten(chunk(board, 4).map(shiftHead));
}

function moveRight(board) {
  return flatten(chunk(board, 4).map(shiftTail));
}
function moveUp(board) {
  let newBoard = board.reduce(
    (cols, value, index) => {
      cols[index % 4].push(value);
      return cols;
    },
    [[], [], [], []]
  );
  newBoard = newBoard.map(shiftHead);
  newBoard = flatten(zip(...newBoard));
  return newBoard;
}
function moveDown(board) {
  let newBoard = board
    .reduce(
      (cols, value, index) => {
        cols[index % 4].push(value);
        return cols;
      },
      [[], [], [], []]
    )
    .map(shiftTail);
  newBoard = flatten(zip(...newBoard));
  return newBoard;
}

function isDead(board) {
  return (
    isEqual(board, moveUp(board)) &&
    isEqual(board, moveDown(board)) &&
    isEqual(board, moveLeft(board)) &&
    isEqual(board, moveRight(board))
  );
}
export default class Board extends PureComponent {
  state = {
    board: generateBoard(),
  };

  handleKeydown = e => {
    let newBoard;
    switch (e.key) {
      case 'ArrowLeft':
        newBoard = moveLeft(this.state.board);
        break;
      case 'ArrowRight':
        newBoard = moveRight(this.state.board);
        break;
      case 'ArrowUp':
        newBoard = moveUp(this.state.board);
        break;
      case 'ArrowDown':
        newBoard = moveDown(this.state.board);
        break;
      default:
        return;
    }
    this.props.onScore(globalScore);
    if (!isEqual(newBoard, this.state.board)) {
      this.setState({ board: newSeed(newBoard) });
    } else if (isFull(newBoard) && isDead(newBoard)) {
      this.props.onDie();
    }
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.game !== this.props.game) {
      this.setState({ board: generateBoard() });
      globalScore = 0;
    }
  }
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  componentWillUnmount() {
    document.addEventListener('keydown', this.handleKeydown);
  }

  render() {
    return (
      <div className="board">
        {this.state.board.map((value, key) => <Tile value={value} key={key} />)}
      </div>
    );
  }
}
