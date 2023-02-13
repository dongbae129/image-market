import { useRef } from 'react';

interface SvgInfo {
  // fill?: string;
  // d: string;

  [key: string]: string;
}
interface SvgIconProps {
  svgInfo: SvgInfo[];
  // [key: string]: string;
}
interface SvgRefType {
  [key: string]: SVGPathElement | null;
}
const SvgIcon = ({ svgInfo, ...rest }: SvgIconProps) => {
  const svgRef = useRef<SvgRefType>([]);
  console.log(svgInfo, 'svg');
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
              <path key={i} ref={(el) => (svgRef.current[i] = el)}></path>
            );
            for (const key in info) {
              console.log(key, info[key], 'info');

              svgRef.current[i]?.setAttribute(key, info[key]);
              // console.log(svgRef, 'ref');
            }
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
