import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { SystemData } from "./App";

function CityMap({ systems }: { systems: SystemData[] }) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [image, setImage] = useState<HTMLImageElement>(new Image());
  const [size, setSize] = useState([0, 0]);

  const containerRef = useRef<HTMLDivElement>(null);

  let horizontalBase = dimensions.width > dimensions.height;

  if (
    horizontalBase &&
    image.height * (dimensions.width / image.width) < dimensions.height
  ) {
    horizontalBase = false;
  }
  const scaleMultiplier = horizontalBase
    ? dimensions.width / image.width
    : dimensions.height / image.height;

  useEffect(() => {
    let img = new Image();
    img.src = "/sber_bw_crop.png";
    setImage(img);
  }, []);

  useLayoutEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, [size]);

  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div className='w-full h-full overflow-auto' ref={containerRef}>
      <div
        style={{
          width: image.width * scaleMultiplier,
          height: image.height * scaleMultiplier,
          backgroundImage: "url(" + image.src + ")",
          backgroundSize: `${image.width * scaleMultiplier}px ${
            image.height * scaleMultiplier
          }px`,
          position: "relative",
        }}
      >
        {systems.map((system) => {
          if (system.coords.split(", ")[1] == undefined) {
            return <></>;
          }

          let spots: Spot[] = [];
          let val_1 = Number(system.status.value.split(" ")[0]);
          let val_2 = Number(system.status.value.split(" ")[1]);
          let clog_1 = val_1 < 25 && val_2 > 30;
          let clog_2 = val_2 <= 30;

          spots.push(
            {
              x: Number(system.coords.split(", ")[0].split(" ")[0]),
              y: Number(system.coords.split(", ")[0].split(" ")[1]),
              val: val_1,
              maxVal: Number(system.drain_depth),
              clog: clog_1,
            },
            {
              x: Number(system.coords.split(", ")[1].split(" ")[0]),
              y: Number(system.coords.split(", ")[1].split(" ")[1]),
              val: val_2,
              maxVal: Number(system.drain_depth_2),
              clog: clog_2,
            }
          );

          return spots.map((spot) => {
            let height = Math.max(spot.maxVal - spot.val, -1);

            let borderColor = "border-white";

            if (height > spot.maxVal * 0.5) {
              borderColor = "border-orange-400";
            } else if (height > spot.maxVal - 25) {
              borderColor = "border-red-500";
            }

            let bgColor = "bg-slate-200";
            if (spot.clog) {
              bgColor = "bg-red-500";
            }

            return (
              <div
                className={`${borderColor} ${bgColor} rounded-full select-none w-14 h-14 border-4 flex items-center justify-center font-semibold flex-col`}
                style={{
                  position: "absolute",
                  left: `${spot.x}%`,
                  top: `${spot.y}%`,
                }}
              >
                <div className='text-lg leading-4'>{height}</div>
                <div className='text-sm leading-3 border-t border-slate-400'>
                  {spot.maxVal}
                </div>
              </div>
            );
          });
        })}
      </div>
    </div>
  );
}

type Spot = {
  x: number;
  y: number;
  val: number;
  maxVal: number;
  clog: boolean;
};

export default CityMap;
