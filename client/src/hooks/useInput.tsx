import { useState } from "react";

export const useInput = () => {
  const [value, setValue] = useState<string>("");
  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const {
      target: { value },
    } = event;
    setValue(value);
  };
  return {
    value,
    onChange,
  };
};