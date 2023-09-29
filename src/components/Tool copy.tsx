// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useEffect, useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import type { UploadProps } from "antd";
import { message, Upload, Skeleton, Space, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import AppContext from "./hooks/createContext";
import { ToolProps } from "./helpers/Interfaces";
import * as _ from "underscore";
import axios from "./tools/request";

// const Tool = ({ handleMouseMove }: any) => {
const Tool = ({
  handleMouseMove,
  handleFileChange,
  resetInit,
  isLoading,
  uploadFile,
}: any) => {
  const {
    image: [image, setImage],
    maskImg: [maskImg, setMaskImg],
    clickType: [clickType, setClickType],
    clicks: [clicks, setClicks],

  } = useContext(AppContext)!;

  // Determine if we should shrink or grow the images to match the
  // width or the height of the page and setup a ResizeObserver to
  // monitor changes in the size of the page
  const [shouldFitToWidth, setShouldFitToWidth] = useState(true);
  const bodyEl = document.body;
  const fitToPage = () => {
    if (!image) return;
    const imageAspectRatio = image.width / image.height;
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    setShouldFitToWidth(imageAspectRatio > screenAspectRatio);
  };
  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === bodyEl) {
        fitToPage();
      }
    }
  });
  // useEffect(() => {
  //   window.onload = function () {
  //     // 所有资源（包括图片、样式表、脚本等）都已加载完毕，可以进行相应操作
  //     console.log(
  //       "加载完成================================================================"
  //     );
  //     console.log(0);
  //   };
  //   // 所有文件及外部 JavaScript 或文件都已加载完毕，可以进行相应操作
  // }, []);

  function animateOpacity() {
    var element: any = document.querySelector(".my-element");
    if (!element) return;
    element.classList.add("active");

    setTimeout(function () {
      element.style.opacity = "0.7";
      setTimeout(function () {
        element.style.opacity = "0.5";
        setTimeout(function () {
          element.style.opacity = ".7";
          setTimeout(function () {
            element.style.opacity = ".4";
            element.classList.remove("active");
          }, 550);
        }, 750);
      }, 500);
    }, 100);
  }


  useEffect(() => {
    fitToPage();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };

    animateOpacity();
  }, [maskImg]);

  useEffect(() => {
    alert(0)

    const canvas:any = document.getElementById('myCanvas');
    alert(canvas)

    if(!canvas) return;
    alert(1)

    const ctx = canvas.getContext('2d');
    const circles:any = [];
    let oldWidth = window.innerWidth;
    let oldHeight = window.innerHeight;

    // const img = new Image();
    // img.src = image.href;
    //     img.onload = function() {
      // image.onload = function() {
          // 计算宽高比例
          const widthToHeight = image.width / image.height;

          // 获取新的 canvas 宽度和高度
          let newWidth = window.innerWidth;
          let newHeight = window.innerHeight;

          if (newWidth / newHeight > widthToHeight) {
            newWidth = newHeight * widthToHeight;
          } else {
            newHeight = newWidth / widthToHeight;
          }

          // 设置 canvas 尺寸
          canvas.width = newWidth;
          canvas.height = newHeight;

          // 在 canvas 上绘制图片
          ctx.drawImage(image, 0, 0, newWidth, newHeight);
        // }

        // 监听 canvas 鼠标点击事件，绘制圆点
    canvas.addEventListener('mousedown', function(e: any) {
      const x = e.offsetX;
      const y = e.offsetY;
      alert(121)

      // circles.push({x: x, y: y});

      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
    })




  function resizeCanvas() {
    // 获取当前 canvas 尺寸和图片
    const canvas:any = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = canvas.toDataURL();

    // 计算宽高比例
    const widthToHeight = img.width / img.height;

    // 获取新的 canvas 宽度和高度
    let newWidth = window.innerWidth;
    let newHeight = window.innerHeight;

    if (newWidth / newHeight > widthToHeight) {
      newWidth = newHeight * widthToHeight;
    } else {
      newHeight = newWidth / widthToHeight;
    }

    // 设置 canvas 尺寸
    canvas.width = newWidth;
    canvas.height = newHeight;

    // 在 canvas 上重新绘制图片
    img.onload = function() {
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
    };

    // 在 canvas 上重新绘制圆点
    for (let i = 0; i < circles.length; i++) {
      const x = clicks[i].x * newWidth / oldWidth;
      const y = clicks[i].y * newHeight / oldHeight;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
    }

    // 更新旧宽度和高度
    oldWidth = newWidth;
    oldHeight = newHeight;
  }
       
  }, [image]);

  function delImg() {
    setImage(null);
    resetInit();
    const root: any = document.getElementById("root");
    root.style.backgroundImage = "none";
  }

  const imageClasses = "";
  const maskImageClasses = `absolute opacity-40 pointer-events-none`;
  // console.log(maskImg);
  // console.log(maskImg[0]?.src);

  // Render the image and the predicted mask image on top
  return (
    <>
      {isLoading ? (
        <Skeleton active />
      ) : (
        <>
          {image ? (
              <>
                <canvas id="myCanvas" className="absolute h-full w-full"></canvas>
                  
                {/* <img
                  onClick={handleMouseMove}
                  // onMouseMove={handleMouseMove}
                  // onMouseOut={() => _.defer(() => setMaskImg(null))}
                  // onTouchStart={handleMouseMove}
                  // src={image as unknown as string}  width={600} object-contain
                  src={image.src || image}
                  className={`${imageClasses} ${
                    shouldFitToWidth ? "w-full" : "h-full"
                  } `}
                ></img> */}
            </>
          ) : (
            <div className="w-full h-full relative border-dashed border bg-slate-50 border-blue-700 rounded">
              <div className="ant-upload-drag-icon w-58 text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                <Space direction={"vertical"}>
                  <InboxOutlined style={{ color: "#1677ff", fontSize: 40 }} />
                  <div style={{ color: "#1677ff" }}>点击上传</div>
        <p className="text-center text-sm mt-2 text-slate-600">请先上传本地图片后，再进行操作</p>

                </Space>
              </div>

              <input
                type="file"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  cursor: "pointer",
                  position: "absolute",
                  opacity: 0,
                }}
                onChange={handleFileChange}
                accept="image/*"
                disabled={isLoading}
              />
            </div>
          )}
          {maskImg.map((item: any, index: number) => (
            <img
              id={item.id}
              key={index}
              src={item.img.src}
              className={` ${maskImageClasses} mask-imgs my-element ${
                shouldFitToWidth ? "w-full" : "h-full"
              }`}
              // className={`${
              //   shouldFitToWidth ? "w-full" : "h-full"
              // } ${maskImageClasses} mask-imgs `}
            ></img>
          ))}
          {image ? (
            <div
              onClick={delImg}
              className="absolute -right-2 -top-2 w-10 h-10 bg-slate-200 cursor-pointer z-10 rounded-full text-center hover:opacity-75 flex align-middle justify-center"
            >
              <CloseOutlined title="删除图片" />
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default Tool;
