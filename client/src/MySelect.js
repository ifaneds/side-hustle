import Select from "react-select";

const styles = {
  menuList: (base) => ({
    ...base,

    "::-webkit-scrollbar": {
      width: "4px",
      height: "0px",
    },
    "::-webkit-scrollbar-track": {
      background: "#f1f1f1",
    },
    "::-webkit-scrollbar-thumb": {
      background: "#888",
    },
    "::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
    base: {
      ...base,
      padding: 10,
    },
  }),
};

const MySelect = ({ placeholder, options, isMulti, onChange, value }) => {
  return (
    <Select
      placeholder={placeholder}
      options={options}
      isMulti={isMulti}
      styles={styles}
      onChange={onChange}
      value={value}
    />
  );
};
export default MySelect;
