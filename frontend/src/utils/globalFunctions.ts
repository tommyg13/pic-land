import {
  ActionCreatorWithPayload,
  AnyAction,
  Dispatch,
} from "@reduxjs/toolkit";
import { showMessage } from "../redux/messageSlice";
import { FormData, FormField, HandleErrorsFunction } from "../types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";

export const validateFields = (
  fields: FormField[],
  handleErrors: HandleErrorsFunction,
  action: () => Promise<void>
) => {
  let hasError = false;

  const updatedValues = Object.values(fields).map((field) => {
    if (!field.value && field.required) {
      field.error = `Παρακαλώ συμπληρώστε το πεδίο ${field.placeholder}`;
      hasError = true;
    } else if (
      field.required &&
      field.type === "email" &&
      !validateEmail(field.value)
    ) {
      field.error = `Παρακαλώ συμπληρώστε μια έγκυρη διεύθυνση email`;
      hasError = true;
    } else {
      field.error = "";
    }
    return field;
  });
  if (hasError) {
    handleErrors(updatedValues);
  } else {
    action();
  }
};

export const validateEmail = (email: string) => {
  const reg = /\S+@\S+\.\S+/;
  return reg.test(email);
};

export function isFetchBaseQueryError(
  error: unknown
): error is FetchBaseQueryError & { data: { message: string } } {
  return typeof error === "object" && error != null && "status" in error;
}

export function isErrorWithMessage(
  error: unknown
): error is { message: string } {
  return (
    typeof error === "object" &&
    error != null &&
    "message" in error &&
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    typeof (error as any).message === "string"
  );
}

export const handlePostAction = async (
  action,
  dispatchAction: ActionCreatorWithPayload<unknown, string>,
  actionData: FormData,
  dispatch: Dispatch<AnyAction>
) => {
  try {
    const data = await action(actionData).unwrap();
    dispatch(dispatchAction({ ...data }));
    const message = data?.data?.message;
    if (message) {
      dispatch(
        showMessage({
          type: "error",
          value: message,
        })
      );
    }
  } catch (err) {
    let errMsg = "Please try again";
    if (isFetchBaseQueryError(err)) {
      errMsg = "error" in err ? err.error : err.data.message;
    } else if (isErrorWithMessage(err)) {
      errMsg = err.message;
    }
    dispatch(
      showMessage({
        type: "error",
        value: errMsg,
      })
    );
  }
};
