import { useState, useEffect } from 'react';

// TODO: 各コンポーネントにおいて各属性を一旦propsで受け止めているが、分割代入で直接受け取ってもいいかもしれない
// TODO: テストを書く
// TODO: ドキュメントを書く
// TODO: TypeScriptで型付けする（any型を具体的な型に型付けする）
// TODO: CPUモードを作る
// TODO: ネットワーク対戦モードを作る
// TODO: 認証機能を付ける
// TODO: 勝敗の履歴や対戦の履歴（盤面の状態を含む）を管理するためにデータベースを利用する
// TODO: 不正に記録する行為を防ぐための施策を講じる
// TODO: 画像やアニメーションを使ってデザインする

// ディスク等の表示の変更はこれらの変数で行う
const BLACK_DISK = '●';
const WHITE_DISK = '○';
const GUIDE_ICON = '×';

// こちらはソースコードの可読性のための内部的な置き換えであり、画面表示には関係ないので変更すべきでない
type Black = 'B';
const BLACK: Black = 'B';
type White = 'W';
const WHITE: White = 'W';
type Diskcolor = Black | White;
type SquareState = Diskcolor | '#' | null;

// 下記`DIRECTIONS`（またはその要素取り出し時の`direction`）をTypeScriptで型付けする際に
// https://www.kabuku.co.jp/developers/good-bye-typescript-enum
// 上記ページの「union型のそれぞれの値に名前をつける」の項目を参照
// 順にUPPER_LEFT, UP, UPPER_RIGHT, LEFT, RIGHT, LOWER_LEFT, DOWN, LOWER_RIGHT
const DIRECTIONS = [-11, -10, -9, -1, 1, 9, 10, 11];

// `canDiskBePlaced`関数の判定の一条件として、もしその`address`にディスクを置いたら現在色のディスクで反対色のディスクを挟めるか否かを一方向分確認する
export function isSandwiching(squares: SquareState[], currentColor: Diskcolor, address: number, direction: number) {
  let addressToScan = address + direction;
  let resultString = "";
  while (squares[addressToScan] === BLACK || squares[addressToScan] === WHITE) {
    resultString += squares[addressToScan];
    addressToScan += direction;
  }
  const oppositeColor: Diskcolor = currentColor === BLACK ? WHITE : BLACK;
  // `address`マスから見て`direction`方向に1個以上の相手の色の連なりがあり、その向こう岸に自分の色があればtrueを返却する
  const currentColorBeyondOneOrMoreOppositeColors = new RegExp(`^(${oppositeColor})+(${currentColor})`);
  return currentColorBeyondOneOrMoreOppositeColors.test(resultString)
  // // 配置予定マスから見て1マス目が反対色でない場合は早期リターンし、反対色の場合は2マス目以降の処理に進む
  // switch (squares[addressToScan]) {
  //   case currentColor:
  //     return false;
  //   case '#':
  //     return false;
  //   case null:
  //     return false;
  //   default:
  //     addressToScan += direction;
  //     break;
  // }

  // // 配置予定マスから見て1枚以上の反対色を挟んだ現在色があればtrueを返却する
  // while (true) {
  //   switch (squares[addressToScan]) {
  //     case currentColor:
  //       return true;
  //     case '#':
  //       return false;
  //     case null:
  //       return false;
  //     default:
  //       addressToScan += direction;
  //       continue;
  //   }
  // }
}

// 指定されたマスに指定された色のディスクを置けるか判定する
export function canDiskBePlaced(squares: SquareState[], diskColor: Diskcolor, address: number) {
  // null以外のマスには置けない
  if (squares[address] !== null) {
    return false;
  }

  // `address`マスから放射状にisSandwiching関数でチェックし、一方向でもtrueならtrueを返却する
  return DIRECTIONS.some(direction => isSandwiching(squares, diskColor, address, direction));
}

// まだ指定された色のディスクを置けるマスがどこか1つでも存在するかを判定する
export function isSquareToPlace(squares: SquareState[], diskColor: Diskcolor) {
  return squares.some((_: any, address: number) => canDiskBePlaced(squares, diskColor, address));
}

// ゲーム終了を判定する
export function isGameOver(squares: SquareState[]) {
  // 両プレイヤーともにディスクを置けるマスが存在しないならtrueを返却する
  return (!isSquareToPlace(squares, BLACK) && !isSquareToPlace(squares, WHITE))
}

// ディスクの色を受け取ってその画面表示を処理する。nullが渡されることがあり、その際はそのnullをそのまま返却する
// TODO: 暫定的にDiskcolor | nullとしているが、番兵が不要になったらSquareStateから'#'を抜いた上でSquareStateに置き換えたい
// 万が一Pythonで書き直すことになった際、「IndexError: list index out of range」エラーが出ないように番兵を用いているが、JSには不要
export function visualize(diskColor: Diskcolor | null) {
  return diskColor === BLACK ? BLACK_DISK : diskColor === WHITE ? WHITE_DISK : diskColor;
}

export function Square(props: any) {
  return (
    <button className="square" id={props.id} onClick={props.onClick}>
      {visualize(props.value)}
    </button>
  );
}

function Board(props: any) {
  function renderSquare(address: number) {
    return (
      <Square
        key={address}
        id={address}
        value={props.squares[address]}
        onClick={() => props.onClick(address)}
      />
    );
  }

  function renderRow(firstAddress: number, lastAddress: number) {
    // 連番の生成 (範囲指定)
    // 連番の生成関数 (Clojure や PHP などでよく "range" と呼ばれる)
    // https://developer.mozilla.org/ja/docs/Web/JavaScript/Reference/Global_Objects/Array/from#sequence_generator_range
    // `stop`も配列に含まれうるので注意（Pythonのrange関数やJavaScriptのArray.slice()では終端の一つ手前まで）
    const range = (start: any, stop: any, step: any) => Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
    const addresses = range(firstAddress, lastAddress, 1);

    return (
      <div className="board-row">
        {addresses.map((address) => renderSquare(address))}
      </div>
    )
  }

  return (
    <div>
      {renderRow(11, 18)}
      {renderRow(21, 28)}
      {renderRow(31, 38)}
      {renderRow(41, 48)}
      {renderRow(51, 58)}
      {renderRow(61, 68)}
      {renderRow(71, 78)}
      {renderRow(81, 88)}
    </div>
  );
}

function Info(props: any) {
  const countDisks = (squares: SquareState[]) => {
    const blackTotal = squares.filter((square: any) => square === BLACK).length;
    const whiteTotal = squares.filter((square: any) => square === WHITE).length;
    return {blackTotal, whiteTotal};
  };
  const {blackTotal, whiteTotal} = countDisks(props.squares);

  const showWinner = (blackTotal: any, whiteTotal: any) => blackTotal > whiteTotal ? visualize(BLACK) : blackTotal < whiteTotal ? visualize(WHITE) : "Tie";
  const status = isGameOver(props.squares) ?
    `Winner: ${showWinner(blackTotal, whiteTotal)}` :
    `Next player: ${visualize(props.currentColor)}`;

  return (
    <div>
      <div id={props.id}>{status}</div>
      <div>{`${visualize(BLACK)} = ${blackTotal}, ${visualize(WHITE)} = ${whiteTotal}`}</div>
    </div>
  );
}

// function UndoButton({stepNumber, setStepNumber, currentColor, setCurrentColor}) {
//   function undo() {
//     setStepNumber(stepNumber - 1);
//     setCurrentColor(currentColor === BLACK ? WHITE : BLACK);
//   }
//   return stepNumber > 0 ? <button onClick={undo}>Undo</button> : <button disabled>Undo</button>;
// }

// function RedoButton({stepNumber, setStepNumber, currentColor, setCurrentColor, historyLength}) {
//   function redo() {
//     setStepNumber(stepNumber + 1);
//     setCurrentColor(currentColor === BLACK ? WHITE : BLACK);
//   }
//   return stepNumber < historyLength - 1 ? <button onClick={redo}>Redo</button> : <button disabled>Redo</button>;
// }

export default function App() {
  const [history, setHistory] = useState([{
    squares: [
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
    ] as SquareState[]
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const current = history[stepNumber];
  const [currentColor, setCurrentColor] = useState(BLACK as Diskcolor);
  const [recursiveModeIsOn, setRecursiveModeIsOn] = useState(false);

  function reverse(squares: SquareState[], whereDiskJustPlaced: any) {
    const copiedSquares = squares.slice();
    copiedSquares[whereDiskJustPlaced] = currentColor;
    const reverseQueue = [whereDiskJustPlaced];

    while(reverseQueue.length) {
      const wedgeAddress = reverseQueue.shift();
      DIRECTIONS.forEach(direction => {
        if (isSandwiching(copiedSquares, currentColor, wedgeAddress, direction)) {
          for (
            let address = wedgeAddress + direction;
            copiedSquares[address] !== currentColor;
            address += direction
          ) {
            copiedSquares[address] = currentColor;
            if (recursiveModeIsOn) {
              reverseQueue.push(address);
            }
          }
        }
      });
    }

    return copiedSquares;
  }

  function handleClick(address: number) {
    const copiedHistory = history.slice(0, stepNumber + 1);
    const copiedCurrent = copiedHistory[copiedHistory.length - 1];
    if (!canDiskBePlaced(copiedCurrent.squares, currentColor, address)) {
      return;
    }

    const copiedSquares = reverse(copiedCurrent.squares, address);

    setHistory(copiedHistory.concat([{squares: copiedSquares}]));
    setStepNumber(copiedHistory.length);
    setCurrentColor(currentColor === BLACK ? WHITE : BLACK);
  }

  function pass() {
    const copiedHistory = history.slice(0, stepNumber + 1);
    const copiedCurrent = copiedHistory[copiedHistory.length - 1];

    setHistory(copiedHistory.concat([{squares: copiedCurrent.squares}]));
    setStepNumber(copiedHistory.length);
    setCurrentColor(currentColor === BLACK ? WHITE : BLACK);
  }

  function undo() {
    setStepNumber(stepNumber - 1);
    setCurrentColor(currentColor === BLACK ? WHITE : BLACK);
  }

  function redo() {
    setStepNumber(stepNumber + 1);
    setCurrentColor(currentColor === BLACK ? WHITE : BLACK);
  }

  // ガイドを表示する。盤面や盤面の履歴に影響を与えずに表示だけ変更したかったのでDOMを操作する方法をとった
  const [guidesAreNeeded, setGuidesAreNeeded] = useState(false);
  useEffect(function showGuides() {
    // ガイドを毎回クリーンアップすることで前回のガイドが残らないようにする
    // https://developer.mozilla.org/ja/docs/Web/API/Document/getElementsByClassName
    // > メソッドの this 値として HTMLCollection を渡すことで、 Array プロトタイプのメソッドを HTMLCollection で使用することができます。
    Array.prototype.forEach.call(document.getElementsByClassName("square"), square => {
      if (square.innerHTML === GUIDE_ICON) {
        square.innerHTML = null;
      }
    });

    if (!guidesAreNeeded) {
      return;
    }

    function extractSquareToPlace(squares: SquareState[], diskColor: Diskcolor) {
      return squares
        .map((_: any, address: number) => canDiskBePlaced(squares, diskColor, address) ? address : null)
        .filter((address: number | null): address is number => typeof address === "number");
    }

    const addresses = extractSquareToPlace(current.squares, currentColor);
    addresses.forEach((address: number) => {
      document.getElementById(String(address))!.innerHTML = GUIDE_ICON;
    });
  }, [guidesAreNeeded, current.squares, currentColor]);
  // const [guideAddresses, setGuideAddresses] = useState([]);
  // function showGuides() {
  //   // 指定された色のディスクを置けるマスをすべて抜き出す
  //   function extractSquareToPlace(squares, diskColor) {
  //     return squares
  //       .map((_, address) => canDiskBePlaced(squares, diskColor, address) ? address : null)
  //       .filter((address) => address);
  //   }

  //   setGuidesAreNeeded(prevGuidesAreNeeded => {
  //     const newGuidesAreNeeded = !prevGuidesAreNeeded;
  //     if (newGuidesAreNeeded) {
  //       const addresses = extractSquareToPlace(current.squares, currentColor);
  //       addresses.forEach(address => current.squares[address] = GUIDE_ICON);
  //       setGuideAddresses(addresses);
  //       // for (const address of addresses) {
  //       //   current.squares[address] = GUIDE_ICON
  //       // }
  //     } else {
  //       guideAddresses.forEach(address => current.squares[address] = null);
  //     }

  //     return newGuidesAreNeeded;
  //   });
  // }


  function addDisabled(condition: any) {
    return condition ? {disabled: true} : {disabled: false};
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          onClick={(address: number) => handleClick(address)}
        />
      </div>
      <div className="sidebar">
        <div className="game-info">
          <Info
            id="status"
            squares={current.squares}
            currentColor={currentColor}
          />
        </div>
        <div className="function-area">
          <button onClick={pass} {...addDisabled(isSquareToPlace(current.squares, currentColor) || isGameOver(current.squares))}>Pass</button>
          <button onClick={undo} {...addDisabled(stepNumber <= 0)}>Undo</button>
          <button onClick={redo} {...addDisabled(stepNumber >= history.length - 1)}>Redo</button>
          <button className="show-hide-guides-button" onClick={() => setGuidesAreNeeded(!guidesAreNeeded)}>{!guidesAreNeeded ? "Show guides" : "Hide guides"}</button>
          <button className="recursive-mode-button" onClick={() => setRecursiveModeIsOn(!recursiveModeIsOn)}>{!recursiveModeIsOn ? "Recursive mode: ON" : "Recursive mode: OFF"}</button>
          {/* <UndoButton
            stepNumber={stepNumber}
            setStepNumber={setStepNumber}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
          />
          <RedoButton
            stepNumber={stepNumber}
            setStepNumber={setStepNumber}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            historyLength={history.length}
          /> */}
        </div>
      </div>
    </div>
  );
}
