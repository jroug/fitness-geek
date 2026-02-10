import * as React from "react";
import plate_icon from "../public/svg/add-meal.svg";

import Image from "next/image";


type Props = {
  children?: React.ReactNode;
  value?: Date;
  onAddFood?: (date: Date) => void;
};

type SlotChildProps = {
  children?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
};

export function TimeSlotWrapper({ children, value, onAddFood }: Props) {
  const slotDate = value ?? new Date();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddFood?.(slotDate);
  };

 

  if (!children) return null;

  // ✅ no `any`
  const child = React.Children.only(children) as React.ReactElement<SlotChildProps>;

  return React.cloneElement(child, {
    ...child.props,
    style: {
      ...(child.props.style ?? {}),
      position: "relative",
    },
    children: (
      <>
        {child.props.children}
         <Image src={plate_icon} width={27} height={27} className="add-meal-btn" alt="add-meal" onClick={handleClick}/> 
      </>
    ),
  });
}
