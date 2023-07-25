import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FormLabelControl from "../../components/formLabelControl";
import { ChangeEvent, useState } from "react";
import { Box } from "@mui/material";

type LoginInfo = {
  email: string;
  password: string;
};

const SignIn = () => {
  const [logInInfo, setLogInInfo] = useState<LoginInfo>(null);
  const [confirmPassword, setConfirmPassword] = useState<string>(null);
  const [logInOrSignUp, setLogInOrSignUp] = useState<"Login" | "Signup">(
    "Login"
  );

  function updateLogInInfo(event: ChangeEvent) {
    const { name, value } = event.target as HTMLInputElement;

    setLogInInfo((prevLogInInfo) => {
      if (name === "email") {
        return {
          email: value,
          password: prevLogInInfo?.password,
        };
      } else if (name === "password") {
        return {
          email: prevLogInInfo?.email,
          password: value,
        };
      }
    });
  }

  function updateConfirmPassword(event: ChangeEvent) {
    const { value } = event.target as HTMLInputElement;

    setConfirmPassword(value);
  }

  function signInOrCreateUser() {
    if (logInOrSignUp === "Login") {
      console.log("dashboard 페이지 이동");
    } else {
      console.log("회원가입 로직 수행");
    }
  }

  return (
    <Box
      sx={{
        width: "50%",
        padding: "0 1rem",
        margin: "12rem auto 6rem",
      }}
    >
      <Form>
        <FormLabelControl label="Email" onChange={updateLogInInfo} />
        <FormLabelControl label="Password" onChange={updateLogInInfo} />
        {logInOrSignUp === "Signup" && (
          <FormLabelControl
            label="Confirm Password"
            type="password"
            onChange={updateConfirmPassword}
          />
        )}

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            variant="primary"
            type="button"
            disabled={
              logInInfo?.password === confirmPassword ||
              logInOrSignUp === "Login"
                ? false
                : true
            }
            onClick={signInOrCreateUser}
          >
            {logInOrSignUp}
          </Button>
          {logInOrSignUp === "Login" && (
            <Box
              sx={{
                "&:hover": {
                  cursor: "pointer",
                  textShadow: "0.5px 0.5px",
                },
              }}
            >
              <Form.Text
                onClick={() => {
                  setLogInOrSignUp("Signup");
                }}
              >
                Not registered?
              </Form.Text>
            </Box>
          )}
        </Box>
      </Form>
    </Box>
  );
};

export default SignIn;
