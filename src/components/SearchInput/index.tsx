import { Input } from 'antd';
import React, { useState, memo, useCallback } from 'react';
import classNames from 'classnames';

import IconSearchNormal from 'assets/images/icons/icon-search-normal.svg';
import IconClear from 'assets/images/icons/icon-x.svg';
import styles from './styles.module.scss';
import { trimSpaceInput } from 'helper';

interface ClearInputInterface {
  onClick: () => void;
}

interface ISearchProductInput {
  onSearch?: (value: string | null) => void;
  isShowClear?: boolean;
  style?: SearchProductInputStylesInterface;
  className?: string;
  isSearchHeader?: boolean;
  placeholder?: string;
  defaultValue?: string;
}

// Icon Clear Button
const IconClearAddon = ({ onClick }: ClearInputInterface) => <img onClick={onClick} src={IconClear} alt="clear" />;

const SearchProductInput = (props: ISearchProductInput) => {
  const { onSearch, isShowClear, style, isSearchHeader, placeholder, defaultValue } = props;
  const [value, setValue] = useState(defaultValue || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setValue(e.target.value);
  };

  const handleEnterPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      setValue(trimSpaceInput(value));
      onSearch(trimSpaceInput(value));
    }
  };

  const handleReset = useCallback(() => {
    setValue('');
    if (onSearch) {
      onSearch(null);
    }
  }, [onSearch]);

  const handleSearchByIcon = () => {
    if (onSearch) {
      onSearch(trimSpaceInput(value));
    }
  };

  return (
    <Input.Group
      compact
      className={classNames({
        [styles.searchProductInputComponent]: true,
        [styles.searchHeader]: isSearchHeader,
      })}
      style={style}
    >
      <img className={styles.iconSearchNormal} src={IconSearchNormal} alt="searching" onClick={handleSearchByIcon} />
      <Input
        onChange={handleChange}
        onKeyDown={handleEnterPress}
        value={value}
        addonAfter={value && isShowClear ? <IconClearAddon onClick={handleReset} /> : <span />}
        placeholder={placeholder}
        onBlur={(e: React.FocusEvent<HTMLInputElement, Element>) => {
          setValue(trimSpaceInput(e.target.value));
          onSearch && onSearch(trimSpaceInput(e.target.value));
        }}
      />
    </Input.Group>
  );
};

export default memo(SearchProductInput);
