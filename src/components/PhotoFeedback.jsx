import React, { useEffect, useRef } from 'react';

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

function drawSigmoidCurve(ctx, width, height, offsetY) {
  ctx.beginPath();
  for (let x = -10; x <= 10; x += 0.1) {
    const canvasX = ((x + 10) / 20) * width;
    const canvasY = sigmoid(x / 2) * height; // 기울기를 완만하게 하기 위해 x를 2로 나눔
    ctx.lineTo(canvasX, canvasY + offsetY);
  }
  ctx.strokeStyle = 'blue';
  ctx.lineWidth = 3; // 끈의 굵기 증가
  ctx.stroke();
}

function PhotoFeedback() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height / 2; // 두 개의 곡선을 그리기 위해 높이를 반으로 나눔
    ctx.clearRect(0, 0, width, canvas.height); // 기존의 그래프를 지움
    drawSigmoidCurve(ctx, width, height, 0); // 위쪽 곡선
    drawSigmoidCurve(ctx, width, height, height); // 아래쪽 곡선
  }, []);

  return (
    <div>
      <h1>Photo Feedback</h1>
      <p>Get feedback on your photos here.</p>
      <canvas ref={canvasRef} width={window.innerWidth} height={400}></canvas>
    </div>
  );
}

export default PhotoFeedback;