import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import {isSandwiching, canDiskBePlaced, isSquareToPlace, isGameOver, visualize, Square} from './App';
import App from './App';

const BLACK_DISK = '●';
const WHITE_DISK = '○';
const GUIDE_ICON = '×';

type Black = 'B';
const BLACK: Black = 'B';
type White = 'W';
const WHITE: White = 'W';
type Diskcolor = Black | White;
type SquareState = Diskcolor | '#' | null;

test('isSandwiching', () => {
  const squares: SquareState[] = [
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, BLACK,  null,  null,  null,  '#',
    '#',  null,  null,  null, BLACK, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
  ];
  expect(isSandwiching(squares, BLACK, 34, 10)).toBe(true);
  expect(isSandwiching(squares, WHITE, 53, 11)).toBe(false);
});

test('canDiskBePlaced', () => {
  const squares: SquareState[] = [
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, BLACK,  null,  null,  null,  '#',
    '#',  null,  null,  null, BLACK, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
  ];
  expect(canDiskBePlaced(squares, BLACK, 0)).toBe(false);
  expect(canDiskBePlaced(squares, WHITE, 0)).toBe(false);
  expect(canDiskBePlaced(squares, BLACK, 11)).toBe(false);
  expect(canDiskBePlaced(squares, WHITE, 11)).toBe(false);
  expect(canDiskBePlaced(squares, BLACK, 33)).toBe(false);
  expect(canDiskBePlaced(squares, BLACK, 34)).toBe(true);
  expect(canDiskBePlaced(squares, BLACK, 43)).toBe(true);
  expect(canDiskBePlaced(squares, WHITE, 35)).toBe(true);
  expect(canDiskBePlaced(squares, WHITE, 46)).toBe(true);
  expect(canDiskBePlaced(squares, WHITE, 56)).toBe(false);
});

test('isSquareToPlace, isGameOver', () => {
  const squares1: SquareState[] = [
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, BLACK,  null,  null,  null,  '#',
    '#',  null,  null,  null, BLACK, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
  ];
  expect(isSquareToPlace(squares1, BLACK)).toBe(true);
  expect(isSquareToPlace(squares1, WHITE)).toBe(true);
  expect(isGameOver(squares1)).toBe(false);

  const squares2: SquareState[] = [
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
  ];
  expect(isSquareToPlace(squares2, BLACK)).toBe(false);
  expect(isSquareToPlace(squares2, WHITE)).toBe(false);
  expect(isGameOver(squares2)).toBe(true);

  const squares3: SquareState[] = [
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null, WHITE, WHITE,  null,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null, WHITE,  null,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null, WHITE,  null,  '#',
    '#',  null,  null,  null,  null,  null,  null,  null, BLACK,  '#',
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',  '#',
  ];
  expect(isSquareToPlace(squares3, BLACK)).toBe(true);
  expect(isSquareToPlace(squares3, WHITE)).toBe(false);
  expect(isGameOver(squares3)).toBe(false);

  const squares4: SquareState[] = [
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#', '#',
    '#', BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, '#',
    '#', WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, '#',
    '#', BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, '#',
    '#', WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, '#',
    '#', BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, '#',
    '#', WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, '#',
    '#', BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, '#',
    '#', WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, WHITE, BLACK, '#',
    '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#',   '#', '#',
  ];
  expect(isSquareToPlace(squares4, BLACK)).toBe(false);
  expect(isSquareToPlace(squares4, WHITE)).toBe(false);
  expect(isGameOver(squares4)).toBe(true);
});

test('visualize', () => {
  expect(visualize(BLACK)).toBe(BLACK_DISK);
  expect(visualize(WHITE)).toBe(WHITE_DISK);
  expect(visualize(null)).toBe(null);
});

// test('App', () => {
//   console.log(App.current.squares);
//   expect(App.addDisabled(true)).toEqual({disabled: true});
//   // expect(visualize(WHITE)).toBe(WHITE_DISK);
//   // expect(visualize(null)).toBe(null);
// });

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("App", () => {
  act(() => {
    render(<App />, container);
  });
  const BD = BLACK_DISK;
  const WD = WHITE_DISK;

  const received1 = Array.prototype.map.call(document.getElementsByClassName("square"), square => square.innerHTML);
  const expected1 = [
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', WD, BD, '', '', '',
    '', '', '', BD, WD, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
  ];
  expect(received1).toEqual(expected1);

  act(() => {
    document.getElementById("34").dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const received2 = Array.prototype.map.call(document.getElementsByClassName("square"), square => square.innerHTML);
  const expected2 = [
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', BD, '', '', '', '',
    '', '', '', BD, BD, '', '', '',
    '', '', '', BD, WD, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
  ];
  expect(received2).toEqual(expected2);

  act(() => {
    document.getElementById("33").dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const received3 = Array.prototype.map.call(document.getElementsByClassName("square"), square => square.innerHTML);
  const expected3 = [
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', WD, BD, '', '', '', '',
    '', '', '', WD, BD, '', '', '',
    '', '', '', BD, WD, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
  ];
  expect(received3).toEqual(expected3);

  act(() => {
    document.getElementById("11").dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const received4 = Array.prototype.map.call(document.getElementsByClassName("square"), square => square.innerHTML);
  const expected4 = [
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', WD, BD, '', '', '', '',
    '', '', '', WD, BD, '', '', '',
    '', '', '', BD, WD, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
  ];
  expect(received4).toEqual(expected4);

  act(() => {
    document.getElementById("35").dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  const received5 = Array.prototype.map.call(document.getElementsByClassName("square"), square => square.innerHTML);
  const expected5 = [
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', WD, BD, '', '', '', '',
    '', '', '', WD, BD, '', '', '',
    '', '', '', BD, WD, '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
    '', '', '', '', '', '', '', '',
  ];
  expect(received5).toEqual(expected5);

  // expect(document.getElementById("44")).toEqual(document.getElementById("44"));
  // expect(<div className="hoge">This is child text.</div>).toEqual(React.createElement('div', {'className': 'hoge'}, 'This is child text.'));
  // expect(document.getElementById("44")).toEqual(
  //   <Square
  //     key={44}
  //     id={44}
  //     value={props.squares[44]}
  //     onClick={() => props.onClick(address)}
  //   />
  // );

  // act(() => {
  //   render(<Hello name="Jenny" />, container);
  // });
  // expect(container.textContent).toBe("Hello, Jenny!");

  // act(() => {
  //   render(<Hello name="Margaret" />, container);
  // });
  // expect(container.textContent).toBe("Hello, Margaret!");
});
