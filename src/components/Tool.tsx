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
  baseReset,
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
    animateOpacity();
    resizeObserver.observe(bodyEl);
    return () => {
      resizeObserver.unobserve(bodyEl);
    };
  }, [maskImg]);

  // useEffect(() => {
  //   fitToPage();
  //   // animateOpacity();
  //   // resizeObserver.observe(bodyEl);
  //   // return () => {
  //   //   resizeObserver.unobserve(bodyEl);
  //   // };
  // }, []);

  useEffect(() => {
    fitToPage();
  }, [image]);

  function delImg() {
    setImage(null);
    baseReset();
    const root: any = document.getElementById("root");
    root.style.backgroundImage = "none";
  }

  function stopTools() {
    
  document.addEventListener('keydown', function(event: any){
    return 123 != event.keyCode || (event.returnValue = false)

          // @ts-ignore
    
    })
    document.addEventListener('contextmenu', function(event){
      return event.returnValue = false
   })
  }
  // stopTools();

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
            <div
              className={`${imageClasses} ${
                shouldFitToWidth ? "w-full" : "h-full"
              } relative`}
              id="imgId"
            >
              {/* <canvas id="myCanvas" className="absolute h-full w-full"></canvas> */}

              <img
                onClick={handleMouseMove}
                // onMouseMove={handleMouseMove}
                // onMouseOut={() => _.defer(() => setMaskImg(null))}
                // onTouchStart={handleMouseMove}
                // src={image as unknown as string}  width={600} object-contain
                src={image.src}
                className={`${imageClasses} ${
                  shouldFitToWidth ? "w-full" : "h-full"
                } `}
              ></img>
              {image ? (
                <span
                  onClick={delImg}
                  className="absolute -right-2 -top-2 w-10 h-10 bg-slate-200 cursor-pointer z-10 rounded-full text-center hover:opacity-75 flex align-middle justify-center"
                >
                  <CloseOutlined title="删除图片" />
                </span>
              ) : null}
            </div>
          ) : (
            <div className="w-full h-full relative border-dashed border bg-slate-50 border-blue-700 rounded">
              <div className="ant-upload-drag-icon w-58 text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                <Space direction={"vertical"}>
                  <InboxOutlined style={{ color: "#1677ff", fontSize: 40 }} />
                  <div style={{ color: "#1677ff" }}>点击上传</div>
                  <p className="text-center text-sm mt-2 text-slate-600">
                    请先上传本地图片后，再进行操作
                  </p>
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
              className={` ${maskImageClasses} mask-imgs my-element 
              ${
                shouldFitToWidth ? "w-full" : "h-full"
              }`}
              //   shouldFitToWidth ? "w-full" : "h-full"
              // } ${maskImageClasses} mask-imgs `}
            ></img>
          ))}
        </>
      )}
    </>
  );
};

export default Tool;
