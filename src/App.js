import styled from "styled-components";
import { useState, useEffect, useMemo } from "react";
import defaultGrids from "./grids";
import useGridDFSAnimation from "./useGridDFSAnimation";
import { cloneGrid } from "./utils/cloneGrid";

export default function App() {
  const [startingGrid, setStartingGrid] = useState("grid1");
  const [customGrid, setCustomGrid] = useState([
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ]);
  const [formData, setFormData] = useState({
    rows: 5,
    cols: 5
  });
  const grids = useMemo(() => {
    return { ...defaultGrids, custom: customGrid };
  }, [customGrid]);
  const {
    currentArea,
    maxArea,
    mapAreas,
    isRunning,
    gridDisplay,
    setGridDisplay,
    resetGrid
  } = useGridDFSAnimation(cloneGrid(grids[startingGrid]), { sleep: 60 });

  useEffect(() => {
    setGridDisplay(cloneGrid(grids[startingGrid]));
  }, [startingGrid, setGridDisplay, grids]);

  const island = gridDisplay.map((row, rIdx) => {
    const tiles = row.map((el, cIdx) => {
      return <Cell key={cIdx} value={el} />;
    });
    return <Row key={rIdx}>{tiles}</Row>;
  });

  const customMap = customGrid.map((row, rIdx) => {
    const tiles = row.map((el, cIdx) => {
      return (
        <Cell
          key={cIdx}
          value={el}
          onClick={() => setCustomGridAreas(rIdx, cIdx)}
        />
      );
    });
    return <Row key={rIdx}>{tiles}</Row>;
  });

  const setCustomGridAreas = (rIdx, cIdx) => {
    customGrid[rIdx][cIdx] = customGrid[rIdx][cIdx] === 0 ? 1 : 0;
    setCustomGrid(cloneGrid(customGrid));
  };

  const handleChangeCustomGridSize = (key, value) => {
    const newFormData = { ...formData, [key]: +value };
    setFormData(newFormData);
    resizeGrid(newFormData);
  };

  const resizeGrid = (newFormData) => {
    const newGrid = Array(newFormData.rows);
    for (let i = 0; i < newGrid.length; i++) {
      newGrid[i] = Array(newFormData.cols).fill(0);
    }
    setCustomGrid(newGrid);
  };

  const handleUseCustomMap = (e) => {
    e.preventDefault();
    setStartingGrid("custom");
    // setGridDisplay(cloneGrid(customGrid));
  };

  return (
    <div className="App">
      <Row as="header">
        <h1> Largest Island Land Area </h1>
      </Row>
      <IslandContainer>
        <div>{island}</div>
      </IslandContainer>
      <Row>
        <Label htmlFor="startingGrid">Select Starting Grid</Label>
        <select
          id="startingGrid"
          onChange={(e) => {
            setStartingGrid(e.target.value);
          }}
        >
          {Object.keys(grids).map((key, i) => {
            let text;
            if (i === Object.keys(grids).length - 1) {
              text = "Custom";
            } else {
              text = `Grid ${i + 1}`;
            }
            return (
              <option key={i} value={key}>
                {text}
              </option>
            );
          })}
          {/* <option value="custom">Custom</option> */}
        </select>
      </Row>
      <Row>
        <ActionButton
          disabled={isRunning}
          onClick={() => {
            mapAreas();
          }}
        >
          Action!
        </ActionButton>
        <ResetButton
          disabled={isRunning}
          onClick={() => {
            resetGrid();
          }}
        >
          Reset
        </ResetButton>
      </Row>
      <Row>
        <h2 style={{ margin: "5px" }}>
          Current Size: <span>{currentArea}</span>
        </h2>
      </Row>
      <Row>
        <h2 style={{ margin: "5px" }}>
          Max Size: <span>{maxArea}</span>
        </h2>
      </Row>
      <hr />
      <Col as="section">
        <Header>
          <h2>Create A Custom Map</h2>
          <h4> 1. Adjust the size of the map </h4>
          <h4> 2. Click tiles on the map to mark them as land </h4>
        </Header>
        <Row>
          <Col as="form" onSubmit={handleUseCustomMap}>
            <Row>
              <Label htmlFor="customRow">Number of Rows</Label>
              <input
                type="number"
                value={formData.rows}
                min="1"
                max="20"
                id="customRow"
                onChange={(e) =>
                  handleChangeCustomGridSize("rows", e.target.value)
                }
              />
            </Row>
            <Row>
              <Label htmlFor="customCol">Number of Columns</Label>
              <input
                type="number"
                min="1"
                max="20"
                id="customCol"
                value={formData.cols}
                onChange={(e) =>
                  handleChangeCustomGridSize("cols", e.target.value)
                }
              />
            </Row>
            <Button as="input" type="submit" value="Use This Island" />
          </Col>
        </Row>
        <IslandContainer>
          <div>{customMap}</div>
        </IslandContainer>
      </Col>
    </div>
  );
}

const IslandContainer = styled.div`
  display: flex;
  min-height: 300px;
  align-items: center;
  justify-content: center;
`;
const Row = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
`;

const Col = styled(Row)`
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  & > * {
    margin: 5px;
  }
`;
const Cell = styled.div`
  height: 30px;
  width: 30px;
  background: ${({ value }) => value === 0 && "blue"};
  background: ${({ value }) => value === 1 && "tan"};
  background: ${({ value }) => value === 2 && "green"};
  background: ${({ value }) => value === 3 && "yellow"};
  background: ${({ value }) => value === 4 && "lightblue"};
  border: 1px solid black;
`;
const Button = styled.button`
  width: 20vw;
  max-width: 150px;
  height: 2rem;
  margin: 10px;
  border-radius: 20px;
  outline: none;
  border: 1px solid black;
  box-shadow: 0 0 10px 0px #d8d8d8;
  background: #e496ff;
  :hover {
    background: white;
    border: 1px solid #e496ff;
  }
`;

const ActionButton = styled(Button)`
  background: #23ea65;
  :hover {
    background: white;
    border: 1px solid #23ea65;
  }
`;
const ResetButton = styled(Button)`
  background: #f24646;
  color: white;
  :hover {
    background: white;
    border: 1px solid #f24646;
    color: black;
  }
`;
const Label = styled.label`
  margin-right: 10px;
`;
