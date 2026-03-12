import type { SVGAttributes } from "react";

const Logo = (props: SVGAttributes<SVGElement>) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex flex-col">
        <span className="text-xl font-bold text-sidebar-foreground leading-tight">
          WISER CONSULTING
        </span>
        <span className="text-xs text-sidebar-foreground/70 leading-tight">
          SOFTWARE HOUSE
        </span>
      </div>
    </div>
  );
};

export default Logo;
