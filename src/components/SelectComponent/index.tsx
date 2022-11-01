import React, { useEffect, useState } from 'react';
import { Select } from 'antd';

import styles from './styles.module.scss';

import DropdownIcon from 'assets/images/icons/icon-arrow-bottom.svg';

const { Option } = Select;
const IconDropdown = () => <img src={DropdownIcon} alt="dropdown" />;

interface ISelectComponent {
  defaultValue?: string | null;
  placeholder?: React.ReactNode;
  items?: ISelect[];
  dropdownClassName?: string;
  handleChangeValueSelect?: (value: string | null) => void;
  isReset?: boolean;
  isShowSearch?: boolean;
  isLoading?: boolean;
  value?: null | string;
}

const SelectComponent = (props: ISelectComponent) => {
  const {
    defaultValue,
    items = [],
    dropdownClassName,
    handleChangeValueSelect,
    isShowSearch = false,
    placeholder,
    isLoading,
    isReset,
  } = props;

  const [value, setValue] = useState<null | string | undefined>(defaultValue);

  const handleChange = (value: string) => {
    setValue(value);
    if (handleChangeValueSelect) {
      handleChangeValueSelect(value);
    }
  };

  useEffect(() => {
    if (isReset) {
      setValue(defaultValue || null);
    }
  }, [defaultValue, isReset]);

  return (
    <Select
      showSearch={isShowSearch}
      className={styles.customSelectComponent}
      defaultValue={defaultValue}
      style={{ width: 140 }}
      onChange={handleChange}
      suffixIcon={<IconDropdown />}
      dropdownClassName={dropdownClassName}
      value={value}
      placeholder={placeholder}
      loading={isLoading}
    >
      {items.map((item: ISelect, index: number) => (
        <Option value={item.value} key={index}>
          {item.name}
        </Option>
      ))}
    </Select>
  );
};

export default SelectComponent;
