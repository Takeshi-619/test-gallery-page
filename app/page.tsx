"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import "./styles/main.scss";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Plane from "./modules/plane";
import Stage from "./modules/stage";
import GlElments from "./modules/gl-elements";

export default function Home() {
  const bodyRef = useRef<HTMLBodyElement>(null!);
  const listRef = useRef<HTMLUListElement>(null!);

  const itemsData = useMemo(
    () => [
      { url: "https://unsplash.com/", src: "/images/sample-img-01.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-02.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-03.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-04.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-05.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-06.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-07.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-08.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-09.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-10.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-11.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-12.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-13.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-14.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-15.jpg" },
      { url: "https://unsplash.com/", src: "/images/sample-img-16.jpg" },
    ],
    []
  );

  useEffect(() => {
    // Initialization
    const body = bodyRef.current;
    const list = listRef.current;
    const items = Array.from(list.querySelectorAll(".item") || []);
    const deviceRatio = window.innerWidth > 767 ? 1.0 : 2.0;
    const meshList: Plane[] = [];
    const stage = new Stage();
    stage.init();
    const glElements = new GlElments(items as HTMLElement[]);
    glElements.init();

    const array: { item: HTMLElement; extra: { x: number; y: number } }[] = [];

    for (let i = 0; i < items.length; i++) {
      array.push({
        item: items[i] as HTMLElement,
        extra: {
          x: 0,
          y: 0,
        },
      });
      meshList.push(new Plane(stage, glElements.optionList[i]));
      meshList[i].init();
    }

    // Event listeners
    const isDownRef = { current: false }; // Ref for isDown state

    const lerp = 0.1;

    // Render Loop
    const x = {
      start: 0,
      end: 0,
      distance: 0,
      mouse: 0,
      current: 0,
      target: 0,
      scroll: 0,
      save: 0,
      wheel: 0,
      key: 0,
      direction: "",
      allDistance: 0,
    };

    const y = {
      start: 0,
      end: 0,
      distance: 0,
      mouse: 0,
      current: 0,
      target: 0,
      scroll: 0,
      save: 0,
      wheel: 0,
      key: 0,
      direction: "",
      allDistance: 0,
    };

    const onTouchDown = (e: TouchEvent | MouseEvent) => {
      isDownRef.current = true;
      console.log("down");

      // Mouse and touch event start position
      x.start = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      y.start = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;

      // Save past movement distance
      x.scroll = x.save;
      y.scroll = y.save;
    };

    const onTouchMove = (e: TouchEvent | MouseEvent) => {
      if (!isDownRef.current) return;
      console.log("move");

      if (listRef.current && body) {
        body.style.cursor = "grabbing";
        listRef.current.style.pointerEvents = "none";
      }

      // Mouse and touch event end position
      x.end = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientX
        : (e as MouseEvent).clientX;
      y.end = (e as TouchEvent).touches
        ? (e as TouchEvent).touches[0].clientY
        : (e as MouseEvent).clientY;

      // Distance moved after the click
      x.distance = (x.start - x.end) * deviceRatio;
      y.distance = (y.start - y.end) * deviceRatio;

      // Target position = distance moved after the click + past movement distance
      x.target = x.distance + x.scroll;
      y.target = y.distance + y.scroll + x.distance;
    };

    const onTouchUp = () => {
      isDownRef.current = false;
      console.log("up");
      if (!body || !list) return;
      body.style.cursor = "auto";
      list.style.pointerEvents = "auto";

      x.mouse += x.distance;
      y.mouse += y.distance + x.distance;
    };

    const onMouseWheel = (e: WheelEvent) => {
      e.preventDefault();
      console.log("asd");
      x.wheel += e.deltaX;
      y.wheel += e.deltaY + e.deltaX * 0.5;

      // Calculate target position from the total movement of all events
      x.target = x.wheel + x.mouse + x.key;
      y.target = y.wheel + y.mouse + y.key;

      console.log(x.direction + "dfgfddas");
      console.log(y.direction);
    };

    const onKeyDown = (e: React.KeyboardEvent) => {
      console.log("down");

      if (keyStrength < 140) keyStrength += 12.0;

      if (e.key === "ArrowDown") {
        y.key += keyStrength;
      }
      if (e.key === "ArrowUp") {
        y.key += -keyStrength;
      }
      if (e.key === "ArrowRight") {
        x.key += keyStrength;
      }
      if (e.key === "ArrowLeft") {
        x.key += -keyStrength;
      }

      // Calculate target position from the total movement of all events
      x.target = x.key + x.wheel + x.mouse;
      y.target = y.key + y.wheel + y.mouse;
    };

    const onKeyUp = () => {
      console.log("up");

      keyStrength = 0;
    };

    let keyStrength = 0;

    const raf = () => {
      // Linear interpolation
      x.current = gsap.utils.interpolate(x.current, x.target, lerp);
      y.current = gsap.utils.interpolate(y.current, y.target, lerp);

      // Get movement direction
      if (x.save < x.current) {
        x.direction = "left";
      } else if (x.save > x.current) {
        x.direction = "right";
      }

      if (y.save < y.current) {
        y.direction = "top";
      } else if (y.save > y.current) {
        y.direction = "bottom";
      }

      x.save = x.current;
      y.save = y.current;

      for (let i = 0; i < array.length; i++) {
        const rect = array[i].item.getBoundingClientRect();

        // Shift by the width of the wrapper element when it goes off-screen
        if ((i % 4) - 1 === 0 || (i % 4) - 1 === 2) {
          if (x.direction === "left" && rect.left < -rect.width) {
            console.log("off-screen");
            array[i].extra.x += list!.clientWidth;
          } else if (x.direction === "right" && window.innerWidth < rect.left) {
            console.log("off-screen");
            array[i].extra.x += -list!.clientWidth;
          }

          if (y.direction === "top" && window.innerHeight < rect.top) {
            console.log("off-screen");
            array[i].extra.y += -list!.clientHeight;
          } else if (y.direction === "bottom" && rect.top < -rect.height) {
            console.log("off-screen");
            array[i].extra.y += list!.clientHeight;
          }
        } else {
          if (x.direction === "left" && rect.left < -rect.width) {
            console.log("off-screen");
            array[i].extra.x += list!.clientWidth;
          } else if (x.direction === "right" && window.innerWidth < rect.left) {
            console.log("off-screen");
            array[i].extra.x += -list!.clientWidth;
          }

          if (y.direction === "bottom" && window.innerHeight < rect.top) {
            console.log("off-screen");
            array[i].extra.y += -list!.clientHeight;
          } else if (y.direction === "top" && rect.top < -rect.height) {
            console.log("off-screen");
            array[i].extra.y += list!.clientHeight;
          }
        }

        // GSAP ticker
        gsap.ticker.fps(60);
        gsap.ticker.add(raf);

        let finalX = 0;
        let finalY = 0;

        finalX = -x.current + array[i].extra.x;
        finalY = -y.current + array[i].extra.y;

        if ((i % 4) - 1 === 0 || (i % 4) - 1 === 2) {
          finalX = -x.current + array[i].extra.x;
          finalY = -(-y.current - array[i].extra.y);
        }

        array[i].item.style.transform = `translate(${finalX}px, ${finalY}px)`;
        console.log(array[i].item.style.transform);
      }

      stage.onRaf();
      glElements._updateOptionList();
      for (let i = 0; i < array.length; i++) {
        const strength = (y.current - y.target) * 0.1;
        if ((i % 4) - 1 === 0 || (i % 4) - 1 === 2) {
          meshList[i]._setStrength(strength);
        } else {
          meshList[i]._setStrength(-strength);
        }
        meshList[i].onRaf();
      }
    };

    const onResize = () => {
      // console.log("resize");

      x.current = 0;
      y.current = 0;
      x.wheel = 0;
      y.wheel = 0;
      x.allDistance = 0;
      y.allDistance = 0;
      x.save = 0;
      y.save = 0;
      x.target = 0;
      y.target = 0;

      for (let i = 0; i < array.length; i++) {
        array[i].extra.x = 0;
        array[i].extra.y = 0;
      }

      stage.onResize();
      for (let i = 0; i < array.length; i++) {
        meshList[i].onResize();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("mousedown", onTouchDown);
    window.addEventListener("mousemove", onTouchMove);
    window.addEventListener("mouseup", onTouchUp);
    window.addEventListener("touchstart", onTouchDown);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", onTouchUp);
    window.addEventListener("wheel", onMouseWheel, { passive: false });
    window.addEventListener("resize", onResize);

    return () => {
      // Cleanup: Remove event listeners
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("mousedown", onTouchDown);
      window.removeEventListener("mousemove", onTouchMove);
      window.removeEventListener("mouseup", onTouchUp);
      window.removeEventListener("touchstart", onTouchDown);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchUp);
      window.removeEventListener("wheel", onMouseWheel);
      window.removeEventListener("resize", onResize);

      // Additional cleanup if needed
    };
  }, [itemsData]);

  return (
    <main>
      <ul className="list" ref={listRef}>
        {itemsData.map((item, i) => (
          <li key={i} className="item">
            <a href={item.url} target="_blank" rel="noopener noreferrer">
              <Image src={item.src} alt="" width={760} height={560} />
            </a>
          </li>
        ))}
      </ul>
      <div id="stats"></div>
      <div id="webgl"></div>
    </main>
  );
}
