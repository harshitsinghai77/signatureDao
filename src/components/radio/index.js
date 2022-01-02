import { Label, Radio } from "theme-ui";

const RadioSelect = ({ allOptions, onSizeChange }) => {
  //   return allOptions.map((el) => (
  //     <Label key={el.name}>
  //       <Radio name={el.name} value="false" />
  //       {el.name}
  //     </Label>
  //   ));
  return (
    <>
      <Label>
        <Radio
          name="dark-mode"
          value="true"
          defaultChecked={true}
          onChange={onSizeChange}
        />
        Small
      </Label>
      <Label>
        <Radio name="dark-mode" value="false" onChange={onSizeChange} />
        Medium
      </Label>
      <Label>
        <Radio name="dark-mode" value="false" onChange={onSizeChange} />
        Large
      </Label>
    </>
  );
};

export default RadioSelect;
