// src/common/transformers/decimal.transformer.ts
import { ValueTransformer } from 'typeorm';

export const ColumnNumericTransformer: ValueTransformer = {
  to: (value?: number): number | null => {
    if (value === null || value === undefined) return null;
    return value;
  },
  from: (value?: string): number | null => {
    if (value === null || value === undefined) return null;
    return parseFloat(value);
  },
};
