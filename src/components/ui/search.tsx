'use client';

import React, { ChangeEventHandler } from 'react';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Input, InputProps } from '@/ui/input';

interface IProps extends InputProps {}

const Search = ({ onChange: _onChange, ...props }: IProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (_onChange) _onChange(event);

    const value = event.target.value;

    const params = new URLSearchParams(searchParams);
    params.set('search', value);

    router.replace(`${pathname}?${params.toString()}`);
  };

  return <Input onChange={onChange} {...props} />;
};

export default Search;
