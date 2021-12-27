import { Flex, Input, Button } from "theme-ui";

const SubscriptionForm = ({ buttonLabel, ...props }) => {
  return (
    <Flex as="form" sx={styles.form} {...props}>
      <Input type="email" placeholder="Enter Email address" />
      <Button>{buttonLabel ?? "Claim NFT"}</Button>
    </Flex>
  );
};

export default SubscriptionForm;

const styles = {
  form: {
    input: {
      flexGrow: 1,
      p: ["0 20px", null, null, null, "0 25px"],
      minHeight: [60],
      height: "auto",
      width: "auto",
    },
    button: {
      ml: [3],
    },
  },
};
