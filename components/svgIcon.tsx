import { useRef, useState } from 'react';

interface SvgInfo {
  // fill?: string;
  // d: string;

  [key: string]: string;
}
interface SvgIconProps {
  svgInfo: SvgInfo[];
  viewBox?: string;
}

const SvgIcon = ({ svgInfo, ...rest }: SvgIconProps) => {
  // const svgRef = useRef<SVGPathElement[] | null[]>([]);

  return (
    <>
      <svg
        stroke="currentColor"
        fill="currentColor"
        strokeWidth="0"
        xmlns="http://www.w3.org/2000/svg"
        {...rest}
      >
        <g>
          {svgInfo.map((info, i) => {
            const svgPath = (
              <path key={i} fill={info.fill || ''} d={info.d}></path>
            );
            // const svgPath = (
            //   <path key={i} ref={(el) => (svgRef.current[i] = el)}></path>
            // );
            // for (const key in info) {
            //   svgRef.current[i]?.setAttribute(key, info[key]);
            // }
            return svgPath;
          })}
        </g>
      </svg>
      <style jsx>{`
        svg {
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default SvgIcon;
