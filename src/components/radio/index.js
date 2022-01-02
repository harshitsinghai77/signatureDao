import { Label, Radio, Flex } from "theme-ui";

const RadioSelect = ({ allOptions, onSizeChange }) => {
  return (
    <>
      <Label>
        <Radio
          name="size-toggle"
          value="small"
          defaultChecked={true}
          onChange={onSizeChange}
        />
        Small
      </Label>
      <Label>
        <Radio name="size-toggle" value="medium" onChange={onSizeChange} />
        Medium
      </Label>
      <Label>
        <Radio name="size-toggle" value="large" onChange={onSizeChange} />
        Large
      </Label>
    </>
  );
};

export default RadioSelect;
