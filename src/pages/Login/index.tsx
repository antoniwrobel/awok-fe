import axios from "axios";
import { useEffect } from "react";
import { Typography, Button, TextField, Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth, useLoading } from "../../hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { Form, Formik } from "formik";
import { RegisterResponseError } from "src/types/axios.types";
import { registerFormFieldsNamesArray } from "../Register/register-form-fields";
import { handleCombineErrors, handleNonFieldErrors } from "src/helpers/errors";
import { generateYupSchema } from "../Register/generate-registration-schema";
import { generateLoginFormFields } from "./generate-login-fields";
import { getAccessToken } from "src/auth/auth-service";

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const accessToken = getAccessToken();

  const { t } = useTranslation();
  const { signIn, user } = useAuth();
  const { isLoading, setIsLoading } = useLoading();

  const loginFormFields = generateLoginFormFields();
  const validationSchema = generateYupSchema(loginFormFields);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (user || accessToken) {
      navigate(from, { replace: true });
    }
  }, [user, accessToken]);

  return (
    <Box display="flex" flexDirection="column" width="100%">
      {from !== "/" && (
        <Typography variant="h6" component="h6">
          {t("login-to-view")} "{from}"
        </Typography>
      )}

      <Box display="flex" mt="10px" justifyContent="space-between">
        <Box width="100%">
          <Formik
            initialValues={{
              username: "",
              password: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (
              values,
              { setSubmitting, setFieldError, resetForm }
            ) => {
              setIsLoading(true);
              setSubmitting(true);

              try {
                await signIn(values.username, values.password);
                const successMessage = t("login-success");
                toast.success(successMessage);

                setIsLoading(false);
                setSubmitting(false);

                navigate("/logged-in");
              } catch (error) {
                setIsLoading(false);
                setSubmitting(false);

                if (axios.isAxiosError(error) && error.response) {
                  for (const fieldName of registerFormFieldsNamesArray) {
                    const err = error as RegisterResponseError;
                    const errors = err.response.data[fieldName];
                    const errorMessage = handleCombineErrors(errors);

                    if (errors) {
                      setFieldError(fieldName, errorMessage);
                      return;
                    }
                  }

                  resetForm({
                    values: {
                      username: values.username,
                      password: "",
                    },
                  });
                  handleNonFieldErrors(error);
                } else {
                  resetForm();
                  const errorMessage = error as string;
                  toast.error(errorMessage);
                }
              }
            }}
          >
            {({ values, handleChange, errors, touched }) => {
              return (
                <Box>
                  <Form
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      alignItems: "flex-end",
                    }}
                  >
                    <Box
                      display="grid"
                      gap="10px"
                      width="100%"
                      gridTemplateColumns={["1fr", "1fr 1fr", "1fr 1fr"]}
                    >
                      {loginFormFields.map((field) => {
                        const { label, name, type } = field;
                        const hasError = Boolean(errors[name] && touched[name]);
                        return (
                          <TextField
                            key={name}
                            name={name}
                            type={type}
                            label={label}
                            variant="outlined"
                            error={hasError}
                            value={values[name]}
                            disabled={isLoading}
                            onChange={handleChange}
                            helperText={hasError && errors[name]}
                          />
                        );
                      })}
                    </Box>

                    <Button
                      sx={{ mt: "10px" }}
                      disabled={isLoading}
                      color="primary"
                      type="submit"
                      variant="contained"
                    >
                      {t("login")}
                    </Button>
                  </Form>
                </Box>
              );
            }}
          </Formik>
        </Box>
      </Box>
    </Box>
  );
};
