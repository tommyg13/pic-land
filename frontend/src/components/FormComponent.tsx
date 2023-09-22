import { Form } from "../types";

const FormComponent = ({
  values,
  handleSubmit,
  handleChange,
  actionTxt,
  disabled,
}: Form) => {
  return (
    <form onSubmit={handleSubmit}>
      {values.map((el) => (
        <div key={el.name}>
          {!!el.error && <p className="error-txt">{el.error}</p>}
          <input
            type={el.type}
            name={el.name}
            value={el.value}
            onChange={handleChange}
          />
        </div>
      ))}
      <button disabled={disabled} type="submit">
        {actionTxt}
      </button>
    </form>
  );
};

export default FormComponent;
