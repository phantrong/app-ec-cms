import React, { useEffect, useState } from 'react';
import NumberFormat from 'react-number-format';

import styles from './styles.module.scss';

interface IInputNumber {
  setValue: (value: any) => void;
  thousandSeparator?: number | null;
  textUnit?: string | null;
  isResetInputNumber?: boolean;
  placeholder?: string;
  onSearch?: (value?: string | number) => void;
}

const InputNumber = (props: IInputNumber) => {
  const { setValue, thousandSeparator, textUnit, isResetInputNumber, placeholder, onSearch } = props;
  const [valueInput, setValueInput] = useState<string | number | undefined>();

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(valueInput);
    }
  };

  useEffect(() => {
    if (isResetInputNumber) setValueInput('');
  }, [isResetInputNumber]);

  return (
    <div className={styles.inputNumberFormat}>
      <NumberFormat
        onValueChange={(values) => {
          setValue(values.floatValue);
          setValueInput(values.floatValue);
        }}
        thousandSeparator={thousandSeparator ? true : false}
        isNumericString
        decimalScale={0}
        value={valueInput}
        defaultValue={valueInput}
        placeholder={placeholder}
        onKeyDown={handleEnterPress}
        onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => onSearch && onSearch(e.target.value)}
      />
      <div className={styles.textUnit}>{textUnit}</div>
    </div>
  );
};

export default InputNumber;
