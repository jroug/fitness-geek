import * as React from "react";

type Props = {
  children?: React.ReactNode;
  value?: Date;
  onAddFood?: (date: Date) => void;
  setPopupFormData: (data: { title: string; message: string; show_popup: boolean }) => void;
};


export function TimeSlotWrapper(props: Props) {
  const { children, value, onAddFood, setPopupFormData } = props;

  // RBC passes the slot date/time in `value`
  const slotDate = value ?? new Date();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddFood?.(slotDate);
    // setPopupFormData({ title: 'test', message: 'test', show_popup: false });
  };

  // Wrapper components should NOT replace the slot element.
  // Clone the existing child element and inject our button.
  if (!children) return null;
  const child = React.Children.only(children) as React.ReactElement<any>;

  return React.cloneElement(child, {
    ...child.props,
    style: {
      ...(child.props?.style ?? {}),
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