import React, { useEffect, useState } from "react";
import CatSprite from "./CatSprite";
import { motion } from "framer-motion";
import DogSprite from "./DogSprite";
import AddBoxIcon from "@mui/icons-material/AddBox";

export default function PreviewArea({ move, rotate, position, controls, catDirection, dogDirection, setCatDirection, setDogDirection, setCollision }) {
  const [catProps, setCatProps] = useState({ x: move, y: 0 });
  const [latestX, setLatestX] = useState(move);
  console.log(catProps);
  console.log("position", position);

  const [isDogVisible, setDog] = useState(false);

  const [dogProps, setDogProps] = useState({ x: -move, y: 0 });
  const [hasCollided, setHasCollided] = useState(false);



  useEffect(() => {
    setCatProps({ x: move, y: 0 });
    setDogProps({ x: -move, y: 0 });
  }, [move]);

  const angleInRadians = (rotate * Math.PI) / 180;

  const moveXCat =
    catDirection * Math.abs(catProps.x) * Math.cos(angleInRadians);
  const moveYCat =
    catDirection * Math.abs(catProps.y) * Math.sin(angleInRadians);

  const moveXDog =
    dogDirection * Math.abs(dogProps.x) * Math.cos(angleInRadians);
  const moveYDog =
    dogDirection * Math.abs(dogProps.y) * Math.sin(angleInRadians);

  const checkCollision = () => {
    const cat = document.getElementById("catSprite").getBoundingClientRect();
    const dog = document.getElementById("dogSprite").getBoundingClientRect();

    return !(
      cat.right < dog.left ||
      cat.left > dog.right ||
      cat.bottom < dog.top ||
      cat.top > dog.bottom
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (checkCollision() && !hasCollided) {
        setHasCollided(true);
        setCollision(true);
        // Swap directions
        setCatDirection((prev) => -prev); // Reverse direction
        setDogDirection((prev) => -prev); // Reverse direction
      } else if (!checkCollision() && hasCollided) {
        setHasCollided(false); // Reset collision state if they are no longer colliding
      }
    }, 50); // Check collision every 50ms

    return () => clearInterval(interval);
  }, [hasCollided]);

  const defaultAnimation = {
    x: -latestX,
    y: position.y || moveYDog,
    scale: 1,
    rotate: rotate,
  };
  // Logic to track the latest update between position.x and moveXCat
  useEffect(() => {
    if (position.x !== latestX || position.y !== latestX) {
      setLatestX(position.x);
    }
  }, [position.x]);

  useEffect(() => {
    if (moveXCat !== latestX) {
      setLatestX(moveXCat);
    }
  }, [moveXCat]);

  return (
    <div className="flex flex-col">
      <div className="relative h-full p-2">
        <motion.div
          animate={{
            x: latestX,
            y: position.y || moveYCat,

            scale: 1,
            rotate: rotate,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute left-0"
        >
          <CatSprite />
        </motion.div>
        {isDogVisible && <motion.div
          animate={defaultAnimation}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute right-24 h-2 w-2"
        >
          <DogSprite />
        </motion.div>}
      </div>
      <div className=" p-10 w-96">
        <div
          onClick={() => { setDog(!isDogVisible) }}
          className="shadow w-5 h-5 rounded-lg cursor-pointer p-10 flex justify-center items-center"
        >
          <AddBoxIcon />
        </div>
      </div>
    </div>
  );
}
