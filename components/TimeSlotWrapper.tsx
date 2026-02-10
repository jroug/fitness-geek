import * as React from "react";

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

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <button
          type="button"
          onClick={handleClick}
          aria-label="Add food"
          className="rbc-add-food-btn"
        >
          +
        </button>
      </>
    ),
  });
}
