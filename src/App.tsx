// Copyright (c) Meta Platforms, Inc. and affiliates.
// All rights reserved.

// This source code is licensed under the license found in the
// LICENSE file in the root directory of this source tree.

import { InferenceSession, Tensor } from "onnxruntime-web";
import React, { useContext, useEffect, useState } from "react";
import { message } from "antd";

import { handleImageScale } from "./components/helpers/scaleHelper";
import { modelScaleProps } from "./components/helpers/Interfaces";
import { onnxMaskToImage } from "./components/helpers/maskUtils";
import { modelData } from "./components/helpers/onnxModelAPI";
import Stage from "./components/Stage";
import AppContext from "./components/hooks/createContext";
const ort = require("onnxruntime-web");
/* @ts-ignore */
import npyjs from "npyjs";
import axios from "./components/tools/request";
import { log } from "console";
import * as _ from "underscore";
// import { toByteArray, fromByteArray } from "base64-js";
// import { parse } from 'numpy-parser';
// const numpy = require("numpy.js");
import "./assets/scss/App.scss";

// const { parse } = require("numpy-parser");
// Define image, embedding and model paths
// const IMAGE_PATH = "/assets/data/w.jpeg";
const BG = "/assets/data/bg.jpg";
const IMAGE_PATH = "/assets/data/dogs.jpg";
const IMAGE_EMBEDDING = "/assets/data/dogs_embedding.npy";
const MODEL_DIR = "/model/sam_onnx_quantized_example.onnx";

// const MODEL_DIR = "./model/model.onnx";

const App = () => {
  const {
    clicks: [clicks, setClicks],
    clickType: [clickType, setClickType],
    image: [image, setImage],
    maskImg: [maskImg, setMaskImg],
  } = useContext(AppContext)!;
  const [model, setModel] = useState<InferenceSession | null>(null); // ONNX model
  const [tensor, setTensor] = useState<Tensor | null>(null); // Image embedding tensor
  const [isLoading, setIsLoading] = useState<boolean>(true); // isLoading
  const [fileImgKey, setFileImgKey] = useState<string>(""); //file
  const [bakImgInfo, setBakImgInfo] = useState<any>(null); //file
  const [currentImgInfo, setCurrentImgInfo] = useState<any>(null); //当前生成后的图片

  // The ONNX model expects the input to be rescaled to 1024.
  // The modelScale state variable keeps track of the scale values.
  const [modelScale, setModelScale] = useState<modelScaleProps | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  // const apiUrl = process.env.REACT_APP_API_URL;
  let _curUrl = process.env.REACT_APP_API_URL;
  console.log(_curUrl);
  
  // let _curUrl = location.origin;

  const loadTensor = async (imgEmbedding: any) => {
    Promise.resolve(await loadNpyTensor(imgEmbedding, "float32")).then(
      (embedding) => {
        setTensor(embedding);
        setIsLoading(false);
        console.log(
          ".npy加载完成================================================================"
        );
      }
    );
  };

  // Initialize the ONNX model. load the image, and load the SAM
  // pre-computed image embedding
  useEffect(() => {
    // Initialize the ONNX model
    const initModel = () => {
      return new Promise(async (resolve, reject) => {
        try {
          if (MODEL_DIR === undefined) return;
          const URL: string = MODEL_DIR;
          const model = await InferenceSession.create(URL);
          setModel(model);
          setIsLoading(false);
          console.log("模型加载完毕=====");

          resolve(model);
        } catch (e) {
          console.log(e);
        }
      });
    };

    initModel();

    console.log("完毕=====");

    // Load the Segment Anything pre-computed embedding
    // Promise.resolve(loadNpyTensor(imgEmbedding, "float32")).then(
    //   (embedding) => setTensor(embedding)
    // );
    // var data = 'http://localhost:3000/assets/data/dogs_embedding.npy'
    // loadTensor(data);

    // const root: any = document.getElementById("root");
    // root.style.backgroundImage = `url(${BG})`;

    // root.style.backgroundSize = "cover";
    // root.style.backgroundPosition = "center";
  }, []);

  //加载图片
  const loadImage = async (url: URL, type?: number) => {
    try {
      // console.log("url======");
      // console.log(url);
      if (type) {
        const imgs = new Image();
        // img.src = IMAGE_PATH;
        imgs.src = url.href + "?id=" + Date.now();
        imgs.onload = function () {
          const { height, width, samScale } = handleImageScale(imgs);
          setModelScale({
            height: height, // original image height
            width: width, // original image width
            samScale: samScale, // scaling factor for image which has been resized to longest side 1024
          });
          imgs.width = width;
          imgs.height = height;
          console.log("进来了");

          setImage(imgs);
        };
        return false;
      }

      const img = new Image();
      // img.src = IMAGE_PATH;
      img.src = url.href;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // document.body.appendChild(canvas);
        const ctx: any = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;

        console.log("clicks======");
        console.log(clicks);

        // ctx?.putImageData(img, 0, 0);
        ctx && ctx.drawImage(img, 0, 0);

        clicks?.map((val: any) => {
          ctx.fillStyle = val.clickType == 1 ? "green" : "pink"; // 设置填充颜色为红色
          ctx.beginPath();
          ctx.arc(val.x, val.y, 5, 0, 2 * Math.PI); // 绘制半径为 5px 的圆形
          ctx.fill();
        });

        const imgs = new Image();
        // img.src = IMAGE_PATH;
        imgs.src = canvas.toDataURL();
        imgs.onload = function () {
          const { height, width, samScale } = handleImageScale(imgs);
          setModelScale({
            height: height, // original image height
            width: width, // original image width
            samScale: samScale, // scaling factor for image which has been resized to longest side 1024
          });
          imgs.width = width;
          imgs.height = height;
          setImage(imgs);
          canvas.remove();
        };

        // 销毁canvas

        // console.log(img.src);

        // const { height, width, samScale } = handleImageScale(imgs);
        // setModelScale({
        //   height: height, // original image height
        //   width: width, // original image width
        //   samScale: samScale, // scaling factor for image which has been resized to longest side 1024
        // });
        // imgs.width = width;
        // imgs.height = height;
        // setImage(imgs);

        //  const root: any = document.getElementById("root");
        // root.style.backgroundImage = `url(${img.src})`;
        // root.style.backgroundSize = "cover";
        // root.style.backgroundPosition = "center";

        // root.style.background = `linear-gradient(to right,#fff,#CC99FF)`;

        // 应用高斯模糊效果
        // root.style.filter = "blur(10px)"; // 调整模糊程度
      };
    } catch (error) {
      console.log(error);
    }
  };

  // Decode a Numpy file into a tensor.
  const loadNpyTensor = async (tensorFile: string | any, dType: string) => {
    let npLoader = new npyjs();
    const npArray = await npLoader.load(tensorFile);
    const tensor = new ort.Tensor(dType, npArray.data, npArray.shape);
    return tensor;
  };

  // Run the ONNX model every time clicks has changed
  useEffect(() => {
    // loadImage(bakImgInfo);
    // const url = new URL(IMAGE_PATH, _curUrl);
    // loadImage(url);

    console.log("clicks=====");
    console.log(clicks);
    currentImgInfo && loadImage(currentImgInfo);
    if (clicks?.length) {
      runONNX();
      // if (!image) return;
      // let obj: any = {
      //   href:  currentImgInfo?.href,
      //   // href: image.src,
      // };
    }

  }, [clicks]);

  const updateImg = () => {
    baseReset();
    console.log("更新----图片");
  };

  //去掉识别物体
  function delGround() {
    if (!maskImg.length) {
      messageApi.open({
        type: "warning",
        content: "暂无mask数据",
      });
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    const results = maskImg.length ? maskImg[0].img.src : "";

    if (fileImgKey) {
      formData.append("key", fileImgKey);
    }
    formData.append("mask", results);

    axios
      .post("/inpaint/remove", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        const { ret, image_uri, image_emb, key, msg } = response.data;
        if (ret == 0) {
          let _url = _curUrl + "/" + image_uri;
          let obj: any = { href: _url };
          updateImg();
          //1代表重新更新图片，不处理点击状态的 点击记录
          loadImage(obj, 1);

          const URL_NPY = _curUrl + "/" + image_emb;
          loadTensor(URL_NPY);
          setFileImgKey(key);
          setCurrentImgInfo(obj);
          console.log("背景生成成功===========");
        } else {
          messageApi.open({
            type: "error",
            content: msg,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        // 处理上传失败的逻辑
      });
    // .finally(() => {
    //   setIsLoading(false);
    // });
  }
  //生成背景
  function creatGround() {
    const formData = new FormData();
    const inputDom: any = document.getElementById("ground_prompt");
    const inputDom2: any = document.getElementById("n_prompt");

    if (!maskImg.length) {
      messageApi.open({
        type: "warning",
        content: "暂无mask数据",
      });
      return;
    }
    setIsLoading(true);
    const results = maskImg.length ? maskImg[0].img.src : "";
    if (fileImgKey) {
      formData.append("key", fileImgKey);
    }
    console.log("outputs=========masks=====");
    console.log(results);
    formData.append("mask", results);
    formData.append("ground_prompt", inputDom.value);
    formData.append("n_prompt", inputDom2.value);

    axios
      .post("/inpaint/ground", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response.data);
        const { ret, image_uri, image_emb, key, msg } = response.data;
        if (ret == 0) {
          let _url = _curUrl + "/" + image_uri;
          let obj: any = { href: _url };
          updateImg();
          loadImage(obj, 1);

          const URL_NPY = _curUrl + "/" + image_emb;
          loadTensor(URL_NPY);
          setFileImgKey(key);
          setCurrentImgInfo(obj);
          console.log("背景生成成功===========");
        } else {
          messageApi.open({
            type: "error",
            content: msg,
          });
        }
      })
      .catch((error) => {
        // 处理上传失败的逻辑
        console.error(error);
      });
    // .finally(() => {
    //   setIsLoading(false);
    // });
  }
  //识别颜色 对应坐标
  function getRGBFromCanvas(canvas: any, x: number, y: number) {
    const context = canvas.getContext("2d");
    const pixelData = context.getImageData(x, y, 1, 1).data;

    const red = pixelData[0];
    const green = pixelData[1];
    const blue = pixelData[2];

    return { red, green, blue };
  }
  //创建canvas
  function createCanvas(src: string) {
    const canvas = document.createElement("canvas");
    const image = new Image();
    image.src = src;
    image.onload = function () {
      canvas.width = image.width;
      canvas.height = image.height;

      const context = canvas.getContext("2d");
      context && context.drawImage(image, 0, 0);
    };
    return canvas;
  }

  //公共清除图片恢复状态
  function baseReset(type?:number) {
    // const maskPoints = document.querySelectorAll(".mask-point");
    // maskPoints.forEach((element) => {
    //   element.remove();
    // });
    setClicks([]);
    setMaskImg([]);
    setClickType(1);
    if(type == 2) {
      setBakImgInfo(null)
      setCurrentImgInfo(null)
      return
    }
    // if(type) return
    // if (currentImgInfo) {
    //   loadImage(currentImgInfo, 1);
    // }
  }

  //重置
  const resetInit = () => {
    // const inputDom: any = document.getElementById("desc");
    // inputDom.value = "";
    // bakImgInfo
    // setImage();
    
    //此处保留
    if (bakImgInfo) {
      loadImage(bakImgInfo, 1);
      setFileImgKey(bakImgInfo.key);
      loadTensor(bakImgInfo.npy);
      setCurrentImgInfo(bakImgInfo)
    }
    baseReset(1);

    console.log("清除----mask");
  };

  //上传数据
  const uploadFile = () => {
    // 执行上传操作，例如将选定的文件发送到服务器
    if (maskImg.length) {
      const formData = new FormData();

      // const results = maskImg.map((mask: any) => mask.results);
      // const results = maskImg[0].results;

      const results = maskImg.length ? maskImg[0].img.src : "";
      // const maskData = JSON.stringify(results);
      const inputDom: any = document.getElementById("desc");
      const inputDom2: any = document.getElementById("desc2");

      if (fileImgKey) {
        formData.append("key", fileImgKey);
      }
      console.log("outputs=========masks=====");
      // console.log(results);

      formData.append("mask", results);
      formData.append("text_prompt", inputDom.value);
      formData.append("n_prompt", inputDom2.value);

      axios
        .post("/generate", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          // 处理上传成功的逻辑
          console.log(response.data);
          const { ret, image_uri, image_emb, key, msg } = response.data;
          if (ret == 0) {
            let _url = _curUrl + "/" + image_uri;
            let obj: any = { href: _url };
            updateImg();
            //1代表重新更新图片，不处理点击状态的 点击记录
            loadImage(obj, 1);

            const URL_NPY = _curUrl + "/" + image_emb;
            loadTensor(URL_NPY);
            setFileImgKey(key);

            setCurrentImgInfo(obj);

            console.log("背景生成成功===========");
            messageApi.open({
              type: "success",
              content: "提交成功",
            });
          } else {
            messageApi.open({
              type: "error",
              content: msg,
            });
          }

          //接受返回的npy文件进行loadTensor函数加载，清除之前的绘画效果
          // loadTensor(IMAGE_EMBEDDING);
          // resetInit();
        })
        .catch((error) => {
          console.error(error);
          // 处理上传失败的逻辑
        });
    } else {
      messageApi.open({
        type: "warning",
        content: "暂无mask数据",
      });
    }
  };

  //图片上传
  const handleFileChange = (event: any) => {
    setIsLoading(true);

    try {
      console.log("event=========");
      console.log(event);

      const file = event.target.files[0];
      console.log("file=======");
      console.log(file);
      // 执行上传操作，例如将选定的文件发送到服务器
      if (file) {
        // 在这里执行上传操作，例如使用axios发送POST请求到服务器
        const formData = new FormData();
        formData.append("image", file);

        axios
          .post("/upload", formData)
          .then((response) => {
            // 处理上传成功的逻辑
            const { ret, key, image_emb, msg, image_uri } = response.data;
            console.log(response.data);
            if (ret == 0) {
              const URL_NPY = _curUrl + "/" + image_emb;
              let _url = _curUrl + "/" + image_uri;

              loadTensor(URL_NPY);
              resetInit();
              setFileImgKey(key);

              let obj: any = {
                href: _url,
                key: key,
                npy: URL_NPY,
              };
              loadImage(obj,1);
              setBakImgInfo(obj);
              setCurrentImgInfo(obj);


              // 使用 FileReader 将文件读取为 DataURL 格式的字符串
              // const reader: any = new FileReader();
              // reader.onload = () => {
              //   // setPreviewUrl(reader.result);
              //   //此处要生存img标签类型的文件
              //   console.log("reader============");

              //   let obj: any = {
              //     href: _url,
              //     // href: reader.result,
              //     key: key,
              //     npy: URL_NPY,
              //   };
              //   loadImage(obj);
              //   setBakImgInfo(obj);
              // };
              // reader.readAsDataURL(file);
            } else {
              messageApi.open({
                type: "error",
                content: msg,
              });
            }

            //接受返回的npy文件进行loadTensor函数加载，清除之前的绘画效果
            // loadTenso(IMAGE_EMBEDDING);
            // resetInit();
          })
          .catch((error) => {
            console.error(error);
            // 处理上传失败的逻辑
          });
      }
    } catch (error) {
      // 处理错误
      console.log(error);
    }
  };

  //根据点击事件，生成对应的mask图
  const runONNX = async () => {
    try {
      if (
        model === null ||
        clicks === null ||
        tensor === null ||
        modelScale === null
      )
        return;
      else {
        // Preapre the model input in the correct format for SAM.
        // The modelData function is from onnxModelAPI.tsx.
        const feeds = modelData({
          clicks,
          tensor,
          modelScale,
        });
        if (feeds === undefined) return;
        // Run the SAM ONNX model with the feeds returned from modelData()
        console.log(feeds.point_coords);

        const results = await model.run(feeds);
        console.log("results================");
        console.log(results);
        console.log(model.outputNames[0]);

        const output = results[model.outputNames[0]];
        // The predicted mask returned from the ONNX model is an array which is
        // rendered as an HTML image using onnxMaskToImage() from maskUtils.tsx.

        const newImg = onnxMaskToImage(
          output.data,
          output.dims[2],
          output.dims[3],
          clicks
        );

        const CANVAS_ITEM = await createCanvas(newImg.src);
        const curObj = {
          id: Date.now(),
          canvas: CANVAS_ITEM,
          img: newImg,
          output: output,
          results: results,
        };

        setMaskImg([...[curObj]]);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Stage
      handleFileChange={handleFileChange}
      resetInit={resetInit}
      baseReset={baseReset}
      isLoading={isLoading}
      uploadFile={uploadFile}
      creatGround={creatGround}
      delGround={delGround}
      bakImgInfo={bakImgInfo}
      loadImage={loadImage}
    />
  );
};

export default App;
