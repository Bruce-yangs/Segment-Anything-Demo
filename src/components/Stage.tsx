// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import React, { useContext, useState } from "react";
import * as _ from "underscore";
import { Button, Space, Input, Spin, Tabs } from "antd";
import type { TabsProps } from "antd";
import {
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  PictureOutlined,
  UploadOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { modelInputProps } from "./helpers/Interfaces";
import AppContext from "./hooks/createContext";
import { log } from "console";
import { handleImageScale } from "../components/helpers/scaleHelper";
import Tool from "./Tool";

const Stage = ({
  handleFileChange,
  resetInit,
  isLoading,
  uploadFile,
  creatGround,
  delGround,
  initImg,
}: any) => {
  const {
    clicks: [clicks, setClicks],
    image: [image, setImage],
    clickType: [clickType, setClickType],
  } = useContext(AppContext)!;

  const [checked, setChecked] = useState<any>("1"); //checked

  const getClick = (x: number, y: number): modelInputProps => {
    const clickTypes = clickType === 1 ? 1 : 0;
    console.log({ x, y, clickTypes });

    return { x, y, clickType: clickTypes };
  };
  //创建point
  function createPoint(clicks: any) {
    const div = document.createElement("div");
    // let imgBox: any = document.getElementById("imgId");
    let imgBox: any = document.getElementById("container-img");
    div.className = "mask-point";
    div.style.width = "10px";
    div.style.height = "10px";
    div.style.borderRadius = "50%";
    div.style.backgroundColor = clickType === 1 ? "green" : "pink";
    div.style.position = "fixed";
    // div.style.position = "absolute";
    div.style.left = clicks.x + "px";
    div.style.top = clicks.y + "px";
    div.style.zIndex = "10";
    console.log('clicks====');
    console.log(clicks);
    

    imgBox.appendChild(div);
  }

  // Get mouse position and scale the (x, y) coordinates back to the natural
  // scale of the image. Update the state of clicks with setClicks to trigger
  // the ONNX model to run and generate a new mask via a useEffect in App.tsx
  const handleMouseMove = _.throttle((e: any) => {
    let el = e.nativeEvent.target;
    const rect = el.getBoundingClientRect();
    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    //dom添加
    let coors = { x: e.clientX - 5, y: e.clientY - 5 };
    // createPoint(coors);

    const imageScale = image ? image.width / el.offsetWidth : 1;
    x *= imageScale;
    y *= imageScale;

    const click = getClick(x, y);
    console.log("clicks====");
    console.log(clicks);
    let _clicks = [];
    if (clicks) {
      _clicks = clicks;
    }
    if (click) setClicks([..._clicks, ...[click]]);
   
  }, 15);

  const onChange = (key: string) => {
    console.log(key);
    setChecked(key);
  };

  function CheckedComponent({ item }: { item: string }) {
    let content;

    if (item == "1") {
      content = (
        <>
          <Button
            type="primary"
            className="w-full hover:opacity-75 mt-3"
            style={{
              // padding: " 4px 18px",
              background: "green",
              borderColor: "green",
              width: "180px",
            }}
            onClick={uploadFile}
            loading={isLoading}
            icon={<CloudUploadOutlined />}
          >
            上传数据
          </Button>

          <Input
            type="text"
            placeholder="图片描述"
            id="desc"
            className="h-8 border w-full text-sm mt-3"
          />
        </>
      );
    } else if (item == "2") {
      content = (
        <>
          <Button
            className="w-full "
            onClick={creatGround}
            loading={isLoading}
            style={{ width: "180px" }}
            type="primary"
            icon={<PictureOutlined />}
          >
            背景生成
          </Button>

          <Input
            type="text"
            placeholder="正向提示词(英文)"
            id="ground_prompt"
            className="h-8 border w-full text-sm mt-3"
          />
          <Input
            type="text"
            placeholder="负向提示词(英文)"
            id="n_prompt"
            className="h-8 border w-full text-sm mt-3"
          />
        </>
      );
    }
    if (item == "3") {
      content = (
        <>
          <Button
            className="w-full mt-3"
            style={{ width: "180px" }}
            onClick={delGround}
            loading={isLoading}
            type="primary"
            icon={<PictureOutlined />}
          >
            去掉识别物体
          </Button>
        </>
      );
    }

    return <div>{content}</div>;
  }
  const flexCenterClasses = "flex items-center justify-center";

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "选择工具",
      children: (
        <Space direction={"vertical"}>
          {/* <Button
            className="w-full "
            type={clickType === 1 ? "primary" : "default"}
            onClick={() => setClickType(1)}
            loading={isLoading}
            icon={<PlusOutlined />}
          >
            添加mask
          </Button>
          <Button
            type={clickType === 2 ? "primary" : "default"}
            className="w-full mt-3"
            onClick={() => setClickType(2)}
            loading={isLoading}
            icon={<MinusOutlined />}
          >
            删除mask
          </Button>
          <Button
            danger
            className="w-full mt-3"
            onClick={resetInit}
            disabled={isLoading}
            loading={isLoading}
            icon={<DeleteOutlined />}
          >
            清除mask
          </Button> */}

          {/* <Button
            type="primary"
            className="w-full hover:opacity-75 mt-3"
            style={{
              padding: " 4px 18px",
              background: "green",
              borderColor: "green",
            }}
            onClick={uploadFile}
            loading={isLoading}
            icon={<CloudUploadOutlined />}
          >
            上传数据
          </Button>

          <Input
            type="text"
            placeholder="图片描述"
            id="desc"
            className="h-8 border w-full text-sm mt-3"
          /> */}
        </Space>
      ),
    },
    {
      key: "2",
      label: "背景生成",
      children: (
        <>
          <Space direction={"vertical"}>
            {/* <Button
              className="w-full "
              onClick={creatGround}
              loading={isLoading}
              type="primary"
              icon={<PictureOutlined />}
            >
              背景生成
            </Button>

            <Input
              type="text"
              placeholder="正向提示词(英文)"
              id="ground_prompt"
              className="h-8 border w-full text-sm mt-3"
            />
            <Input
              type="text"
              placeholder="负向提示词(英文)"
              id="n_prompt"
              className="h-8 border w-full text-sm mt-3"
            /> */}
          </Space>
        </>
      ),
    },
    {
      key: "3",
      label: "去物体",
      children: (
        <Space direction={"vertical"}>
          {/* <Button
            className="w-full mt-3"
            style={{ width: "180px" }}
            onClick={delGround}
            loading={isLoading}
            type="primary"
            icon={<PictureOutlined />}
          >
            去掉识别物体
          </Button> */}
        </Space>
      ),
    },
  ];

  /* hover:text-white */
  return (
    <>
      {/* {image ? ( */}

      <div className="t absolute left-1/2 -translate-x-1/3">
        <Space className="w-full mt-5 ">
          <Button
            className="w-full"
            type={clickType === 1 ? "primary" : "default"}
            onClick={() => setClickType(1)}
            loading={isLoading}
            icon={<PlusOutlined />}
          >
            添加mask
          </Button>
          <Button
            type={clickType === 2 ? "primary" : "default"}
            className="w-full"
            onClick={() => setClickType(2)}
            loading={isLoading}
            icon={<MinusOutlined />}
          >
            删除mask
          </Button>
          <Button
            danger
            className="w-full"
            onClick={resetInit}
            disabled={isLoading}
            loading={isLoading}
            icon={<DeleteOutlined />}
          >
            清除mask
          </Button>
          {/* <Button
              className="w-full relative"
              icon={<UploadOutlined />}
              loading={isLoading}
              type="primary"
            >
              图片重新上传
              <input
                type="file"
                style={{
                  width: "100%",
                  height: "100%",
                  zIndex: 1,
                  cursor: "pointer",
                  position: "absolute",
                  opacity: 0,
                  left: 0,
                  top: 0,
                }}
                onChange={handleFileChange}
                accept="image/*"
                disabled={isLoading}
              />
            </Button> */}
          <Button
            className="w-full"
            icon={<SyncOutlined />}
            onClick={resetInit}
            // onClick={initImg}
            loading={isLoading}
            type="primary"
          >
            重置
          </Button>
        </Space>
        {/*  ) : null} */}
      </div>
      <div
        className="absolute left-3 h-5/6 my-20"
        style={{
          padding: "20px 20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div className="text-slate-500 mb-2 text-sm">工作台</div>
        <Tabs
          className="mt-5"
          defaultActiveKey="1"
          items={items}
          tabPosition="left"
          onChange={onChange}
        />
      </div>
      <div
        className="absolute right-3 h-5/6 my-20"
        style={{
          padding: "20px 20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          textAlign: "center",
        }}
      >
        <div className="text-slate-500 mb-2 text-sm">操作区</div>
        <Space direction={"vertical"} style={{ width: "180px" }}>
          <CheckedComponent item={checked} />
        </Space>
      </div>

      {/* <div className="absolute left-3 top-48 w-56 text-center flex   flex-col">
      
        <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
      </div> */}

      <div className={`${flexCenterClasses} w-full h-full`}>
        <div
          className={`${flexCenterClasses} relative w-[65%] h-[65%] left-30`}
          // className={`${flexCenterClasses} relative w-[90%] h-[90%]`}
          id="container-img"
        >
          <Tool
            handleMouseMove={handleMouseMove}
            handleFileChange={handleFileChange}
            resetInit={resetInit}
            isLoading={isLoading}
            uploadFile={uploadFile}
          />
        </div>
      </div>
      {isLoading ? (
        <Spin
          tip="正在解析文件，请稍后哦..."
          size="large"
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            width: "300px",
            transform: "translate(-35%, -50%)",
          }}
        >
          <div className="content" />
        </Spin>
      ) : null}
    </>
  );
};

export default Stage;
