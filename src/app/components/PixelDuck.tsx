import React, { useState, useEffect, useRef } from "react";
import duckImg from "../../imports/duck.png";

interface PixelDuckProps {
  bannerRef: React.RefObject<HTMLDivElement>;
  isBannerVisible: boolean;
}

export function PixelDuck({ bannerRef, isBannerVisible }: PixelDuckProps) {
  const [isBlinking, setIsBlinking] = useState(false);
  const [isBeakOpen, setIsBeakOpen] = useState(false);
  const [stepFrame, setStepFrame] = useState(0);

  // States for positioning
  const [isSnapped, setIsSnapped] = useState(true);
  const [isDragged, setIsDragged] = useState(false);
  const [bannerX, setBannerX] = useState(15); // Percentage across banner (0 to 100)
  const [direction, setDirection] = useState<"left" | "right">("right");

  // Free dragging position (viewport coordinates)
  const [freePos, setFreePos] = useState({ x: 200, y: 200 });

  // Calculated screen position for render
  const [computedPos, setComputedPos] = useState({ x: -9999, y: -9999 });

  const dragOffsetRef = useRef({ x: 0, y: 0 });

  // 1. Random Blinking & Beak Opening Timers
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 160);
    }, 2800 + Math.random() * 2500);

    const beakInterval = setInterval(() => {
      setIsBeakOpen(true);
      setTimeout(() => setIsBeakOpen(false), 320);
    }, 2200 + Math.random() * 3000);

    return () => {
      clearInterval(blinkInterval);
      clearInterval(beakInterval);
    };
  }, []);

  // 2. Walking Interval (only when snapped to banner and banner is visible)
  useEffect(() => {
    if (!isSnapped || isDragged || !isBannerVisible) return;

    const walkInterval = setInterval(() => {
      setStepFrame((prev) => (prev + 1) % 4);

      setBannerX((prevX) => {
        const speed = 0.8;
        if (direction === "right") {
          if (prevX >= 90) {
            setDirection("left");
            return prevX - speed;
          }
          return prevX + speed;
        } else {
          if (prevX <= 5) {
            setDirection("right");
            return prevX + speed;
          }
          return prevX - speed;
        }
      });
    }, 120);

    return () => clearInterval(walkInterval);
  }, [isSnapped, isDragged, isBannerVisible, direction]);

  // 3. Update computed screen position
  useEffect(() => {
    const updatePos = () => {
      if (isDragged) return; // Handled directly by mousemove

      if (isSnapped && bannerRef.current && isBannerVisible) {
        const rect = bannerRef.current.getBoundingClientRect();
        const duckWidth = 44;
        const duckHeight = 50;

        const posX = rect.left + (rect.width * (bannerX / 100)) - (duckWidth / 2);
        const posY = rect.top - duckHeight + 3; // Sit cleanly on top border of banner

        setComputedPos({ x: posX, y: posY });
      } else if (!isSnapped) {
        setComputedPos(freePos);
      }
    };

    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, { passive: true });
    const animId = requestAnimationFrame(updatePos);

    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos);
      cancelAnimationFrame(animId);
    };
  }, [isSnapped, isDragged, bannerX, freePos, bannerRef, isBannerVisible]);

  // 4. Mouse Drag & Drop Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragged(true);

    const startX = computedPos.x !== -9999 ? computedPos.x : e.clientX - 22;
    const startY = computedPos.y !== -9999 ? computedPos.y : e.clientY - 25;

    dragOffsetRef.current = {
      x: e.clientX - startX,
      y: e.clientY - startY,
    };

    setFreePos({ x: startX, y: startY });
    setComputedPos({ x: startX, y: startY });
    setIsSnapped(false);
  };

  useEffect(() => {
    if (!isDragged) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragOffsetRef.current.x;
      const newY = e.clientY - dragOffsetRef.current.y;
      setFreePos({ x: newX, y: newY });
      setComputedPos({ x: newX, y: newY });
    };

    const handleMouseUp = (e: MouseEvent) => {
      setIsDragged(false);

      if (bannerRef.current) {
        const rect = bannerRef.current.getBoundingClientRect();
        const duckX = e.clientX;
        const duckY = e.clientY;

        const isHorizontallyOver = duckX >= rect.left - 40 && duckX <= rect.right + 40;
        const isVerticallyNear = Math.abs(duckY - rect.top) < 100 || (duckY >= rect.top && duckY <= rect.bottom);

        if (isHorizontallyOver && isVerticallyNear) {
          const relativePct = ((duckX - rect.left) / rect.width) * 100;
          const clampedPct = Math.max(5, Math.min(90, relativePct));

          setBannerX(clampedPct);
          setIsSnapped(true);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragged, bannerRef]);

  // Hide duck if snapped to banner but banner is not visible and not dragged
  if (isSnapped && !isBannerVisible && !isDragged) {
    return null;
  }

  // Body bobbing (2px vertical shift on odd walking steps)
  const bodyBobY = (stepFrame === 1 || stepFrame === 3) ? -2 : 0;
  const legRotation = stepFrame === 1 ? -4 : stepFrame === 3 ? 4 : 0;

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        position: "fixed",
        left: `${computedPos.x}px`,
        top: `${computedPos.y}px`,
        width: "44px",
        height: "50px",
        zIndex: 99999,
        cursor: isDragged ? "grabbing" : "grab",
        userSelect: "none",
        touchAction: "none",
        pointerEvents: "auto",
        transition: isDragged ? "none" : "top 0.04s linear, left 0.04s linear",
      }}
      title="Потяните меня мышкой!"
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transform: `translateY(${bodyBobY}px) rotate(${legRotation}deg) ${direction === "left" ? "scaleX(-1)" : "scaleX(1)"}`,
          transformOrigin: "center bottom",
          transition: "transform 0.1s ease-in-out",
        }}
      >
        {/* Original Pixel Duck Image */}
        <img
          src={duckImg}
          alt="Pixel Duck"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            imageRendering: "pixelated",
            display: "block",
          }}
        />

        {/* Eye Blinking Overlay */}
        {isBlinking && (
          <div
            style={{
              position: "absolute",
              left: "28%",
              top: "13%",
              width: "8%",
              height: "10%",
              backgroundColor: "#FFCC00",
              borderRadius: "1px",
            }}
          />
        )}

        {/* Beak Opening Overlay */}
        {isBeakOpen && (
          <div
            style={{
              position: "absolute",
              left: "4%",
              top: "23%",
              width: "20%",
              height: "4%",
              backgroundColor: "#000000",
              borderRadius: "1px",
            }}
          />
        )}
      </div>
    </div>
  );
}
