const drawLines = (node1, node2) => {
  const x1 = node1.position.split("/")[0] * 100;
  const y1 = node1.position.split("/")[1] * 50;
  const x2 = node2.position.split("/")[0] * 100;
  const y2 = node2.position.split("/")[1] * 50;

  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="black" strokeWidth="2" />
  );
};

export default drawLines;
