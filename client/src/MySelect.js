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
    padding: 0,
  }),
  container: (provided) => ({
    ...provided,
    paddingTop: "5px",
    paddingBottom: "5px",
  }),
  control: (provided, state) => ({
    ...provided,
    padding: 0,
    borderColor: state.isFocused ? '#4caf50' : '#ccc',
    boxShadow: state.isFocused ? '0 0 0 1px #4caf50' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#4caf50' : '#ccc',
    },
  }),
  menu: (provided) => ({
    ...provided,
    marginTop: 0,
    padding: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isFocused ? '#e8f5e9' : 'transparent',
    color: '#333',
    '&:active': {
      backgroundColor: '#c8e6c9',
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
