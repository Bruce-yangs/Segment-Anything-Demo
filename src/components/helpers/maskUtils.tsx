// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

// Convert the onnx model mask prediction to ImageData
function arrayToImageData(input: any, width: number, height: number) {
  const [r, g, b, a] = [0, 114, 189, 255]; // the masks's blue color
  const arr = new Uint8ClampedArray(4 * width * height).fill(0);
  for (let i = 0; i < input.length; i++) {

    // Threshold the onnx model mask prediction at 0.0
    // This is equivalent to thresholding the mask using predictor.model.mask_threshold
    // in python
    if (input[i] > 0.0) {
      arr[4 * i + 0] = r;
      arr[4 * i + 1] = g;
      arr[4 * i + 2] = b;
      arr[4 * i + 3] = a;
    }
  }
  return new ImageData(arr, height, width);
}

// Use a Canvas element to produce an image from ImageData
function imageDataToImage(imageData: ImageData,clicks:any) {
  const canvas = imageDataToCanvas(imageData,clicks);
  const image = new Image();
  image.src = canvas.toDataURL();
  return image;
}

// Canvas elements can be created from ImageData
function imageDataToCanvas(imageData: ImageData,clicks:any) {
  const canvas = document.createElement("canvas");
  const ctx:any = canvas.getContext("2d");
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  console.log('clicks======');
  console.log(clicks);
  
  // ctx.fillStyle = 'red'; // 设置填充颜色为红色
  // ctx.beginPath();
  // ctx.arc(clicks[0].x, clicks[0].y, 5, 0, 2 * Math.PI); // 绘制半径为 5px 的圆形
  // // ctx.arc(515.7232236154649, 236.4690438871473, 5, 0, 2 * Math.PI); // 绘制半径为 5px 的圆形
  // ctx.fill();

//   ctx.fillStyle="green";
// ctx.fillRect(10,10,50,50);

  ctx?.putImageData(imageData, 0, 0);
  return canvas;
}

// Convert the onnx model mask output to an HTMLImageElement
export function onnxMaskToImage(input: any, width: number, height: number,clicks:any) {
  return imageDataToImage(arrayToImageData(input, width, height),clicks);
}
