import { useState } from "react";
import { FormData, FormField } from "../types";

const useForms = (initialFields: FormField[]) => {
  const [values, setValues] = useState<FormField[]>(initialFields);

  const updateInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setValues((oldValues) => {
      return oldValues.map((el) =>
        el.name === e.target.name ? { ...el, value: e.target.value } : el
      );
    });
  };

  const resetFields = () => {
    setValues((oldValues) => {
      return oldValues.map((el) => ({ ...el, value: "", error: "" }));
    });
  };

  const getFormData = (): FormData => {
    const formData: Record<string, string> = {};
    values.forEach((field) => {
      formData[field.name] = field.value;
    });
    return { data: formData };
  };

  const handleErrors = (updatedFields: FormField[]) => {
    setValues(updatedFields);
  };

  return { values, updateInput, resetFields, getFormData, handleErrors };
};

export default useForms;
